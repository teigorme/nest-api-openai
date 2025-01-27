import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';


export const refreshToken = extendApi(z.object({
    refreshToken: z.string().min(1).jwt()
}))

export type refreshToken = z.infer<typeof refreshToken>

export class RefreshToken extends createZodDto(refreshToken) { }

export const jwtTokens = extendApi(z.object({
    access_token: z.string(),
    refresh_token: z.string()
}))


export type jwtTokens = z.infer<typeof jwtTokens>

export class JwtTokens extends createZodDto(jwtTokens) { }