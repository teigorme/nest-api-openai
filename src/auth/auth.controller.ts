import { Controller, Post, Body, UsePipes, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserZDto } from './dto/create-auth.dto';
import { LoginUserDto, LoginUserZDto } from './dto/login-auth.dto';
import { RefreshTokenDto, RefreshTokenZDto } from './dto/refresh-token.dto';
import { ZodValidationPipe } from 'src/utils/pipes/ZodValidationPipe';
import { Public } from './decorators/public.decorator';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ObjectNull } from 'src/utils/schemas/object-null';
import { HttpError } from 'src/utils/schemas/http-error';
import { JwtTokens } from './entities/jwt-tokens';
import { Response } from 'express';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @Public()
  @ApiResponse({ status: 201, type: ObjectNull })
  @ApiResponse({ status: 400, type: HttpError })
  @UsePipes(new ZodValidationPipe(CreateUserZDto))
  async register(@Body() createUserDto: CreateUserDto): Promise<ObjectNull> {
    return await this.authService.register(createUserDto);
  }

  @Post('/login')
  @Public()
  @ApiResponse({ status: 201, type: JwtTokens })
  @ApiResponse({ status: 401, type: HttpError })
  @UsePipes(new ZodValidationPipe(LoginUserZDto))
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<JwtTokens> {
    const { access_token, refresh_token } =
      await this.authService.login(loginUserDto);

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token, refresh_token };
  }

  @Post('/refresh-token')
  @Public()
  @ApiResponse({ status: 201, type: JwtTokens })
  @ApiResponse({ status: 401, type: HttpError })
  @UsePipes(new ZodValidationPipe(RefreshTokenZDto))
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<JwtTokens> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
