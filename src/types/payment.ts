export interface Payment {
  id: string;
  propertyId: string;
  date: string;
  amount: number;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentFormData {
  propertyId: string;
  date: string;
  amount: number;
  observations?: string;
}
