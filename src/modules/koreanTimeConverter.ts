const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

const getKoreanTime = async () => {
  const curr = new Date();
  const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
  const kr_curr = new Date(utc + KR_TIME_DIFF);
  return kr_curr;
};

export default getKoreanTime;
