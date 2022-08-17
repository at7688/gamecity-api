import { SetMetadata } from '@nestjs/common';
import { PlatformType } from '@prisma/client';
import { PLATFORMS } from 'src/meta-consts';

export const Platforms = (platforms: PlatformType[]) =>
  SetMetadata(PLATFORMS, platforms);
