import { api } from "@/lib/api";
import { ProductCard } from "@/components/features/ProductCard";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  let category: any = null;
  let products: any[] = [];
  
  try {
    const categories = await api.getCategories();
    category = categories.find((cat: any) => cat.slug === slug);
    
    if (category) {
      const allProducts = await api.getProducts();
      // Simple filter for demo, in production the API would handle this
      products = allProducts.filter((p: any) => p.categoryId === category.id);
    }
  } catch (error) {
    console.error("Failed to fetch category data:", error);
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-muted-foreground">
          Showing all {products.length} products in {category.name}
        </p>
        <Separator />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
