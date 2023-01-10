import app from '../index';
import dotenv from 'dotenv';
import req from 'supertest';
dotenv.config();

/**
 * 추천 카테고리 조회
 * 200 케이스
 */
describe('GET /environment/category', () => {
  // 추천 카테고리 조회 200 케이스
  it('추천카테고리 조회 - 성공', (done) => {
    req(app)
      .get(`/api/environment/category`)
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
});

/**
 * 추천 카테고리 별 환경 조회
 * 200 케이스
 */
describe('GET /environment/:categoryId', () => {
  // 카테고리 별 환경 조회 200 케이스
  it('카테고리 별 환경 조회 - 성공', (done) => {
    req(app)
      .get(`/api/environment/${1}`)
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
});
