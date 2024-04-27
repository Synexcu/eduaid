import { db } from '$lib/server';
import { modulTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params, locals }) => {
    const id = params.id;
    const data = await db.query.modulTable.findFirst({
      where: eq(modulTable.id, id),
      with: {
        tp: true
      }
    });
  
    const tujuanPembelajaran = await db.query.tpTable.findMany();

    const filteredTpData = tujuanPembelajaran.filter(tp => {
      if (locals.user!.role === 2) {
        return tujuanPembelajaran;
      } else {
        return tp.userId === locals.user!.id;
      }
    });
  
    return {
      form: await superValidate(data, zod(formSchema)),
      tujuanPembelajaran:filteredTpData
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
      .insert(modulTable)
      .values({
        id: form.data.id,
        tpId: form.data.tpId,
        userId: event.locals.user!.id,
        modul: form.data.modul
      })
      .onConflictDoUpdate({
        target: modulTable.id,
        set: {
          tpId: form.data.tpId,
          userId: event.locals.user!.id,
          modul: form.data.modul
        }
      });

    return {
      form
    };
  }
};