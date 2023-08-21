import { district } from '$db/collection/district';
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  const { districts } = await parent();

  return {
    title: 'Data Kecamatan',
    districts: districts
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name');
    if (!name) {
      return fail(400, { requiredIsMissing: true, field: 'name' });
    }

    let doc = { name: name };

    const lat = parseFloat(formData.get('latitude'));
    const long = parseFloat(formData.get('longitude'));

    if (!lat || !long) {
      return fail(400, { requiredIsMissing: true, filed: 'coordinate' });
    }

    doc['coordinate'] = { lat, long };

    try {
      const res = await district.insertOne(doc);
      if (!res.insertedId) {
        return fail(400, { insertFailed: true });
      }
    } catch (err) {
      return fail(400, { insertException: true });
    }

    return { insertSuccess: true };
  },
  update: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name');
    if (!name) {
      return fail(400, { requiredIsMissing: true, field: 'name' });
    }

    let doc = { name: name };

    const lat = parseFloat(formData.get('latitude'));
    const long = parseFloat(formData.get('longitude'));

    if (!lat || !long) {
      return fail(400, { requiredIsMissing: true, filed: 'coordinate' });
    }

    doc['coordinate.lat'] = lat;
    doc['coordinate.long'] = long;

    try {
      const res = await district.updateOne({ name: name }, { $set: doc });
      if (res.modifiedCount === 0) {
        return fail(400, { updateFailed: true });
      }
    } catch (err) {
      return fail(400, { updateException: true });
    }

    return { updateSuccess: true };
  },
  delete: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name');

    try {
      const res = await district.deleteOne({ name: name });
      if (res.deletedCount !== 1) {
        return fail(400, { deleteFailed: true });
      }
    } catch (err) {
      return fail(400, { deleteFailed: true });
    }

    return { deleteSuccess: true };
  }
};
