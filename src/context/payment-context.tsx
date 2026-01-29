
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
}

interface PaymentContextType {
  savedCard: CardDetails | null;
  saveCard: (card: CardDetails) => void;
  clearCard: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [savedCard, setSavedCard] = useState<CardDetails | null>(null);

  useEffect(() => {
    try {
      const storedCard = localStorage.getItem('savedCard');
      if (storedCard) {
        setSavedCard(JSON.parse(storedCard));
      }
    } catch (error) {
      console.error("Could not parse saved card from localStorage", error);
      localStorage.removeItem('savedCard');
    }
  }, []);

  const saveCard = (card: CardDetails) => {
    setSavedCard(card);
    localStorage.setItem('savedCard', JSON.stringify(card));
  };

  const clearCard = () => {
    setSavedCard(null);
    localStorage.removeItem('savedCard');
  };

  return (
    <PaymentContext.Provider value={{ savedCard, saveCard, clearCard }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
