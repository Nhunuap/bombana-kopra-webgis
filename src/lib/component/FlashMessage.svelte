<script>
  /** @type {boolean|undefined} */
  export let showOn;

  /** @type {'OK'|'INFO'|'WARN'|'ERROR'} */
  export let severity = 'INFO';

  const severityStyle = {
    OK: 'border-green-300 bg-green-200 text-green-500',
    INFO: 'border-sky-300 bg-sky-200 text-sky-500',
    WARN: 'border-yellow-300 bg-yellow-200 text-yellow-500',
    ERROR: 'border-rose-300 bg-rose-200 text-rose-500'
  };
</script>

{#if showOn}
  <div class="mb-2 rounded-md border py-2 px-4 {severityStyle[severity]}">
    <slot />
  </div>
{/if}
