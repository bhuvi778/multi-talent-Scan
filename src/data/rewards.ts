import { Reward } from '@/types';

export const MOCK_REWARDS: Reward[] = [
    // === CASH ===
    { id: 'r1', category: 'cash', title: '₹100 Cashback', description: 'Instant UPI transfer', pointsRequired: 200, value: 100, image: '💵', stock: 999, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r2', category: 'cash', title: '₹250 Cashback', description: 'Instant UPI transfer', pointsRequired: 500, value: 250, image: '💴', stock: 999, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r3', category: 'cash', title: '₹500 Cashback', description: 'Instant UPI transfer', pointsRequired: 1000, value: 500, image: '💶', stock: 999, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r4', category: 'cash', title: '₹1000 Cashback', description: 'Instant UPI transfer', pointsRequired: 2000, value: 1000, image: '💷', stock: 999, isAvailable: true, tenantId: 'tenant-001' },

    // === GIFT CARDS ===
    { id: 'r5', category: 'gift-cards', title: 'Amazon ₹500', description: 'Amazon shopping gift card', pointsRequired: 1100, value: 500, image: '🛒', stock: 50, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r6', category: 'gift-cards', title: 'Flipkart ₹500', description: 'Flipkart shopping gift card', pointsRequired: 1100, value: 500, image: '🛍️', stock: 50, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r7', category: 'gift-cards', title: 'Swiggy ₹300', description: 'Food delivery gift card', pointsRequired: 700, value: 300, image: '🍕', stock: 100, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r8', category: 'gift-cards', title: 'BookMyShow ₹500', description: 'Movie & events gift card', pointsRequired: 1100, value: 500, image: '🎬', stock: 40, isAvailable: true, tenantId: 'tenant-001' },

    // === ELECTRONICS ===
    { id: 'r9', category: 'electronics', title: 'JBL GO Speaker', description: 'Portable bluetooth speaker', pointsRequired: 8000, value: 1999, image: '🔊', stock: 20, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r10', category: 'electronics', title: 'boAt Earphones', description: 'Wireless earbuds 30hr battery', pointsRequired: 5000, value: 1299, image: '🎧', stock: 30, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r11', category: 'electronics', title: 'Power Bank 20000mAh', description: 'Fast charging power bank', pointsRequired: 6000, value: 1499, image: '🔋', stock: 25, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r12', category: 'electronics', title: 'Smart Watch', description: 'Fitness & health tracking', pointsRequired: 12000, value: 2999, image: '⌚', stock: 15, isAvailable: true, tenantId: 'tenant-001' },

    // === WHITE GOODS ===
    { id: 'r13', category: 'white-goods', title: 'Mixer Grinder', description: '750W mixer grinder 3 jars', pointsRequired: 15000, value: 3499, image: '🥤', stock: 10, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r14', category: 'white-goods', title: 'Electric Kettle', description: '1.5L stainless steel kettle', pointsRequired: 4000, value: 899, image: '☕', stock: 30, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r15', category: 'white-goods', title: 'Air Fryer', description: '4L digital air fryer', pointsRequired: 18000, value: 4999, image: '🍳', stock: 8, isAvailable: true, tenantId: 'tenant-001' },

    // === BEAUTY ===
    { id: 'r16', category: 'beauty', title: 'Lakme Gift Set', description: 'Premium cosmetics hamper', pointsRequired: 3000, value: 799, image: '💄', stock: 40, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r17', category: 'beauty', title: "L'Oreal Hair Kit", description: 'Complete hair care kit', pointsRequired: 2500, value: 649, image: '💆', stock: 35, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r18', category: 'beauty', title: 'Perfume Collection', description: 'Luxury fragrance set', pointsRequired: 5000, value: 1299, image: '🌸', stock: 20, isAvailable: true, tenantId: 'tenant-001' },

    // === HOLIDAYS ===
    { id: 'r19', category: 'holidays', title: 'Goa Weekend Trip', description: '2N/3D couple package', pointsRequired: 50000, value: 12999, image: '🏖️', stock: 5, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r20', category: 'holidays', title: 'Manali Getaway', description: '3N/4D hill station package', pointsRequired: 60000, value: 14999, image: '🏔️', stock: 5, isAvailable: true, tenantId: 'tenant-001' },
    { id: 'r21', category: 'holidays', title: 'Hotel Voucher ₹5000', description: 'Premium hotel stay voucher', pointsRequired: 20000, value: 5000, image: '🏨', stock: 15, isAvailable: true, tenantId: 'tenant-001' },
];

export const REWARD_CATEGORIES = [
    { id: 'cash', label: 'Cash', icon: '💰', color: '#43E97B', gradient: 'linear-gradient(135deg, #43E97B, #38F9D7)' },
    { id: 'gift-cards', label: 'Gift Cards', icon: '🎁', color: '#6C63FF', gradient: 'linear-gradient(135deg, #6C63FF, #a855f7)' },
    { id: 'electronics', label: 'Electronics', icon: '📱', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
    { id: 'white-goods', label: 'White Goods', icon: '🏠', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
    { id: 'beauty', label: 'Beauty', icon: '💄', color: '#FF6584', gradient: 'linear-gradient(135deg, #FF6584, #f472b6)' },
    { id: 'holidays', label: 'Holidays', icon: '✈️', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)' },
];
