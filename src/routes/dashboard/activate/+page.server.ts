import { db } from '$lib/server';
import { userTable } from '$lib/server/schema';
import { fail, redirect } from '@sveltejs/kit';
import { and, eq, ne } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';
import { Argon2id } from 'oslo/password';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user!.status === 2) redirect(302, '/dashboard');
  const data = await db.query.userTable.findFirst({
    where: eq(userTable.id, event.locals.user!.id)
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

    const exist = await db.query.userTable.findFirst({
      where: and(ne(userTable.id, form.data.id), eq(userTable.username, form.data.username))
    });

    if (exist) {
      return setError(form, 'username', 'Username already exist');
    }

    const hashedPassword = await new Argon2id().hash(form.data.password);

    await db
      .update(userTable)
      .set({
        username: form.data.username,
        password: hashedPassword,
        status: 2
      })
      .where(eq(userTable.id, form.data.id));

    return {
      form
    };
  }
};
