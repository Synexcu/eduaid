import { db } from '$lib/server';
import { subjectTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.subjectTable.findFirst({
    where: eq(subjectTable.id, id)
  });

  return {
    form: await superValidate(data, zod(formSchema))
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
      .insert(subjectTable)
      .values({
        id: form.data.id,
        subjectName: form.data.subjectName,
        phase: form.data.phase,
        medium: form.data.medium,
        minimum: form.data.minimum
      })
      .onConflictDoUpdate({
        target: subjectTable.id,
        set: {
          subjectName: form.data.subjectName,
          phase: form.data.phase,
          medium: form.data.medium,
          minimum: form.data.minimum
        }
      });

    return {
      form
    };
  }
};
