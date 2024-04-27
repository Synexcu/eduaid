import type { Actions, PageServerLoad } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { db } from '$lib/server';
import { userTable } from '$lib/server/schema';
import { lucia } from '$lib/server/auth';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema))
  };
};

export const actions: Actions = {
  register: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    const userId = generateId(15);
    const hashedPassword = await new Argon2id().hash(form.data.password);

    const exist = await db.query.userTable.findFirst({
      where: (users, { eq }) => eq(users.username, form.data.username)
    });

    if (exist) {
      return setError(form, 'username', 'Username already exist');
    }

    await db.insert(userTable).values({
      id: userId,
      username: form.data.username,
      password: hashedPassword
    });

    return {
      form
    };
  },

  logout: async (event) => {
    if (!event.locals.session) {
      return fail(401);
    }
    await lucia.invalidateSession(event.locals.session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
    redirect(302, '/');
  }
};
