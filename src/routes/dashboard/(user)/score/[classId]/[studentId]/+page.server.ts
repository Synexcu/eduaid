import { db } from '$lib/server';
import { cpTable, nilaiTable, subjectTable, tpTable } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { fail, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const studentId = params.studentId;
  const classId = params.classId;

  const scoreData = await db
    .select({
      nilaiId: nilaiTable.id,
      subjectName: subjectTable.subjectName,
      tpName: tpTable.tujuanPembelajaran,
      score: nilaiTable.nilai
    })
    .from(nilaiTable)
    .where(eq(nilaiTable.studentId, studentId))
    .fullJoin(tpTable, eq(nilaiTable.tpId, tpTable.id))
    .fullJoin(cpTable, eq(tpTable.cpId, cpTable.id))
    .fullJoin(subjectTable, eq(cpTable.subjectId, subjectTable.id));

  return {
    scoreData,
    classId,
    studentId
  };
};

export const actions: Actions = {
  delete: async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
      return fail(400, { message: 'invalid request' });
    }

    try {
      await db.delete(nilaiTable).where(eq(nilaiTable.id, id));
    } catch (error) {
      return fail(500, { message: 'something went wrong' });
    }

    return;
  }
};
