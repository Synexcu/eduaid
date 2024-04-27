<script lang="ts">
  import { enhance } from '$app/forms';
  import { LogOut } from 'lucide-svelte';
  import * as Tooltip from './ui/tooltip';
  import Button from './ui/button/button.svelte';
</script>

<div class="sticky top-0 z-10 border-b-2 bg-background">
  <div class="z-20 flex h-full w-full justify-end bg-primary/15 p-4">
    <form method="post" action="/?/logout" use:enhance>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <button
            class="group flex h-10 items-center rounded-md border-2 border-primary bg-background p-2"
            type="submit"
          >
            <LogOut
              size="18"
              strokeWidth={3}
              class="text-gray-500 transition-all duration-200 group-hover:size-5"
            />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>Log Out</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </form>
  </div>
</div>
