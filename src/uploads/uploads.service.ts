import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { Body, PutObjectRequest } from 'aws-sdk/clients/s3';
import * as sharp from 'sharp';
@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}
  AWS_S3_BUCKET = this.configService.get('AWS_S3_BUCKET');
  s3Storage = new AWS.S3({
    accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
    secretAccessKey: this.configService.get('AWS_S3_KEY_SECRET'),
  });

  async uploadFile(file: Express.Multer.File, size?: { w: number; h: number }) {
    const { originalname } = file;

    return this.s3_upload(
      size ? await this.imgResize(file.buffer, size) : file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(file: Body, bucket: string, name: string, mimetype: string) {
    const params: PutObjectRequest = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      // CreateBucketConfiguration: {
      //   LocationConstraint: 'ap-south-1',
      // },
    };

    try {
      const s3Response = await this.s3Storage.upload(params).promise();
      return { path: s3Response.Location, filename: s3Response.Key };
    } catch (e) {
      console.log(e);
    }
  }

  async imgResize(buffer: Buffer, { w, h }: { w: number; h: number }) {
    const res = await sharp(buffer).resize(w, h);
    return res.toBuffer();
  }
}
