import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const validateUsersMission = async (userId: number, missionId: number) => {
  try {
    const mission = await prisma.mission.findFirstOrThrow({
      where: {
        id: missionId,
        user_id: userId,
      },
    });
  } catch (error) {
    throw 4001;
  }
};
