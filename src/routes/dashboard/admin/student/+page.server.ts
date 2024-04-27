import { db } from '$lib/server';
import { studentTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const student = await db.query.studentTable.findMany({
    with: {
      class: {
        columns: {
          classname: true
        }
      }
    }
  });

  return {
    student
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(studentTable).where(eq(studentTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
