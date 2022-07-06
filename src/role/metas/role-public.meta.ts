import { SetMetadata } from '@nestjs/common';
import { IS_ROLE_PUBLIC_KEY } from 'src/meta-consts';

export const RolePublic = () => SetMetadata(IS_ROLE_PUBLIC_KEY, true);
