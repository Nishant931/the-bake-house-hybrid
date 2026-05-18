import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      variants: true,
      category: true,
    },
  });

  if (!product) {
    notFound();
  }

  const defaultVariant = product.variants[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <Carousel className="w-full max-w-xl mx-auto">
            <CarouselContent>
              {product.images.map((image, index) => (
                <CarouselItem key={image.id}>
                  <div className="relative aspect-square rounded-xl overflow-hidden border">
                    <Image
                      src={image.url}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images.map((image) => (
              <div key={image.id} className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border cursor-pointer hover:border-primary">
                <Image
                  src={image.url}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Product Info & Selectors */}
        <div className="flex flex-col space-y-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                {product.category.name}
              </Badge>
              {product.isEggless && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  100% Eggless Available
                </Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm font-bold text-foreground">4.8</span>
              </div>
              <span className="text-sm text-muted-foreground underline">250 Reviews</span>
            </div>
          </div>

          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-bold text-primary">₹{defaultVariant?.price}</span>
            {defaultVariant?.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">₹{defaultVariant.originalPrice}</span>
            )}
            <span className="text-sm text-green-600 font-semibold">15% OFF</span>
          </div>

          <Separator />

          {/* Weight Selector */}
          <div className="space-y-3">
            <h4 className="font-semibold">Select Weight</h4>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <Button 
                  key={v.id} 
                  variant="outline" 
                  className={`rounded-full px-6 ${v.id === defaultVariant.id ? 'border-primary bg-primary/5 text-primary' : ''}`}
                >
                  {v.weight}
                </Button>
              ))}
            </div>
          </div>

          {/* Delivery Check */}
          <div className="p-4 bg-muted rounded-xl space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Earlier delivery available: <span className="text-primary font-bold">Today</span></span>
            </div>
            <div className="flex space-x-2">
              <input 
                placeholder="Enter Pincode" 
                className="flex-1 bg-background border border-input px-3 py-2 rounded-md text-sm focus:ring-1 focus:ring-primary outline-none"
              />
              <Button>Check</Button>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button size="lg" className="flex-1 font-bold text-lg h-14">
              Add to Cart
            </Button>
            <Button size="lg" variant="secondary" className="flex-1 font-bold text-lg h-14 bg-secondary text-secondary-foreground hover:bg-secondary/80">
              Buy Now
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>Safe and Secure Payments</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>100% Satisfaction Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-16 space-y-6">
        <div className="border-b">
          <h2 className="text-2xl font-bold pb-4 border-b-2 border-primary w-max">Product Details</h2>
        </div>
        <div className="prose max-w-none text-muted-foreground">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
}
