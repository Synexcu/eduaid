<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';
  import { ArrowLeft, Loader2 } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { formSchema } from './schema';

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zodClient(formSchema),

    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Submit succesfull');
        await goto('/dashboard/admin/teacher');
      }
    },

    onError(event) {
      toast.error(event.result.error.message);
    }
  });

  const { form: formData, enhance, submitting } = form;

  $formData.password = '';

  $: selectedRole = $formData.role
    ? {
        label: $formData.role === 1 ? 'Pengguna' : 'Admin',
        value: $formData.role.toString()
      }
    : undefined;
  $: selectedStatus = $formData.status
    ? {
        label: $formData.status === 1 ? 'Tidak Aktif' : 'Aktif ',
        value: $formData.status.toString()
      }
    : undefined;
</script>

<!-- <SuperDebug data={$formData} /> -->

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Guru</h1>
      {#if $formData.id}
        <p>Form Edit Guru</p>
      {:else}
        <p>Form Pembuatan Guru</p>
      {/if}
    </div>
    <Button variant="outline" href="/dashboard/admin/teacher" class="p-2 shadow-lg">
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
    <Form.Field {form} name="username">
      <Form.Control let:attrs>
        <Form.Label>Username</Form.Label>
        <Input {...attrs} bind:value={$formData.username} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="password">
      <Form.Control let:attrs>
        <Form.Label>Password</Form.Label>
        <Input type="password" {...attrs} bind:value={$formData.password} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="role">
      <Form.Control let:attrs>
        <Form.Label>Peran</Form.Label>
        <Select.Root
          selected={selectedRole}
          onSelectedChange={(v) => {
            v && ($formData.role = parseInt(v.value));
          }}
        >
          <Select.Trigger {...attrs}>
            <Select.Value placeholder="Pilih peran user " />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="1" label="Pengguna" />
            <Select.Item value="2" label="Admin" />
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.role} name={attrs.name} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Field {form} name="status">
      <Form.Control let:attrs>
        <Form.Label>Status</Form.Label>
        <Select.Root
          selected={selectedStatus}
          onSelectedChange={(v) => {
            v && ($formData.status = parseInt(v.value));
          }}
        >
          <Select.Trigger {...attrs}>
            <Select.Value placeholder="Pilih status" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="1" label="Tidak Aktif" />
            <Select.Item value="2" label="Aktif" />
          </Select.Content>
        </Select.Root>
        <input hidden bind:value={$formData.status} name={attrs.name} />
      </Form.Control>
      <Form.FieldErrors />
    </Form.Field>
    <Form.Button
      disabled={$submitting}
      class="mt-4 transition-all duration-200 hover:-translate-y-1"
    >
      {#if $submitting}
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      {/if}
      Simpan
    </Form.Button>
  </form>
</div>
