import { db } from '$lib/server';
import { userTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { and, eq, ne } from 'drizzle-orm';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  const data = await db.query.userTable.findFirst({
    where: eq(userTable.id, id)
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

    const exist = await db.query.userTable.findFirst({
      where: and(ne(userTable.id, form.data.id), eq(userTable.username, form.data.username))
    });

    if (exist) {
      return setError(form, 'username', 'Username already exist');
    }

    const hashedPassword = await new Argon2id().hash(form.data.password);

    await db
      .insert(userTable)
      .values({
        id: form.data.id,
        username: form.data.username,
        password: hashedPassword,
        role: form.data.role,
        status: form.data.status
      })
      .onConflictDoUpdate({
        target: userTable.id,
        set: {
          username: form.data.username,
          password: hashedPassword,
          role: form.data.role,
          status: form.data.status
        }
      });

    return {
      form
    };
  }
};
