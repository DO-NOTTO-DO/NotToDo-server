import { PrismaClient } from '@prisma/client';
import { UserCreateDTO } from '../DTO/authDTO';
const prisma = new PrismaClient();
import convertSnakeToCamel from '../modules/convertSnakeToCamel';

const createUser = async (userCreateDTO: UserCreateDTO) => {
  const user = await prisma.user.upsert({
    where: {
      social_id: userCreateDTO.socialId,
    },
    update: {},
    create: {
      name: userCreateDTO.name,
      email: userCreateDTO.email,
      social_type: userCreateDTO.socialType,
      social_id: userCreateDTO.socialId,
    },
  });
  return convertSnakeToCamel.keysToCamel(user);
};

const createFCM = async (userId: number, fcmToken: string) => {
  const result = await prisma.fcm_token.upsert({
    where: {
      token: fcmToken,
    },
    update: {},
    create: {
      user_id: userId,
      token: fcmToken,
    },
  });
  return convertSnakeToCamel.keysToCamel(result);
};

export default {
  createUser,
  createFCM,
};
