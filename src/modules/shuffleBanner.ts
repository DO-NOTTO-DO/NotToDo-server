import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getRandomBanner = async (bannerCategory: string) => {
  const banners = await prisma.banner.findMany({
    where: {
      banner_category: bannerCategory,
    },
    select: {
      title: true,
      image: true,
    }
  });

  return shuffleAndSelect(banners);
};

const shuffleAndSelect = (array: Array<{ title: string; image: string }>) => {
  const randomArray = array.sort(() => Math.random() - 0.5);
  return randomArray[0];
};

export default getRandomBanner;
