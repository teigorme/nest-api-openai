import { Controller, Get, Post, Body, UsePipes, UseGuards, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserZDto } from './dto/create-auth.dto';
import { LoginUserDto, LoginUserZDto } from './dto/login-auth.dto';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { HttpError } from 'src/types/httpError';
import { JwtTokens, RefreshToken, refreshToken } from './dto/tokens-auth.dto';
import { Tokens } from './types/tokens';
import { User } from './types/user';
import { ZodValidationBodyPipe } from 'src/infra/pipes/ZodValidationBodyPipe';
import { Public } from './decorators/public.decorator';

@Controller()

export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/register")
  @Public()
  @UsePipes(new ZodValidationBodyPipe(CreateUserZDto))
  @ApiCreatedResponse({
    type: CreateUserDto,
  })
  @ApiBody({ type: CreateUserDto })
  @ApiBadRequestResponse({ type: HttpError })
  async register(@Body() body: CreateUserZDto): Promise<User> {
    return await this.authService.register(body);
  }

  
  @Post("/login")
  @Public()
  @UsePipes(new ZodValidationBodyPipe(LoginUserZDto))
  @ApiBody({ type: LoginUserDto })
  @ApiUnauthorizedResponse({ type: HttpError })
  @ApiCreatedResponse({
    type: JwtTokens,
  })
  async login(@Body() body: LoginUserZDto): Promise<Tokens> {
    return this.authService.login(body);
  }


  @Post("/refresh-token")
  @Public()
  @UsePipes(new ZodValidationBodyPipe(refreshToken))
  @ApiCreatedResponse({
    type: JwtTokens,
  })
  @ApiBody({ type: RefreshToken })
  @ApiUnauthorizedResponse({ type: HttpError })
  async refreshToken(@Body() body: refreshToken): Promise<Tokens> {
    return this.authService.refreshToken(body);
  }


}
