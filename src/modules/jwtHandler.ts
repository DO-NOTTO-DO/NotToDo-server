import jwt from 'jsonwebtoken';
import { tokenType } from '../constants';

const sign = (userId: number) => {
  const payload = {
    userId,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '24d' });
  return accessToken;
};

const verify = (token: string) => {
  let decoded: string | jwt.JwtPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error: any) {
    if (error.message === 'jwt expired') {
      return tokenType.TOKEN_EXPIRED;
    } else if (error.message === 'invalid token') {
      return tokenType.TOKEN_INVALID;
    } else {
      return tokenType.TOKEN_INVALID;
    }
  }

  return decoded;
};

export default {
  sign,
  verify,
};
