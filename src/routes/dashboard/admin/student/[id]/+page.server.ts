import { db } from '$lib/server';
import { studentTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { and, eq, ne } from 'drizzle-orm';
import { generateId } from 'lucia';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.studentTable.findFirst({
    where: eq(studentTable.id, id)
  });

  const kelas = await db.query.classTable.findMany();

  return {
    form: await superValidate(data, zod(formSchema)),
    kelas
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

    const nikexist = await db.query.studentTable.findFirst({
      where: and(eq(studentTable.noInduk, form.data.noInduk), ne(studentTable.id, form.data.id))
    });

    if (nikexist) {
      return setError(form, 'noInduk', 'No Induk already exist');
    }

    const nisnexist = await db.query.studentTable.findFirst({
      where: and(eq(studentTable.nisn, form.data.nisn), ne(studentTable.id, form.data.id))
    });

    if (nisnexist) {
      return setError(form, 'nisn', 'nisn already exist');
    }

    await db
      .insert(studentTable)
      .values({
        ...form.data
      })
      .onConflictDoUpdate({
        target: studentTable.id,
        set: {
          ...form.data
        }
      });

    return {
      form
    };
  }
};
