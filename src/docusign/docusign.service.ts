import { Injectable } from '@nestjs/common';
import { CreateDocusignDto } from './dto/create-docusign.dto';
import docusign from 'docusign-esign';
import mainArgs from './dto/defaultEnvelopeTempalte.json';

@Injectable()
export class DocusignService {
  async sendEnvelope(createDocusignDto: CreateDocusignDto) {
    const dsApiClient = new docusign.ApiClient();

    dsApiClient.setBasePath(mainArgs.baseUrl);

    dsApiClient.addDefaultHeader(
      'X-DocuSign-Authentication',
      '{ "Username":"mudassir.ijaz@kwanso.com",  "Password":"pa$$WORD1122",  "IntegratorKey":"27af8f71-2a7c-4ee5-bf5e-2a47fb6cc107" }',
    );

    const envelopesApi = new docusign.EnvelopesApi(dsApiClient);

    const envelope = this.creatingEnvelope(createDocusignDto);

    const results = await envelopesApi.createEnvelope(mainArgs.accountId, {
      envelopeDefinition: envelope,
    });

    return results;
  }

  creatingEnvelope(body: CreateDocusignDto) {
    const envelope = new docusign.EnvelopeDefinition();

    envelope.templateId = mainArgs.envelopeArgs.templateId;

    const [templateRoles] = mainArgs.envelopeArgs.templateRoles;

    const { tabs } = templateRoles;

    const [
      date,
      company,
      title,
      address,
      city,
      fullName,
      spellPercentage,
      percentage,
      spellDays,
      voilationDays,
      notifyDays,
      terminationDays,
      companyAgain,
    ] = tabs.textTabs;

    templateRoles.name = body.recipientName;
    templateRoles.email = body.recipientEmail;
    templateRoles.roleName = body.recipientRole;

    date.value = this._dateToDesireForamt();
    company.value = body.companyName;
    title.value = body.companyContactTitle;
    address.value = body.address;
    fullName.value = body.companyContactName;
    city.value = `${body.city}, ${body.state} ${body.zip}`;
    spellPercentage.value = body.spellPercentage;
    percentage.value = body.percentage;
    spellDays.value = body.spellDays;
    voilationDays.value = body.voilationDays;
    notifyDays.value = body.notifyDays;
    terminationDays.value = body.terminationDays;
    companyAgain.value = body.companyName;

    envelope.templateRoles = [templateRoles];

    envelope.status = mainArgs.envelopeArgs.status;

    return envelope;
  }

  _dateToDesireForamt() {
    const date = new Date();
    return `${date.toLocaleString('default', { month: 'long' })}, ${
      date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    } ${date.getFullYear()}`;
  }
}

/*

{
    "recipientEmail": "ijazmudassir786@gmail.com",
    "recipientRole": "Signer",
    "recipientName": "Mudassir",
    "companyName": "Kwanso",
    "companyContactTitle": "Developer",
    "address": "string",
    "companyContactName": "Nadeem Yasin",
    "city": "Lahore",
    "state": "Punjab",
    "zip": "54000",
    "spellPercentage": "Fifteen Percent",
    "percentage": "15%",
    "spellDays": "thirty days",
    "voilationDays": "30",
    "notifyDays": "30",
    "terminationDays": "30"
}

*/
