import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

async function run() {
  try {
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: "test/verify.txt",
        Body: Buffer.from("test from local .env.local"),
        ContentType: "text/plain",
      })
    );
    console.log("LOCAL R2 TEST: SUCCESS!");
  } catch (err) {
    console.error("LOCAL R2 TEST: FAILED!", err.message);
  }
}
run();
