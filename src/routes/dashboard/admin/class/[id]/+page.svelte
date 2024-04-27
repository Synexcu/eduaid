<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import SuperDebug, { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { toast } from 'svelte-sonner';
  import { formSchema } from './schema';
  import { goto } from '$app/navigation';
  import { ArrowLeft, Loader2 } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Submit berhasil');
        await goto('/dashboard/admin/class');
      }
    },
    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;

  $: selectedTeacher = $formData.userId
    ? {
        label: data.teacher.find((teacher) => teacher.id == $formData.userId)?.username,
        value: $formData.userId
      }
    : undefined;
  $: selectedBatch = $formData.batch.toString()
    ? {
        label: $formData.batch.toString(),
        value: $formData.batch.toString()
      }
    : undefined;
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Kelas</h1>
      {#if $formData.id}
        <p>Form Edit Kelas</p>
      {:else}
        <p>Form Buat Kelas</p>
      {/if}
    </div>
    <Button variant="outline" href="/dashboard/admin/class" class="p-2 shadow-lg">
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
    <Form.Field {form} name="classname">
      <Form.Control let:attrs>
        <Form.Label>Nama Kelas</Form.Label>
        <Input {...attrs} bind:value={$formData.classname} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="batch">
      <Form.Control let:attrs>
        <Form.Label>Tingkat Kelas</Form.Label>
        <Select.Root
          selected={selectedBatch}
          onSelectedChange={(v) => {
            v && ($formData.batch = parseInt(v.value));
          }}
        >
          <Select.Trigger {...attrs}>
            <Select.Value placeholder="Select batch" />
          </Select.Trigger>
          <Select.Content>
            {#each Array(6)
              .fill(undefined)
              .map((_, i) => i + 1) as num}
              <Select.Item value={num} label={num.toString()} />
            {/each}
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.batch} name={attrs.name} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="userId">
      <Form.Control let:attrs>
        <Form.Label>Wali Kelas</Form.Label>
        <Select.Root
          selected={selectedTeacher}
          onSelectedChange={(v) => {
            v && ($formData.userId = v.value);
          }}
        >
          <Select.Trigger {...attrs}>
            <Select.Value placeholder="Select teacher" />
          </Select.Trigger>
          <Select.Content>
            {#each data.teacher as teacher (teacher.id)}
              <Select.Item value={teacher.id} label={teacher.username} />
            {/each}
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.userId} name={attrs.name} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Button disabled={$submitting} class="mt-4">
      {#if $submitting}
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      {/if}
      Simpan
    </Form.Button>
  </form>
</div>
