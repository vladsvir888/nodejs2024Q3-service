export const LevelLog = {
  log: 'LOG',
  fatal: 'FATAL',
  error: 'ERROR',
  warn: 'WARN',
  debug: 'DEBUG',
  verbose: 'VERBOSE',
} as const;

export type TLevelLog = typeof LevelLog[keyof typeof LevelLog];
