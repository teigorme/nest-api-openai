import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserZDto } from './dto/create-auth.dto';
import { LoginUserZDto } from './dto/login-auth.dto';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { toHashPassword, toVerifyPassword } from 'src/infra/helpers/hash';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './types/payload';
import { User } from './types/user';
import { Tokens } from './types/tokens';
import { jwtConstants, jwtConstantsRefreshToken } from './constants/constants';
import { refreshToken } from './dto/tokens-auth.dto';


@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) { }


  async register(body: CreateUserZDto): Promise<User> {
    const emailExists = await this.prisma.user.findUnique({ where: { email: body.email } })
    if (emailExists) throw new BadRequestException("Email já está sendo ultilizado.")

    const phoneNumberExists = await this.prisma.user.findUnique({ where: { phoneNumber: body.phoneNumber } })
    if (phoneNumberExists) throw new BadRequestException("Telefone já está sendo ultilizado.")

    const { confirmPassword, ...rest } = body

    if (confirmPassword != body.password) throw new BadRequestException("Palavra-passes não diferentes")

    const user = await this.prisma.user.create({ data: { ...rest, password: (await toHashPassword(body.password)) } })

    const { password, ...data } = user

    return data

  }

  async login(body: LoginUserZDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({ where: { email: body.email } })
    if (!user || await (toVerifyPassword(body.password, user.password))) throw new UnauthorizedException()

    const payload: Payload = { sub: user.id, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, { expiresIn: "1d", secret: jwtConstantsRefreshToken.secret }),
    }
  }


  async refreshToken(body: refreshToken): Promise<Tokens> {
    try {
      const payload: Payload = await this.jwtService.verifyAsync(
        body.refreshToken,
        {
          secret: jwtConstants.secret
        }
      )
      return {
        access_token: await this.jwtService.signAsync(payload),
        refresh_token: await this.jwtService.signAsync(payload, { expiresIn: "1d", secret: jwtConstantsRefreshToken.secret }),
      }
    } catch (error) {
      throw new UnauthorizedException()

    }
  }


}
