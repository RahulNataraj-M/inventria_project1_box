import { products } from '@/lib/data';
import ProductCard from '@/components/product/product-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BuyAgainPage() {
  // Simulate previously bought products - taking first 4 for demo
  const previouslyBought = products.slice(0, 4);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-headline text-3xl font-bold mb-6">Buy Again</h1>
      <Card>
        <CardHeader>
          <CardTitle>Products You've Purchased</CardTitle>
        </CardHeader>
        <CardContent>
          {previouslyBought.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {previouslyBought.map((product, index) => (
                <div key={product.id} className="animate-fadeIn" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>You haven't purchased any products yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
