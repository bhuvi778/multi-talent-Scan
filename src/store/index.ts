import { TenantConfig, User, CartItem, Transaction, QRScan } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ===== MOCK TENANTS =====
export const MOCK_TENANTS: TenantConfig[] = [
    {
        id: 'tenant-001',
        name: 'AvoPay',
        subdomain: 'avopay',
        logo: '⚡',
        logoUrl: 'https://ui-avatars.com/api/?name=AvoPay&background=6366f1&color=fff&size=128&bold=true&font-size=0.4&rounded=true',
        primaryColor: '#6366f1',
        secondaryColor: '#a855f7',
        accentColor: '#10b981',
        gradientFrom: '#6366f1',
        gradientTo: '#4f46e5',
        features: { cashRedemption: true, whiteGoods: true, giftCards: true, electronics: true, beauty: true, holidays: true },
        pointsPerRupee: 10,
        minRedeemPoints: 500,
        cashbackRate: 100,
    },
    {
        id: 'tenant-002',
        name: 'LoyalMart',
        subdomain: 'loyalmart',
        logo: '🛒️',
        logoUrl: 'https://ui-avatars.com/api/?name=LoyalMart&background=f59e0b&color=fff&size=128&bold=true&font-size=0.4&rounded=true',
        primaryColor: '#f59e0b',
        secondaryColor: '#ef4444',
        accentColor: '#10b981',
        gradientFrom: '#f59e0b',
        gradientTo: '#ef4444',
        features: { cashRedemption: true, whiteGoods: false, giftCards: true, electronics: false, beauty: true, holidays: false },
        pointsPerRupee: 5,
        minRedeemPoints: 1000,
        cashbackRate: 50,
    },
];

// ===== AUTH STORE =====
interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    tenant: TenantConfig;
    loading: boolean;
    otpSent: boolean;
    phone: string;
    login: (phone: string) => void;
    verifyOTP: (otp: string) => Promise<boolean>;
    logout: () => void;
    setPhone: (phone: string) => void;
    setOtpSent: (val: boolean) => void;
    updateUser: (updates: Partial<User>) => void;
    setTenant: (tenant: TenantConfig) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoggedIn: false,
            tenant: MOCK_TENANTS[0],
            loading: false,
            otpSent: false,
            phone: '',

            setPhone: (phone) => set({ phone }),
            setOtpSent: (val) => set({ otpSent: val }),
            setTenant: (tenant) => set({ tenant }),

            login: (phone) => {
                set({ loading: true });
                setTimeout(() => { set({ otpSent: true, loading: false, phone }); }, 1500);
            },

            verifyOTP: async (otp) => {
                set({ loading: true });
                await new Promise(r => setTimeout(r, 1500));
                if (otp === '123456' || otp.length === 6) {
                    const mockUser: User = {
                        id: 'user-001',
                        name: 'Rahul Sharma',
                        phone: get().phone,
                        totalPoints: 4750,
                        redeemablePoints: 3200,
                        lifetimePoints: 12500,
                        tier: 'Gold',
                        joinedAt: '2024-01-15',
                        tenantId: get().tenant.id,
                    };
                    set({ user: mockUser, isLoggedIn: true, loading: false });
                    return true;
                }
                set({ loading: false });
                return false;
            },

            logout: () => set({ user: null, isLoggedIn: false, otpSent: false, phone: '' }),
            updateUser: (updates) => set((s) => ({ user: s.user ? { ...s.user, ...updates } : null })),
        }),
        { name: 'loyalty-auth', partialize: (s) => ({ user: s.user, isLoggedIn: s.isLoggedIn, tenant: s.tenant }) }
    )
);

// ===== CART STORE =====
interface CartState {
    items: CartItem[];
    addItem: (item: CartItem['reward']) => void;
    removeItem: (rewardId: string) => void;
    updateQty: (rewardId: string, qty: number) => void;
    clear: () => void;
    totalPoints: () => number;
    totalValue: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
    items: [],
    addItem: (reward) => {
        const existing = get().items.find(i => i.reward.id === reward.id);
        if (existing) {
            set(s => ({ items: s.items.map(i => i.reward.id === reward.id ? { ...i, quantity: i.quantity + 1 } : i) }));
        } else {
            set(s => ({ items: [...s.items, { reward, quantity: 1 }] }));
        }
    },
    removeItem: (id) => set(s => ({ items: s.items.filter(i => i.reward.id !== id) })),
    updateQty: (id, qty) => {
        if (qty <= 0) get().removeItem(id);
        else set(s => ({ items: s.items.map(i => i.reward.id === id ? { ...i, quantity: qty } : i) }));
    },
    clear: () => set({ items: [] }),
    totalPoints: () => get().items.reduce((acc, i) => acc + i.reward.pointsRequired * i.quantity, 0),
    totalValue: () => get().items.reduce((acc, i) => acc + i.reward.value * i.quantity, 0),
}));

// ===== HISTORY STORE =====
interface HistoryState {
    transactions: Transaction[];
    scans: QRScan[];
    addTransaction: (t: Transaction) => void;
    addScan: (s: QRScan) => void;
}

