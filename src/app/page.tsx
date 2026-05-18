import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/features/Hero";
import { ProductCard } from "@/components/features/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const bestsellers = await prisma.product.findMany({
    take: 8,
    include: { images: true, variants: true },
  });

  const categories = await prisma.category.findMany({
    where: { parentId: null },
    take: 4,
  });

  return (
    <div className="flex flex-col space-y-12 pb-12">
      <Hero />

      {/* Categories Horizontal Scroll */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link href="/categories" className="text-primary font-semibold flex items-center hover:underline">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="group relative h-40 rounded-xl overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors z-0" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                 <span className="text-white text-lg font-bold">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">India Loves (Bestsellers)</h2>
          <Link href="/bestsellers" className="text-primary font-semibold flex items-center hover:underline">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Delivery Info Banner */}
      <section className="bg-accent py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <h4 className="font-bold text-lg">Same Day Delivery</h4>
            <p className="text-sm text-muted-foreground">Order by 6 PM for today's celebration.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-lg">Midnight Surprise</h4>
            <p className="text-sm text-muted-foreground">Make it special with our midnight delivery service.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-lg">100% Eggless Options</h4>
            <p className="text-sm text-muted-foreground">All our cakes are available in eggless variants.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
