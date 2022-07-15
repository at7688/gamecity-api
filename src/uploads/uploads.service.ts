import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { Body, PutObjectRequest } from 'aws-sdk/clients/s3';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}
  AWS_S3_BUCKET = this.configService.get('AWS_S3_BUCKET');
  s3Storage = new AWS.S3({
    accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
    secretAccessKey: this.configService.get('AWS_S3_KEY_SECRET'),
  });

  async uploadFile(file: Express.Multer.File) {
    const { originalname, filename } = file;

    console.log(file);

    // await this.s3_upload(
    //   file.buffer,
    //   this.AWS_S3_BUCKET,
    //   originalname,
    //   file.mimetype,
    // );
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

    console.log(params);

    try {
      const s3Response = await this.s3Storage.upload(params).promise();

      console.log(s3Response);
    } catch (e) {
      console.log(e);
    }
  }
}
