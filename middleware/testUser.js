import { BadRequestError } from '../errors/index.js';

const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError(
      'Demo mode is read-only. Create an account to manage your own applications.'
    );
  }
  next();
};

export default testUser;
