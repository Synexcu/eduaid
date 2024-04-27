import { db } from '$lib/server';
import { tpTable, classTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params, locals }) => {
    const id = params.id;

    const classData = await db.query.classTable.findFirst({
      where: eq(classTable.userId, locals.user!.id)
    });

    const data = await db.query.tpTable.findFirst({
      where: eq(tpTable.id, id),
      with: {
        cp: true
      }
    });

    const capaianPembelajaran = await db.query.cpTable.findMany({
      with: {
        subject: true
      }
    });

    const filteredCpData = capaianPembelajaran.filter(cp => {
      if (locals.user!.role === 2) {
        return capaianPembelajaran;
      }
      const batch = classData!.batch; 
      return  (batch === 1 || batch === 2) ? cp.subject!.phase === 1 :
              (batch === 3 || batch === 4) ? cp.subject!.phase === 2 :
              (batch === 5 || batch === 6) ? cp.subject!.phase === 3 : false;
    });
  
  
    return {
      form: await superValidate(data, zod(formSchema)),
      capaianPembelajaran: filteredCpData
    };
  };

  
export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    if (!form.data.id) {
      form.data.id = generateId(15);
    }

    await db
      .insert(tpTable)
      .values({
        id: form.data.id,
        cpId: form.data.cpId,
        userId: event.locals.user!.id,
        tujuanPembelajaran: form.data.tujuanPembelajaran
      })
      .onConflictDoUpdate({
        target: tpTable.id,
        set: {
          cpId: form.data.cpId,
          userId: event.locals.user!.id,
          tujuanPembelajaran: form.data.tujuanPembelajaran
        }
      });

    return {
      form
    };
  }
};