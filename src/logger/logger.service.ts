import { LoggerService, Injectable } from '@nestjs/common';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { appendFile } from 'fs/promises';
import { LevelLog, TLevelLog } from './types';

@Injectable()
export class CustomLogger implements LoggerService {
  private logsDir: string;
  private logsFile: string;

  constructor() {
    this.logsDir = 'logs';
    this.logsFile = 'logs.txt';
    this.createDir();
  }

  log(message: string, ...params: unknown[]): void {
    this.writeToFile(message, params, LevelLog.log);
  }

  fatal(message: string, ...params: unknown[]): void {
    this.writeToFile(message, params, LevelLog.fatal);
  }

  error(message: string, ...params: unknown[]): void {
    this.writeToFile(message, params, LevelLog.error);
  }

  warn(message: string, ...params: unknown[]): void {
    this.writeToFile(message, params, LevelLog.warn);
  }

  debug(message: string, ...params: unknown[]): void {
    this.writeToFile(message, params, LevelLog.debug);
  }

  verbose(message: string, ...params: unknown[]): void {
    this.writeToFile(message, params, LevelLog.verbose);
  }

  private createTime(): string {
    return new Date().toLocaleString('en-US', {
      hour12: true,
    });
  }

  private async writeToFile(
    message: string,
    params: unknown[],
    level: TLevelLog,
  ): Promise<void> {
    const logMessage = `[Nest] ${
      process.pid
    } - ${this.createTime()}     ${level} [${params}] ${message}`;

    try {
      await appendFile(
        join(process.cwd(), this.logsDir, this.logsFile),
        logMessage + '\n',
      );
    } catch (error) {
      console.log(error.message);
    }

    console.log(logMessage);
  }

  private createDir(): void {
    mkdirSync(join(process.cwd(), this.logsDir), {
      recursive: true,
    });
  }
}
