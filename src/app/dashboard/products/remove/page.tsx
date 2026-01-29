
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/dashboard/product-table";
import { ArrowLeft } from "lucide-react";
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import type { Product } from '@/lib/types';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function RemoveProductListPage() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();

    // Create a memoized query to fetch only the products for the current user.
    const userProductsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'products'), where('factory.id', '==', user.uid));
    }, [firestore, user]);

    // useCollection now directly returns the user's products.
    const { data: userProducts, isLoading: productsLoading } = useCollection<Product>(userProductsQuery);

    const isLoading = isUserLoading || productsLoading;

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-4">
                    <Link href="/dashboard/products">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="font-headline text-3xl font-bold">Remove Your Product Listings</h1>
                </div>
            </div>
            {isLoading ? (
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            ) : (
                <ProductTable data={userProducts || []} viewMode="remove" />
            )}
        </div>
    );
}
