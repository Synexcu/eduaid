<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { ArrowLeft, BookMarked } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Siswa</h1>
      <p>Daftar Siswa</p>
    </div>
    <Button variant="outline" href="/dashboard/score" class="p-2 shadow-lg">
      <ArrowLeft />
    </Button>
  </div>
  <hr />
  <div class="grid grid-cols-3 gap-4">
    {#each data.studentData as studentData (studentData.studentId)}
      <a
        href="/dashboard/score/{data.classId}/{studentData.studentId}"
        class="flex w-full justify-between rounded-md bg-primary p-4 text-primary-foreground"
      >
        <div>{studentData.studentName}</div>
        <div class="flex gap-2">
          <BookMarked />
          {#if studentData.average}
            {studentData.average}
          {:else}
            0
          {/if}
        </div>
      </a>
    {/each}
  </div>
</div>
