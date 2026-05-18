"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const SLIDES = [
  {
    image: "https://www.bakingo.com/sites/default/files/new_banner_desktop_bakingo_cake_0.jpg",
    title: "Delicious Cakes",
  },
  {
    image: "https://www.bakingo.com/sites/default/files/new_banner_desktop_bakingo_dessert_0.jpg",
    title: "Sweet Desserts",
  },
];

export function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <section className="w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {SLIDES.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[300px] md:h-[500px] w-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  unoptimized // Bakingo images might need this if domains aren't configured
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </div>
      </Carousel>
    </section>
  );
}
