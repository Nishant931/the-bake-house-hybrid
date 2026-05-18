import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/features/ProductCard";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: { images: true, variants: true },
      },
      children: true,
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-muted-foreground">
          Showing all {category.products.length} products in {category.name}
        </p>
        <Separator />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {category.products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
