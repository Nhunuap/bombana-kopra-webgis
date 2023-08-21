import { district } from '$db/collection/district';
import { districtPolygon } from '$db/collection/districtPolygon';
import { factory } from '$db/collection/factory';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  return {
    kecamatan: await kecamatan.find({}).toArray()
  };
}
