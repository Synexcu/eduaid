<script lang="ts">
  import type { PageData } from './$types';
  import { Button } from '$lib/components/ui/button';
  import DataTable from './components/data-table.svelte';
  import { ArrowLeft, Plus } from 'lucide-svelte';

  export let data: PageData;
</script>

<div class="flex flex-col gap-4">
  <div class="flex items-center justify-between">
    <div class="flex flex-col gap-1">
      <h1 class="text-3xl font-bold">Nilai</h1>
      <p>Tabel Daftar Nilai</p>
    </div>
    <div class="flex gap-4">
      <Button variant="outline" href={`/dashboard/score/${data.classId}`} class="p-2 shadow-lg">
        <ArrowLeft />
      </Button>
      <Button
        href={`/dashboard/score/${data.classId}/${data.studentId}/new`}
        variant="outline"
        class="p-2 shadow-lg"
      >
        <Plus />
      </Button>
    </div>
  </div>
  <hr />
  <DataTable data={data.scoreData} />
</div>
