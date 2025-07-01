import { Metadata } from 'next'
import { Suspense } from 'react'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/product-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Products - Shop Online | E-Commerce Store',
  description: 'Browse our wide selection of products. Electronics, furniture, clothing, food & beverage, books, and sports items. Free shipping on orders over $50.',
  keywords: 'products, online shopping, electronics, furniture, clothing, books, sports, e-commerce',
  openGraph: {
    title: 'Products - Shop Online',
    description: 'Browse our wide selection of products with free shipping on orders over $50.',
    type: 'website',
  },
  alternates: {
    canonical: '/products',
  },
}

interface ProductsPageProps {
  searchParams: {
    search?: string
    category?: string
    sort?: string
  }
}

async function getProducts(searchParams: ProductsPageProps['searchParams']): Promise<Product[]> {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    // Apply search filter
    if (searchParams.search) {
      query = query.or(`name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
    }

    // Apply category filter
    if (searchParams.category && searchParams.category !== 'all') {
      query = query.eq('category', searchParams.category)
    }

    // Apply sorting
    switch (searchParams.sort) {
      case 'price-asc':
        query = query.order('price', { ascending: true })
        break
      case 'price-desc':
        query = query.order('price', { ascending: false })
        break
      case 'name-asc':
        query = query.order('name', { ascending: true })
        break
      case 'name-desc':
        query = query.order('name', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data: products, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return products || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .eq('is_active', true)
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    const categories = [...new Set(data?.map(item => item.category).filter(Boolean))] as string[]
    return categories.sort()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <CardContent className="p-4">
            <Skeleton className="h-4 w-2/3 mb-2" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories()
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Products',
    description: 'Browse our wide selection of products',
    url: 'https://yourdomain.com/products',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'Product',
        position: index + 1,
        name: product.name,
        description: product.description,
        image: product.image_url,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'USD',
          availability: product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        }
      }))
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
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Products</h1>
            <p className="text-muted-foreground">
              Discover our amazing collection of products. {products.length} items available.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <Label htmlFor="search">Search Products</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      type="search"
                      placeholder="Search products..."
                      className="pl-8"
                      defaultValue={searchParams.search}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue={searchParams.category || 'all'}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort */}
                <div>
                  <Label htmlFor="sort">Sort By</Label>
                  <Select defaultValue={searchParams.sort || 'newest'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="name-asc">Name: A to Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Categories as badges */}
                <div>
                  <Label>Popular Categories</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.slice(0, 6).map((category) => (
                      <Badge key={category} variant="secondary" className="cursor-pointer">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Showing {products.length} products
                </p>
              </div>

              <Suspense fallback={<ProductsLoading />}>
                {products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <div className="text-muted-foreground mb-4">
                        <Search className="mx-auto h-12 w-12 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No products found</h3>
                        <p>Try adjusting your search or filters to find what you're looking for.</p>
                      </div>
                      <Button variant="outline">
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </Suspense>
            </div>
          </div>
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
