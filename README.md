# AWS STS assumeRole Example

### 시작하기

**테스트 환경**
```
node -v
v20.11.1
```

**패키지 인스톨**

```
npm install
```

**`.env` 복사**

`.evn` 파일에 환경변수를 입력하면 `process`에 적용됩니다.

```
cp .env.example .env
```
이후 `.env` 파일에 `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` 등 필요한 값들을 입력해주세요.

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=
REGION=
OBJECT_KEY=
ROLE_ARN=
```

**테스트**

```
npm test
```

**결과**

Trust Relationships에 입력된 ARN은 토큰을 얻을 수 있고 테스트를 통과합니다.

```
> test
> jest -i

 PASS  ./index.test.js
  ✓ GetObject without STS (481 ms)
  ✓ GetObject with STS (238 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.947 s, estimated 1 s
Ran all test suites.
```
