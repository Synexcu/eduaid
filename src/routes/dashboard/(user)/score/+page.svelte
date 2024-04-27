<script lang="ts">
  import { Users } from 'lucide-svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Kelas</h1>
      <p>Daftar Kelas</p>
    </div>
  </div>
  <hr />
  <div class="grid grid-cols-3 gap-4">
    {#each data.classData as classData (classData.classId)}
      <a
        href="/dashboard/score/{classData.classId}"
        class="flex w-full justify-between rounded-md bg-primary p-4 text-primary-foreground"
      >
        <div>{classData.classname}</div>
        <div class="flex gap-2">
          <Users />
          {classData.studentCount}
        </div>
      </a>
    {/each}
  </div>
</div>
