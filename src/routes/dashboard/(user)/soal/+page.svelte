<script lang="ts">
  import { Input } from '$lib/components/ui/input';
  import { Button } from '$lib/components/ui/button';
  import { useChat } from 'ai/svelte';
  import { page } from '$app/stores';

  let currentRoute = $page.url.pathname;
  
  const { messages, handleSubmit, input } = useChat({
    api: currentRoute
  });
</script>

 
  <!-- Title -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">Asisten Ai</h1>
      <p>Buat Soal dengan bantuan Ai</p>
    </div>
    <Button variant="ghost" href="/dashboard/tujuanPembelajaran">Kembali</Button>
  </div>
 
  <!-- Line -->
  <hr />
  
  <!-- Chat & Input -->
  <div class="flex min-h-[640px] flex-col justify-between gap-4">
      <!--  Chat -->
      <ul class="flex flex-col px-4 py-8">
        <li class="self-start text-left">
          <div class="font-bold text-slate-600">Asisten Ai</div>
          <div class="w-full max-w-3xl rounded-r-md rounded-t-md bg-slate-600 px-4 py-2 text-white">
            Halo, saya Edu Ai. Saya akan membantu Anda membuat Soal. Berikan saja Topik
            yang ingin Anda pilih, dan saya akan menghasilkan daftar soal untuk Anda. Pastikan Anda
            mengecek ulang fakta dan pilihan jawaban yang saya berikan.
          </div>
        </li>
  
        {#each $messages as message}
          {#if message.role === 'user'}
            <li class="self-end text-right">
              <div class="font-bold text-primary">{message.role}</div>
              <div class="w-full max-w-3xl rounded-l-md rounded-t-md bg-primary px-4 py-2 text-white">
                {message.content}
              </div>
            </li>
          {:else}
            <li class="self-start text-left">
              <div class="font-bold text-slate-600">Asisten Ai</div>
              <div
                class="w-full max-w-3xl rounded-r-md rounded-t-md bg-slate-600 px-4 py-2 text-white"
              >
                {message.content}
              </div>
            </li>
          {/if}
        {/each}
      </ul>
    <!-- Input -->
    <form on:submit={handleSubmit} class="flex w-full gap-4 px-4">
      <Input bind:value={$input} class="h-full" />
      <Button type="submit" class="h-full">Send</Button>
    </form>
  </div>
  