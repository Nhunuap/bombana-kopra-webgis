import { district } from '$db/collection/district';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  let districts = await district
    .find({})
    .project({
      _id: { $toString: '$_id' },
      name: 1,
      production: {
        $elemMatch: { year: parseInt(params.year) }
      }
    })
    .toArray();

  districts = districts.map((district) => {
    district.production = district?.production?.[0] ?? {};
    return district;
  });

  return json(districts);
}
