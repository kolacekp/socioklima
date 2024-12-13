export interface LicenseListDto {
  id: string;
  product: number;
  classesTotal: number;
  createdAt: Date;
  validFrom: Date;
  validUntil: Date;
  isPaid: boolean;
  price: number;
  school: {
    schoolName: string;
    country: number;
  };
  classesRemaining: number;
  invoiceNumber: number | null;
  generateInvoice: boolean;
}
