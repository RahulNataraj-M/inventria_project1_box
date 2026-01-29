
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2, Save } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productRef = useMemoFirebase(() => {
    if (!firestore || !productId) return null;
    return doc(firestore, 'products', productId);
  }, [firestore, productId]);

  const { data: productData, isLoading: isProductLoading } = useDoc<Product>(productRef);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      priceUnit: 'ton',
      quantity: 0,
      companyRegistrationNumber: '',
      license: '',
      details: '',
    },
  });

  useEffect(() => {
    if (productData) {
      form.reset(productData);
    }
  }, [productData, form]);

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    if (!firestore || !user || !productRef || !productData) {
      toast({ title: 'Error', description: 'Could not save product. Please try again.', variant: 'destructive' });
      setIsSubmitting(false);
      return;
    }
    
    if (user.uid !== productData?.factory.id) {
       toast({ title: 'Authorization Error', description: 'You can only edit your own products.', variant: 'destructive' });
       setIsSubmitting(false);
       return;
    }

    try {
      await setDoc(productRef, data, { merge: true });
      toast({
        title: 'Product Updated!',
        description: `${data.name} has been successfully updated.`,
      });
      router.push('/dashboard/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Update Failed',
        description: 'There was an error saving your changes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isProductLoading) {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/2" />
        </div>
    )
  }

  if (!productData) {
      return (
          <div className="p-8 text-center">
              <h1 className="text-2xl font-bold">Product Not Found</h1>
              <p>The product you are trying to edit does not exist.</p>
          </div>
      )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-3xl font-bold">Edit Product</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Modify the details for your product listing.</CardDescription>
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
                          <Select onValueChange={field.onChange} value={field.value}>
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
              
              <div className="space-y-8 p-6 border rounded-lg bg-muted/50">
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
                        Saving Changes...
                    </>
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
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
