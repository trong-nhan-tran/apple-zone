import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import * as React from "react";
import { Plus, Minus, Search, ShoppingBag, X } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

// Product type for order
type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
};

// Order item type
type OrderItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

// Sample products (in real app, would come from API)
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "iPhone 15 Pro",
    price: 35990000,
    image: "/images/iphone15pro.jpg",
  },
  {
    id: "p2",
    name: "iPhone 15",
    price: 25990000,
    image: "/images/iphone15.jpg",
  },
  {
    id: "p3",
    name: "MacBook Air M2",
    price: 29990000,
    image: "/images/macbookair.jpg",
  },
  {
    id: "p4",
    name: 'iPad Pro 13"',
    price: 24990000,
    image: "/images/ipadpro.jpg",
  },
  {
    id: "p5",
    name: "Apple Watch Series 9",
    price: 11990000,
    image: "/images/watch9.jpg",
  },
  {
    id: "p6",
    name: "AirPods Pro 2",
    price: 6790000,
    image: "/images/airpodspro.jpg",
  },
];

export function AddOrderModal({ open, setOpen }: Props) {
  // Customer info
  const [customerName, setCustomerName] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [shippingAddress, setShippingAddress] = React.useState("");

  // Payment method
  const [paymentMethod, setPaymentMethod] = React.useState<"COD" | "Banking">(
    "COD"
  );

  // Order items
  const [orderItems, setOrderItems] = React.useState<OrderItem[]>([]);

  // Product search and adding
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<Product[]>([]);
  const [showProductSearch, setShowProductSearch] = React.useState(false);

  // Calculate order total
  const orderTotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Search products
  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = SAMPLE_PRODUCTS.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setSearchResults(results);
  }, [searchQuery]);

  // Add product to order
  const addProduct = (product: Product) => {
    // Check if product already exists in order
    const existingItemIndex = orderItems.findIndex(
      (item) => item.productId === product.id
    );

    if (existingItemIndex >= 0) {
      // Increase quantity if product already in order
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += 1;
      setOrderItems(updatedItems);
    } else {
      // Add new product to order
      const newItem: OrderItem = {
        id: `item-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      };
      setOrderItems([...orderItems, newItem]);
    }

    // Clear search
    setSearchQuery("");
    setSearchResults([]);
    setShowProductSearch(false);
  };

  // Update item quantity
  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is zero or less
      removeItem(itemId);
      return;
    }

    setOrderItems(
      orderItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Remove item from order
  const removeItem = (itemId: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== itemId));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (!customerName.trim()) {
      alert("Vui lòng nhập tên khách hàng");
      return;
    }

    if (!customerPhone.trim()) {
      alert("Vui lòng nhập số điện thoại khách hàng");
      return;
    }

    if (!shippingAddress.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    if (orderItems.length === 0) {
      alert("Vui lòng thêm ít nhất một sản phẩm vào đơn hàng");
      return;
    }

    // Create order data
    const orderData = {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
      items: orderItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: orderTotal,
      status: "processing" as const,
      orderDate: new Date(),
    };

    console.log("Submitting order:", orderData);

    // Here you would send the data to your API
    // After successful submission:
    setOpen(false);

    // Reset form
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setShippingAddress("");
    setPaymentMethod("COD");
    setOrderItems([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-2/3 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo đơn hàng mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin khách hàng</h3>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="customerName" className="block mb-1">
                    Họ tên khách hàng
                  </Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="customerEmail" className="block mb-1">
                    Email
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="customerPhone" className="block mb-1">
                    Số điện thoại
                  </Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0901234567"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="shippingAddress" className="block mb-1">
                    Địa chỉ giao hàng
                  </Label>
                  <Textarea
                    id="shippingAddress"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    required
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="block mb-3">Phương thức thanh toán</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) =>
                      setPaymentMethod(value as "COD" | "Banking")
                    }
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="COD" id="payment-cod" />
                      <Label htmlFor="payment-cod">Tiền mặt (COD)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Banking" id="payment-banking" />
                      <Label htmlFor="payment-banking">Chuyển khoản</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Sản phẩm</h3>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowProductSearch(true)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Thêm sản phẩm
                </Button>
              </div>

              {/* Product search dropdown */}
              {showProductSearch && (
                <div className="border rounded-md p-3 space-y-3 relative">
                  <div className="flex">
                    <div className="relative flex-1">
                      <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                        autoFocus
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => {
                        setShowProductSearch(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="border rounded-md max-h-[200px] overflow-y-auto">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center space-x-3 p-2 hover:bg-muted cursor-pointer"
                          onClick={() => addProduct(product)}
                        >
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(product.price)}
                            </div>
                          </div>
                          <Button type="button" size="sm" variant="ghost">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchQuery && searchResults.length === 0 && (
                    <div className="py-2 text-center text-muted-foreground">
                      Không tìm thấy sản phẩm
                    </div>
                  )}
                </div>
              )}

              {/* Cart items */}
              <div className="border rounded-md">
                {orderItems.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Chưa có sản phẩm nào trong đơn hàng
                  </div>
                ) : (
                  <div className="divide-y">
                    {orderItems.map((item) => (
                      <div key={item.id} className="p-3 flex items-center">
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center mr-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(item.price)}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() =>
                              updateItemQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>

                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItemQuantity(
                                item.id,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-14 h-7 text-center"
                            min="1"
                          />

                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            className="h-7 w-7"
                            onClick={() =>
                              updateItemQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>

                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="p-3 flex justify-between items-center bg-muted/50">
                      <div className="font-medium">Tổng cộng:</div>
                      <div className="font-bold text-lg">
                        {formatCurrency(orderTotal)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Huỷ
            </Button>
            <Button type="submit">Tạo đơn hàng</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
