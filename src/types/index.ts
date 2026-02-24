// ===== TENANT / CLIENT =====
export interface TenantConfig {
  id: string;
  name: string;
  subdomain: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  features: {
    cashRedemption: boolean;
    whiteGoods: boolean;
    giftCards: boolean;
    electronics: boolean;
    beauty: boolean;
    holidays: boolean;
  };
  pointsPerRupee: number;
  minRedeemPoints: number;
  cashbackRate: number; // points per ₹1 cashback
}

// ===== USER =====
export interface User {
  id: string;
  name: string;
  phone: string;
  aadhaar?: string;
  pan?: string;
  establishmentType?: string;
  upiId?: string;
  totalPoints: number;
  redeemablePoints: number;
  lifetimePoints: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Platinum';
  joinedAt: string;
  tenantId: string;
}

// ===== QR / TRANSACTION =====
export interface QRScan {
  id: string;
  qrCode: string;
  productName: string;
  productImage?: string;
  pointsEarned: number;
  cashbackAmount?: number;
  scannedAt: string;
  status: 'success' | 'pending' | 'failed';
  type: 'sales' | 'customer';
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  category: 'scan' | 'redeem' | 'bonus' | 'cashback';
  title: string;
  subtitle?: string;
  points?: number;
  amount?: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
}

// ===== REWARDS =====
export type RewardCategory = 'cash' | 'white-goods' | 'gift-cards' | 'electronics' | 'beauty' | 'holidays';

export interface Reward {
  id: string;
  category: RewardCategory;
  title: string;
  description: string;
  pointsRequired: number;
  value: number; // ₹ value
  image: string;
  stock: number;
  isAvailable: boolean;
  tenantId: string;
}

export interface CartItem {
  reward: Reward;
  quantity: number;
}

// ===== REDEMPTION =====
export interface Redemption {
  id: string;
  userId: string;
  items: CartItem[];
  totalPoints: number;
  totalValue: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  upiId?: string;
  createdAt: string;
}

// ===== UPI =====
export interface UPIVerification {
  upiId: string;
  name: string;
  isVerified: boolean;
}

// ===== ADMIN =====
export interface AdminUser {
  id: string;
  email: string;
  role: 'superadmin' | 'tenant_admin';
  tenantId?: string;
}
