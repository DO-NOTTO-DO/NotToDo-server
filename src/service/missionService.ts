import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import convertSnakeToCamel from '../modules/convertSnakeToCamel';
import moment from 'moment';

const getMissionCount = async (userId: number, startDate: Date, lastDate: Date) => {
  const count = await prisma.mission.groupBy({
    by: ['action_date'],
    where: {
      user_id: userId,
      action_date: {
        gt: startDate,
        lte: lastDate,
      },
    },
    _count: {
      action_date: true,
    },
    orderBy: {
      action_date: 'asc',
    },
  });

  const data = await Promise.all(
    count.map(async (x) => {
      let date = moment(x.action_date).format('YYYY-MM-DD');
      date = date.split('-').join('.');
      const result = {
        actionDate: date,
        count: x._count.action_date,
      };
      return result;
    }),
  );

  return convertSnakeToCamel.keysToCamel(data);
};

export default {
  getMissionCount,
};
