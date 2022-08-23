import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Player } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginUser } from 'src/types';
import { CreatePBankcardDto } from './dto/create-p-bankcard.dto';
import { UpdatePBankcardDto } from './dto/update-p-bankcard.dto';

@Injectable()
export class PBankcardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  platform = this.configService.get('PLATFORM');
  async create(data: CreatePBankcardDto, player: Player) {
    const defaultCards = await this.prisma.playerCard.findMany({
      where: { player_id: player.id, is_default: true },
    });
    return this.prisma.playerCard.create({
      data: {
        ...data,
        is_default: !defaultCards.length, // 有預設卡片則新卡片不為預設
        player_id: player.id,
      },
    });
  }

  findAll() {
    return this.prisma.playerCard.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} pBankcard`;
  }

  update(id: number, updatePBankcardDto: UpdatePBankcardDto) {
    return `This action updates a #${id} pBankcard`;
  }

  remove(id: number) {
    return `This action removes a #${id} pBankcard`;
  }
}
