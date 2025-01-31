import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';


export const HttpErrorZDto = extendApi(z.object({
    statusCode: z.number(),
    message: z.string()
}))


export type HttpErrorZDto = z.infer<typeof HttpErrorZDto>

export class HttpError extends createZodDto(HttpErrorZDto) { }