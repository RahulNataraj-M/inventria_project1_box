
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, IndianRupee, Wallet, ShoppingBag, Trash2 } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { usePayment } from '@/context/payment-context';
import { cn } from '@/lib/utils';

type BuyNowDialogProps = {
  product: Product;
};

export default function BuyNowDialog({ product }: BuyNowDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { toast } = useToast();
  const { savedCard, saveCard, clearCard } = usePayment();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCardDetails, setSaveCardDetails] = useState(false);
  const [upiId, setUpiId] = useState('');

  const handlePurchase = () => {
    if (paymentMethod === 'card' && !savedCard) {
      if (!cardNumber || !expiry || !cvv) {
        toast({
          title: 'Card details incomplete',
          description: 'Please fill in all card details to proceed.',
          variant: 'destructive',
        });
        return;
      }
      if (saveCardDetails) {
        saveCard({ number: cardNumber, expiry, cvv });
      }
    }

    if (paymentMethod === 'upi') {
      if (!upiId.trim()) {
        toast({
          title: 'UPI ID is required',
          description: 'Please enter your UPI ID to proceed.',
          variant: 'destructive',
        });
        return;
      }
    }


    toast({
      title: 'Purchase Simulated!',
      description: `Your order for "${product.name}" has been placed using ${paymentMethod}.`,
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="flex-1">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Buy Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Complete Your Purchase</DialogTitle>
          <DialogDescription>
            You are buying "{product.name}" for ₹{product.price.toFixed(2)} / ton.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-muted-foreground text-sm">
            This is a simulated payment gateway. No real transaction will occur.
          </p>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="grid gap-4">
              <Label
                htmlFor="card"
                className={cn(
                  'flex flex-col gap-4 rounded-md border p-4 hover:bg-accent cursor-pointer [&:has([data-state=checked])]:border-primary'
                )}
              >
                <div className="flex items-center gap-4">
                  <CreditCard />
                  <div className="grid gap-1.5 flex-1">
                    <span className="font-medium">Card</span>
                    <span className="text-sm text-muted-foreground">Pay with Credit or Debit Card</span>
                  </div>
                  <RadioGroupItem value="card" id="card" className="ml-auto" />
                </div>
                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-4 pt-4 border-t">
                    {savedCard ? (
                       <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                            <div>
                                <p className="font-medium">Card ending in {savedCard.number.slice(-4)}</p>
                                <p className="text-sm text-muted-foreground">Expires {savedCard.expiry}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => clearCard()}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry</Label>
                            <Input id="expiry" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="XXX" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="save-card" checked={saveCardDetails} onCheckedChange={(checked) => setSaveCardDetails(!!checked)} />
                          <Label htmlFor="save-card" className="text-sm font-normal">
                            Save card for future purchases
                          </Label>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Label>
              <Label
                htmlFor="upi"
                className={cn("flex flex-col gap-4 rounded-md border p-4 hover:bg-accent cursor-pointer [&:has([data-state=checked])]:border-primary")}
              >
                <div className="flex items-center gap-4">
                    <Wallet />
                    <div className="grid gap-1.5">
                    <span className="font-medium">UPI</span>
                    <span className="text-sm text-muted-foreground">Pay with any UPI app</span>
                    </div>
                    <RadioGroupItem value="upi" id="upi" className="ml-auto" />
                </div>
                {paymentMethod === 'upi' && (
                  <div className="mt-4 space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input id="upi-id" placeholder="yourname@bank" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                    </div>
                  </div>
                )}
              </Label>
              <Label
                htmlFor="cod"
                className="flex items-center gap-4 rounded-md border p-4 hover:bg-accent cursor-pointer [&:has([data-state=checked])]:border-primary"
              >
                <IndianRupee />
                <div className="grid gap-1.5">
                  <span className="font-medium">Cash on Delivery</span>
                  <span className="text-sm text-muted-foreground">Pay when your order arrives</span>
                </div>
                <RadioGroupItem value="cod" id="cod" className="ml-auto" />
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handlePurchase}>
            Confirm Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
