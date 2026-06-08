export interface ShippingAddress {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  reference: string;
}

export interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  address: ShippingAddress;
}
