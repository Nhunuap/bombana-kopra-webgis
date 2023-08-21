import { factory } from '$db/collection/factory';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  const doc = await factory.findOne(
    {
      'owner.name': params.name
    },
    {
      projection: {
        _id: { $toString: '$_id' },
        owner: 1,
        production: {
          $elemMatch: { year: parseInt(params.year) }
        }
      }
    }
  );

  return json(doc);
}
