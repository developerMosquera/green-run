import { SetMetadata } from '@nestjs/common';
import { ROLE } from '../enums/role.enum';

export const Roles = (...roles: ROLE[]) => SetMetadata('role', roles);
