import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const Schema = extendApi(
  z.object({
    access_token: z.string().jwt(),
    refresh_token: z.string().jwt(),
  }),
);

export class JwtTokens extends createZodDto(Schema) {}
