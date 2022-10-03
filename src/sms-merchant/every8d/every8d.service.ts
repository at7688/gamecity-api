import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import { Cache } from 'cache-manager';
import { ResCode } from 'src/errors/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { Every8dConfig } from '../dto/create-sms-merchant.dto';
import { Every8dReqBase, Every8dResBase, EVERY8D_TOKEN } from './types/base';
import { Every8dGetCreditReq, Every8dGetCreditRes } from './types/getCredit';
import { Every8dGetTokenReq, Every8dGetTokenRes } from './types/getToken';
import * as FormData from 'form-data';

export class Every8dService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  apiUrl = 'https://api.e8d.tw';
  merchantCode = 'every8d';

  async request<T>(reqConfig: Every8dReqBase) {
    const { method, path, data, form } = reqConfig;

    const formData = new FormData();
    if (form) {
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });
    }
    const postData = form ? formData : data;
    const axiosConfig: AxiosRequestConfig<any> = {
      method,
      baseURL: this.apiUrl,
      url: path,
      headers: {
        Authorization: `Bearer ${await this.cacheManager.get(EVERY8D_TOKEN)}`,
      },
      data: postData,
    };
    try {
      const res = await axios.request<T>(axiosConfig);
      const resData = res.data as unknown as Every8dResBase;
      if (resData.Result === false) {
        await this.prisma.merchantLog.create({
          data: {
            merchant_code: this.merchantCode,
            action: 'ERROR',
            path,
            method,
            sendData: postData,
            resData: res.data as unknown as Prisma.InputJsonObject,
          },
        });
        this.prisma.error(ResCode.EXCEPTION_ERR, JSON.stringify(res.data));
      }

      await this.prisma.merchantLog.create({
        data: {
          merchant_code: this.merchantCode,
          action: 'SUCCESS',
          path,
          method,
          sendData: postData,
          resData: res.data as unknown as Prisma.InputJsonObject,
        },
      });
      return res.data;
    } catch (err) {
      await this.prisma.merchantLog.create({
        data: {
          merchant_code: this.merchantCode,
          action: 'ERROR',
          path,
          method,
          sendData: postData,
          resData: err.response.data,
        },
      });
      console.log('Error :' + err.message);
      console.log('Error Info:' + JSON.stringify(err.response.data));
      this.prisma.error(ResCode.EXCEPTION_ERR);
    }
  }

  async getToken() {
    const merchant = await this.prisma.smsMerchant.findUnique({
      where: { code: this.merchantCode },
    });
    const config = merchant.config as unknown as Every8dConfig;
    const reqConfig: Every8dReqBase<Every8dGetTokenReq> = {
      method: 'POST',
      path: '/API21/HTTP/ConnectionHandler.ashx',
      data: {
        HandlerType: 3,
        VerifyType: 1,
        UID: config.UID,
        PWD: config.PWD,
      },
    };
    const res = await this.request<Every8dGetTokenRes>(reqConfig);
    await this.cacheManager.set(EVERY8D_TOKEN, res.Msg);
    return this.prisma.success();
  }

  async getCredit() {
    const token = await this.cacheManager.get(EVERY8D_TOKEN);
    if (!token) {
      await this.getToken();
    }
    const merchant = await this.prisma.smsMerchant.findUnique({
      where: { code: this.merchantCode },
    });
    const config = merchant.config as unknown as Every8dConfig;
    const reqConfig: Every8dReqBase<Every8dGetCreditReq> = {
      method: 'POST',
      path: '/API21/HTTP/GetCredit.ashx',
      form: {
        UID: config.UID,
        PWD: config.PWD,
      },
    };
    const number = await this.request<Every8dGetCreditRes>(reqConfig);
    console.log(number);
    return this.prisma.success(number);
  }
}
