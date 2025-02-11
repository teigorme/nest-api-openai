import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const Schema = extendApi(z.object({}));

export class ObjectNull extends createZodDto(Schema) {}
