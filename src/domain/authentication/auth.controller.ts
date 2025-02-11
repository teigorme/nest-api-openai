import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserZDto } from './dto/create-auth.dto';
import { LoginUserDto, LoginUserZDto } from './dto/login-auth.dto';
import { RefreshTokenDto, RefreshTokenZDto } from './dto/refresh-token.dto';
import { ZodValidationPipe } from 'src/infra/pipes/ZodValidationPipe';
import { Public } from './decorators/public.decorator';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ObjectNull } from 'src/schemas/object-null';
import { HttpError } from 'src/schemas/http-error';
import { JwtTokens } from './schemas/jwt-tokens';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @Public()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, type: ObjectNull })
  @ApiResponse({ status: 400, type: HttpError })
  @UsePipes(new ZodValidationPipe(CreateUserZDto))
  async register(@Body() createUserDto: CreateUserDto): Promise<ObjectNull> {
    return await this.authService.register(createUserDto);
  }

  @Post('/login')
  @Public()
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 201, type: JwtTokens })
  @ApiResponse({ status: 401, type: HttpError })
  @UsePipes(new ZodValidationPipe(LoginUserZDto))
  async login(@Body() loginUserDto: LoginUserDto): Promise<JwtTokens> {
    return this.authService.login(loginUserDto);
  }

  @Post('/refresh-token')
  @Public()
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 201, type: JwtTokens })
  @ApiResponse({ status: 401, type: HttpError })
  @UsePipes(new ZodValidationPipe(RefreshTokenZDto))
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<JwtTokens> {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
