<script>
  import { AppShell, ShellSection, Navbar } from '@svelteuidev/core';

  import UserSideNav from '$lib/component/navigation/UserSideNav.svelte';
</script>

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
      <UserSideNav />
    </ShellSection>
  </Navbar>
  <slot />
</AppShell>
