<script>
  import FlashMessage from '$lib/component/FlashMessage.svelte';

  /** @type {import('./$types').ActionData} */
  export let form;
</script>

<div class="flex h-screen w-full items-center justify-center bg-slate-200 text-slate-600">
  <form method="post" class="w-64">
    <FlashMessage showOn="{form?.missingField}" severity="{'ERROR'}">
      <p>Missing Field</p>
    </FlashMessage>
    <FlashMessage showOn="{form?.invalidUsername}" severity="{'ERROR'}">
      <p>Invalid User</p>
    </FlashMessage>
    <FlashMessage showOn="{form?.invalidCredential}" severity="{'ERROR'}">
      <p>Invalid Credential</p>
    </FlashMessage>
    <input
      name="username"
      type="text"
      placeholder="Username"
      class="focus:shadow-outline mb-2 block w-full rounded-md border-2 border-slate-300 bg-slate-300 p-2 focus:border-slate-400 focus:outline-none"
    />
    <input
      name="password"
      type="password"
      placeholder="Password"
      class="focus:shadow-outline block w-full rounded-md border-2 border-slate-300 bg-slate-300 p-2 focus:border-slate-400 focus:outline-none"
    />
    <div class="my-2 flex items-center justify-end">
      <button
        type="submit"
        class="rounded border border-slate-400 bg-slate-300 py-1 px-8 text-slate-800 hover:bg-slate-400 hover:text-slate-700"
      >
        Log in
      </button>
    </div>
  </form>
</div>
