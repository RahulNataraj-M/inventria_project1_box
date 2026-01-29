
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  CreditCard,
  User,
  Loader2,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import AuthDialog from '@/components/auth/auth-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      setIsAuthDialogOpen(true);
    }
    if (!isUserLoading && user) {
      setIsAuthDialogOpen(false);
    }
  }, [user, isUserLoading]);

  // Early return for loading state - blocks all UI
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // Early return for unauthenticated user - blocks all UI
  if (!user) {
    return (
      <>
        <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        <div className="flex h-screen w-full items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Access Restricted</CardTitle>
              <CardDescription>
                You must be signed in to view the seller dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={() => setIsAuthDialogOpen(true)}>
                Sign In / Sign Up
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Navigation items for the authenticated user
  const navItems = [
    { href: '/dashboard', label: 'Analytics', icon: LayoutDashboard },
    { href: '/dashboard/products', label: 'Manage Products', icon: Package },
    { href: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/dashboard/payment-methods', label: 'Payment Methods', icon: CreditCard },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
  ];

  // Render dashboard only if authenticated
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar
          collapsible="icon"
          className="hidden md:flex flex-col border-r"
        >
          <SidebarHeader className="p-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="w-6 h-6 text-primary" />
              <span className="font-headline font-semibold text-lg group-data-[collapsible=icon]:hidden">
                Dashboard
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="flex-1 p-4">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/">
                  <SidebarMenuButton tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
