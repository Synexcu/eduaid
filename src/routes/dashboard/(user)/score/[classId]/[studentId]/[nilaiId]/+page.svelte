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
        await goto(`/dashboard/score/${data.classId}/${data.studentId}`);
      }
    },

    onError(event) {
      toast.error(event.result.error.message);
    }
  });

  const { form: formData, enhance, submitting } = form;

  $: selectedTp = $formData.tpId
    ? {
        label: data.tpData.find((item) => item.tpId == $formData.tpId)?.tpName as string,
        value: $formData.tpId
      }
    : undefined;
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Nilai</h1>
      {#if $formData.id}
        <p>Form Edit Nilai</p>
      {:else}
        <p>Form Buat Nilai</p>
      {/if}
    </div>
    <Button variant="outline" href={`/dashboard/score/${data.classId}`} class="p-2 shadow-lg">
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
    <Form.Field {form} name="nilai">
      <Form.Control let:attrs>
        <Form.Label>Nilai (1 - 100)</Form.Label>
        <Input {...attrs} bind:value={$formData.nilai} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="tpId">
      <Form.Control let:attrs>
        <Form.Label>Pelajaran</Form.Label>
        <Select.Root
          selected={selectedTp}
          onSelectedChange={(v) => {
            v && ($formData.tpId = v.value);
          }}
        >
          <Select.Trigger {...attrs}>
            <Select.Value placeholder="Pilih tujuan pelajaran..." />
          </Select.Trigger>
          <Select.Content>
            {#if data.tpData.length}
              {#each data.tpData as tpData (tpData.tpId)}
                <Select.Item value={tpData.tpId} label={tpData.tpName} />
              {/each}
            {:else}
              <Select.Item value="" label="Tujuan pembelajaran tidak ada" disabled />
            {/if}
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.tpId} name={attrs.name} />
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
