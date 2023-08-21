<script>
  export let title = '';
</script>

<p
  class="flex items-center justify-between rounded-md bg-slate-500 py-2 px-4 font-semibold text-slate-300"
>
  {title}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="3"
    stroke="currentColor"
    class="inline h-4 w-4"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
  </svg>
</p>
<div class="pl-4">
  <slot />
</div>
