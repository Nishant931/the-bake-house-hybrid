import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">The Bake House</h3>
            <p className="text-sm opacity-80">
              Premium quality cakes and desserts delivered to your doorstep. Making every occasion special since 2026.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
              <Instagram className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
              <Twitter className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" />
              {/* <Youtube className="h-5 w-5 cursor-pointer hover:text-primary transition-colors" /> */}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-wider">Customer Support</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/faq" className="hover:text-primary">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-primary">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-primary">Returns & Refunds</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 uppercase text-xs tracking-wider">Newsletter</h4>
            <p className="text-sm opacity-80 mb-4">Subscribe to get special offers and news.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-secondary-foreground/10 border-0 px-3 py-2 text-sm flex-1 rounded-l-md focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-bold rounded-r-md">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 text-center text-xs opacity-60">
          <p>© 2026 The Bake House. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
