import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, ip } = req;
    const userAgent = headers['user-agent'] || 'N/A';
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode, statusMessage } = res;
      const duration = Date.now() - start;
      const contentLength = res.getHeader('content-length') || '0';

      this.logger.log(
        `📥 ${method} ${originalUrl} - ${statusCode} ${statusMessage} ` +
          `(${duration}ms) | IP: ${ip} | User-Agent: ${userAgent} | ` +
          `Response Size: ${contentLength} bytes`,
      );
    });

    next();
  }
}
