<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Loader2 } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { formSchema } from './schema';

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    resetForm: false,

    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('User teraktivasi');
        await goto('/dashboard/score');
        invalidateAll();
      }
    },

    onError(event) {
      toast.error(event.result.error.message);
    }
  });
  const { form: formData, enhance, submitting } = form;
  $formData.password = '';
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">Aktivasi Akun</h1>
      <p>Please input your username and password</p>
    </div>
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
        <Input {...attrs} bind:value={$formData.password} type="password" />
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
