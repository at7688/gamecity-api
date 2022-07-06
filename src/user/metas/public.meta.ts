import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/meta-consts';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
