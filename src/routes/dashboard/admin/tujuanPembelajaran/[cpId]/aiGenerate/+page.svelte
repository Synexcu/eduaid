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
        await goto('/dashboard/tujuanPembelajaran');
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
  <!-- Title -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">Asisten Ai</h1>
      <p>Buat Tujuan Pembelajaran Anda dengan bantuan Ai</p>
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
            Halo, saya Edu Ai. Saya akan membantu Anda membuat Tujuan Pembelajaran. Berikan saja
            Capaian Pembelajaran yang ingin Anda pilih, dan saya akan menghasilkan daftar saran
            untuk Anda.
          </div>
        </li>

        {#each $messages as message}
          {#if message.role === 'user'}
            <li class="self-end text-right">
              <div class="font-bold text-primary">{message.role}</div>
              <div
                class="w-full max-w-3xl rounded-l-md rounded-t-md bg-primary px-4 py-2 text-white"
              >
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
  </div>
</div>
