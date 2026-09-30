import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

// Cloudflare R2 is S3-compatible, so the AWS SDK works unmodified against
// it. This is the *only* place that knows about R2 — swapping to S3 or
// another provider later means changing this file, not any caller
// (Section 18's "keep the storage provider abstract").
let client = null

function getClient() {
  if (!env.r2.accountId || !env.r2.accessKeyId || !env.r2.secretAccessKey) {
    // A plain Error here would be masked into a generic 500 by the central
    // error handler (Section 48's "no raw internals" rule) — this is an
    // expected, actionable setup step, not an unexpected fault, so it
    // should reach the admin UI as-is.
    throw new ApiError(
      503,
      'Media storage is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET and R2_PUBLIC_URL in server/.env before uploading media.',
    )
  }
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.r2.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.r2.accessKeyId,
        secretAccessKey: env.r2.secretAccessKey,
      },
    })
  }
  return client
}

export async function uploadFile({ buffer, key, contentType }) {
  const s3 = getClient()
  await s3.send(
    new PutObjectCommand({
      Bucket: env.r2.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  )
  return getUrl(key)
}

export async function deleteFile(key) {
  const s3 = getClient()
  await s3.send(new DeleteObjectCommand({ Bucket: env.r2.bucket, Key: key }))
}

export function getUrl(key) {
  return `${env.r2.publicUrl.replace(/\/$/, '')}/${key}`
}
