import dayjs from 'dayjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import convertSnakeToCamel from '../modules/convertSnakeToCamel';

const getDailyMission = async (userId: number, date: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return null;
  }

  const actionDate = dayjs(date);

  const dailyMissions = await prisma.mission.findMany({
    where: {
      user_id: userId,
      action_date: actionDate.format(),
    },
    include: {
      action: true,
    },
  });

  console.log(dailyMissions);

  // const data = await Promise.all(
  //   timeTravelList.map(async (timeTravel) => {
  //     const result: GetTimeTravelDto = {
  //       timeTravelId: timeTravel._id,
  //       title: timeTravel.title,
  //       year: timeTravel.year,
  //       month: timeTravel.month,
  //       day: timeTravel.day,
  //       writtenDate: timeTravel.writtenDate,
  //       image: timeTravel.image,
  //     };

  //     return result;
  //   }),
  // );
};

export default {
  getDailyMission,
};
