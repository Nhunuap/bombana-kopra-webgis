<script>
  import { page } from '$app/stores';
  import { Anchor, Button, Text } from '@svelteuidev/core';

  /** @type {string} */
  export let link;

  /** @type {string} */
  export let content;

  $: current = $page.url.href.endsWith(link) ? 'bg-slate-600 shadow-xl' : 'bg-slate-500';
</script>

<Anchor underline="{false}" href="{link}">
  <Button
    fullSize
    class="flex justify-start text-slate-200 {current} mb-2.5 rounded-lg py-6 hover:bg-slate-700 hover:shadow-xl active:bg-slate-600"
  >
    <slot slot="leftIcon" />
    <Text align="center" class="text-xl text-slate-200">
      {content}
    </Text>
  </Button>
</Anchor>
