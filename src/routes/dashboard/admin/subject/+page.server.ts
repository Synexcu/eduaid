import { db } from '$lib/server';
import { subjectTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const subject = await db.query.subjectTable.findMany();

  return {
    subject
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(subjectTable).where(eq(subjectTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
