export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  avatarUrl?: string;
  isVerified: boolean;
  createdAt: string;
}

export type DeliveryMethod = 'mobile_money' | 'bank_transfer';
export type MobileMoneyProvider = 'M-Pesa' | 'Airtel Money' | 'Equity Bank' | 'KCB Bank';

export interface Recipient {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  country: string;
  deliveryMethod: DeliveryMethod;
  provider: MobileMoneyProvider;
  accountNumber: string;
  isFavorite: boolean;
  createdAt: string;
}

export type TransferStatus = 'processing' | 'delivered' | 'failed' | 'cancelled';

export interface Transfer {
  id: string;
  userId: string;
  recipientId: string;
  senderAmount: number;
  senderCurrency: string;
  recipientAmount: number;
  recipientCurrency: string;
  fee: number;
  exchangeRate: number;
  deliveryMethod: string;
  provider: string;
  accountNumber: string;
  recipientName: string;
  status: TransferStatus;
  currentStep: number; // 1: Created, 2: Payment Received, 3: Sending, 4: Delivered
  note?: string;
  estimatedDelivery: string;
  createdAt: string;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  feeFixed: number;
  feePercent: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'transfer' | 'promo' | 'security';
  isRead: boolean;
  createdAt: string;
}

export interface TransferCalculation {
  sendAmount: number;
  sendCurrency: string;
  recipientCurrency: string;
  exchangeRate: number;
  fee: number;
  receiveAmount: number;
  totalCharge: number;
}
