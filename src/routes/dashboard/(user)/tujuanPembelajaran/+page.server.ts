import { db } from '$lib/server';
import { classTable, cpTable, subjectTable, tpTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { count, eq, isNotNull, sql } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const sq = db
    .select({
      phase: sql<number>`CASE
    WHEN batch IN (1, 2) THEN 1
    WHEN batch IN (3, 4) THEN 2
    WHEN batch IN (5, 6) THEN 3
    ELSE NULL
    END `.as('phasecolumn')
    })
    .from(classTable)
    .where(eq(classTable.userId, event.locals.user!.id))
    .as('sq');

  const cpData = await db
    .select({
      cpId: cpTable.id,
      capaianPembelajaran: cpTable.capaianPembelajaran,
      tpCount: count(tpTable.id)
    })
    .from(cpTable)
    .leftJoin(tpTable, eq(tpTable.cpId, cpTable.id))
    .leftJoin(subjectTable, eq(cpTable.subjectId, subjectTable.id))
    .leftJoin(sq, eq(subjectTable.phase, sq.phase))
    .where(isNotNull(sq.phase))
    .groupBy(cpTable.capaianPembelajaran);

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
      await db.delete(tpTable).where(eq(tpTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
