
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { PackagePlus, Loader2, AlertCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters long'),
  description: z.string().min(20, 'Description must be at least 20 characters long'),
  price: z.coerce.number().positive('Price must be a positive number'),
  priceUnit: z.enum(['ton', 'kg'], { required_error: 'You must select a price unit.' }),
  quantity: z.coerce.number().min(0, 'Quantity must be a non-negative number.'),
  companyRegistrationNumber: z.string().min(5, 'A valid company registration number is required'),
  license: z.string().min(5, 'A valid seller license number is required'),
  details: z.string().min(50, 'Product details must be at least 50 characters long'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      license: '',
      details: '',
      companyRegistrationNumber: '',
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (!firestore || !user) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to sell a product.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    let success = false;
    let newProductData: Product | null = null;
    const productsCollection = collection(firestore, 'products');
    const newProductRef = doc(productsCollection);
    const productId = newProductRef.id;

    try {
        let imageUrl = '';
        try {
            const keywords = data.name.toLowerCase().split(/\s+/).join(',');
            const unsplashUrl = `https://source.unsplash.com/600x400/?${encodeURIComponent(keywords)}`;
            const response = await fetch(unsplashUrl);
            if (response.ok) {
                imageUrl = response.url;
            } else {
                imageUrl = `https://picsum.photos/seed/${encodeURIComponent(data.name)}/600/400`;
            }
        } catch (e) {
            console.error('Failed to fetch image from Unsplash:', e);
            imageUrl = `https://picsum.photos/seed/${encodeURIComponent(data.name)}/600/400`;
        }
    
        newProductData = {
          ...data,
          id: productId,
          images: [imageUrl],
          verificationDocs: [],
          category: 'Newly Added', 
          factory: {
              id: user.uid,
              name: user.displayName || 'My Factory'
          },
          specifications: [
              {name: 'Condition', value: 'By-product'},
          ],
          reviews: [],
          currency: 'INR',
        };
    
        await setDoc(newProductRef, newProductData);

        toast({
          title: 'Product Listed Successfully!',
          description: `${data.name} is now available on the marketplace.`,
        });
        success = true;
        
    } catch (error: any) {
        console.error('Error listing product:', error);

        if (error.code === 'permission-denied' && newProductData) {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: newProductRef.path,
              operation: 'create',
              requestResourceData: newProductData,
              app: firestore.app,
            }));
            toast({
                title: 'Permission Denied',
                description: 'You do not have permission to add a product.',
                variant: 'destructive',
            });
        } else {
             toast({
                title: 'Listing Failed',
                description: 'An unexpected error occurred while listing the product.',
                variant: 'destructive',
            });
        }
    } finally {
        setIsSubmitting(false);
        if (success) {
            router.push('/dashboard/products');
        }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-3xl font-bold">Add a New Product</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Fill out the form below to list a new by-product on the marketplace. All fields are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., High-Grade Steel Offcuts" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 5500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="priceUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ton">per ton</SelectItem>
                              <SelectItem value="kg">per kg</SelectItem>
                            </SelectContent>
                          </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

               <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 50" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Summary</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the material, its source, and potential uses..." {...field} rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Product Details (History, Uses, etc.)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Provide a detailed history, common uses, and any other relevant information about the by-product..." {...field} rows={8} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    The following section requires official documentation for verification.
                  </AlertDescription>
              </Alert>

              <div className="space-y-8 p-6 border rounded-lg">
                 <FormField
                    control={form.control}
                    name="companyRegistrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Registration Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your official company registration number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="license"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seller License / Authorization</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your business or authorization license number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Listing Product...
                    </>
                ) : (
                    <>
                        <PackagePlus className="mr-2" />
                        List Product
                    </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
