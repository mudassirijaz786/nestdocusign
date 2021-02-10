import { Module } from '@nestjs/common';
import { DocusignService } from './docusign.service';
import { DocusignController } from './docusign.controller';

@Module({
  controllers: [DocusignController],
  providers: [DocusignService]
})
export class DocusignModule {}
