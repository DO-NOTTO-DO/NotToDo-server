# NotToDo-server

<img width="922" alt="스크린샷 2023-01-05 오전 3 57 26" src="https://user-images.githubusercontent.com/91375028/210629137-6c7e42e7-fad5-4b8e-b5ce-e4bd3ed108d1.png">

## 서비스 핵심 기능 소개

![A4 - 2](https://user-images.githubusercontent.com/68391767/211763432-1b9aecc6-0b46-4d96-ac37-e652c06c394e.png)

오늘 하루 하지 않을 것을 지키고 더 나은 일상을 경험하세요. 일상 속 규율 지킴이 낫투두. 

`1단계` 오늘의 낫투두 작성

`2단계` 단계별 달성 체크

`3단계` 낫투두 실천 방법 추천

`4단계` 성취 기록 통계

## dependencies module (package.json)

```json
{
  "name": "nottodo",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "dev": "nodemon",
    "build": "tsc && node dist/src",
    "test": "mocha -r ts-node/register src/test/*.spec.ts -exit",
    "db:pull": "npx prisma db pull",
    "db:push": "npx prisma db push",
    "generate": "npx prisma generate"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/chai": "^4.3.4",
    "@types/express": "^4.17.14",
    "@types/jsonwebtoken": "^8.5.9",
    "@types/node": "^18.11.9",
    "@types/supertest": "^2.0.12",
    "chai": "^4.3.7",
    "eslint": "^8.19.0",
    "mocha": "^10.2.0",
    "nodemon": "^2.0.20",
    "prettier": "^2.7.1",
    "supertest": "^6.3.3",
    "ts-node": "^10.8.2",
    "typescript": "^4.7.4"
  },
  "dependencies": {
    "@prisma/client": "^4.5.0",
    "@types/express-validator": "^3.0.0",
    "@types/mocha": "^10.0.1",
    "agenda": "^4.3.0",
    "axios": "^1.2.2",
    "bcryptjs": "^2.4.3",
    "dayjs": "^1.11.7",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-validator": "^6.14.2",
    "firebase-admin": "^11.4.1",
    "jsonwebtoken": "^8.5.1",
    "moment": "^2.29.4",
    "mongoose": "^6.8.2",
    "prisma": "^4.5.0",
    "ts-config": "^20.10.0"
  }
}
```

## Server architecture

<img width="940" alt="image" src="https://user-images.githubusercontent.com/68391767/211761864-e4ea57e3-63ed-471d-a923-2c1c8f3ba3e3.png">



## 설계한 DB의 ERD

<img width="770" alt="image" src="https://user-images.githubusercontent.com/68391767/210394914-27fcda51-9076-47f7-ac71-26bf85f55879.png">

## 팀별 역할분담

<img width="826" alt="image" src="https://user-images.githubusercontent.com/68391767/211846690-bbae6acf-9324-4165-b183-9be39e834413.png">

박정훈: AWS 세팅

남지윤: 프로젝트 세팅

김혜수: Git 세팅

## Commit, coding convention, branch 전략

### Commit convention

**prefix: [이슈번호] 내용**

ex) fix: #23 어쩌구 고침

 **<Prefix>**

- feat (feature)
- fix (bug fix)
- docs (documentation)
- style (formatting, missing semi colons, …)
- refactor
- test (when adding missing tests)
- chore (maintain)
  
 
### Coding Convention
  
[Coding Convention Link](https://google.github.io/styleguide/tsguide.html)
  
  
### Branch convention

Prefix/이슈번호

ex) Feat/#4
  
## 프로젝트 폴더 구조
  
```
├── node_modules
├── prisma
└── src
    ├── constants
    ├── controllers
    ├── middlewares
    ├── modules
    ├── router
    └── service
```
  
## 전체 API 로직 구현 진척도

  - 남지윤 담당 API: 100%
  - 박정훈 담당 API: 100%
  - 김혜수 담당 API: 100%
