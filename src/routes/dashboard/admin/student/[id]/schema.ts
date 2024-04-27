import { ZodType, z } from 'zod';

export const formSchema = z.object({
  id: z.string(),
  classId: z.string().nullable(),
  noInduk: z.string().min(1),
  studentName: z.string().min(1),
  nisn: z.string().min(1),
  namaPanggilan: z.string().min(1),
  gender: z.number().gt(0), // 1: laki, 2: perempuan
  agama: z.string().min(1),
  tempatLahir: z.string().min(1),
  tanggalLahir: z.string().min(1),
  pendidikan: z.string().min(1),
  alamat: z.string().min(1),
  namaAyah: z.string().min(1),
  namaIbu: z.string().min(1),
  pekerjaanAyah: z.string().min(1),
  pekerjaanIbu: z.string().min(1),
  jalan: z.string().min(1),
  provinsi: z.string().min(1),
  kota: z.string().min(1),
  kecamatan: z.string().min(1),
  kelurahan: z.string().min(1),
  noTelepon: z.string().min(1),
  namaWali: z.string().min(1),
  pekerjaanWali: z.string().min(1),
  alamatWali: z.string().min(1)
});

export type FormSchema = typeof formSchema;
