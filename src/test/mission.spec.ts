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
