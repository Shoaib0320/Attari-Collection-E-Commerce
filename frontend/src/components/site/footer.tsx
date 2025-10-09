// export default function SiteFooter() {
//   return (
//     <footer className="border-t bg-card">
//       <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between text-sm text-muted-foreground">
//         <div>© {new Date().getFullYear()} Attari Collection</div>
//         <nav className="flex items-center gap-4">
//           <a className="hover:underline" href="/contact">Contact</a>
//           <a className="hover:underline" href="/profile">Profile</a>
//         </nav>
//       </div>
//     </footer>
//   )
// }


"use client"

import Link from "next/link"
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function SiteFooter() {
  const [email, setEmail] = useState("")

  const handleNewsletterSubscribe = () => {
    if (email.trim()) {
      // Newsletter subscription logic yahan add karein
      console.log("Newsletter subscription:", email)
      setEmail("")
    }
  }

  return (
    <footer className="border-t bg-card">
      {/* Newsletter Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-1">Subscribe to Our Newsletter</h3>
              <p className="text-sm opacity-90">Get the latest updates on new products and exclusive offers!</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input 
                type="email"
                placeholder="Enter your email" 
                className="bg-background text-foreground md:w-80"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNewsletterSubscribe()}
              />
              <Button 
                variant="secondary" 
                size="icon"
                onClick={handleNewsletterSubscribe}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                A
              </div>
              <div>
                <div className="font-bold text-lg leading-tight">Attari Collection</div>
                <div className="text-xs text-muted-foreground">Premium Fashion</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your one-stop destination for premium quality fashion and lifestyle products. 
              We bring you the best collections at unbeatable prices.
            </p>
            <div className="flex gap-2">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Facebook className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Instagram className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Twitter className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Youtube className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shop Now
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Special Offers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-base mb-4">Customer Service</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/account" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-foreground transition-colors">
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-base mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  123 Fashion Street, Karachi, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                <a href="tel:+923001234567" className="text-muted-foreground hover:text-foreground transition-colors">
                  +92 300 1234567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                <a href="mailto:info@attaricollection.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  info@attaricollection.com
                </a>
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-muted/50">
              <p className="text-xs font-semibold mb-1">Opening Hours</p>
              <p className="text-xs text-muted-foreground">Mon - Sat: 9:00 AM - 9:00 PM</p>
              <p className="text-xs text-muted-foreground">Sunday: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Attari Collection. All rights reserved.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms & Conditions
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/sitemap" className="text-muted-foreground hover:text-foreground transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              💳 We accept all major payment methods | 🚚 Fast & Secure Delivery | 🔄 Easy Returns
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}