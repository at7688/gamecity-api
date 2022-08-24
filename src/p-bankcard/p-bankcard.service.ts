import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Player } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePBankcardDto } from './dto/create-p-bankcard.dto';
import { UpdatePBankcardDto } from './dto/update-p-bankcard.dto';

@Injectable()
export class PBankcardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  platform = this.configService.get('PLATFORM');

  findAll() {
    return this.prisma.playerCard.findMany();
  }

  findOne(id: string) {
    return `This action returns a #${id} pBankcard`;
  }

  update(id: string, updatePBankcardDto: UpdatePBankcardDto) {
    return `This action updates a #${id} pBankcard`;
  }

  remove(id: string) {
    return `This action removes a #${id} pBankcard`;
  }
}
