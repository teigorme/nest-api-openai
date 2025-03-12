import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from './mail.service';

@Injectable()
export class EmailListener implements OnModuleInit {
  constructor(
    private readonly mailService: MailService,
    private readonly logger: Logger,
  ) {}

  onModuleInit() {
    this.logger.log('EmailListener iniciado');
  }

  @OnEvent('email.send')
  async handleEmailEvent(payload: {
    to: string;
    subject: string;
    text: string;
  }) {
    this.logger.log('Evento de envio de e-mail recebido:', payload);
    await this.mailService.sendEmail(payload.to, payload.subject, payload.text);
  }
}
