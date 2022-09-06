import { Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';

@Injectable()
export class IdentityService {
  constructor(private readonly prisma: PrismaService) {}
  create(data: CreateIdentityDto, player: Player) {
    const { id_card_num, img_ids } = data;
    return this.prisma.identityVerify.create({
      data: {
        player_id: player.id,
        id_card_num,
        imgs: { connect: img_ids.map((id) => ({ id })) },
      },
      include: { imgs: { select: { id: true } } },
    });
  }

  findAll() {
    return this.prisma.identityVerify.findMany();
  }

  findOne(id: string) {
    return this.prisma.identityVerify.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateIdentityDto, player: Player) {
    const { id_card_num, img_ids } = data;
    return this.prisma.identityVerify.update({
      where: { id },
      data: {
        player_id: player.id,
        id_card_num,
        imgs: { connect: img_ids.map((id) => ({ id })) },
      },
      include: { imgs: { select: { id: true } } },
    });
  }

  remove(id: string) {
    return this.prisma.identityVerify.delete({ where: { id } });
  }
}
