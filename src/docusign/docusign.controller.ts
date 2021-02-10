import { Controller, Post, Body } from '@nestjs/common';
import { DocusignService } from './docusign.service';
import { CreateDocusignDto } from './dto/create-docusign.dto';

@Controller('docusign')
export class DocusignController {
  constructor(private readonly docusignService: DocusignService) {}

  @Post('sendEnvelope')
  sendEnvelope(@Body() createDocusignDto: CreateDocusignDto) {
    return this.docusignService.sendEnvelope(createDocusignDto);
  }
}