const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 't1', type: 'credit', category: 'scan', title: 'QR Scan Reward', subtitle: 'Asian Paints Premium', points: 500, date: '2025-02-20T10:30:00Z', status: 'success' },
    { id: 't2', type: 'credit', category: 'scan', title: 'QR Scan Reward', subtitle: 'Berger Paints Luxury', points: 350, date: '2025-02-18T14:15:00Z', status: 'success' },
    { id: 't3', type: 'debit', category: 'redeem', title: 'Cash Redemption', subtitle: 'UPI Transfer', amount: 500, points: 1000, date: '2025-02-15T09:00:00Z', status: 'success' },
    { id: 't4', type: 'credit', category: 'bonus', title: 'Welcome Bonus', subtitle: 'First scan bonus', points: 200, date: '2025-02-01T00:00:00Z', status: 'success' },
    { id: 't5', type: 'credit', category: 'scan', title: 'QR Scan Reward', subtitle: 'Nerolac Impressions', points: 420, date: '2025-01-28T16:45:00Z', status: 'success' },
    { id: 't6', type: 'debit', category: 'redeem', title: 'Gift Card Redeemed', subtitle: 'Amazon ₹1000', amount: 1000, points: 2000, date: '2025-01-20T11:30:00Z', status: 'success' },
];

const MOCK_SCANS: QRScan[] = [
    { id: 's1', qrCode: 'QR001', productName: 'Asian Paints Premium Emulsion 10L', pointsEarned: 500, scannedAt: '2025-02-20T10:30:00Z', status: 'success', type: 'sales' },
    { id: 's2', qrCode: 'QR002', productName: 'Berger Paints Luxury Silk', pointsEarned: 350, scannedAt: '2025-02-18T14:15:00Z', status: 'success', type: 'sales' },
    { id: 's3', qrCode: 'QR003', productName: 'Nerolac Impressions HD', pointsEarned: 420, scannedAt: '2025-01-28T16:45:00Z', status: 'success', type: 'sales' },
];

export const useHistoryStore = create<HistoryState>()((set) => ({
    transactions: MOCK_TRANSACTIONS,
    scans: MOCK_SCANS,
    addTransaction: (t) => set(s => ({ transactions: [t, ...s.transactions] })),
    addScan: (scan) => set(s => ({ scans: [scan, ...s.scans] })),
}));

// ===== CASHBACK REQUEST STORE =====
export interface CashbackRequest {
    id: string;
    productCode: string;
    productName: string;
    cashbackAmount: number;
    customerName: string;
    mobileNumber: string;
    upiId: string;
    status: 'pending' | 'approved' | 'paid' | 'rejected';
    submittedAt: string;
    tenantId: string;
}

interface CashbackState {
    requests: CashbackRequest[];
    addRequest: (req: Omit<CashbackRequest, 'id' | 'submittedAt' | 'status'>) => void;
    updateStatus: (id: string, status: CashbackRequest['status']) => void;
}

const MOCK_CASHBACK: CashbackRequest[] = [
    { id: 'cb1', productCode: 'AP-001', productName: 'Asian Paints Premium Emulsion 10L', cashbackAmount: 120, customerName: 'Amit Verma', mobileNumber: '9876543210', upiId: 'amit@paytm', status: 'paid', submittedAt: '2025-02-21T10:30:00Z', tenantId: 'tenant-001' },
    { id: 'cb2', productCode: 'BP-002', productName: 'Berger Paints Silk 4L', cashbackAmount: 80, customerName: 'Priya Singh', mobileNumber: '8765432109', upiId: 'priya@ybl', status: 'approved', submittedAt: '2025-02-22T14:20:00Z', tenantId: 'tenant-001' },
    { id: 'cb3', productCode: 'NP-003', productName: 'Nerolac Impressions HD 1L', cashbackAmount: 50, customerName: 'Ravi Kumar', mobileNumber: '7654321098', upiId: 'ravi@oksbi', status: 'pending', submittedAt: '2025-02-23T09:15:00Z', tenantId: 'tenant-001' },
];

export const useCashbackStore = create<CashbackState>()(
    persist(
        (set) => ({
            requests: MOCK_CASHBACK,
            addRequest: (req) => set(s => ({
                requests: [{
                    ...req,
                    id: `cb${Date.now()}`,
                    status: 'pending' as const,
                    submittedAt: new Date().toISOString(),
                }, ...s.requests]
            })),
            updateStatus: (id, status) => set(s => ({
                requests: s.requests.map(r => r.id === id ? { ...r, status } : r)
            })),
        }),
        { name: 'loyalty-cashback' }
    )
);

// ===== GLOBAL TENANT STORE (persisted — admin creates tenants here) =====
interface TenantStoreState {
    tenants: TenantConfig[];
    addTenant: (t: TenantConfig) => void;
    removeTenant: (id: string) => void;
    getTenantBySubdomain: (sub: string) => TenantConfig | undefined;
}

export const useTenantStore = create<TenantStoreState>()(
    persist(
        (set, get) => ({
            tenants: MOCK_TENANTS,
            addTenant: (t) => set(s => ({ tenants: [...s.tenants, t] })),
            removeTenant: (id) => set(s => ({ tenants: s.tenants.filter(t => t.id !== id) })),
            getTenantBySubdomain: (sub) => get().tenants.find(t => t.subdomain === sub),
        }),
        { name: 'loyalty-tenants' }
    )
);
