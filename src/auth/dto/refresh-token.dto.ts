import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const RefreshTokenZDto = extendApi(
  z.object({
    refreshToken: z.string().min(1).jwt(),
  }),
);

export class RefreshTokenDto extends createZodDto(RefreshTokenZDto) {}
