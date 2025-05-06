// backend/services/storage.js
require('dotenv').config();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const ENDPOINT    = process.env.DO_SPACES_ENDPOINT;  // <–– usa aqui
const BUCKET      = process.env.DO_SPACES_BUCKET;
const REGION      = process.env.DO_SPACES_REGION;   // opcional, mas recomendado
const BASE_FOLDER = process.env.BASE_FOLDER;

const s3Client = new S3Client({
  endpoint: ENDPOINT,    // usa seu URL exato
  region: REGION,        // mantém a região pra registrar na assinatura
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

async function createSubFolder(subFolderName) {
  const key = `${BASE_FOLDER}/${subFolderName}/`;
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: Buffer.alloc(0),
    ACL: 'private',
  }));
}

module.exports = { s3Client, BUCKET, BASE_FOLDER, createSubFolder };
