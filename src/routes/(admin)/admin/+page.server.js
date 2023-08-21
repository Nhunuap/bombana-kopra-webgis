import { district } from '$db/collection/district';
import { factory } from '$db/collection/factory';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ parent }) {
  const { factories } = await parent();
  const districts = district.find({}).project({ _id: 0, name: 1 }).toArray();

  return {
    title: 'Data Pabrik',
    factories: factories,
    districts: districts
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  create: async ({ request }) => {
    const formData = await request.formData();

    const owner = formData.get('owner');
    if (!owner) {
      return fail(400, { name: owner, ownerIsMissing: true, insertFailed: true });
    }

    let doc = {
      owner: { name: owner, contact: {} },
      coordinate: {},
      location: {},
      type: {},
      price: []
    };

    const lat = formData.get('latitude');
    const long = formData.get('longitude');
    if (lat && long) {
      doc.coordinate = {
        lat: parseFloat(lat),
        long: parseFloat(long)
      };
    }

    const district = formData.get('district');
    const subdistrict = formData.get('subdistrict');
    const street = formData.get('street');
    if (district && subdistrict && street) {
      doc.location = {
        district,
        subdistrict,
        street
      };
    }

    const email = formData.get('email');
    if (email) {
      doc.owner.contact['email'] = email;
    }

    const telp = formData.get('telp');
    if (telp) {
      doc.owner.contact['telp'] = telp;
    }

    const white = formData.get('white');
    const black = formData.get('black');
    doc.type = {
      white: white === 'on',
      black: black === 'on'
    };

    const prices = formData.get('prices');
    if (prices) {
      prices.split(' ').forEach((e) => {
        const price = parseInt(e);
        if (price) {
          doc.price.push(price);
        }
      });
    }

    try {
      await factory.insertOne(doc);
    } catch (err) {
      return fail(400, { insertFailed: true });
    }

    return { insertSuccess: true };
  },
  update: async ({ request }) => {
    const formData = await request.formData();

    const owner = formData.get('owner');
    if (!owner) {
      return fail(400, { name: owner, ownerIsMissing: true, insertFailed: true });
    }

    let updateDoc = { 'owner.name': owner };

    const lat = formData.get('latitude');
    const long = formData.get('longitude');
    if (lat && long) {
      updateDoc['coordinate.lat'] = parseFloat(lat);
      updateDoc['coordinate.long'] = parseFloat(long);
    }

    const district = formData.get('district');
    const subdistrict = formData.get('subdistrict');
    const street = formData.get('street');
    if (district && subdistrict && street) {
      updateDoc['location.district'] = district;
      updateDoc['location.subdistrict'] = subdistrict;
      updateDoc['location.street'] = street;
    }

    const email = formData.get('email');
    if (email) {
      updateDoc['owner.contact.email'] = email;
    }

    const telp = formData.get('telp');
    if (telp) {
      updateDoc['owner.contact.telp'] = telp;
    }

    const white = formData.get('white');
    const black = formData.get('black');
    updateDoc['type.white'] = white === 'on';
    updateDoc['type.black'] = black === 'on';

    const prices = formData.get('prices');
    if (prices) {
      let price = [];
      prices.split(' ').forEach((e) => {
        const p = parseInt(e);
        if (p) {
          price.push(p);
        }
      });
      updateDoc['price'] = price;
    }

    try {
      const res = await factory.updateOne({ 'owner.name': owner }, { $set: updateDoc });
      if (res.modifiedCount === 0) {
        return fail(400, { updateFailed: true });
      }
    } catch (err) {
      return fail(400, { updateFailed: true });
    }

    return { updateSuccess: true };
  },
  delete: async ({ request }) => {
    const formData = await request.formData();

    try {
      const result = await factory.deleteOne({ 'owner.name': formData.get('name') });
      if (result.deletedCount !== 1) {
        return fail(400, { deleteFailed: true });
      }
    } catch (e) {
      return fail(400, { deleteFailed: true });
    }

    return { deleteSuccess: true };
  },
  logout: async ({ cookies }) => {
    cookies.delete('sessionId');
    throw redirect(303, '/auth/login');
  }
};
