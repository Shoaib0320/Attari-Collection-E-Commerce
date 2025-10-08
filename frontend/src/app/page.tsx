import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, Star, Truck, Shield, ArrowRight, Sparkles, Heart } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-primary-950 dark:via-neutral-900 dark:to-accent-950 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Welcome to Attari Collection
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Premium Fashion
              <span className="block text-gradient bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                & Lifestyle
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover our curated collection of premium fashion and lifestyle products. 
              Quality meets style in every piece we offer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4 bg-gradient-primary hover:shadow-glow">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Explore Collection
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-medium transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <CardTitle>Free Shipping</CardTitle>
                <CardDescription>
                  Free shipping on orders over $50. Fast and reliable delivery to your doorstep.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-medium transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-success-100 dark:bg-success-900/20 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-success-600 dark:text-success-400" />
                </div>
                <CardTitle>Secure Payment</CardTitle>
                <CardDescription>
                  Your payments are secure with our encrypted checkout process and fraud protection.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-medium transition-shadow duration-300">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-accent-600 dark:text-accent-400" />
                </div>
                <CardTitle>Premium Quality</CardTitle>
                <CardDescription>
                  Carefully curated products with premium materials and exceptional craftsmanship.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="py-20 bg-gray-50 dark:bg-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Discover our handpicked selection of premium items
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="group overflow-hidden hover:shadow-medium transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <button className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-neutral-800/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Product {i + 1}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Premium Category</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">$49.00</span>
                      <Button size="sm" className="text-sm">
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of satisfied customers who trust Attari Collection for their fashion needs.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Start Shopping
          </Button>
        </div>
      </section>
    </div>
  )
}
