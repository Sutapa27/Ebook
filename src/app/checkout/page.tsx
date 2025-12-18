"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ShoppingCart, CreditCard, CheckCircle, Trash2 } from "lucide-react";

export default function CheckoutPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [cart, setCart] = useState<any[]>([]);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        cardNumber: "",
        cardName: "",
        expiryDate: "",
        cvv: "",
        address: "",
        city: "",
        zipCode: ""
    });

    useEffect(() => {
        if (!user) {
            router.push("/login");
            return;
        }

        // Load cart from localStorage
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, [user, router]);

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price || 0), 0);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Format card number with spaces
        if (e.target.name === "cardNumber") {
            value = value.replace(/\s/g, "").replace(/(\d{4})/g, "$1 ").trim();
        }

        // Format expiry date
        if (e.target.name === "expiryDate") {
            value = value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").substr(0, 5);
        }

        // Format CVV (only numbers, max 3 digits)
        if (e.target.name === "cvv") {
            value = value.replace(/\D/g, "").substr(0, 3);
        }

        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            // Get user's purchased books
            const purchasedBooks = localStorage.getItem(`purchased-${user?.email}`);
            const purchased = purchasedBooks ? JSON.parse(purchasedBooks) : [];

            // Add cart items to purchased books
            cart.forEach(book => {
                if (!purchased.find((p: any) => p.slug === book.slug)) {
                    purchased.push({
                        ...book,
                        purchaseDate: new Date().toISOString()
                    });
                }
            });

            // Save purchased books
            localStorage.setItem(`purchased-${user?.email}`, JSON.stringify(purchased));

            // Clear cart
            localStorage.removeItem("cart");
            
            // Trigger cart update event
            window.dispatchEvent(new Event("cartUpdated"));

            setProcessing(false);
            setPaymentComplete(true);

            // Redirect to library after 3 seconds
            setTimeout(() => {
                router.push("/my-library");
            }, 3000);
        }, 2000);
    };

    const removeFromCart = (slug: string) => {
        const updatedCart = cart.filter(item => item.slug !== slug);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    if (paymentComplete) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
                <div className="fixed inset-0 -z-10">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-green-500/20 blur-[100px] animate-pulse" />
                </div>

                <GlassPanel intensity="medium" className="p-12 text-center space-y-6 max-w-md mx-4">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-500/20">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                        <p className="text-muted-foreground">Your books have been added to your library</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Redirecting to your library...</p>
                </GlassPanel>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center px-4">
                    <GlassPanel intensity="medium" className="p-12 text-center space-y-6">
                        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                            <p className="text-muted-foreground">Add some books to get started</p>
                        </div>
                        <Button onClick={() => router.push("/")}>Browse Library</Button>
                    </GlassPanel>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[100px] animate-pulse" />
            </div>

            <Header />

            <main className="flex-1 pt-32 pb-16 px-4 md:px-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Order Summary */}
                        <div className="space-y-6">
                            <GlassPanel intensity="medium" className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                                <div className="space-y-4">
                                    {cart.map((book) => (
                                        <div key={book.slug} className="flex justify-between items-start border-b border-white/10 pb-4">
                                            <div className="flex-1 pr-4">
                                                <h3 className="font-medium">{book.title}</h3>
                                                <p className="text-sm text-muted-foreground">{book.author}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-semibold">₹{(book.price || 0).toFixed(2)}</p>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFromCart(book.slug)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>₹{calculateTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tax</span>
                                        <span>₹0.00</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                                        <span>Total</span>
                                        <span>₹{calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </GlassPanel>
                        </div>

                        {/* Payment Form */}
                        <div>
                            <GlassPanel intensity="medium" className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-primary/20">
                                        <CreditCard className="h-6 w-6 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-semibold">Payment Details</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Card Number</label>
                                        <Input
                                            name="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={handleChange}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            required
                                            className="bg-white/50 dark:bg-black/20"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Cardholder Name</label>
                                        <Input
                                            name="cardName"
                                            value={formData.cardName}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required
                                            className="bg-white/50 dark:bg-black/20"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Expiry Date</label>
                                            <Input
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleChange}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                required
                                                className="bg-white/50 dark:bg-black/20"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">CVV</label>
                                            <Input
                                                name="cvv"
                                                type="password"
                                                value={formData.cvv}
                                                onChange={handleChange}
                                                placeholder="123"
                                                maxLength={3}
                                                required
                                                className="bg-white/50 dark:bg-black/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/10">
                                        <h3 className="text-sm font-medium mb-4">Billing Address</h3>
                                        
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Street Address</label>
                                                <Input
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    placeholder="123 Main Street"
                                                    required
                                                    className="bg-white/50 dark:bg-black/20"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">City</label>
                                                    <Input
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleChange}
                                                        placeholder="New York"
                                                        required
                                                        className="bg-white/50 dark:bg-black/20"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">ZIP Code</label>
                                                    <Input
                                                        name="zipCode"
                                                        value={formData.zipCode}
                                                        onChange={handleChange}
                                                        placeholder="10001"
                                                        required
                                                        className="bg-white/50 dark:bg-black/20"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        size="lg"
                                        disabled={processing}
                                    >
                                        {processing ? "Processing..." : `Complete Purchase - ₹${calculateTotal().toFixed(2)}`}
                                    </Button>

                                    <p className="text-xs text-center text-muted-foreground">
                                        This is a demo checkout. No real payment will be processed.
                                    </p>
                                </form>
                            </GlassPanel>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}