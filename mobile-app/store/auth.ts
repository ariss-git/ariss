import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type UserType = 'DEALER' | 'TECHNICIAN' | 'BACKOFFICE';

interface Address {
  pncd: string;
  loc: string;
  dst: string;
  stcd: string;
  adr: string;
}

interface BillingAddress extends Address {
  st: string;
}

interface AuthState {
  email: string;
  phone: string;
  otp: string;
  userType: UserType;
  token: string | null;
  firstName: string;
  lastName: string;
  gstin: string;
  shippingAddress?: Address | null;
  businessName?: string;
  billingAddress?: BillingAddress | null;
  dealerId: string;

  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
  setOtp: (otp: string) => void;
  setUserType: (userType: UserType) => void;
  setToken: (token: string | null) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setGstin: (gstin: string) => void;
  setShippingAddress: (address: Address | null) => void;
  setBusinessName: (name: string) => void;
  setBillingAddress: (address: BillingAddress | null) => void;
  setDealerId: (dealerId: string) => void;
  setProfileData: (profile: any) => void; // Add profile data setter
}

export const useAuthStore = create<AuthState>((set) => ({
  email: '',
  phone: '',
  otp: '',
  userType: 'DEALER',
  token: null,
  firstName: '',
  lastName: '',
  gstin: '',
  shippingAddress: null,
  businessName: '',
  billingAddress: null,
  dealerId: '',

  setEmail: (email) => set({ email }),
  setPhone: (phone) => set({ phone }),
  setOtp: (otp) => set({ otp }),
  setUserType: (userType) => set({ userType }),

  setToken: async (token) => {
    if (token) {
      await AsyncStorage.setItem('authToken', token);
    } else {
      await AsyncStorage.removeItem('authToken');
    }
    set({ token });
  },

  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    set({
      email: '',
      phone: '',
      otp: '',
      userType: 'DEALER',
      token: null,
      firstName: '',
      lastName: '',
      gstin: '',
      shippingAddress: null,
      businessName: '',
      billingAddress: null,
      dealerId: '',
    });
  },

  loadToken: async () => {
    const storedToken = await AsyncStorage.getItem('authToken');
    if (storedToken) {
      set({ token: storedToken });
    }
  },

  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setGstin: (gstin) => set({ gstin }),
  setShippingAddress: (shippingAddress) => set({ shippingAddress }),
  setBusinessName: (businessName) => set({ businessName }),
  setBillingAddress: (billingAddress) => set({ billingAddress }),
  setDealerId: (dealerId) => set({ dealerId }),

  setProfileData: (profile) => {
    set({
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.email,
      phone: profile.phone,
      gstin: profile.gstin || '',
      shippingAddress: profile.shipping_address || null,
      businessName: profile.business_name || '',
      billingAddress: profile.billing_address || null,
      dealerId: profile.dealer_id || '',
    });
  },
}));
