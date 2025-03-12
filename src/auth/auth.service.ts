import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { toHashPassword, toVerifyPassword } from 'src/utils/helpers/hash';
import { JwtService } from '@nestjs/jwt';
import { jwtConstantsRefreshToken } from './constants/constants';
import { LoginUserDto } from './dto/login-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from './dto/create-auth.dto';
import { JwtTokens } from './entities/jwt-tokens';
import { ObjectNull } from 'src/utils/schemas/object-null';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<ObjectNull> {
    const emailExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (emailExists)
      throw new BadRequestException('Email já está sendo ultilizado.');

    const phoneNumberExists = await this.prisma.user.findUnique({
      where: { phoneNumber: createUserDto.phoneNumber },
    });
    if (phoneNumberExists)
      throw new BadRequestException('Telefone já está sendo ultilizado.');

    const { confirmPassword, ...rest } = createUserDto;

    if (confirmPassword != createUserDto.password)
      throw new BadRequestException('Palavra-passes não diferentes');

    await this.prisma.user.create({
      data: { ...rest, password: await toHashPassword(createUserDto.password) },
    });

    return {};
  }

  async login(loginUserDto: LoginUserDto): Promise<JwtTokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginUserDto.email },
    });
    if (
      !user ||
      !(await toVerifyPassword(loginUserDto.password, user.password))
    )
      throw new UnauthorizedException();

    const payload = { sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: jwtConstantsRefreshToken.secret,
      }),
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<JwtTokens> {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: jwtConstantsRefreshToken.secret,
        },
      );
      return {
        access_token: await this.jwtService.signAsync({ sub: payload.sub }),
        refresh_token: await this.jwtService.signAsync(
          { sub: payload.sub },
          { expiresIn: '7d', secret: jwtConstantsRefreshToken.secret },
        ),
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  
}
