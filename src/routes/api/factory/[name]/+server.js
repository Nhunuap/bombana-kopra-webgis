import { factory } from '$db/collection/factory';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  const data = await factory.findOne(
    {
      'owner.name': params.name
    },
    {
      projection: {
        _id: { $toString: '$_id' },
        owner: 1,
        coordinate: 1,
        location: 1,
        type: 1,
        price: 1
      }
    }
  );

  return json(data);
}
