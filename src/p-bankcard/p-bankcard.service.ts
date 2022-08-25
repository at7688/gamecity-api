import { ValidatePBankcardDto } from './dto/validate-p-bankcard.dto';
import { SearchPBankcardsDto } from './dto/search-p-bankcards.dto';
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

  findAll(search: SearchPBankcardsDto) {
    const { username, nickname, account, name, valid_status } = search;
    return this.prisma.playerCard.findMany({
      where: {
        player: {
          username: {
            contains: username,
          },
          nickname: {
            contains: nickname,
          },
        },
        account: {
          contains: account,
        },
        name: {
          contains: name,
        },
        valid_status: {
          in: valid_status,
        },
      },
      include: {
        player: {
          select: {
            id: true,
            nickname: true,
            username: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} pBankcard`;
  }

  update(id: string, data: UpdatePBankcardDto) {
    return this.prisma.playerCard.update({ where: { id }, data: { ...data } });
  }
  validate(id: string, data: ValidatePBankcardDto) {
    const { valid_status, inner_note, outter_note } = data;
    return this.prisma.playerCard.update({
      where: { id },
      data: {
        valid_status,
        inner_note,
        outter_note,
      },
    });
  }

  remove(id: string) {
    return `This action removes a #${id} pBankcard`;
  }
}
