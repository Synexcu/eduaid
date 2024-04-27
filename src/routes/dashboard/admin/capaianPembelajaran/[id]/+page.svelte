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
        toast.success('Submit succesfull');
        await goto('/dashboard/admin/capaianPembelajaran');
      }
    },

    onError(event) {
      toast.error(event.result.error.message);
    }
  });

  const { form: formData, enhance, submitting } = form;

  $: selectedSubject = $formData.subjectId
    ? (() => {
        const subject = data.subject.find((subject) => subject.id === $formData.subjectId);
        const label = subject ? `${subject.subjectName} Fase ${subject.phase}` : '';
        return { label, value: $formData.subjectId };
      })()
    : undefined;

  data.subject;
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Capaian Pembelajaran</h1>
      {#if $formData.id}
        <p>Form Edit Capaian Pembelajaran</p>
      {:else}
        <p>Form Buat Capaian Pembelajaran</p>
      {/if}
    </div>
    <Button variant="outline" href="/dashboard/admin/capaianPembelajaran" class="p-2 shadow-lg">
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
    <Form.Field {form} name="capaianPembelajaran">
      <Form.Control let:attrs>
        <Form.Label>Capaian Pembelajaran</Form.Label>
        <Input {...attrs} bind:value={$formData.capaianPembelajaran} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="subjectId">
      <Form.Control let:attrs>
        <Form.Label>Pelajaran</Form.Label>
        <Select.Root
          selected={selectedSubject}
          onSelectedChange={(v) => {
            v && ($formData.subjectId = v.value);
          }}
        >
          <Select.Trigger {...attrs}>
            <Select.Value placeholder="Pilih pelajaran" />
          </Select.Trigger>
          <Select.Content>
            {#if data.subject.length}
              {#each data.subject as subject (subject.id)}
                <Select.Item
                  value={subject.id}
                  label={`${subject.subjectName} Fase ${subject.phase}`}
                />
              {/each}
            {:else}
              <Select.Item value="none" label="Pelajaran Belum Ada" disabled />
            {/if}
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.subjectId} name={attrs.name} />
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
