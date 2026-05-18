import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    isEggless: boolean;
    images: { url: string }[];
    variants: { price: number; originalPrice?: number | null }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const thumbnail = product.images[0]?.url || "/placeholder-cake.jpg";
  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  const originalPrice = product.variants[0]?.originalPrice;

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/p/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={thumbnail}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.isEggless && (
            <div className="absolute top-2 left-2 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded border border-green-500">
               <div className="w-2.5 h-2.5 rounded-full bg-green-600 border border-white" />
               <span className="text-[10px] font-bold text-green-700">Eggless</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-3 space-y-1">
        <div className="flex items-center space-x-1">
          <div className="flex text-yellow-500">
            <Star className="h-3 w-3 fill-current" />
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">4.8 (120 reviews)</span>
        </div>
        <Link href={`/p/${product.slug}`}>
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline space-x-2">
          <span className="font-bold text-lg text-foreground">₹{lowestPrice}</span>
          {originalPrice && originalPrice > lowestPrice && (
            <span className="text-xs text-muted-foreground line-through">₹{originalPrice}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button size="sm" className="w-full font-bold">
          Quick Add
        </Button>
      </CardFooter>
    </Card>
  );
}
