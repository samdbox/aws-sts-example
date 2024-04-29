/* eslint no-console: 0 */
const { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts')
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')

// Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY in the process.env
require('dotenv').config()

const bucket = process.env['S3_BUCKET']
const region = process.env['REGION']
const key = process.env['OBJECT_KEY']
const roleArn = process.env['ROLE_ARN']

test('GetObject without STS', async () => {
  
  // Create a s3 client with credentials
  const s3Client = new S3Client({ region })
  // Create a command to get an object.
  const s3Command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  })
  // Make a request to get an object.
  const response = await s3Client.send(s3Command)
  // Parse the response
  let body = await response.Body.transformToString()
  body = JSON.parse(body)

  expect(body).toBeDefined()
  expect(body.data.length).toBe(3)
})

test('GetObject with STS', async () => {
  // create a STSClient
  const stsClient = new STSClient({ region })
  // create an assumeRole command 
  const assumeRoleCommand = new AssumeRoleCommand({
    RoleArn: roleArn,
    RoleSessionName: 'session',
  })
  // Make a request to get credentials.
  const stsResponse = await stsClient.send(assumeRoleCommand)

  const { Credentials } = stsResponse

  expect(Credentials.AccessKeyId).toBeDefined()
  expect(Credentials.SecretAccessKey).toBeDefined()
  expect(Credentials.SessionToken).toBeDefined()

  // create a s3 client with credentials
  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId: Credentials.AccessKeyId,
      secretAccessKey: Credentials.SecretAccessKey,
      sessionToken: Credentials.SessionToken,
    },
  })
  // Create a command to get an object.
  const s3Command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  })
  // Make a request to get an object.
  const response = await s3Client.send(s3Command)
  // Parse the response
  let body = await response.Body.transformToString()
  body = JSON.parse(body)

  expect(body).toBeDefined()
  expect(body.data.length).toBe(3)
})
