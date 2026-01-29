'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';

export default function ManageProductsHubPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-headline text-3xl font-bold mb-6">Manage Your Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/products/add" className="block">
          <Card className="hover:bg-muted/50 hover:border-primary transition-all h-full flex flex-col">
            <CardHeader className="flex-row items-center gap-4">
              <PlusCircle className="w-8 h-8 text-primary" />
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>List a new by-product on the marketplace by filling out the product details form.</CardDescription>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/dashboard/products/manage" className="block">
          <Card className="hover:bg-muted/50 hover:border-primary transition-all h-full flex flex-col">
            <CardHeader className="flex-row items-center gap-4">
                <Pencil className="w-8 h-8 text-primary" />
                <CardTitle>Modify Products</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>View your product listings to edit details, update pricing, change images, and manage stock.</CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/products/remove" className="block">
          <Card className="hover:bg-muted/50 hover:border-destructive/80 transition-all h-full flex flex-col">
            <CardHeader className="flex-row items-center gap-4">
              <Trash2 className="w-8 h-8 text-destructive" />
              <CardTitle>Remove Products</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>View your product listings to permanently remove items from the marketplace.</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
