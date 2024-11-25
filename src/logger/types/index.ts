export const LevelLog = {
  log: 'LOG',
  fatal: 'FATAL',
  error: 'ERROR',
  warn: 'WARN',
  debug: 'DEBUG',
  verbose: 'VERBOSE',
} as const;

export const numericLevelLog = {
  fatal: 0,
  error: 1,
  log: 2,
  warn: 3,
  debug: 4,
  verbose: 5,
};

export type TLevelLog = typeof LevelLog[keyof typeof LevelLog];
