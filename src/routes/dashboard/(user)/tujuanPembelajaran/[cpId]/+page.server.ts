import { db } from '$lib/server';
import { tpTable, cpTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const cpId = params.cpId;

  const tpData = await db.query.cpTable.findFirst({
    where: eq(cpTable.id, cpId),
    with: {
      tp: true
    }
  });

  return {
    tpData,
    cpId
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(tpTable).where(eq(tpTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
