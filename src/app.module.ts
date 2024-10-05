import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'dev.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
