import { factory } from '$db/collection/factory';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  let factories = await factory
    .find({})
    .project({
      _id: { $toString: '$_id' },
      owner: 1,
      production: {
        $elemMatch: { year: parseInt(params.year) }
      }
    })
    .toArray();

  factories = factories.map((district) => {
    district.production = district?.production?.[0] ?? {};
    return district;
  });

  return json(factories);
}
