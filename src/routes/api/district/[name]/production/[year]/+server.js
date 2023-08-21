import { district } from '$db/collection/district';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  const doc = await district.findOne(
    {
      name: params.name
    },
    {
      projection: {
        _id: { $toString: '$_id' },
        name: 1,
        production: {
          $elemMatch: { year: parseInt(params.year) }
        }
      }
    }
  );

  return json(doc);
}
