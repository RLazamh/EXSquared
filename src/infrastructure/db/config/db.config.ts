import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const getMongoConfig = (configService: ConfigService) => {
  const username = configService.get<string>('MONGO_INITDB_ROOT_USERNAME');
  const password = configService.get<string>('MONGO_INITDB_ROOT_PASSWORD');
  const host = configService.get<string>('MONGO_HOST');
  const port = configService.get<string>('MONGO_PORT');
  const db = configService.get<string>('MONGO_INITDB_DATABASE');

  if (!username || !password || !host || !port || !db) {
    throw new Error('Missing required MongoDB configuration.');
  }
  const MONGODB_URI = `mongodb://${username}:${password}@${host}:${port}/${db}?authSource=admin`;

  Logger.log(`MONGODB URI: ${MONGODB_URI}`);

  return { uri: MONGODB_URI };
};
// mongodb://admin:admin@mongodb_vehicle:27017/vehicle?authSource=admi
