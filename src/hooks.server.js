import { connect } from '$db/mongo';

connect()
  .then(() => console.log('Connected to Mongo Atlas'))
  .catch((e) => console.error(e));
