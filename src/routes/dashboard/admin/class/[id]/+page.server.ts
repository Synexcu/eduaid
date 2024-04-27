import { db } from '$lib/server';
import { classTable, userTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.classTable.findFirst({
    where: eq(classTable.id, id),
    with: {
      teacher: true
    }
  });

  const teacher = await db.query.userTable.findMany({
    where: eq(userTable.status, 2)
  });

  return {
    form: await superValidate(data, zod(formSchema)),
    teacher
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
      .insert(classTable)
      .values({
        id: form.data.id,
        userId: form.data.userId,
        classname: form.data.classname,
        batch: form.data.batch
      })
      .onConflictDoUpdate({
        target: classTable.id,
        set: {
          userId: form.data.userId,
          classname: form.data.classname,
          batch: form.data.batch
        }
      });

    return {
      form
    };
  }
};
