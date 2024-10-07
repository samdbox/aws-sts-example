/* eslint no-console: 0 */
const { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts')
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')

// Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY in the process.env
require('dotenv').config()

const bucket = process.env['S3_BUCKET']
const region = process.env['REGION']
const key = process.env['OBJECT_KEY']
const roleArn = process.env['ROLE_ARN']

let stsClient

beforeEach(() => {

}) 

describe('success case', () => {
  test('Succeed with STS (200)', async () => {
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
    const body = await response.Body.transformToString()

    expect(response.Body.statusCode).toBe(200)
    expect(body).toBeDefined()
    expect(typeof body).toBe('string')
  })
})

describe('error case', () => {
  test('InvalidAccessKeyId (403)', async () => {
    const s3Client = new S3Client({ 
      region,
      credentials: {
        accessKeyId: 'foo',
        secretAccessKey: 'bar',
      }
    })
    const s3Command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    try {
      await s3Client.send(s3Command)
    } catch(err) {
      expect(err.Code).toBe('InvalidAccessKeyId')
    }
  })

  test('SignatureDoesNotMatch (403)', async () => {
    const s3Client = new S3Client({ 
      region,
      credentials: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
        secretAccessKey: 'bar',
      }
    })
    const s3Command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    try {
      await s3Client.send(s3Command)
    } catch(err) {
      expect(err.Code).toBe('SignatureDoesNotMatch')
    }
  })

  test('Access Denied (403)', async () => {
    const s3Client = new S3Client({ 
      region,
      credentials: {
        accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
        secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
      }
    })
    const s3Command = new GetObjectCommand({
      Bucket: bucket,
      Key: 'unknown.json',
    })

    try {
      await s3Client.send(s3Command)
    } catch (err) {
      expect(err.Code).toBe('AccessDenied')
    }
  })

  test('NoSuchBucket (404)', async () => {
    const s3Client = new S3Client({ region })
    const s3Command = new GetObjectCommand({
      Bucket: 'unknown.bucket',
      Key: key,
    })
    try {
      await s3Client.send(s3Command)
    } catch (err) {
      expect(err.Code).toBe('NoSuchBucket')
      expect(err.message).toBe('The specified bucket does not exist')
    }
  })
})
