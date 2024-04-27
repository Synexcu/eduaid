<script lang="ts">
  import { navigating } from '$app/stores';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Topbar from '$lib/components/Topbar.svelte';
  import * as Card from '$lib/components/ui/card';
  import { Loader2 } from 'lucide-svelte';
  import type { LayoutData } from './$types';

  export let data: LayoutData;
</script>

<div class="flex">
  <Sidebar role={data.user.role} status={data.user.status} />
  <div class="flex flex-1 flex-col bg-background">
    <Topbar />
    <div class="container h-full w-full py-8">
      {#if $navigating}
        <div class="flex h-full w-full items-center justify-center">
          <Loader2 class="animate-spin" size="50" />
        </div>
      {:else}
        <Card.Root class="bg-prima w-full">
          <Card.Content class="p-6">
            <slot />
          </Card.Content>
        </Card.Root>
      {/if}
    </div>
  </div>
</div>
