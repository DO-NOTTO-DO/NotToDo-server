import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const validateMissionId = async (inputMissionId: string) => {
  try {
    const missionId = Number(inputMissionId);
    if (isNaN(missionId)) {
      throw 400;
    }
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

const validateCompletionStatus = async (completionStatus: string) => {
  try {
    if (completionStatus !== 'FINISH' && completionStatus !== 'AMBIGUOUS' && completionStatus !== 'NOTYET') {
      throw 4002;
    }
  } catch (error) {
    throw 4002;
  }
}

export default {
  validateMissionId,
  validateUsersMission,
  validateCompletionStatus,
}
