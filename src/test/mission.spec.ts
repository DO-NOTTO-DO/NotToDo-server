import app from '../index';
import dotenv from 'dotenv';
import req from 'supertest';
dotenv.config();

/**
 * 일일 낫투두 조회
 * 200, 400, 401 케이스
 */
describe('GET /mission/daily/:date', () => {
  // 일일 낫투두 조회 200 케이스
  it('일일 낫투두 조회 - 성공', (done) => {
    req(app)
      .get('/api/mission/daily/2023-01-06')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `${process.env.TEST_ACCESS_TOKEN}` })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  // 일일 낫투두 조회 400 케이스
  it('일일 낫투두 조회 - 잘못된 날짜 형식', (done) => {
    req(app)
      .get(`/api/mission/daily/2023-25`)
      .set('Content-Type', 'application/json')
      .set({ Authorization: `${process.env.TEST_ACCESS_TOKEN}` })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  // 일일 낫투두 조회 401 케이스
  it('일일 낫투두 조회 - 유효하지 않은 토큰', (done) => {
    req(app)
      .get('/api/mission/daily/2023-01-05')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer process.env.TEST_TOKEN` })
      .expect(401)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

/**
 * 주간 낫투두 개수 조회
 * 200, 400, 401 케이스
 */
describe('GET /mission/week/:startDate', () => {
  // 주간 낫투두 조회 200 케이스
  it('주간 낫투두 개수 조회 - 성공', (done) => {
    req(app)
      .get('/api/mission/week/2023-01-02')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `${process.env.TEST_ACCESS_TOKEN}` })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  // 주간 낫투두 조회 400 케이스
  it('주간 낫투두 개수 조회 - 잘못된 날짜 형식', (done) => {
    req(app)
      .get(`/api/mission/week/2023-25`)
      .set('Content-Type', 'application/json')
      .set({ Authorization: `${process.env.TEST_ACCESS_TOKEN}` })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  // 주간 낫투두 조회 400 케이스
  it('주간 낫투두 개수 조회 - 월요일이 아님', (done) => {
    req(app)
      .get(`/api/mission/week/2023-01-03`)
      .set('Content-Type', 'application/json')
      .set({ Authorization: `${process.env.TEST_ACCESS_TOKEN}` })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  // 주간 낫투두 조회 401 케이스
  it('주간 낫투두 조회 - 유효하지 않은 토큰', (done) => {
    req(app)
      .get('/api/mission/week/2023-01-02')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer process.env.TEST_TOKEN` })
      .expect(401)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

/**
 * 낫투두 완료 상태 변경
 * 201, 400, 401 케이스
 */
describe('PATCH /mission/:missionId/check', () => {
  // 낫투두 완료 상태 변경 201 케이스
  it('낫투두 완료 상태 변경 - 성공', (done) => {
    req(app)
      .patch(`/api/mission/${process.env.TEST_MISSION_ID}/check`)
      .set('Content-Type', 'application/json')
      .set({ Authorization: `${process.env.TEST_ACCESS_TOKEN}` })
      .send({
        completionStatus: 'FINISH',
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  // 낫투두 완료 상태 변경 400 케이스
  it('낫투두 완료 상태 변경 - 로그인한 유저의 낫투두가 아님', (done) => {
    req(app)
      .patch(`/api/mission/1/check`)
      .set('Content-Type', 'application/json')
      .set({ Authorization: `${process.env.TEST_ACCESS_TOKEN}` })
      .send({
        completionStatus: 'FINISH',
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  // 낫투두 완료 상태 변경 400 케이스
  it('낫투두 완료 상태 변경 - 잘못된 완료 여부', (done) => {
    req(app)
      .patch(`/api/mission/${process.env.TEST_MISSION_ID}/check`)
      .set('Content-Type', 'application/json')
      .set({ Authorization: `${process.env.TEST_ACCESS_TOKEN}` })
      .send({
        completionStatus: '남지윤 바보',
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  // 낫투두 완료 상태 변경 401 케이스
  it('낫투두 완료 상태 변경 - 유효하지 않은 토큰', (done) => {
    req(app)
      .patch(`/api/mission/${process.env.TEST_MISSION_ID}/check`)
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer process.env.TEST_TOKEN` })
      .send({
        completionStatus: 'FINISH',
      })
      .expect(401)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});

/**
 * 낫투두 삭제
 * 201, 400, 401 케이스
 */
describe('DELETE /mission/:missionId', () => {
  // 낫투두 삭제 200 케이스
  it('낫투두 삭제 - 성공', (done) => {
    req(app)
      .delete(`/api/mission/${process.env.TEST_MISSION_ID}`)
      .set('Content-Type', 'application/json')
      .set({ Authorization: `${process.env.TEST_ACCESS_TOKEN}` })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  // 낫투두 삭제 400 케이스
  it('낫투두 삭제 - 로그인한 유저의 낫투두가 아님', (done) => {
    req(app)
      .delete(`/api/mission/1`)
      .set('Content-Type', 'application/json')
      .set({ Authorization: `${process.env.TEST_ACCESS_TOKEN}` })
      .expect(400)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
  // 낫투두 삭제 401 케이스
  it('낫투두 삭제 - 유효하지 않은 토큰', (done) => {
    req(app)
      .delete(`/api/mission/${process.env.TEST_MISSION_ID}`)
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer process.env.TEST_TOKEN` })
      .expect(401)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});


describe('GET /mission/recent', () => {
  // 낫투두 최근기록 조회 200
  it('낫투두 최근기록 조회 - 성공', (done) => {
    req(app)
      .get('/api/mission/recent')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `${process.env.TEST_ACCESS_TOKEN}` })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });

  // 상황 401
  it('낫투두 최근기록 조회 - 유효하지 않은 토큰', (done) => {
    req(app)
      .get('/api/situation')
      .set('Content-Type', 'application/json')
      .set({ Authorization: `Bearer process.env.TEST_TOKEN` })
      .expect(401)
      .expect('Content-Type', /json/)
      .then((res) => {
        done();
      })
      .catch((err) => {
        console.error('######Error >>', err);
        done(err);
      });
  });
});
