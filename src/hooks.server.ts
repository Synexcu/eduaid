import { lucia } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const auth: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get(lucia.sessionCookieName);
  if (!sessionId) {
    event.locals.user = null;
    event.locals.session = null;

    return resolve(event);
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    // sveltekit types deviates from the de-facto standard
    // you can use 'as any' too
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
  }

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
      path: '.',
      ...sessionCookie.attributes
    });
  }
  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};

const protect: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/dashboard')) {
    if (!event.locals.user) redirect(302, '/');
    if (event.locals.user.status !== 2) {
      if (event.url.pathname !== '/dashboard/activate') redirect(302, '/dashboard/activate');
    }
    if (event.url.pathname.startsWith('/dashboard/admin') && event.locals.user.role !== 2)
      redirect(302, '/dashboard/score');
  }

  return resolve(event);
};

export const handle = sequence(auth, protect);
