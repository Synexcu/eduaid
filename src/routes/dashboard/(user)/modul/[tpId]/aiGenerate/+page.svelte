<script lang="ts">
  import type { PageData } from './$types';
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
  import { useChat } from 'ai/svelte';
  import { page } from '$app/stores';

  let currentRoute = $page.url.pathname;

  export let data: PageData;

  const { messages, handleSubmit, input } = useChat({
    api: currentRoute
  });

  const form = superForm(data.form, {
    validators: zodClient(formSchema),

    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Submit succesfull');
        await goto('/dashboard/modul');
      }
    },

    onError(event) {
      toast.error(event.result.error.message);
    }
  });

  const { form: formData, enhance, submitting } = form;

  $: selectedTP = $formData.tpId
    ? {
        label: data.tujuanPembelajaran.find(
          (tujuanPembelajaran) => tujuanPembelajaran.id == $formData.tpId
        )?.tujuanPembelajaran,
        value: $formData.tpId
      }
    : undefined;
</script>

<!-- Title -->
<div class="flex items-center justify-between">
  <div>
    <h1 class="text-3xl font-bold">Asisten Ai</h1>
    <p>Buat Modul Pembelajaran Anda dengan bantuan Ai</p>
  </div>
  <Button variant="ghost" href="/dashboard/tujuanPembelajaran">Kembali</Button>
</div>

<!-- Line -->
<hr />

<!-- Chat & Input -->
<div class="flex min-h-[640px] flex-row gap-4">
  <!-- Chat Interface -->
  <div class="flex w-8/12 flex-col justify-between rounded-md border bg-slate-100 py-8 shadow-md">
    <!--  Chat -->
    <ul class="flex flex-col px-4 py-8">
      <li class="self-start text-left">
        <div class="font-bold text-slate-600">Asisten Ai</div>
        <div class="w-full max-w-3xl rounded-r-md rounded-t-md bg-slate-600 px-4 py-2 text-white">
          Halo, saya Edu Ai. Saya akan membantu Anda membuat Modul Pembelajaran. Berikan saja Tujuan
          Pembelajaran yang ingin Anda pilih, dan saya akan menghasilkan daftar saran untuk Anda.
        </div>
      </li>

      {#each $messages as message}
        {#if message.role === 'user'}
          <li class="self-end text-right">
            <div class="font-bold text-primary">{message.role}</div>
            <div class="w-full max-w-3xl rounded-l-md rounded-t-md bg-primary px-4 py-2 text-white">
              {message.content}
            </div>
          </li>
        {:else}
          <li class="self-start text-left">
            <div class="font-bold text-slate-600">Asisten Ai</div>
            <div
              class="w-full max-w-3xl rounded-r-md rounded-t-md bg-slate-600 px-4 py-2 text-white"
            >
              {message.content}
            </div>
          </li>
        {/if}
      {/each}
    </ul>

    <!-- Input -->
    <form on:submit={handleSubmit} class="flex w-full gap-4 px-4">
      <Input bind:value={$input} class="h-full" />
      <Button type="submit" class="h-full">Send</Button>
    </form>
  </div>

  <!-- Input Interface -->
  <div class="flex w-4/12 flex-col rounded-md border p-8 shadow-md">
    <form method="POST" use:enhance>
      <Form.Field {form} name="id">
        <Form.Control let:attrs>
          <input hidden name={attrs.name} bind:value={$formData.id} />
        </Form.Control>
      </Form.Field>

      <Form.Field {form} name="modul">
        <Form.Control let:attrs>
          <Form.Label>Modul</Form.Label>
          <Input {...attrs} bind:value={$formData.modul} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>

      <Form.Field {form} name="tpId">
        <Form.Control let:attrs>
          <Form.Label>Tujuan Pembelajaran</Form.Label>
          <Select.Root
            selected={selectedTP}
            onSelectedChange={(v) => {
              v && ($formData.tpId = v.value);
            }}
          >
            <Select.Trigger {...attrs}>
              <Select.Value placeholder="Pilih TP..." />
            </Select.Trigger>
            <Select.Content>
              {#each data.tujuanPembelajaran as tujuanPembelajaran (tujuanPembelajaran.id)}
                <Select.Item
                  value={tujuanPembelajaran.id}
                  label={tujuanPembelajaran.tujuanPembelajaran}
                />
              {/each}
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
</div>
