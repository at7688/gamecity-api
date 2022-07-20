import { SetMetadata } from '@nestjs/common';
import { IS_GLOBAL } from 'src/meta-consts';

export const Global = () => SetMetadata(IS_GLOBAL, true);
