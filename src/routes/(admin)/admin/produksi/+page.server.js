import { factory } from '$db/collection/factory';
import { productionYear } from '$db/collection/productionYear';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  let { factories } = await parent();

  factories = factories.map((factory) => {
    factory.production = factory.production.find((p) => p.year === 2020);
    return factory;
  });

  return {
    title: 'Data Produksi Pabrik',
    productionYear: await productionYear
      .find({})
      .project({ _id: { $toString: '$_id' }, year: 1 })
      .sort({ year: 1 })
      .toArray(),
    factories: factories
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  update: async ({ request }) => {
    const formData = await request.formData();
    const production = parseInt(formData.get('production'));
    const year = parseInt(formData.get('year'));
    const owner = formData.get('owner');
    const query = { 'owner.name': owner, 'production.year': year };
    const updateDoc = { 'production.$.result': production };

    try {
      let res = await factory.updateOne(query, { $set: updateDoc });
      if (res.modifiedCount === 0) {
        res = await factory.updateOne(
          { 'owner.name': owner },
          {
            $push: {
              production: {
                year: year,
                result: production
              }
            }
          }
        );

        if (res.modifiedCount === 0) {
          return fail(400, { updateFailed: true, reason: 'No Matched Query' });
        }

        console.log(res);
      }
    } catch (err) {
      console.log(err);
      return fail(400, { updateFailed: true, reason: 'Exception' });
    }

    return { updateSuccess: true };
  }
};
