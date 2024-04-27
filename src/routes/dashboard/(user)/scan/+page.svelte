<script lang="ts">
    //@ts-nocheck
    import type { PageData } from './$types';
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input'
    import * as Form from '$lib/components/ui/form';
    import SuperDebug, { superForm } from 'sveltekit-superforms';
    import { toast } from 'svelte-sonner';
    import { goto } from '$app/navigation';
    import { formSchema } from './schema';
    import { zodClient } from 'sveltekit-superforms/adapters';
    import FormField from '$lib/components/ui/form/form-field.svelte';
    import { FormInput } from 'lucide-svelte';
    import { CldUploadButton, CldUploadWidget, CldImage, getCldImageUrl } from 'svelte-cloudinary';

    import Label from '$lib/components/ui/label/label.svelte';


    
    export let data: PageData;

    let info:string;
    let error:string;
    let secure_url:string;
    let ans:string;
    let questions:string;
    let choices:string;
    let myIndex:any = [];
    let grading:any = [];
    let score:any= null;
    let pydata:any;

    // const open = (widget: any) => {
    //     widget.open()
    // }

    const onUpload = (result:any, widget:any) => {
        // onChange(result.info.secure_url);
        if (result.event == "success") {
            info = result.info;
            secure_url = result.info.secure_url
            toast.success('Upload image ke CLOUD berhasil!');
            $formData.link = result.info.secure_url
        } else if (result.event === "error") {
            error = result.error.status
        }
        widget.close()
    };

    const uploadPresetKey = "zgdpwmae"

    const form = superForm(data.form, {
    validators: zodClient(formSchema),

    async onUpdate({ form }) {
      if (form.valid) {
        toast.success('Upload link gambar ke DATABASE berhasil!');
      }
    },

    onError(event) {
        toast.error(event.result.error.message);
        toast.error("Anda belum mengupload gambar");
    }
    });

    function processValues(myIndexArr: number[], gradingArr: number[]): { myIndex: string, grading: string } {
    const indexMapping = ['A', 'B', 'C', 'D', 'E'];
    const gradingMapping = ['Salah', 'Benar'];

    const myIndexResult = myIndexArr.map(index => indexMapping[index]).join(', ');
    const gradingResult = gradingArr.map(value => gradingMapping[value]).join(', ');

    return { myIndex: myIndexResult, grading: gradingResult };
    }


    async function fetchData() {
        try {
            const response = await fetch(`http://localhost:8000/ocr?q=${secure_url}&ans=${ans}&questions=${questions}&choices=${choices}`, {
                method: 'GET',
            });
            if (response.ok) {
                const pydata = await response.json();
                console.log(pydata);

                const parsedData = JSON.parse(pydata);
                myIndex = parsedData.myIndex;
                grading = parsedData.grading;
                score = parsedData.score;

                const { myIndex: processedMyIndex, grading: processedGrading } = processValues(myIndex, grading);
                myIndex = processedMyIndex;
                grading = processedGrading;

                console.log(myIndex)
                console.log(grading)
                console.log(score)
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // onMount(() => {
    // // Fetch and process data when the component mounts
    // fetchData();
    // });

    const { form: formData, enhance, submitting } = form;
</script>

<div>
    <div>
        {#if info}
        <CldImage
            width=450
            height=600
            src={secure_url}
            sizes="100vw"
            alt="Image uploaded"/>
        {/if}
    </div>

    <div class="mt-3">
        <CldUploadWidget uploadPreset={uploadPresetKey} {onUpload} let:open>
            <Button on:click={open}>    
                Upload Test
            </Button>
        </CldUploadWidget>

        <!-- <Widget /> -->


        {#if error}
            <p>{error}</p>
        {/if}

        {#if info}
        <Button
            href={secure_url}
            target='_blank'>
            Lihat Gambar
        </Button>
        {/if}
    </div>

    <div class="mt-10">
        <h1>Panel Kontrol</h1>
        <!-- <SuperDebug data={$formData} /> -->
        <br />
        <form method="POST" use:enhance>
            <Form.Field {form} name="link">
                <Form.Control let:attrs>
                    <Form.Label>Upload link gambar ke Database: </Form.Label>
                    <Input disabled {...attrs} bind:value={$formData.link} />
                    <input hidden name={attrs.name} value={$formData.link}/>
                </Form.Control>
            </Form.Field>
    
            {#if !info}
            <Form.Button disabled class="mt-4">
                Upload ke Database
            </Form.Button>
            {/if}

            {#if info}
            <Form.Button class="mt-4">
                Upload ke Database
            </Form.Button>
            {/if}
        </form>
        
        <div class="mt-10">
            <h1>Konfigurasi AI</h1>
            <form class="mt-5" on:submit|preventDefault>
                <input type="hidden" name="q" value={secure_url} />
                <Input class="mt-2" name=ans bind:value={ans} placeholder="Masukkkan kunci jawaban dengan format: A B C B D"/>
                <Input class="mt-2" name=questions bind:value={questions} placeholder="Masukkan jumlah soal dengan angka. Contoh: 5"/>
                <Input class="mt-2" name=choices bind:value={choices} placeholder="Masukkan jumlah pilihan dengan angka. Contoh: 5"/>
                <Button class="mt-5" type="submit" on:click={fetchData}>Scan dengan AI</Button>
            </form>
        </div>

    </div>

    <section>
        <div class="mt-10">
            <h1>Hasil Scan AI:</h1>
            <form class="mt-5">
                <Form.Field {form} name='id'>
                    <Form.Control let:attrs>
                        <Form.Label class="mt-2">Index jawaban terpilih oleh siswa: </Form.Label>
                        <Input disabled class="mt-2" {...attrs} value={myIndex} />

                        <Form.Label class="mt-2">Benar atau Salah per soal: </Form.Label>
                        <Input disabled class="mt-2" {...attrs} value={grading} />

                        <Form.Label class="mt-2">Skor akhir: </Form.Label>
                        <Input disabled class="mt-2" {...attrs} value={score} />
                    </Form.Control>
                </Form.Field>
            </form>
            <br />
            <p class="italic font-sans text-sm">*Mohon untuk selalu mengecek ulang jika ada hasil yang dianggap salah</p>
        </div>
    </section>
    
</div>

