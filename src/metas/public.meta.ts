import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC } from 'src/meta-consts';

export const Public = () => SetMetadata(IS_PUBLIC, true);
