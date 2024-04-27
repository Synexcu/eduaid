import { db } from '$lib/server';
import { cpTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.cpTable.findFirst({
    where: eq(cpTable.id, id),
    with: {
      subject: {
        columns: {
          subjectName: true,
          phase: true
        }
      }
    }
  });

  const subject = await db.query.subjectTable.findMany();

  return {
    form: await superValidate(data, zod(formSchema)),
    subject
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
      .insert(cpTable)
      .values({
        id: form.data.id,
        subjectId: form.data.subjectId,
        capaianPembelajaran: form.data.capaianPembelajaran
      })
      .onConflictDoUpdate({
        target: cpTable.id,
        set: {
          subjectId: form.data.subjectId,
          capaianPembelajaran: form.data.capaianPembelajaran
        }
      });

    return {
      form
    };
  }
};
