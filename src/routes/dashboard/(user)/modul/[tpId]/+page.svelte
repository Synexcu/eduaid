<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { CirclePlus, Pencil, BotMessageSquare, Trash } from 'lucide-svelte';
    import type { PageData } from './$types';
    import { page } from '$app/stores';
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
            toast.success('Modul Deleted');
        }
        };
    };

    const tpId = $page.params.tpId
</script>

<div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold">{data.modulData.find(modul => modul.tpId === tpId)?.tp?.tujuanPembelajaran || 'Capaian pembelajaran not found'}</h1>
    </div>
    
    <div class="flex flex-row gap-4">
        <Button href="/dashboard/modul/${tpId}/new" variant="default" class="shadow-lg w-fit gap-3">
            <CirclePlus class="w-4"/>
            Tambah
        </Button>
        <Button href="/dashboard/modul/${tpId}/aiGenerate" variant="default" class="shadow-lg w-fit gap-3">
            <BotMessageSquare class="w-4"/>
            Tambah dengan Ai
        </Button>
    </div>

    <hr />

    <h2 class="font-bold text-1xl">Modul: </h2>

    {#each data.modulData as modul (modul.id)}
        {#if modul.tpId === tpId}
            <Modal
                title="Apakah anda yakin?"
                description="Tindakan ini tidak dapat dibatalkan"
                {isOpen}
                onClose={() => (isOpen = false)}
                >
                <div class="flex w-full items-center justify-end space-x-2 pt-6">
                <Button disabled={loading} variant="outline" on:click={() => (isOpen = false)}>Batal</Button>
                <form action="?/delete&id={modul.id}" method="post" use:enhance={addTodo}>
                    <Button disabled={loading} variant="destructive" type="submit">
                    {#if loading}
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {/if}
                    Lanjut
                    </Button>
                </form>
                </div>
            </Modal>

            <div class="bg-neutral-50 p-2 rounded-md shadow-sm hover:shadow-md">
                <div class="flex flex-row justify-between w-full items-center">
                    <p class="">{modul.modul}</p>

                    <div class="flex flex-row gap-4">
                        <Button class="shadow-lg w-fit gap-3" href={`/dashboard/modul/${tpId}/${modul.id}`}>
                            <Pencil class="w-4"/>
                            Edit
                        </Button>

                        <Button class="w-fit gap-3 shadow-lg" on:click={() => (isOpen = true)}>
                            <Trash class="w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>
            </div>
        {/if}
    {/each}

</div>