import { db } from '$lib/server';
import { cpTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { createChatCompletion } from '$lib/server/openai';

export const load: PageServerLoad = async () => {
  const cpData = await db.query.cpTable.findMany({
    with: {
      subject: {
        columns: {
          subjectName: true,
          phase: true
        }
      }
    }
  });

  return {
    cpData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(cpTable).where(eq(cpTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
