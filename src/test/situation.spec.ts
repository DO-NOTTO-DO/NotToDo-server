import app from '../index';
import dotenv from 'dotenv';
import req from 'supertest';
dotenv.config();

describe('GET /situation', () => {
  // 상황 200
  it('상황조회 - 성공', (done) => {
    req(app)
      .get('/api/situation')
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
  it('상황조회 - 유효하지 않은 토큰', (done) => {
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
