import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/features/ProductCard";
import { Separator } from "@/components/ui/separator";

export default async function BestsellersPage() {
  const products = await prisma.product.findMany({
    take: 20,
    include: { images: true, variants: true },
    orderBy: { createdAt: 'desc' } // For now, just show newest as bestsellers
  });

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
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
