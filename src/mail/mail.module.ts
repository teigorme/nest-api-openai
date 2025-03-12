import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { EmailListener } from './email.listener';

@Module({
  providers: [MailService, EmailListener],
  exports: [MailService],
})
export class MailModule {}
