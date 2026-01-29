
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import {
  initiateEmailSignUp,
  initiateEmailSignIn,
  initiateGoogleSignIn,
} from '@/firebase/non-blocking-login';
import { updateProfile } from 'firebase/auth';

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.854 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l-2.333 2.333c-.933-.853-2.133-1.467-3.573-1.467-3.067 0-5.56 2.347-5.56 5.253s2.493 5.253 5.56 5.253c3.467 0 4.933-2.4 5.2-3.6h-5.2z" fill="currentColor"></path>
    </svg>
)

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { toast } = useToast();
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const onSignInError = (error: any) => {
        let description = "Could not sign you in. Please check your credentials and try again.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            description = "Invalid email or password. Please try again.";
        }
        toast({
            title: "Sign In Failed",
            description: description,
            variant: "destructive"
        });
        setIsSubmitting(false);
    };
    
    if (!auth) {
        toast({ title: 'Auth service not available.', variant: 'destructive'});
        setIsSubmitting(false);
        return;
    };

    initiateEmailSignIn(auth, email, password, () => {
        toast({
            title: 'Sign In Successful!',
            description: 'Welcome back.',
        });
        setTimeout(() => {
            onOpenChange(false);
            setIsSubmitting(false);
        }, 1000);
    }, onSignInError);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    const onSignUpError = (error: any) => {
        let description = "An unexpected error occurred during sign up.";
        if (error.code === 'auth/email-already-in-use') {
            description = "This email is already registered. Please sign in instead.";
        } else if (error.code === 'auth/weak-password') {
            description = "The password is too weak. Please use at least 8 characters.";
        }
        toast({
            title: "Sign Up Failed",
            description,
            variant: "destructive",
        });
        setIsSubmitting(false);
    };

    if (!auth) {
        toast({ title: 'Auth service not available.', variant: 'destructive' });
        setIsSubmitting(false);
        return;
    }
      
    initiateEmailSignUp(auth, email, password, (userCred) => {
        if (userCred.user) {
            updateProfile(userCred.user, { displayName: name });
        }
        toast({
            title: 'Sign Up Successful!',
            description: 'Welcome! You are now signed in.',
        });

        setTimeout(() => {
            onOpenChange(false);
            setIsSubmitting(false);
        }, 1000);
    }, onSignUpError);
  };

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    if (!auth) {
        toast({ title: "Auth service not available.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    initiateGoogleSignIn(auth, (userCred) => {
        toast({
            title: 'Sign In Successful!',
            description: 'Welcome!',
        });
        setTimeout(() => {
            onOpenChange(false);
            setIsSubmitting(false);
        }, 1000);
    }, (error) => {
        let description = "Could not sign you in with Google. Please try again.";
        if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed') {
            description = 'Google Sign-In is not enabled for this project. Please contact an administrator.';
        }
        toast({
            title: "Google Sign-In Failed",
            description,
            variant: "destructive"
        });
        setIsSubmitting(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <DialogHeader className="p-6 pb-0 text-center">
            <DialogTitle>Authentication Required</DialogTitle>
            <DialogDescription>
                Please sign in or create an account to continue.
            </DialogDescription>
        </DialogHeader>
        <div className="px-6 pt-6">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Continue with Google
            </Button>
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or
                    </span>
                </div>
            </div>
        </div>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={handleSignIn}>
              <Card className="border-none shadow-none">
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input id="signin-email" name="email" type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input id="signin-password" name="password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={handleSignUp}>
              <Card className="border-none shadow-none">
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input id="signup-name" name="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" name="email" type="email" placeholder="m@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" name="password" type="password" required minLength={8} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
