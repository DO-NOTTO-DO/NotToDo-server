import { PrismaClient } from '@prisma/client';
import getRandomBanner from '../modules/shuffleBanner';
import getKoreanTime from '../modules/koreanTimeConverter';
const prisma = new PrismaClient();

const getBanner = async (userId: number) => {
  const dailyMissions = await prisma.mission.findMany({
    where: {
      user_id: userId,
      action_date: await getKoreanTime(),
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
