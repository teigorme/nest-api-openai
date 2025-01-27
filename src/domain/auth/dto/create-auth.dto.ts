import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

export const CreateUserZDto = extendApi(z.object({
    fullName: z.string().min(1).max(255),
    phoneNumber: z.string().min(1).max(13).startsWith("+244").trim(),
    email: z.string().min(1).max(255).email(),
    password: z.string().min(8).max(255),
    confirmPassword: z.string().min(8).max(255)
}))


export type CreateUserZDto = z.infer<typeof CreateUserZDto>

export class CreateUserDto extends createZodDto(CreateUserZDto) { }