import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './domain/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './domain/auth/constants/constants';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './domain/auth/guards/auth.guard';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true })
    , JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15min' },
    }), AuthModule],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
  }],
})
export class AppModule { configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(LoggerMiddleware)
    .forRoutes({path:"*", method: RequestMethod.ALL}); 
}}
