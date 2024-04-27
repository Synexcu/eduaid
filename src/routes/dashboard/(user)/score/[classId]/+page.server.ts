import { db } from '$lib/server';
import { nilaiTable, studentTable } from '$lib/server/schema';
import { eq, avg } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const classId = params.classId;

  const studentData = await db
    .select({
      studentId: studentTable.id,
      studentName: studentTable.studentName,
      average: avg(nilaiTable.nilai)
    })
    .from(studentTable)
    .where(eq(studentTable.classId, classId))
    .leftJoin(nilaiTable, eq(studentTable.id, nilaiTable.studentId))
    .groupBy(studentTable.id)
    .orderBy(studentTable.studentName);

  return {
    studentData,
    classId
  };
};
