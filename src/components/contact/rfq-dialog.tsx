
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Send } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import AuthDialog from '../auth/auth-dialog';

type RfqDialogProps = {
  product: Product;
};

export default function RfqDialog({ product }: RfqDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState<number | ''>('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { user } = useUser();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const handleSendRfq = () => {
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }

    if (!quantity || quantity <= 0) {
      toast({
        title: 'Invalid Quantity',
        description: 'Please enter a quantity greater than zero.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'RFQ Sent!',
      description: `Your request for a quote for ${quantity} tons of "${product.name}" has been sent.`,
    });
    setIsOpen(false);
    setQuantity('');
    setMessage('');
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setQuantity('');
    } else {
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue >= 0) {
        setQuantity(numValue);
      }
    }
  };

  const currentQuantity = typeof quantity === 'number' ? quantity : 0;
  const estimatedPrice = (product.price * currentQuantity).toFixed(2);


  return (
    <>
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="lg" className="flex-1">
            <FileText className="mr-2 h-5 w-5" />
            Request for Quote (RFQ)
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="font-headline">Request for Quote</DialogTitle>
            <DialogDescription>
              Submit a request for a custom quote for "{product.name}" from {product.factory.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="quantity">Quantity (in tons)</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="e.g., 10"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="message-rfq">Additional Message (Optional)</Label>
              <Textarea
                id="message-rfq"
                placeholder="Include any specific requirements, delivery details, or questions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="p-4 bg-secondary/50 rounded-md border">
                <p className="text-sm font-semibold">Total Estimated Price</p>
                <p className="text-lg font-bold text-primary">₹{estimatedPrice}</p>
                <p className="text-xs text-muted-foreground">This is an estimate. The final price will be confirmed by the seller in their quote.</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSendRfq}>
              <Send className="mr-2 h-4 w-4" />
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
