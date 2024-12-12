import { LoggerService, Injectable } from '@nestjs/common';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { appendFile, stat, rm } from 'fs/promises';
import { LevelLog, TLevelLog, numericLevelLog } from './types';

@Injectable()
export class CustomLogger implements LoggerService {
  private logsDir: string;
  private logLevel: number;
  private maxFileSize: number;
  private pathToLogsFile: string;
  private pathToLogsErrorFile: string;

  constructor() {
    const logsFile = 'logs.log';
    const logsErrorFile = 'logs-error.log';
    const currentWorkingDir = process.cwd();
    this.logsDir = 'logs';
    this.logLevel = Number(process.env.LOG_LEVEL);
    this.maxFileSize = Number(process.env.MAX_FILE_SIZE);
    this.pathToLogsFile = join(currentWorkingDir, this.logsDir, logsFile);
    this.pathToLogsErrorFile = join(
      currentWorkingDir,
      this.logsDir,
      logsErrorFile,
    );
    this.createDir();
  }

  log(message: string, ...params: unknown[]): void {
    if (this.logLevel >= numericLevelLog.log) {
      this.writeToFile(message, params, LevelLog.log);
    }
  }

  fatal(message: string, ...params: unknown[]): void {
    if (this.logLevel >= numericLevelLog.fatal) {
      this.writeToFile(message, params, LevelLog.fatal);
    }
  }

  error(message: string, ...params: unknown[]): void {
    if (this.logLevel >= numericLevelLog.error) {
      this.writeToFile(message, params, LevelLog.error);
    }
  }

  warn(message: string, ...params: unknown[]): void {
    if (this.logLevel >= numericLevelLog.warn) {
      this.writeToFile(message, params, LevelLog.warn);
    }
  }

  debug(message: string, ...params: unknown[]): void {
    if (this.logLevel >= numericLevelLog.debug) {
      this.writeToFile(message, params, LevelLog.debug);
    }
  }

  verbose(message: string, ...params: unknown[]): void {
    if (this.logLevel >= numericLevelLog.verbose) {
      this.writeToFile(message, params, LevelLog.verbose);
    }
  }

  private createTime(): string {
    return new Date().toLocaleString('en-US', {
      hour12: true,
    });
  }

  private async checkFileSize(path: string): Promise<boolean> {
    const size = (await stat(path)).size;
    const sizeInBytes = Math.floor(size / 1024);
    return sizeInBytes >= this.maxFileSize;
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
      await appendFile(this.pathToLogsFile, logMessage + '\n');
      const isRemoveLogFile = await this.checkFileSize(this.pathToLogsFile);
      if (isRemoveLogFile) {
        await rm(this.pathToLogsFile);
      }

      if (level === LevelLog.error) {
        await appendFile(this.pathToLogsErrorFile, logMessage + '\n');
        const isRemoveLogErrorFile = await this.checkFileSize(
          this.pathToLogsErrorFile,
        );
        if (isRemoveLogErrorFile) {
          await rm(this.pathToLogsErrorFile);
        }
      }
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
