
import { orders } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Package, Truck, Home } from 'lucide-react';

type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export default function MyOrdersPage() {

  // We'll simulate showing orders for the logged-in user.
  // In a real app, this would be fetched from Firestore based on user ID.
  const myOrders = orders.filter(o => o.customerName === 'John Doe' || o.customerName === 'Mary Johnson');

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return { variant: 'outline', progress: 25, label: 'Order Confirmed' };
      case 'Shipped':
        return { variant: 'secondary', progress: 65, label: 'In Transit' };
      case 'Delivered':
        return { variant: 'default', progress: 100, label: 'Delivered' };
      case 'Cancelled':
        return { variant: 'destructive', progress: 0, label: 'Cancelled' };
      default:
        return { variant: 'default', progress: 0, label: 'Unknown' };
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-headline text-3xl font-bold mb-6">My Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Order History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {myOrders.length > 0 ? (
            myOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                    <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4">
                            <div className="grid gap-0.5">
                                <p className="font-semibold">Order ID: <span className="font-normal text-muted-foreground">{order.id}</span></p>
                                <p className="text-sm text-muted-foreground">Date: {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Total: ₹{order.total.toFixed(2)}</span>
                                <Badge variant={statusInfo.variant}>{order.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="mb-6">
                                <h3 className="font-semibold mb-1">{order.productName}</h3>
                                <p className="text-muted-foreground">Status: {statusInfo.label}</p>
                            </div>
                            {order.status !== 'Cancelled' && (
                                <div>
                                    <Progress value={statusInfo.progress} className="w-full h-2 mb-2" />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <div className={cn("flex flex-col items-center", statusInfo.progress >= 25 && "text-primary font-medium")}>
                                            <Package className="w-4 h-4 mb-1" />
                                            <span>Confirmed</span>
                                        </div>
                                        <div className={cn("flex flex-col items-center", statusInfo.progress >= 65 && "text-primary font-medium")}>
                                            <Truck className="w-4 h-4 mb-1" />
                                            <span>Shipped</span>
                                        </div>
                                        <div className={cn("flex flex-col items-center", statusInfo.progress >= 100 && "text-primary font-medium")}>
                                            <Home className="w-4 h-4 mb-1" />
                                            <span>Delivered</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })
          ) : (
             <div className="text-center py-12 text-muted-foreground">
                <p>You haven't placed any orders yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
