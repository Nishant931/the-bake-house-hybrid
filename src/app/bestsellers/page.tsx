import { api } from "@/lib/api";
import { ProductCard } from "@/components/features/ProductCard";
import { Separator } from "@/components/ui/separator";

export default async function BestsellersPage() {
  let products = [];
  
  try {
    products = await api.getProducts();
    // For now, just taking the first 20 as bestsellers
    products = products.slice(0, 20);
  } catch (error) {
    console.error("Failed to fetch bestsellers:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-8 text-center">
        <h1 className="text-4xl font-bold">India Loves: Our Bestsellers</h1>
        <p className="text-muted-foreground text-lg">
          The most popular treats chosen by our community.
        </p>
        <Separator className="max-w-xs mx-auto h-1 bg-primary rounded-full" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
