import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { ApiLoggerModule } from './api-logger/api-logger.module';
import { AuthStrategy } from './auth/auth.strategy';
import { EmailModule } from './email/email.module';
import { SettingModule } from './setting/setting.module';
import { PspsModule } from './psps/psps.module';
import { LevelsModule } from './levels/levels.module';
import { JspsModule } from './jsps/jsps.module';
import { StripeService } from './stripe-service/stripe-service.service';
import { StripeServiceModule } from './stripe-service/stripe-service.module';
import { HomeModule } from './home/home.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '7d' }, // e.g. 30s, 7d, 24h
    }),
    UsersModule,
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    ApiLoggerModule,
    EmailModule,
    SettingModule,
    PspsModule,
    LevelsModule,
    JspsModule,
    HomeModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    AuthStrategy,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
