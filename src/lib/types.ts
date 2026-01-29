
import type { LucideIcon } from 'lucide-react';

export type Review = {
    id: string;
    author: string;
    avatar: string;
    rating: number;
    comment: string;
}

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  priceUnit: 'ton' | 'kg';
  currency: 'INR';
  images: string[];
  specifications: {
    name: string;
    value: string;
  }[];
  factory: {
    id: string;
    name: string;
  };
  reviews: Review[];
  license: string;
  companyRegistrationNumber: string;
  verificationDocs?: string[];
  address?: string;
  details?: string;
  quantity?: number;
};

export type Category = {
  id: string;
  name: string;
  icon?: LucideIcon | string; // Allow string for icon name if not using Lucide directly
};


export type Order = {
  id: string;
  productName: string;
  customerName: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
};

export type QnaItem = {
    id: string;
    question: string;
    answer: string;
    author: string;
}
