<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { CirclePlus, BotMessageSquare } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold">Modul Pembelajaran</h1>
    <p>Pengaturan Modul Pembelajaran</p>
  </div>

  <div class="flex flex-row gap-4">
    <Button href="/dashboard/modul/tp/new" variant="default" class="w-fit gap-3 shadow-lg">
      <CirclePlus class="w-4" />
      Tambah
    </Button>
    <Button href="/dashboard/modul/tp/aiGenerate" variant="default" class="w-fit gap-3 shadow-lg">
      <BotMessageSquare class="w-4" />
      Tambah dengan Ai
    </Button>
  </div>

  <hr />

  <div class="flex flex-wrap">
    {#each data.modulData as md (md.tpId)}
      {#if data.modulData.filter((modulData) => modulData.tpId === md.tpId).length > 0}
        <a
          class="w-1/3 rounded-md px-4 py-6 shadow-md hover:shadow-lg"
          href={`/dashboard/modul/${md.tpId}`}
        >
          <!-- Title -->
          <div
            class="mb-2 text-xl font-bold text-slate-800 transition duration-300 ease-in-out hover:text-slate-600"
          >
            <span>{md.tpName}</span>
          </div>

          <!-- Total -->
          <p class="text-base text-gray-700">
            Jumlah Modul
            <span class="font-semibold text-gray-900">
              {md.modulCount}
            </span>
          </p>
        </a>
      {/if}
    {/each}
  </div>
</div>
