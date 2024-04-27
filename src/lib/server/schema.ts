import { relations, sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable('user', {
  id: text('id').notNull().primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: integer('role').default(1).notNull(), // 1: user, 2: admin
  status: integer('status').default(1).notNull(), // 1: inactive, 2: active
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const usersRelations = relations(userTable, ({ many }) => ({
  class: many(classTable),
  tp: many(tpTable)
}));

export type selectUser = typeof userTable.$inferSelect;

export const sessionTable = sqliteTable('session', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull()
});

export const classTable = sqliteTable('class', {
  id: text('id').notNull().primaryKey(),
  userId: text('user_id').references(() => userTable.id, {
    onDelete: 'set null'
  }),
  classname: text('classname').notNull(),
  batch: integer('batch').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const classRelations = relations(classTable, ({ one, many }) => ({
  students: many(studentTable),
  teacher: one(userTable, {
    fields: [classTable.userId],
    references: [userTable.id]
  })
}));

export type selectClass = typeof classTable.$inferSelect;

export const studentTable = sqliteTable('student', {
  id: text('id').notNull().primaryKey(),
  classId: text('class_id').references(() => classTable.id, { onDelete: 'set null' }),
  noInduk: text('no_induk').notNull().unique(),
  studentName: text('student_name').notNull(),
  nisn: text('nisn').notNull().unique(),
  namaPanggilan: text('nama_panggilan').notNull(),
  gender: integer('gender').notNull(), // 1: laki, 2: perempuan
  agama: text('agama').notNull(),
  tempatLahir: text('tempatLahir').notNull(),
  tanggalLahir: text('tanggal_lahir').notNull(),
  pendidikan: text('pendidikan').notNull(),
  alamat: text('alamat').notNull(),
  namaAyah: text('nama_ayah').notNull(),
  namaIbu: text('nama_ibu').notNull(),
  pekerjaanAyah: text('pekerjaan_ayah').notNull(),
  pekerjaanIbu: text('pekerjaan_ibu').notNull(),
  provinsi: text('provinsi').notNull(),
  kota: text('kota').notNull(),
  kecamatan: text('kecamatan').notNull(),
  kelurahan: text('kelurahan').notNull(),
  jalan: text('jalan').notNull(),
  noTelepon: text('no_telepon').notNull(),
  namaWali: text('nama_wali').notNull(),
  pekerjaanWali: text('pekerjaan_wali').notNull(),
  alamatWali: text('alamat_wali').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const studentRelations = relations(studentTable, ({ one, many }) => ({
  class: one(classTable, {
    fields: [studentTable.classId],
    references: [classTable.id]
  }),
  nilai: many(nilaiTable)
}));

export type selectStudent = typeof studentTable.$inferSelect;

export const subjectTable = sqliteTable('subject', {
  id: text('id').notNull().primaryKey(),
  subjectName: text('subject_name').notNull(),
  phase: integer('phase').notNull(),
  minimum: integer('minimum').notNull(),
  medium: integer('medium').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export type selectSubject = typeof subjectTable.$inferSelect;

export const pelajaranRelations = relations(subjectTable, ({ many }) => ({
  capaianPembelajaran: many(cpTable)
}));

export const cpTable = sqliteTable('capainPembelajaran', {
  id: text('id').notNull().primaryKey(),
  subjectId: text('subject_id').references(() => subjectTable.id, { onDelete: 'set null' }),
  capaianPembelajaran: text('capaian_pembelajaran').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export type selectCp = typeof cpTable.$inferSelect;

export const cpRelations = relations(cpTable, ({ one, many }) => ({
  subject: one(subjectTable, {
    fields: [cpTable.subjectId],
    references: [subjectTable.id]
  }),
  tp: many(tpTable)
}));

export const tpTable = sqliteTable('tujuanPembelajaran', {
  id: text('id').notNull().primaryKey(),
  cpId: text('cp_id').references(() => cpTable.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  tujuanPembelajaran: text('tujuan_pembelajaran').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const tpRelations = relations(tpTable, ({ one, many }) => ({
  cp: one(cpTable, {
    fields: [tpTable.cpId],
    references: [cpTable.id]
  }),
  teacher: one(userTable, {
    fields: [tpTable.userId],
    references: [userTable.id]
  }),
  modul: many(modulTable)
}));

export type selectTP = typeof tpTable.$inferSelect;

export const nilaiTable = sqliteTable('nilai', {
  id: text('id').notNull().primaryKey(),
  tpId: text('tp_id')
    .notNull()
    .references(() => tpTable.id, { onDelete: 'cascade' }),
  studentId: text('student_id')
    .notNull()
    .references(() => studentTable.id, { onDelete: 'cascade' }),
  nilai: integer('nilai').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const nilaiRelations = relations(nilaiTable, ({ one }) => ({
  tp: one(tpTable, {
    fields: [nilaiTable.tpId],
    references: [tpTable.id]
  }),
  student: one(studentTable, {
    fields: [nilaiTable.studentId],
    references: [studentTable.id]
  })
}));

export const modulTable = sqliteTable('modul', {
  id: text('id').notNull().primaryKey(),
  tpId: text('tp_id').references(() => tpTable.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  modul: text('modul').notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export const modulRelations = relations(modulTable, ({ one }) => ({
  tp: one(tpTable, {
    fields: [modulTable.tpId],
    references: [tpTable.id]
  }),
  teacher: one(userTable, {
    fields: [modulTable.userId],
    references: [userTable.id]
  })
}));

export type selectmodul = typeof modulTable.$inferSelect;

export const imagesTable = sqliteTable('images', {
  id: text('id').notNull().primaryKey(),
  link: text('link').notNull().unique(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`)
});

export type selectImages = typeof imagesTable.$inferSelect;