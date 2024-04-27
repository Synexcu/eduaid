<script lang="ts">
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import SuperDebug, { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { toast } from 'svelte-sonner';
  import { formSchema } from './schema';
  import { goto } from '$app/navigation';
  import { Loader2 } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zodClient(formSchema),

    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Submit succesfull');
        await goto('/dashboard/admin/tujuanPembelajaran');
      }
    },

    onError(event) {
      toast.error(event.result.error.message);
    }
  });

  const { form: formData, enhance, submitting } = form;

  $: selectedCP = $formData.cpId
    ? {
        label: data.capaianPembelajaran.find(
          (capaianPembelajaran) => capaianPembelajaran.id == $formData.cpId
        )?.capaianPembelajaran,
        value: $formData.cpId
      }
    : undefined;
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">TP</h1>
      {#if $formData.id}
        <p>Edit TP</p>
      {:else}
        <p>Create TP</p>
      {/if}
    </div>
    <Button variant="ghost" href="/dashboard/admin/tujuanPembelajaran">Kembali</Button>
  </div>
  <hr />

  <SuperDebug data={$formData} />

  <form method="POST" use:enhance>
    <Form.Field {form} name="id">
      <Form.Control let:attrs>
        <input hidden name={attrs.name} bind:value={$formData.id} />
      </Form.Control>
    </Form.Field>

    <Form.Field {form} name="tujuanPembelajaran">
      <Form.Control let:attrs>
        <Form.Label>Tujuan Pembelajaran</Form.Label>
        <Input {...attrs} bind:value={$formData.tujuanPembelajaran} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="cpId">
      <Form.Control let:attrs>
        <Form.Label>Pelajaran</Form.Label>
        <Select.Root
          selected={selectedCP}
          onSelectedChange={(v) => {
            v && ($formData.cpId = v.value);
          }}
        >
          <Select.Trigger {...attrs}>
            <Select.Value placeholder="Pilih CP..." />
          </Select.Trigger>
          <Select.Content>
            {#each data.capaianPembelajaran as capaianPembelajaran (capaianPembelajaran.id)}
              <Select.Item
                value={capaianPembelajaran.id}
                label={capaianPembelajaran.capaianPembelajaran}
              />
            {/each}
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.cpId} name={attrs.name} />
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
