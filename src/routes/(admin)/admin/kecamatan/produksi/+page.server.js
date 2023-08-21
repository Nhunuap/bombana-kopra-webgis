import { district } from '$db/collection/district';
import { productionYear } from '$db/collection/productionYear';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  let { districts } = await parent();

  districts = districts.map((district) => {
    district.production = district.production.find((p) => p.year === 2020);
    return district;
  });

  return {
    title: 'Data Produksi Kecamatan',
    districts,
    productionYear: await productionYear
      .find({})
      .project({
        _id: { $toString: '$_id' },
        year: 1
      })
      .sort({ year: 1 })
      .toArray()
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  update: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name');
    const year = parseInt(formData.get('year'));
    const landArea = parseFloat(formData.get('area'));
    const productionCapacity = parseFloat(formData.get('cap'));
    const coconutProduction = parseFloat(formData.get('coconut'));

    if (!name || !year || !landArea || !productionCapacity || !coconutProduction) {
      return fail(400, { updateFailed: true, reason: 'Invalid data' });
    }

    const query = { name: name, 'production.year': year };
    const updateDoc = {
      'production.$.land_area': landArea,
      'production.$.production_cap': productionCapacity,
      'production.$.coconut': coconutProduction
    };

    try {
      let res = await district.updateOne(query, { $set: updateDoc });

      if (res.modifiedCount === 0) {
        res = await district.updateOne(
          { name: name },
          {
            $push: {
              production: {
                year: year,
                land_area: landArea,
                coconut: coconutProduction,
                production_cap: productionCapacity
              }
            }
          }
        );
      }

      if (res.modifiedCount === 0) {
        return fail(400, { updateFailed: true, reason: 'No Matched Query' });
      }
    } catch (err) {
      return fail(400, { updateExceptopn: true });
    }

    return { updateSuccess: true };
  }
};
