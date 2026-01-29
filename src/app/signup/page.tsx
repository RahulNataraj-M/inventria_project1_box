
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/firebase';
import { initiateEmailSignUp, initiateGoogleSignIn } from '@/firebase/non-blocking-login';
import { updateProfile } from 'firebase/auth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.854 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l-2.333 2.333c-.933-.853-2.133-1.467-3.573-1.467-3.067 0-5.56 2.347-5.56 5.253s2.493 5.253 5.56 5.253c3.467 0 4.933-2.4 5.2-3.6h-5.2z" fill="currentColor"></path>
    </svg>
)

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleErrorDialogOpen, setGoogleErrorDialogOpen] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!auth) {
        toast({ title: "Auth not ready", description: "Firebase Auth is not available.", variant: "destructive"});
        setIsSubmitting(false);
        return;
    }

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

    initiateEmailSignUp(auth, email, password, (userCred) => {
        // On success
        if(userCred.user) {
            updateProfile(userCred.user, { displayName: name });
        }
        toast({
            title: "Account Created!",
            description: "Welcome to Box. You are now being redirected.",
        });

        setTimeout(() => {
            router.push('/');
            setIsSubmitting(false);
        }, 2000);

    }, onSignUpError);

  };

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    if (!auth) {
        toast({ title: "Auth not ready", description: "Firebase Auth is not available.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    initiateGoogleSignIn(auth, 
        (userCred) => { // onSuccess
            toast({
                title: "Signed In Successfully!",
                description: "Welcome! Redirecting you to the marketplace.",
            });
            router.push('/');
        }, 
        (error) => { // onError
            if (error.code === 'auth/unauthorized-domain' || error.code === 'auth/operation-not-allowed') {
                setGoogleErrorDialogOpen(true);
            } else {
                toast({
                    title: "Google Sign-In Failed",
                    description: error.message || "An unexpected error occurred. Please try again.",
                    variant: "destructive"
                });
            }
            setIsSubmitting(false);
        }
    );
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm animate-fadeIn">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>
            Join Box to start buying and selling industrial by-products.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={8} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
            </div>
            <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign up with Google
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/signin" className="underline hover:text-primary">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
    <AlertDialog open={googleErrorDialogOpen} onOpenChange={setGoogleErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Google Sign-In Not Enabled</AlertDialogTitle>
            <AlertDialogDescription>
              To use Google Sign-In, you need to enable it in your Firebase project console. Navigate to Authentication &gt; Sign-in method, and add Google as a new provider.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setGoogleErrorDialogOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
