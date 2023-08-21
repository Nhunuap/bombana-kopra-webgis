<script>
  import { Box, Text, Stack } from '@svelteuidev/core';
</script>

<Stack>
  <Box css="{{ padding: '$mdPX', userSelect: 'none' }}">
    <Text align="center" class="mx-1.5 text-3xl text-zinc-900">BOMBANA KOPRA WEBGIS</Text>
  </Box>
  <slot />
</Stack>
