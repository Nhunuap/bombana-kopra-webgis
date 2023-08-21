import { district } from '$db/collection/district';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  return {
    districts: await district
      .find({})
      .project({
        _id: { $toString: '$_id' },
        name: 1,
        coordinate: 1,
        production: 1
      })
      .toArray()
  };
}
