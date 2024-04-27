<script lang="ts">
  import { Loader2 } from 'lucide-svelte';
  import { Button } from '../button';
  import Modal from '../modal.svelte';

  export let isOpen: boolean;
  export let onClose: () => void;
  export let onConfirm: () => void;
  export let loading: boolean;
</script>

<Modal title="Are you sure?" description="This action cannot be undone." {isOpen} {onClose}>
  <div class="flex w-full items-center justify-end space-x-2 pt-6">
    <Button disabled={loading} variant="outline" on:click={onClose}>Cancel</Button>
    <Button disabled={loading} variant="destructive" on:click={onConfirm}>
      {#if loading}
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {/if}
      Continue
    </Button>
  </div>
</Modal>
