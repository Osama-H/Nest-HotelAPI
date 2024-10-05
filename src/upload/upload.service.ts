import { Injectable } from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'; // Import the correct method

import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });
  constructor(private configService: ConfigService) {}

  async upload(fileName: string, file: Buffer, resource: string) {
    let Key: string;
    if (resource == 'hotel') {
      Key = `hotel-photos/${fileName}`;
    }
    if (resource == 'user') {
      Key = `user-photos/${fileName}`;
    }

    return await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'nestjs-hotel-booking',
        Key,
        Body: file,
      }),
    );
  }

  async getSignedUrl(fileName: string, resource: string) {
    let Key: string;
    if (resource == 'hotel') {
      Key = `hotel-photos/${fileName}`;
    }
    if (resource == 'user') {
      Key = `user-photos/${fileName}`;
    }

    const command = new GetObjectCommand({
      Bucket: 'nestjs-hotel-booking',
      Key,
    });

    // Generate a pre-signed URL valid for 60 minutes
    const url = await getSignedUrl(this.s3Client, command);
    return url;
  }
}
