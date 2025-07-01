import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { ShoppingCart, Heart, Share2, ArrowLeft, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'

interface ProductPageProps {
  params: {
    id: string
  }
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return null
    }

    return product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getRelatedProducts(categoryId: string, currentProductId: string): Promise<Product[]> {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', categoryId)
      .eq('is_active', true)
      .neq('id', currentProductId)
      .limit(4)

    return products || []
  } catch (error) {
    console.error('Error fetching related products:', error)
    return []
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for could not be found.',
    }
  }

  return {
    title: `${product.name} - Buy Online | E-Commerce Store`,
    description: product.description || `Buy ${product.name} at the best price. ${product.category} category. Free shipping available.`,
    keywords: [product.name, product.category, 'buy online', 'e-commerce', 'shop'].filter(Boolean).join(', '),
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at the best price`,
      images: product.image_url ? [
        {
          url: product.image_url,
          width: 800,
          height: 600,
          alt: product.name,
        }
      ] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `Buy ${product.name} at the best price`,
      images: product.image_url ? [product.image_url] : [],
    },
    alternates: {
      canonical: `/products/${params.id}`,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category || '', product.id)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image_url,
    brand: {
      '@type': 'Brand',
      name: 'E-Commerce Store'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'E-Commerce Store'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '12'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-foreground">Products</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link href={`/categories/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-foreground">
                  {product.category}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{product.name}</span>
          </nav>

          {/* Back to products */}
          <Link 
            href="/products" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-muted-foreground">No Image Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.category && (
                    <Badge variant="secondary">{product.category}</Badge>
                  )}
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">(12 reviews)</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                <div className="flex items-center">
                  {product.stock_quantity > 0 ? (
                    <Badge variant="outline" className="text-green-600">
                      In Stock ({product.stock_quantity} available)
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}

              <Separator />

              {/* Actions */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    className="flex-1"
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <Button size="lg" variant="outline">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                
                <Button variant="outline" size="lg" className="w-full">
                  Buy Now
                </Button>
              </div>

              <Separator />

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="font-medium">Free Shipping</div>
                    <div className="text-muted-foreground">On orders over $50</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="font-medium">Secure Payment</div>
                    <div className="text-muted-foreground">100% protected</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="font-medium">Easy Returns</div>
                    <div className="text-muted-foreground">30-day policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold tracking-tight mb-8">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-muted py-12 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground">
              © 2024 E-Commerce Site. Built with Next.js, shadcn/ui, and Supabase.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
