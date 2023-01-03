import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { statusCode } from '../constants';
import { SignInDTO, UserCreateDTO } from '../DTO/authDTO';
const prisma = new PrismaClient();

const findUserBySocialId = async (socialId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      social_id: socialId,
    },
  });
  if (!user) {
    return null;
  }
  return user;
};

const updateFcm = async (userId: number, fcmToken: string) => {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: { fcm_token: fcmToken },
  });
  return user;
};

const createUser = async (userCreateDTO: UserCreateDTO) => {
  const user = await prisma.user.create({
    data: {
      name: userCreateDTO.name,
      email: userCreateDTO.email,
      social_type: userCreateDTO.socialType,
      fcm_token: userCreateDTO.fcmToken,
      social_id: userCreateDTO.socialId,
    },
  });

  return user;
};

export default {
  createUser,
  findUserBySocialId,
  updateFcm,
};
