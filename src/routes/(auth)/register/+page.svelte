<script lang="ts">
	import type { PageData } from './$types';

	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema } from './schema';
	import { Loader2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(formSchema),
		resetForm: false,

		async onUpdate({ form }) {
			if (form.valid) {
				toast.success('Username created');
				await goto('/');
			}
		}
	});

	const { form: formData, enhance, submitting } = form;
</script>

<Card.Root class="w-full max-w-md">
	<form method="POST" action="?/register" use:enhance>
		<Card.Header>
			<Card.Title>Register</Card.Title>
			<Card.Description>Register to your account</Card.Description>
		</Card.Header>
		<Card.Content>
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
		</Card.Content>
		<Card.Footer class="flex w-full justify-between">
			<Button href="/" variant="ghost">Login</Button>
			<Form.Button disabled={$submitting}>
				{#if $submitting}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
				{/if}
				Submit
			</Form.Button>
		</Card.Footer>
	</form>
</Card.Root>
