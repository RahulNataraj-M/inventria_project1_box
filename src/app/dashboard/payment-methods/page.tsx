
'use client';

import { useState } from 'react';
import { usePayment } from '@/context/payment-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Trash2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PaymentMethodsPage() {
  const { savedCard, saveCard, clearCard } = usePayment();
  const { toast } = useToast();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handleSaveCard = () => {
    if (!cardNumber || !expiry || !cvv) {
      toast({
        title: 'Incomplete Details',
        description: 'Please fill out all card fields.',
        variant: 'destructive',
      });
      return;
    }
    
    // Basic validation
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        toast({ title: 'Invalid Card Number', description: 'Please enter a valid 16-digit card number.', variant: 'destructive'});
        return;
    }
     if (!/^\d{3,4}$/.test(cvv)) {
        toast({ title: 'Invalid CVV', description: 'Please enter a valid 3 or 4-digit CVV.', variant: 'destructive'});
        return;
    }
     if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        toast({ title: 'Invalid Expiry Date', description: 'Please use MM/YY format.', variant: 'destructive'});
        return;
    }

    saveCard({ number: cardNumber, expiry, cvv });
    toast({
      title: 'Card Saved',
      description: 'Your card has been saved for future purchases.',
    });
    // Clear form
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-headline text-3xl font-bold mb-6">Payment Methods</h1>
      <Card>
        <CardHeader>
          <CardTitle>Saved Cards</CardTitle>
          <CardDescription>Manage your saved debit and credit cards.</CardDescription>
        </CardHeader>
        <CardContent>
          {savedCard ? (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-4">
                <CreditCard className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">Card ending in **** {savedCard.number.slice(-4)}</p>
                  <p className="text-sm text-muted-foreground">Expires {savedCard.expiry}</p>
                </div>
              </div>
              <Button variant="destructive" size="icon" onClick={clearCard}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete Card</span>
              </Button>
            </div>
          ) : (
            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="text-xl">Add a New Card</CardTitle>
                    <CardDescription>Your saved card will appear here once you add one.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} maxLength={16} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="XXX" value={cvv} onChange={(e) => setCvv(e.target.value)} maxLength={4} />
                        </div>
                    </div>
                     <Button onClick={handleSaveCard}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Save Card
                    </Button>
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
