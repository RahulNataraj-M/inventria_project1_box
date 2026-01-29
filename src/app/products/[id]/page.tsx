

'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products as staticProducts } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowLeft, Star, User, ShoppingCart, Send, PackageX } from 'lucide-react';
import ContactFactoryDialog from '@/components/contact/contact-factory-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BuyNowDialog from '@/components/product/buy-now-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Review, QnaItem, Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import RfqDialog from '@/components/contact/rfq-dialog';
import { useDoc, useCollection, useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useMemoFirebase } from '@/firebase/provider';
import AuthDialog from '@/components/auth/auth-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user: authUser } = useUser();

  const productId = params.id as string;

  const productRef = useMemoFirebase(() => {
    if (!firestore || !productId) return null;
    return doc(firestore, 'products', productId);
  }, [firestore, productId]);

  const { data: productData, isLoading: productLoading } = useDoc<Product>(productRef);

  const reviewsRef = useMemoFirebase(() => {
    if (!productRef) return null;
    return collection(productRef, 'reviews');
  }, [productRef]);

  const { data: reviewsData } = useCollection<Review>(reviewsRef);
  
  const product = useMemo(() => {
    if (productLoading) return undefined; // Still loading, don't decide yet
    if (productData) return productData; // Firestore data takes precedence
    return staticProducts.find(p => p.id === productId); // Fallback to static data
  }, [productData, productLoading, productId]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [qna, setQna] = useState<QnaItem[]>([]);
  
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [newQuestion, setNewQuestion] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  useEffect(() => {
    // This effect now correctly triggers a 404 only after loading is complete and no product is found.
    if (!productLoading && !product) {
      notFound();
    }
  }, [product, productLoading]);

  useEffect(() => {
    if (product) {
      // If firestore returns reviews, use them. Otherwise, fall back to static reviews.
      const determinedReviews = (reviewsData && reviewsData.length > 0) ? reviewsData : (product.reviews || []);
      setReviews(determinedReviews);
      
      setQna([
        {
          id: 'q1',
          question: 'Is this material suitable for outdoor use?',
          answer: 'Yes, this aluminum alloy has excellent corrosion resistance, making it suitable for many outdoor applications, especially if anodized.',
          author: 'Curious Buyer',
        },
        {
          id: 'q2',
          question: 'What is the lead time for a 5-ton order?',
          answer: 'Typically, a 5-ton order has a lead time of 7-10 business days. Please use the "Contact Factory" button to get a more precise quote based on our current production schedule.',
          author: 'Potential Customer',
        }
      ]);
    }
  }, [product, reviewsData]);


  if (product === undefined || productLoading) {
    return (
        <div className="container mx-auto max-w-6xl px-4 py-12">
            <div className="mb-6">
                <Skeleton className="h-6 w-40" />
            </div>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div>
                    <Skeleton className="w-full aspect-video rounded-lg" />
                </div>
                <div className="flex flex-col gap-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <div className="mt-auto pt-8 flex flex-col gap-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (product === null) {
      // This case should be handled by notFound() in the effect, but as a fallback:
      return <div>Product not found.</div>
  }
  
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) {
      setIsAuthDialogOpen(true);
      return;
    }
    if (!reviewsRef) {
        toast({ title: 'Error', description: 'Could not submit review. Database not ready.', variant: 'destructive' });
        return;
    }
    if (newReview.rating > 0 && newReview.comment) {
      const reviewData = {
        author: authUser.displayName || 'Anonymous',
        avatar: authUser.photoURL || '',
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString()
      };
      
      addDocumentNonBlocking(reviewsRef, reviewData);
      
      setNewReview({ rating: 0, comment: '' });
      toast({ title: 'Review Submitted!', description: 'Thank you for your feedback.' });
    } else {
      toast({ title: 'Incomplete Review', description: 'Please provide a rating and a comment.', variant: 'destructive' });
    }
  };
  
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) {
      setIsAuthDialogOpen(true);
      return;
    }
    if (newQuestion) {
      const question: QnaItem = {
        id: `q-${Date.now()}`,
        question: newQuestion,
        answer: 'No answer yet. Be the first to respond!',
        author: authUser.displayName || 'Anonymous Buyer'
      };
      setQna([...qna, question]);
      setNewQuestion('');
      toast({ title: 'Question Posted!', description: 'Your question is now live.' });
    }
  };
  
  const handleAddToCart = () => {
    if (!authUser) {
      setIsAuthDialogOpen(true);
      return;
    }
    addToCart(product);
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <>
    <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Marketplace
            </Link>
        </div>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Carousel className="w-full rounded-lg overflow-hidden border">
            <CarouselContent>
              {product.images.map((img, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={img}
                    alt={`${product.name} image ${index + 1}`}
                    width={800}
                    height={600}
                    className="aspect-video object-cover w-full"
                    data-ai-hint={PlaceHolderImages.find(p => p.imageUrl === img)?.imageHint || 'industrial byproduct'}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
          {product.details && (
            <div className="mt-8">
              <h2 className="font-headline text-xl font-semibold mb-2">
                More About {product.name}
              </h2>
              <ScrollArea className="h-48 w-full rounded-md border p-4 bg-muted/20">
                <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: product.details.replace(/### (.*?)\n/g, '<h3 class="font-semibold text-base mb-2">$1</h3>').replace(/\n/g, '<br />') }} />
              </ScrollArea>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit mb-2">
            {product.category}
          </Badge>
          <h1 className="font-headline text-3xl md:text-4xl font-bold">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            From: <span className="font-medium text-foreground">{typeof product.factory === 'object' && product.factory.name}</span>
          </p>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-primary fill-current' : 'text-muted-foreground/50'}`} />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">({reviews.length} reviews)</span>
          </div>
          

          <p className="mt-4 text-3xl font-bold text-primary">
            ₹{product.price.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground"> / {product.priceUnit}</span>
          </p>

          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="mt-auto pt-8">
            <h2 className="font-headline text-xl font-semibold mb-2">
              Specifications
            </h2>
            <Table>
              <TableBody>
                {product.specifications.map((spec) => (
                  <TableRow key={spec.name}>
                    <TableCell className="font-medium">{spec.name}</TableCell>
                    <TableCell>{spec.value}</TableCell>
                  </TableRow>
                ))}
                {product.quantity !== undefined && (
                    <TableRow>
                        <TableCell className="font-medium">Quantity Available</TableCell>
                        <TableCell>{product.quantity} {product.priceUnit === 'ton' ? 'tons' : product.priceUnit}</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {product.quantity === 0 ? (
                <Button size="lg" className="flex-1" disabled>
                    <PackageX className="mr-2 h-5 w-5" />
                    Out of Stock
                </Button>
            ) : (
                <>
                    <Button variant="outline" size="lg" className="flex-1" onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                    </Button>
                    <BuyNowDialog product={product} />
                </>
            )}
          </div>
           <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <ContactFactoryDialog product={product} />
              <RfqDialog product={product} />
           </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="font-headline text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>What buyers are saying</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 max-h-[500px] overflow-y-auto">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.id} className="flex gap-4">
                                    <Avatar>
                                        <AvatarImage src={review.avatar || undefined} alt={review.author} />
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold">{review.author}</p>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-primary fill-current' : 'text-muted-foreground/50'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center py-4">No reviews yet for this product.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Leave a Review</CardTitle>
                    </CardHeader>
                    <form onSubmit={handleReviewSubmit}>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Your Name</Label>
                                <Input defaultValue={authUser?.displayName || ''} placeholder="Enter your name" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Rating</Label>
                                <div className="flex items-center gap-1" onMouseLeave={() => setHoveredRating(0)}>
                                    {[...Array(5)].map((_, i) => (
                                        <Button 
                                            type="button"
                                            variant="ghost" 
                                            size="icon" 
                                            key={i} 
                                            className="text-muted-foreground hover:text-primary"
                                            onClick={() => setNewReview({...newReview, rating: i + 1})}
                                            onMouseEnter={() => setHoveredRating(i + 1)}
                                        >
                                            <Star className={`w-6 h-6 transition-colors ${(hoveredRating || newReview.rating) > i ? 'text-primary fill-current' : ''}`} />
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="comment">Comment</Label>
                                <Textarea id="comment" placeholder="Share your experience..." rows={4} value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} required />
                            </div>
                            <Button type="submit" className="w-full">
                                <Send className="mr-2 h-4 w-4" />
                                Submit Review
                            </Button>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="font-headline text-2xl font-bold mb-6">Questions &amp; Answers</h2>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Ask a Question</CardTitle>
                </CardHeader>
                <form onSubmit={handleQuestionSubmit}>
                    <CardContent className="space-y-4">
                        <Textarea placeholder="Have a question? Ask the community." value={newQuestion} onChange={e => setNewQuestion(e.target.value)} />
                        <Button type="submit">Post Question</Button>
                    </CardContent>
                </form>
            </Card>
            <Accordion type="single" collapsible className="w-full">
              {qna.map(item => (
                <AccordionItem value={item.id} key={item.id}>
                    <AccordionTrigger className="text-left font-semibold">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                        <p className="font-medium text-foreground mb-2">Answer from community:</p>
                        {item.answer}
                    </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </div>
      </div>
    </div>
    </>
  );
}
