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
        await goto('/dashboard/admin/subject');
      }
    },

    onError(event) {
      toast.error(event.result.error.message);
    }
  });

  const { form: formData, enhance, submitting } = form;

  const phaseLabel = ['Fase 1 (Kelas 1 & 2)', 'Fase 2 (Kelas 3 & 4)', 'Fase 3 (Kelas 5 & 6)'];

  $: selectedPhase = $formData.phase.toString()
    ? {
        label: phaseLabel[$formData.phase - 1],
        value: $formData.phase.toString()
      }
    : undefined;
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Pelajaran</h1>
      {#if $formData.id}
        <p>Form Edit Pelajaran</p>
      {:else}
        <p>Form Buat Pelajaran</p>
      {/if}
    </div>
    <Button variant="outline" href="/dashboard/admin/subject" class="p-2 shadow-lg">
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
    <Form.Field {form} name="subjectName">
      <Form.Control let:attrs>
        <Form.Label>Nama Pelajaran</Form.Label>
        <Input {...attrs} bind:value={$formData.subjectName} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="phase">
      <Form.Control let:attrs>
        <Form.Label>Fase</Form.Label>
        <Select.Root
          selected={selectedPhase}
          onSelectedChange={(v) => {
            v && ($formData.phase = parseInt(v.value));
          }}
        >
          <Select.Trigger {...attrs}>
            <Select.Value placeholder="Pilih fase" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value={1} label={'Fase 1 (Kelas 1 & 2)'} />
            <Select.Item value={2} label={'Fase 2 (Kelas 3 & 4)'} />
            <Select.Item value={3} label={'Fase 3 (Kelas 5 & 6)'} />
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.phase} name={attrs.name} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="minimum">
      <Form.Control let:attrs>
        <Form.Label>Nilai batas bawah</Form.Label>
        <Input {...attrs} bind:value={$formData.minimum} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="medium">
      <Form.Control let:attrs>
        <Form.Label>Nilai batas atas</Form.Label>
        <Input {...attrs} type="number" bind:value={$formData.medium} />
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
