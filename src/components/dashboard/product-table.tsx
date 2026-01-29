
"use client"

import * as React from "react"
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import type { Product } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useFirestore } from "@/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

type ProductTableProps = {
  data: Product[];
  viewMode?: 'manage' | 'remove';
}

export function ProductTable({ data, viewMode = 'manage' }: ProductTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete || !firestore) return;
    setIsDeleting(true);
    try {
      const docRef = doc(firestore, 'products', productToDelete.id);
      await deleteDoc(docRef);
      // Note: This does not delete associated images from Firebase Storage.
      // A more robust solution would involve a Cloud Function to handle cleanup.
      toast({
        title: 'Product Deleted',
        description: `"${productToDelete.name}" has been successfully removed.`,
      });
    } catch (error) {
        console.error("Error deleting product: ", error);
        toast({
            title: 'Error',
            description: 'Could not delete the product. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
    }
  };

  return (
    <>
    <Card>
        <CardHeader>
            <CardTitle>Your Product Listings</CardTitle>
        </CardHeader>
        <CardContent>
            {data.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="hidden sm:table-cell">
                              {product.images && product.images.length > 0 && (
                                <Image
                                  alt={product.name}
                                  className="aspect-square rounded-md object-cover"
                                  height="64"
                                  src={product.images[0]}
                                  width="64"
                                />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                            </TableCell>
                            <TableCell>₹{product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.quantity ?? 0} {product.priceUnit}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                {viewMode === 'manage' && (
                                  <Button asChild variant="outline" size="sm">
                                    <Link href={`/dashboard/products/edit/${product.id}`}>
                                      <Pencil className="mr-2 h-4 w-4" />
                                      Modify
                                    </Link>
                                  </Button>
                                )}
                                {viewMode === 'remove' && (
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(product)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Remove
                                    </Button>
                                )}
                              </div>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-semibold">No products listed yet</h3>
                    <p className="text-sm">You have not listed any products to {viewMode === 'manage' ? 'modify' : 'remove'}.</p>
                    {viewMode !== 'manage' && viewMode !== 'remove' && (
                         <Button asChild className="mt-4">
                            <Link href="/dashboard/products/add">Add Your First Product</Link>
                        </Button>
                    )}
                </div>
            )}
        </CardContent>
    </Card>
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product "{productToDelete?.name}" from the marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isDeleting ? 'Deleting...' : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
