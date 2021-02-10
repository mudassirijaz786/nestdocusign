import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocusignModule } from './docusign/docusign.module';

@Module({
  imports: [DocusignModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
