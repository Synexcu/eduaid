<script lang="ts">
  import {
    Book,
    BookOpen,
    ClipboardPlus,
    DoorClosed,
    FileQuestion,
    GraduationCap,
    NotebookTabs,
    Percent,
    ScanEye,
    Users
  } from 'lucide-svelte';
  import { page } from '$app/stores';

  export let role: number;
  export let status: number;
</script>

<div
  class="sticky left-0 top-0 z-10 hidden h-screen w-72 flex-col border-r-2 bg-primary/15 shadow-xl md:flex"
>

  <!-- Logo -->
  <div class=" flex w-full items-center gap-2 border-b-2 px-4 py-6">
    <div class="flex items-center justify-center gap-2">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-auto"
      >
        <circle cx="48.4" cy="48.4" r="48.4" fill="#0084B8" />
        <path
          d="M103.2 48.4C103.2 21.6694 124.869 0 151.6 0V0C178.331 0 200 21.6694 200 48.4V48.4C200 75.1306 178.331 96.8 151.6 96.8H103.2V48.4Z"
          fill="#0084B8"
        />
        <path
          d="M0 151.6C0 124.869 21.6694 103.2 48.4 103.2H96.8V151.6C96.8 178.331 75.1306 200 48.4 200V200C21.6694 200 0 178.331 0 151.6V151.6Z"
          fill="#0084B8"
        />
        <circle cx="151.6" cy="151.6" r="48.4" fill="#0084B8" />
        <path
          d="M48.16 76C41.0667 76 35.9734 74.5067 32.88 71.52C29.7867 68.5333 28.24 64.2133 28.24 58.56V37.44C28.24 31.7867 29.7867 27.4667 32.88 24.48C35.9734 21.4933 41.0667 20 48.16 20H66.8801V28.8H48.16C45.2267 28.8 43.04 29.4933 41.6 30.88C40.2134 32.2667 39.52 34.4533 39.52 37.44V43.6H63.3601V52.4H39.52V58.56C39.52 61.4933 40.2134 63.68 41.6 65.12C43.04 66.5067 45.2267 67.2 48.16 67.2H67.0401V76H48.16Z"
          fill="white"
        />
        <path
          d="M131.8 20H152.6C158.893 20 163.853 20.9067 167.48 22.72C171.16 24.5333 173.8 27.4667 175.4 31.52C177.053 35.52 177.88 41.0133 177.88 48C177.88 54.9867 177.053 60.5067 175.4 64.56C173.8 68.56 171.16 71.4667 167.48 73.28C163.853 75.0933 158.893 76 152.6 76H131.8V20ZM152.6 67.2C156.12 67.2 158.893 66.5867 160.92 65.36C162.947 64.1333 164.387 62.1333 165.24 59.36C166.147 56.5867 166.6 52.8 166.6 48C166.6 43.2 166.147 39.4133 165.24 36.64C164.387 33.8667 162.947 31.8667 160.92 30.64C158.893 29.4133 156.12 28.8 152.6 28.8H143.08V67.2H152.6Z"
          fill="white"
        />
        <path
          d="M46.96 185.04C39.6534 185.04 34.1334 183.493 30.4 180.4C26.6667 177.253 24.8 172.907 24.8 167.36V128H36.08V167.36C36.08 173.28 39.7067 176.24 46.96 176.24C54.2134 176.24 57.84 173.28 57.84 167.36V128H69.12V167.36C69.12 172.907 67.2534 177.253 63.5201 180.4C59.7867 183.493 54.2667 185.04 46.96 185.04Z"
          fill="white"
        />
        <path
          d="M162.56 164.96H140.64L136.88 178H125.6L139.28 133.36C140.24 130.16 141.253 127.68 142.32 125.92C143.387 124.16 144.64 122.907 146.08 122.16C147.573 121.413 149.413 121.04 151.6 121.04C153.787 121.04 155.6 121.413 157.04 122.16C158.48 122.907 159.733 124.16 160.8 125.92C161.92 127.68 162.96 130.16 163.92 133.36L177.6 178H166.32L162.56 164.96ZM160.08 156.56L153.36 133.52C152.987 132.133 152.4 131.44 151.6 131.44C150.8 131.44 150.213 132.133 149.84 133.52L143.12 156.56H160.08Z"
          fill="white"
        />
      </svg>
      <svg
        width="719"
        height="134"
        viewBox="0 0 719 134"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-auto"
      >
        <path
          d="M45.816 131.308C29.5013 131.308 17.7867 127.873 10.672 121.004C3.55733 114.135 0 104.199 0 91.196V42.62C0 29.6173 3.55733 19.6813 10.672 12.812C17.7867 5.94265 29.5013 2.50798 45.816 2.50798H88.872V22.748H45.816C39.0693 22.748 34.04 24.3427 30.728 27.532C27.5387 30.7213 25.944 35.7507 25.944 42.62V56.788H80.776V77.028H25.944V91.196C25.944 97.9427 27.5387 102.972 30.728 106.284C34.04 109.473 39.0693 111.068 45.816 111.068H89.24V131.308H45.816Z"
          fill="#0084B8"
        />
        <path
          d="M111.365 2.50798H159.205C173.679 2.50798 185.087 4.59332 193.429 8.76399C201.893 12.9347 207.965 19.6813 211.645 29.004C215.447 38.204 217.349 50.8387 217.349 66.908C217.349 82.9773 215.447 95.6733 211.645 104.996C207.965 114.196 201.893 120.881 193.429 125.052C185.087 129.223 173.679 131.308 159.205 131.308H111.365V2.50798ZM159.205 111.068C167.301 111.068 173.679 109.657 178.341 106.836C183.002 104.015 186.314 99.4147 188.277 93.036C190.362 86.6573 191.405 77.948 191.405 66.908C191.405 55.868 190.362 47.1587 188.277 40.78C186.314 34.4013 183.002 29.8013 178.341 26.98C173.679 24.1587 167.301 22.748 159.205 22.748H137.309V111.068H159.205Z"
          fill="#0084B8"
        />
        <path
          d="M288.545 133.7C271.74 133.7 259.044 130.143 250.457 123.028C241.87 115.791 237.577 105.793 237.577 93.036V2.50798H263.521V93.036C263.521 106.652 271.862 113.46 288.545 113.46C305.228 113.46 313.569 106.652 313.569 93.036V2.50798H339.513V93.036C339.513 105.793 335.22 115.791 326.633 123.028C318.046 130.143 305.35 133.7 288.545 133.7Z"
          fill="#0084B8"
        />
        <path d="M358.801 77.028H410.137V92.668H358.801V77.028Z" fill="#0084B8" />
        <path
          d="M501.561 101.316H451.145L442.497 131.308H416.553L448.017 28.636C450.225 21.276 452.556 15.572 455.009 11.524C457.462 7.47599 460.345 4.59332 463.657 2.87599C467.092 1.15865 471.324 0.299988 476.353 0.299988C481.382 0.299988 485.553 1.15865 488.865 2.87599C492.177 4.59332 495.06 7.47599 497.513 11.524C500.089 15.572 502.481 21.276 504.689 28.636L536.153 131.308H510.209L501.561 101.316ZM495.857 81.996L480.401 29.004C479.542 25.8147 478.193 24.22 476.353 24.22C474.513 24.22 473.164 25.8147 472.305 29.004L456.849 81.996H495.857Z"
          fill="#87CEEB"
        />
        <path d="M555.552 2.50798H581.496V131.308H555.552V2.50798Z" fill="#87CEEB" />
        <path
          d="M612.693 2.50798H660.533C675.007 2.50798 686.415 4.59332 694.757 8.76399C703.221 12.9347 709.293 19.6813 712.973 29.004C716.775 38.204 718.677 50.8387 718.677 66.908C718.677 82.9773 716.775 95.6733 712.973 104.996C709.293 114.196 703.221 120.881 694.757 125.052C686.415 129.223 675.007 131.308 660.533 131.308H612.693V2.50798ZM660.533 111.068C668.629 111.068 675.007 109.657 679.669 106.836C684.33 104.015 687.642 99.4147 689.605 93.036C691.69 86.6573 692.733 77.948 692.733 66.908C692.733 55.868 691.69 47.1587 689.605 40.78C687.642 34.4013 684.33 29.8013 679.669 26.98C675.007 24.1587 668.629 22.748 660.533 22.748H638.637V111.068H660.533Z"
          fill="#87CEEB"
        />
      </svg>
    </div>
  </div>

  {#if status === 2}
    <div class="flex flex-col gap-8 p-4">

      <!-- Admin -->
      {#if role === 2}
        <div class="flex flex-col gap-2">
          <div class="text-xs font-medium uppercase tracking-wider text-gray-500">admin</div>
          <div class="flex flex-col gap-2">

            <!-- Class -->
            <a
              href="/dashboard/admin/class"
              class:active={$page.url.pathname === '/dashboard/admin/class'}
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all duration-200 hover:text-foreground"
            >
              <DoorClosed size="20" />
              Kelas
            </a>

            <!-- Guru -->
            <a
              href="/dashboard/admin/teacher"
              class:active={$page.url.pathname === '/dashboard/admin/teacher'}
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all duration-200 hover:text-foreground"
            >
              <Users size="20" />
              <div class="flex items-center">Guru</div>
            </a>

            <!-- Siswa -->
            <a
              href="/dashboard/admin/student"
              class:active={$page.url.pathname === '/dashboard/admin/student'}
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all duration-200 hover:text-foreground"
            >
              <GraduationCap size="20" />
              <div class="flex items-center">Siswa</div>
            </a>

            <!-- Pelajaran -->
            <a
              href="/dashboard/admin/subject"
              class:active={$page.url.pathname === '/dashboard/admin/subject'}
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all duration-200 hover:text-foreground"
            >
              <Book size="20" />
              <div class="flex items-center">Pelajaran</div>
            </a>

            <!-- Capaian Pembelajaran -->
            <a
              href="/dashboard/admin/capaianPembelajaran"
              class:active={$page.url.pathname === '/dashboard/admin/capaianPembelajaran'}
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all duration-200 hover:text-foreground"
            >
              <BookOpen size="20" />
              <div class="flex items-center">Capaian Pembelajaran</div>
            </a>

            <!-- Tujuan Pembelajaran -->
            <a
              href="/dashboard/admin/tujuanPembelajaran"
              class:active={$page.url.pathname === '/dashboard/admin/tujuanPembelajaran'}
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all duration-200 hover:text-foreground"
            >
              <NotebookTabs size="20" />
              <div class="flex items-center">Tujuan Pembelajaran</div>
            </a>
          </div>
        </div>
      {/if}

      <!-- User/Teacher -->
      <div class="flex flex-col gap-2">
        <div class="text-xs font-medium uppercase tracking-wider text-gray-500">user</div>
        <div class="flex flex-col gap-2">
          <a
            href="/dashboard/score"
            class:active={$page.url.pathname === '/dashboard/score'}
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all duration-200 hover:text-foreground"
          >
            <Percent size="20" />
            <div class="flex items-center">Nilai Siswa</div>
          </a>
          <a
            href="/dashboard/scan"
            class:active={$page.url.pathname === '/dashboard/scan'}
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all duration-200 hover:text-foreground"
          >
            <ScanEye size="20" />
            <div class="flex items-center">Scan</div>
          </a>
          <a
            href="/dashboard/tujuanPembelajaran"
            class:active={$page.url.pathname === '/dashboard/tujuanPembelajaran'}
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all duration-200 hover:text-foreground"
          >
            <NotebookTabs size="20" />
            <div class="flex items-center">Tujuan Pembelajaran</div>
          </a>
          <a
            href="/dashboard/modul"
            class:active={$page.url.pathname === '/dashboard/modul'}
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all duration-200 hover:text-foreground"
          >
            <ClipboardPlus size="20" />
            <div class="flex items-center">Modul Pembelajaran</div>
          </a>
          <a
            href="/dashboard/soal"
            class:active={$page.url.pathname === '/dashboard/soal'}
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all duration-200 hover:text-foreground"
          >
            <FileQuestion size="20" />
            <div class="flex items-center">Pembuatan Soal</div>
          </a>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .active {
    background-color: hsl(210 34% 63% / 0.2);
    color: rgb(47 53 65);
  }
</style>
