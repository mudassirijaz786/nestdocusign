export interface CreateDocusignDto {
  recipientName: string;
  recipientEmail: string;
  recipientRole: string;
  companyName: string;
  companyContactTitle: string;
  address: string;
  companyContactName: string;
  city: string;
  state: string;
  zip: string;
  spellPercentage: string;
  percentage: string;
  spellDays: string;
  voilationDays: string;
  notifyDays: string;
  terminationDays: string;
}
