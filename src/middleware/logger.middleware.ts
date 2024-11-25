import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLogger } from 'src/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { originalUrl, query, body } = req;
    const { statusCode } = res;

    this.logger.log(
      `url: ${originalUrl}, query: ${JSON.stringify(
        query,
      )}, body: ${JSON.stringify(body)}`,
      ['Request'],
    );

    res.on('finish', () => {
      this.logger.log(`statusCode: ${statusCode}`, ['Response']);
    });

    next();
  }
}
