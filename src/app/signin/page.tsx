
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { initiateGoogleSignIn } from '@/firebase/non-blocking-login';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
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

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [googleErrorDialogOpen, setGoogleErrorDialogOpen] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
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

    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Signed In Successfully!",
          description: "Welcome back! Redirecting you to the marketplace.",
        });

        // The onAuthStateChanged listener will handle the redirect.
        router.push('/');
    } catch(error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            setIsErrorDialogOpen(true);
        } else {
            toast({
                title: "Sign In Failed",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive"
            });
        }
    } finally {
        setIsSubmitting(false);
    }
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
            <CardTitle className="text-2xl font-headline">Sign In</CardTitle>
            <CardDescription>
              Enter your email below to sign in to your account.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignIn}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing In..." : "Sign In"}
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
                    Sign in with Google
                </Button>
              <div className="text-sm">
                  <Link href="#" className="underline hover:text-primary">
                      Forgot your password?
                  </Link>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="underline hover:text-primary">
                  Sign Up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      <AlertDialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign In Failed</AlertDialogTitle>
            <AlertDialogDescription>
              The email or password you entered is incorrect. Please check your
              details and try again, or sign up for a new account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Retry</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/signup')}>
              Sign Up
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
