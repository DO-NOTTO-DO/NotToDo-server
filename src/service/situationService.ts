import { PrismaClient } from '@prisma/client';
import { SituationDTO, SituationResponseDTO } from '../DTO/situationDTO';
const prisma = new PrismaClient();

const returnCount = 9;

const getRecommendSituations = async (): Promise<SituationDTO[]> => {
  const data: SituationDTO[] = await prisma.recommend_situation.findMany({
    select: {
      name: true,
    },
    take: returnCount,
  });
  return data;
};

const getRecentSituations = async (userId: number): Promise<SituationDTO[]> => {
  let data = await prisma.mission.findMany({
    where: {
      user_id: userId,
    },
    select: {
      situation: {
        select: {
          name: true,
        },
      },
    },
    distinct: ['situation_id'],
    orderBy: {
      created_at: 'desc',
    },
    take: returnCount * 2,
  });

  data = data.filter((item) => item.situation);

  return await Promise.all(
    data.map(async (item) => {
      const responseData: SituationDTO = {
        name: item.situation?.name,
      };
      return responseData;
    }),
  );
};

const filterSituations = async (userId: number): Promise<SituationResponseDTO> => {
  const recommendSituations: SituationDTO[] = await getRecommendSituations();
  const recentSituations: SituationDTO[] = await getRecentSituations(userId);
  const recentFilteredSituations: SituationDTO[] = recentSituations.filter((item) => !recommendSituations.map((item) => item.name).includes(item.name));
  const data: SituationResponseDTO = {
    recommends: recommendSituations,
    recents: recentFilteredSituations.slice(0, returnCount),
  };
  return data;
};

const situationService = {
  getRecentSituations,
  getRecommendSituations,
  filterSituations,
};

export default situationService;
