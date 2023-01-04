import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const validateMissionId = async (inputMissionId: string): Promise<number> => {
  try {
    const missionId = Number(inputMissionId);
    await prisma.mission.findUniqueOrThrow({
      where: {
        id: missionId,
      },
    });
    return missionId;
  } catch (error) {
    return 400;
  }
};

const validateUsersMission = async (userId: number, missionId: number) => {
  try {
    await prisma.mission.findFirstOrThrow({
      where: {
        id: missionId,
        user_id: userId,
      },
    });
  } catch (error) {
    throw 4001;
  }
};

export default {
  validateMissionId,
  validateUsersMission,
}
