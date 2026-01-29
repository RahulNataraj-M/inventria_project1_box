

'use client';

import Link from 'next/link';
import { LogOut, ShoppingCart, User, LayoutDashboard, CreditCard, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useUser, useAuth } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { signOut } from 'firebase/auth';
import { Logo } from '@/components/logo';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';


export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    if (auth) {
        await signOut(auth);
        router.push('/');
    }
  }

  const navItems = [
    { href: '/', label: 'Marketplace' },
    { href: '/dashboard', label: 'Seller Dashboard' },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo className="h-6 w-6" />
          <span className="font-bold font-headline sm:inline-block">
            Box
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isMounted ? (
            <>
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="relative" onClick={() => router.push('/cart')}>
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {cart.length}
                  </span>
                  )}
                  <span className="sr-only">Cart</span>
              </Button>
              {isUserLoading ? (
                  <Skeleton className="h-8 w-24 rounded-md" />
              ) : user ? (
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                          <Avatar className="h-8 w-8">
                              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                              <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}</AvatarFallback>
                          </Avatar>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              <span>Dashboard</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                              <User className="mr-2 h-4 w-4" />
                              <span>Profile</span>
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => router.push('/dashboard/my-orders')}>
                            <Package className="mr-2 h-4 w-4" />
                            <span>My Orders</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/dashboard/buy-again')}>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            <span>My Purchases</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/dashboard/payment-methods')}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Payment Methods</span>
                        </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleLogout}>
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>Logout</span>
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              ) : (
                  <div className="flex items-center gap-2">
                      <Button variant="ghost" onClick={() => router.push('/signin')}>Sign In</Button>
                      <Button onClick={() => router.push('/signup')}>Sign Up</Button>
                  </div>
              )}
            </>
          ) : (
            <>
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
