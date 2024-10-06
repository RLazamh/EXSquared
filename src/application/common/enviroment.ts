import * as dotenv from 'dotenv';

dotenv.config();

export const ENVIRONMENT = {
  bottleneckMaxConcurrent: process.env.BOTTLENECK_MAX_CONCURRENT
    ? parseInt(process.env.BOTTLENECK_MAX_CONCURRENT, 10)
    : 200,
  bottleneckMinTime: process.env.BOTTLENECK_MIN_TIME
    ? parseInt(process.env.BOTTLENECK_MIN_TIME, 10)
    : 300,
};
