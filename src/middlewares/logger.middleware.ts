import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP'); 

  use(req: Request, res: any, next: () => void) {
    const { method, originalUrl,body,ip } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
