import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const LoginUserZDto = extendApi(z.object({
    email: z.string().min(1).max(255).email(),
    password: z.string().min(1).max(255)
}))

export type LoginUserZDto = z.infer<typeof LoginUserZDto>

export class LoginUserDto extends createZodDto(LoginUserZDto) { }