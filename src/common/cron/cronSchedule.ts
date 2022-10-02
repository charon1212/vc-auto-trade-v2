import * as cron from 'node-cron';

export const cronSchedule = {
  everySecond: (secondSpan?: number) => (func: () => void) => cron.schedule(`${secondSpan ? `*/${secondSpan}` : `*`} * * * * *`, func),
  everyMinute: (minuteSpan?: number) => (func: () => void) => cron.schedule(`0 ${minuteSpan ? `*/${minuteSpan}` : `*`} * * * *`, func),
  everyHour: (hourSpan?: number) => (func: () => void) => cron.schedule(`0 0 ${hourSpan ? `*/${hourSpan}` : `*`} * * *`, func),
};
