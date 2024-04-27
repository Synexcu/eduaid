import { db } from '$lib/server';
import { classTable, cpTable, nilaiTable, subjectTable, tpTable } from '$lib/server/schema';
import { fail } from '@sveltejs/kit';
import { and, eq, isNotNull, sql } from 'drizzle-orm';
import { generateId } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { formSchema } from './schema';

export const load: PageServerLoad = async ({ params, locals }) => {
  const studentId = params.studentId;
  const classId = params.classId;
  const id = params.nilaiId;

  const data = await db.query.nilaiTable.findFirst({
    where: eq(nilaiTable.id, id)
  });

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
    .where(eq(classTable.userId, locals.user!.id))
    .as('sq');

  const tpData = await db
    .select({
      tpId: tpTable.id,
      tpName: tpTable.tujuanPembelajaran
    })
    .from(tpTable)
    .where(and(eq(tpTable.userId, locals.user!.id), isNotNull(sq.phase)))
    .leftJoin(cpTable, eq(tpTable.cpId, cpTable.id))
    .leftJoin(subjectTable, eq(cpTable.subjectId, subjectTable.id))
    .leftJoin(sq, eq(subjectTable.phase, sq.phase));

  return {
    form: await superValidate(data, zod(formSchema)),
    tpData,
    studentId,
    classId
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form
      });
    }

    if (!form.data.id) {
      form.data.id = generateId(15);
    }

    await db
      .insert(nilaiTable)
      .values({
        id: form.data.id,
        tpId: form.data.tpId,
        nilai: form.data.nilai,
        studentId: event.params.studentId
      })
      .onConflictDoUpdate({
        target: nilaiTable.id,
        set: {
          tpId: form.data.tpId,
          nilai: form.data.nilai,
          studentId: event.params.studentId
        }
      });

    return {
      form
    };
  }
};
