export default {
  NULL_VALUE: '필요한 값이 없습니다.',
  OUT_OF_VALUE: '파라미터 값이 잘못되었습니다.',
  NOT_FOUND: '잘못된 경로입니다.',
  BAD_REQUEST: '잘못된 요청입니다.',

  // 회원가입 및 로그인
  SIGNUP_SUCCESS: '회원 가입 성공',
  SIGNUP_FAIL: '회원 가입 실패',
  SIGNIN_SUCCESS: '로그인 성공',
  SIGNIN_FAIL: '로그인 실패',
  ALREADY_NICKNAME: '이미 사용중인 닉네임입니다.',

  // 유저
  CREATE_USER_SUCCESS: '유저 회원가입 성공',
  LOGIN_USER_SUCCESS: '유저 로그인 성공',
  READ_USER_SUCCESS: '유저 조회 성공',
  READ_ALL_USERS_SUCCESS: '모든 유저 조회 성공',
  UPDATE_USER_SUCCESS: '유저 수정 성공',
  DELETE_USER_SUCCESS: '유저 탈퇴 성공',
  DELETE_USER_FAIL: '유저 탈퇴 실패',
  NO_USER: '탈퇴했거나 가입하지 않은 유저입니다.',

  // 토큰
  CREATE_TOKEN_SUCCESS: '토큰 재발급 성공',
  EXPIRED_TOKEN: '토큰이 만료되었습니다.',
  EXPIRED_ALL_TOKEN: '모든 토큰이 만료되었습니다.',
  INVALID_TOKEN: '유효하지 않은 토큰입니다.',
  VALID_TOKEN: '유효한 토큰입니다.',
  EMPTY_TOKEN: '토큰 값이 없습니다.',

  // 서버 내 오류
  INTERNAL_SERVER_ERROR: '서버 내 오류',
  INVALID_PASSWORD: '잘못된 비밀번호입니다.',

  // 성공
  SUCCESS: '성공',

  // 추천
  READ_CATEGORY_SUCCESS: '추천 카테고리 조회 성공',

  // 낫투두
  READ_DAILY_MISSION_SUCCESS: '일일 낫투두 조회 성공',
  INVALID_DATE_TYPE: '올바르지 않은 날짜 형식입니다.',
  READ_WEEKLY_MISSION_COUNT_SUCCESS: '주간 낫투두 개수 조회 성공',
  IS_NOT_MONDAY: '시작일은 월요일이어야합니다.',
  READ_MISSION_COUNT_SUCCESS: '월별 낫투두 개수 조회 성공',
  INVALID_MISSION_ID: '올바르지 않은 id입니다.',
  NOT_USERS_MISSION: '로그인한 유저의 낫투두가 아닙니다.',
  INVALID_COMPLETION_STATUS_TYPE: '완료 여부는 NOTYET, AMBIGUOUS, FINISH로만 가능합니다.',
  CHANGE_COMPLETION_STATUS_SUCCESS: '낫투두 완료 여부 변경 성공',
  DELETE_MISSION_SUCCESS: '낫투두 삭제 성공',
  RECENT_MISSION_SUCCESS: '최근 사용 낫투두 기록 불러오기 성공',
  COPY_OTHERDATES_MISSION_SUCCESS: '낫투두 다른 날짜에 추가 성공',
  MISSION_NOT_FOUND: '해당 낫투두가 존재하지 않습니다.',
  EMPTY_MISSION_ID: '필요한 값(id)이 없습니다.',
  EMPTY_MISSION_DATES: '필요한 값(날짜)이 없습니다.',
  ALREADY_THREE_MISSIONS: '해당 날짜에 이미 3개의 낫투두가 있습니다.',
  ALREADY_SAME_MISSIONS: '해당 날짜에 이미 같은 낫투두가 있습니다.',
  CREATE_MISSION_SUCCESS: '낫투두 생성 성공',
  ALREADY_EXIST_MISSION: '이미 존재하는 낫투두 입니다.',
  LIMITED_MISSION_COUNT: '낫투두를 3개 이상 추가할 수 없습니다.',
  LIMITED_ACTION_COUNT: '액션은 최대 2개까지만 추가할 수 있습니다.',

  //통계
  READ_NOTTODO_STAT_SUCCESS: '낫투두별 통계 조회 성공',
  READ_SITUATION_STAT_SUCCESS: '상황별 통계 조회 성공',

  // 상황
  SITUATIONS_GET_SUCCESS: '상황 불러오기 성공',

  // 배너
  READ_BANNER_SUCCESS: '배너 불러오기 성공',
};
