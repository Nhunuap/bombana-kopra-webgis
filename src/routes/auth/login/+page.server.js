import { fail, redirect } from '@sveltejs/kit';
import { users } from '$lib/server/db/auth';

export async function load({ cookies }) {
  if (users[cookies.get('sessionId')]) {
    throw redirect(303, '/admin');
  }

  return {
    title: 'Log In Admin - Bombana Kopra WEBGIS'
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ cookies, request }) => {
    const formData = await request.formData();
    const username = formData.get('username');
    const password = formData.get('password');

    if (!username || !password) {
      return fail(400, { missingField: true });
    }

    if (!users[username]) {
      return fail(400, { invalidUsername: true });
    }

    if (password !== users[username]) {
      return fail(400, { invalidCredential: true });
    }

    cookies.set('sessionId', username, { path: '/' });
    throw redirect(303, '/admin');
  }
};
