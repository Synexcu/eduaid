<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import { Textarea } from '$lib/components/ui/textarea';
  import { ArrowLeft, Loader2 } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import SuperDebug, { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { formSchema } from './schema';

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zodClient(formSchema),

    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Submit berhasil');
        await goto('/dashboard/admin/student');
      }
    },

    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;

  $: selectedGender = $formData.gender
    ? {
        label: $formData.gender === 1 ? 'Laki-laki' : 'Perempuan',
        value: $formData.gender.toString()
      }
    : undefined;

  $: selectedKelas = $formData.classId
    ? {
        label: data.kelas.find((kelas) => kelas.id == $formData.classId)?.classname,
        value: $formData.classId
      }
    : undefined;
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Siswa</h1>
      {#if $formData.id}
        <p>Form Edit Siswa</p>
      {:else}
        <p>Form Buat Siswa</p>
      {/if}
    </div>
    <Button variant="outline" href="/dashboard/admin/student" class="p-2 shadow-lg">
      <ArrowLeft />
    </Button>
  </div>
  <hr />

  <form method="POST" use:enhance>
    <Form.Field {form} name="id">
      <Form.Control let:attrs>
        <input hidden name={attrs.name} bind:value={$formData.id} />
      </Form.Control>
    </Form.Field>

    <h1 class="mb-2 text-xl">Identitas siswa</h1>
    <div class="flex gap-12">
      <Form.Field {form} name="noInduk" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>No Induk</Form.Label>
          <Input {...attrs} bind:value={$formData.noInduk} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="nisn" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>NISN</Form.Label>
          <Input {...attrs} bind:value={$formData.nisn} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="flex gap-12">
      <Form.Field {form} name="studentName" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Nama Lengkap</Form.Label>
          <Input {...attrs} bind:value={$formData.studentName} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="namaPanggilan" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Nama Panggilan</Form.Label>
          <Input {...attrs} bind:value={$formData.namaPanggilan} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="flex gap-12">
      <Form.Field {form} name="gender" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Jenis Kelamin</Form.Label>
          <Select.Root
            selected={selectedGender}
            onSelectedChange={(v) => {
              v && ($formData.gender = parseInt(v.value));
            }}
          >
            <Select.Trigger {...attrs}>
              <Select.Value placeholder="Pilih gender siswa" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="1" label="Laki-laki" />
              <Select.Item value="2" label="Perempuan" />
            </Select.Content>
          </Select.Root>
          <input hidden bind:value={$formData.gender} name={attrs.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="agama" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Agama</Form.Label>
          <Input {...attrs} bind:value={$formData.agama} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="pendidikan" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Pendidikan Sebelumnya</Form.Label>
          <Input {...attrs} bind:value={$formData.pendidikan} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="mt-2 flex gap-12">
      <Form.Field {form} name="tempatLahir" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Tempat Lahir</Form.Label>
          <Input {...attrs} bind:value={$formData.tempatLahir} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="tanggalLahir" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Tanggal Lahir</Form.Label>
          <input
            type="date"
            bind:value={$formData.tanggalLahir}
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground"
            {...attrs}
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="classId" class="w-full ">
        <Form.Control let:attrs>
          <Form.Label>Class</Form.Label>
          <Select.Root
            selected={selectedKelas}
            onSelectedChange={(v) => {
              v && ($formData.classId = v.value);
            }}
          >
            <Select.Trigger {...attrs}>
              <Select.Value placeholder="Pilih Kelas" />
            </Select.Trigger>
            <Select.Content>
              {#each data.kelas as kelas}
                <Select.Item value={kelas.id} label={kelas.classname} />
              {/each}
            </Select.Content>
          </Select.Root>
          <input hidden bind:value={$formData.classId} name={attrs.name} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <Form.Field {form} name="alamat">
      <Form.Control let:attrs>
        <Form.Label>Alamat Peserta Didik</Form.Label>
        <Textarea {...attrs} bind:value={$formData.alamat} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <h1 class="mb-2 mt-12 text-xl">Identitas Orang Tua</h1>
    <div class="flex gap-12">
      <Form.Field {form} name="namaAyah" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Nama Ayah</Form.Label>
          <Input {...attrs} bind:value={$formData.namaAyah} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="pekerjaanAyah" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Pekerjaan Ayah</Form.Label>
          <Input {...attrs} bind:value={$formData.pekerjaanAyah} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <div class="flex gap-12">
      <Form.Field {form} name="namaIbu" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Nama Ibu</Form.Label>
          <Input {...attrs} bind:value={$formData.namaIbu} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="pekerjaanIbu" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Pekerjaan Ibu</Form.Label>
          <Input {...attrs} bind:value={$formData.pekerjaanIbu} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <Form.Field {form} name="noTelepon">
      <Form.Control let:attrs>
        <Form.Label>No Telepon</Form.Label>
        <Input {...attrs} bind:value={$formData.noTelepon} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <div class="flex gap-12">
      <Form.Field {form} name="provinsi" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Provinsi</Form.Label>
          <Input {...attrs} bind:value={$formData.provinsi} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="kota" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Kabupaten/Kota</Form.Label>
          <Input {...attrs} bind:value={$formData.kota} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="kecamatan" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Kecamatan</Form.Label>
          <Input {...attrs} bind:value={$formData.kecamatan} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="kelurahan" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Kelurahan</Form.Label>
          <Input {...attrs} bind:value={$formData.kelurahan} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <Form.Field {form} name="jalan">
      <Form.Control let:attrs>
        <Form.Label>Jalan</Form.Label>
        <Textarea {...attrs} bind:value={$formData.jalan} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <h1 class="mb-2 mt-12 text-xl">Identitas Wali</h1>
    <div class="flex gap-12">
      <Form.Field {form} name="namaWali" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Nama Wali</Form.Label>
          <Input {...attrs} bind:value={$formData.namaWali} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="pekerjaanWali" class="w-full">
        <Form.Control let:attrs>
          <Form.Label>Pekerjaan Wali</Form.Label>
          <Input {...attrs} bind:value={$formData.pekerjaanWali} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </div>
    <Form.Field {form} name="alamatWali">
      <Form.Control let:attrs>
        <Form.Label>Alamat Wali</Form.Label>
        <Textarea {...attrs} bind:value={$formData.alamatWali} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Button disabled={$submitting} class="mt-4">
      {#if $submitting}
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      {/if}
      Submit
    </Form.Button>
  </form>
</div>
