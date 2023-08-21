import { factory } from '$db/collection/factory';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }) {
  if (!cookies.get('sessionId')) {
    throw redirect(303, '/auth/login');
  }

  return {
    factories: await factory
      .find({})
      .project({
        _id: { $toString: '$_id' },
        coordinate: 1,
        location: 1,
        owner: 1,
        type: 1,
        price: 1,
        photos: 1,
        production: 1
      })
      .toArray()
  };
}
