
'use client';

import { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { MessageSquare, Send, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/types';
import { getInquirySuggestion } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import AuthDialog from '../auth/auth-dialog';

type ContactFactoryDialogProps = {
  product: Product;
};

export default function ContactFactoryDialog({ product }: ContactFactoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { user } = useUser();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      getInquirySuggestion(product).then((res) => {
        setSuggestion(res);
        setIsLoading(false);
      });
    }
  }, [isOpen, product]);

  const handleUseSuggestion = () => {
    setMessage(suggestion);
  };
  
  const handleSend = () => {
    if (!user) {
      setIsAuthDialogOpen(true);
      return;
    }

    if (!message.trim()) {
        toast({
            title: 'Message is empty',
            description: 'Please write a message before sending.',
            variant: 'destructive'
        });
        return;
    }
    toast({
        title: 'Inquiry Sent!',
        description: 'The factory has been notified of your inquiry.',
    });
    setIsOpen(false);
    setMessage('');
  }

  return (
    <>
      <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="flex-1">
            <MessageSquare className="mr-2 h-5 w-5" />
            Contact Factory
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="font-headline">Contact {product.factory.name}</DialogTitle>
            <DialogDescription>
              Send an inquiry about "{product.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="message">Your Inquiry</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
              />
            </div>
            {isLoading ? (
              <div className="space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
              </div>
            ) : (
              <div className="p-3 bg-secondary/50 rounded-md border border-dashed">
                  <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span>AI-Powered Suggestion</span>
                      </p>
                      <Button variant="ghost" size="sm" onClick={handleUseSuggestion}>Use Suggestion</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{suggestion}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSend}>
              <Send className="mr-2 h-4 w-4" />
              Send Inquiry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
