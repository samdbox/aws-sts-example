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
# Your AWS access key id
AWS_ACCESS_KEY_ID=
# Your AWS secret access key
AWS_SECRET_ACCESS_KEY=
# S3 bucket name to connect
S3_BUCKET=
# The region of the bucket. eg. ap-northeast-1
REGION=
# The object key name to get
OBJECT_KEY=
# The role arn using STS
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
  success case
    ✓ Succeed with STS (200) (318 ms)
  error case
    ✓ InvalidAccessKeyId (403) (62 ms)
    ✓ SignatureDoesNotMatch (403) (58 ms)
    ✓ Access Denied (403) (74 ms)
    ✓ NoSuchBucket (404) (60 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        0.884 s, estimated 1 s
Ran all test suites.
```
