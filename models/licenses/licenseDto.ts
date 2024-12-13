export interface LicenseDto {
  id: string;
  validFrom: string;
  validUntil: string;
  classesTotal: number;
  classesRemaining: number;
  product: number;
  price: number;
  generateInvoice: boolean;
  isPaid: boolean;
  invoiceNumber: number;
  schoolId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
