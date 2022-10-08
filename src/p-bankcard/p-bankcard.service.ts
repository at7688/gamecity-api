import { pagerList } from './../sql/pagerList';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { WithdrawStatus } from 'src/withdraw/enums';
import { SearchPBankcardsDto } from './dto/search-p-bankcards.dto';
import { UpdatePBankcardDto } from './dto/update-p-bankcard.dto';
import { ValidatePBankcardDto } from './dto/validate-p-bankcard.dto';
import { playerCardList } from './raw/playerCardList';

@Injectable()
export class PBankcardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}
  platform = this.configService.get('PLATFORM');

  async findAll(search: SearchPBankcardsDto) {
    const {
      username,
      nickname,
      account,
      name,
      valid_status,
      page,
      perpage,
      withdraw_start_at,
      withdraw_end_at,
    } = search;
    const filterCards = await this.prisma.playerCard.findMany({
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
    });
    const records = await this.prisma.$queryRaw<any[]>(
      pagerList(
        playerCardList(
          filterCards.map((t) => t.id),
          search,
        ),
        page,
        perpage,
      ),
    );
    return this.prisma.listFormat({ ...records[0], search });
  }

  findOne(id: string) {
    return `This action returns a #${id} pBankcard`;
  }

  update(id: string, data: UpdatePBankcardDto) {
    return this.prisma.playerCard.update({ where: { id }, data: { ...data } });
  }
  async validate(data: ValidatePBankcardDto) {
    const { id, valid_status, inner_note, outter_note } = data;
    await this.prisma.playerCard.update({
      where: { id },
      data: {
        valid_status,
        inner_note,
        outter_note,
      },
    });
    return this.prisma.success();
  }

  remove(id: string) {
    return `This action removes a #${id} pBankcard`;
  }
}
