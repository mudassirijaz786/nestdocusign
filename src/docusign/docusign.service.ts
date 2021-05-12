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
      '{ "Username":"DOCUSIGN_EMAIL_HERE",  "Password":"DOCUSIGN_PASSWORD_HERE",  "IntegratorKey":"DOCUSIGN_INTEGRATION_KEY_HERE" }',
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
    title.value = `${body.companyContactName}, ${body.companyContactTitle}`;
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

    envelope.emailBlurb = `
    Subject: Direct Hire Agreement - ${body.companyName} & RealREPP

Dear ${body.companyContactName},
    
Good afternoon, We appreciate the opportnunity to work with you and COMPANY and we look forward to great success working together.
    
Attached is the Direct Hire Agreement for your review. Please let us know if you have any questions.
    
In the event of a different contract signatory, we left the signature line blank for easy forwarding. For convenience, this agreement was also sent to your attention in pdf format via email and can also be forwarded.
    
We look forward to working with you!
    
Stay Save + Healthy 

Cheers,
Johnny Renaudo 
CEO | Founder 
Direct: 949-383-5345
johnnyrenaudo@realrepp.com
www.realrepp.com`;

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


