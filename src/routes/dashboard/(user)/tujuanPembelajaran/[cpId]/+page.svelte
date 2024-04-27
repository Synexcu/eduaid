<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { BotMessageSquare, CirclePlus, Pencil, Trash } from 'lucide-svelte';
  import type { PageData } from './$types';
  import Modal from '$lib/components/ui/modal.svelte';
  import { invalidateAll } from '$app/navigation';
  import { toast } from 'svelte-sonner';
  import type { SubmitFunction } from '../$types';
  import { Loader2 } from 'lucide-svelte';
  import { enhance } from '$app/forms';

  export let data: PageData;
  let isOpen = false;
  let loading = false;

  const addTodo: SubmitFunction = () => {
    loading = true;

    return ({ result }) => {
      if (result.type === 'failure') {
        toast.error(result.data?.message!);
      } else {
        loading = false;
        invalidateAll();
        toast.success('Tujuan Pembelajaran Deleted');
      }
    };
  };
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold">{data.tpData?.capaianPembelajaran}</h1>
  </div>

  <div class="flex flex-row gap-4">
    <Button
      href="/dashboard/tujuanPembelajaran/${data.cpId}/new"
      variant="default"
      class="w-fit gap-3 shadow-lg"
    >
      <CirclePlus class="w-4" />
      Tambah
    </Button>
    <Button
      href="/dashboard/tujuanPembelajaran/${data.cpId}/aiGenerate"
      variant="default"
      class="w-fit gap-3 shadow-lg"
    >
      <BotMessageSquare class="w-4" />
      Tambah dengan Ai
    </Button>
  </div>

  <hr />

  <h2 class="text-1xl font-bold">Tujuan Pembelajaran:</h2>

  {#if data.tpData}
    {#each data.tpData.tp as tp (tp.id)}
      <Modal
        title="Apakah anda yakin?"
        description="Tindakan ini tidak dapat dibatalkan"
        {isOpen}
        onClose={() => (isOpen = false)}
        >
        <div class="flex w-full items-center justify-end space-x-2 pt-6">
          <Button disabled={loading} variant="outline" on:click={() => (isOpen = false)}>Batal</Button>
          <form action="?/delete&id={tp.id}" method="post" use:enhance={addTodo}>
            <Button disabled={loading} variant="destructive" type="submit">
              {#if loading}
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {/if}
              Lanjut
            </Button>
          </form>
        </div>
      </Modal>

      <div class="rounded-md bg-neutral-50 p-2 shadow-sm hover:shadow-md">
        <div class="flex w-full flex-row items-center justify-between">
          <p class="">{tp.tujuanPembelajaran}</p>

          <div class="flex flex-row gap-4">
            <Button
              class="w-fit gap-3 shadow-lg"
              href={`/dashboard/tujuanPembelajaran/${data.cpId}/${tp.id}`}
            >
              <Pencil class="w-4" />
              Edit
            </Button>

            <Button class="w-fit gap-3 shadow-lg" on:click={() => (isOpen = true)}>
              <Trash class="w-4" />
              Hapus
            </Button>
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>
