<script>
  import { page } from '$app/stores';

  import { AppShell, ShellSection, Navbar } from '@svelteuidev/core';

  import AdminSideNav from '$lib/component/navigation/AdminSideNav.svelte';
</script>

<svelte:head>
  <title>{$page.data?.title ?? ''} | Admin - Bombana Kopra WEBGIS</title>
</svelte:head>

<AppShell fixed class="bg-gray-300">
  <Navbar
    slot="navbar"
    fixed
    position="{{ top: 0, left: 0 }}"
    hiddenBreakpoint="sm"
    width="{{ base: '100%', sm: 300 }}"
    override="{{ p: '$xlPX' }}"
    class="bg-slate-400"
  >
    <ShellSection grow>
      <AdminSideNav />
    </ShellSection>
  </Navbar>
  <slot />
</AppShell>
