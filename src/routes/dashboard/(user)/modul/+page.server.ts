import { db } from '$lib/server';
import { modulTable, cpTable, classTable, tpTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { count, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const modulData = await db
    .select({
      tpId: tpTable.id,
      tpName: tpTable.tujuanPembelajaran,
      modulCount: count(modulTable.id)
    })
    .from(tpTable)
    .leftJoin(modulTable, eq(modulTable.tpId, tpTable.id));

  return {
    modulData
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(modulTable).where(eq(modulTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
