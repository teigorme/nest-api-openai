import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventsService {
  constructor(private eventEmitter: EventEmitter2) {}

  emitEmailEvent(data: { to: string; subject: string; text: string }) {
    this.eventEmitter.emit('email.send', data);
  }
}
