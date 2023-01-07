import { PrismaClient } from '@prisma/client';
import getRandomBanner from '../modules/shuffleBanner';
const prisma = new PrismaClient();

const getBanner = async (userId: number, today: string) => {
  const date: Date = new Date(today);
  const dailyMissions = await prisma.mission.findMany({
    where: {
      user_id: userId,
      action_date: date,
    },
    select: {
      completion_status: true,
    },
  });

  const notYetCount = dailyMissions.filter((x) => x.completion_status?.includes('NOTYET')).length;
  if (notYetCount > 0 || dailyMissions.length === 0) {
    return getRandomBanner('NOTYET');
  }
  return getRandomBanner('FINISH');
};

export default {
  getBanner,
};
