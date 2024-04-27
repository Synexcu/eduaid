import { db } from '$lib/server';
import { classTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const classData = await db.query.classTable.findMany({
    with: {
      teacher: {
        columns: {
          username: true
        }
      }
    }
  });

  return {
    classData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(classTable).where(eq(classTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
