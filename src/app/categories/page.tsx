import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Categories - Browse by Category | E-Commerce Store',
  description: 'Explore our product categories: Electronics, Furniture, Clothing, Food & Beverage, Books, and Sports. Find exactly what you\'re looking for.',
  keywords: 'categories, electronics, furniture, clothing, food, books, sports, product categories',
  openGraph: {
    title: 'Product Categories - Shop by Category',
    description: 'Explore our wide range of product categories and find exactly what you\'re looking for.',
    type: 'website',
  },
  alternates: {
    canonical: '/categories',
  },
}

interface CategoryWithCount {
  category: string
  count: number
  description: string
  imageUrl: string
}

async function getCategories(): Promise<CategoryWithCount[]> {
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

    // Count products per category
    const categoryCount = data?.reduce((acc, item) => {
      if (item.category) {
        acc[item.category] = (acc[item.category] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>) || {}

    // Category data with descriptions and images
    const categoryData: Record<string, { description: string; imageUrl: string }> = {
      'Electronics': {
        description: 'Latest gadgets, computers, smartphones, and electronic accessories',
        imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop&crop=center'
      },
      'Furniture': {
        description: 'Modern and comfortable furniture for your home and office',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&crop=center'
      },
      'Clothing': {
        description: 'Trendy fashion and apparel for all styles and occasions',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&crop=center'
      },
      'Food & Beverage': {
        description: 'Premium food products, beverages, and gourmet items',
        imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&h=400&fit=crop&crop=center'
      },
      'Books': {
        description: 'Wide selection of books across all genres and topics',
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&crop=center'
      },
      'Sports': {
        description: 'Sports equipment, fitness gear, and athletic accessories',
        imageUrl: 'https://images.unsplash.com/photo-1571019613914-85e0c1ee7e7e?w=600&h=400&fit=crop&crop=center'
      }
    }

    const categories: CategoryWithCount[] = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      description: categoryData[category]?.description || 'Explore our amazing products in this category',
      imageUrl: categoryData[category]?.imageUrl || 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(category)
    }))

    return categories.sort((a, b) => b.count - a.count)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Product Categories',
    description: 'Browse products by category',
    url: 'https://yourdomain.com/categories',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        '@type': 'Thing',
        position: index + 1,
        name: category.category,
        description: category.description,
        url: `/categories/${category.category.toLowerCase().replace(/\s+/g, '-')}`
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
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Shop by Category
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our wide range of products organized by categories. 
              Find exactly what you're looking for with ease.
            </p>
          </div>

          {/* Categories Grid */}
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {categories.map((category) => (
                <Card key={category.category} className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <Image
                      src={category.imageUrl}
                      alt={category.category}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{category.category}</CardTitle>
                      <Badge variant="secondary">
                        {category.count} {category.count === 1 ? 'item' : 'items'}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href={`/products?category=${encodeURIComponent(category.category)}`}>
                        Browse {category.category}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent>
                <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Categories Available</h3>
                <p className="text-muted-foreground mb-6">
                  We're working on adding product categories. Check back soon!
                </p>
                <Button asChild>
                  <Link href="/products">
                    Browse All Products
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Featured Section */}
          <section className="bg-muted rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Browse all our products or use our search feature to find exactly what you need. 
              We're constantly adding new items to our inventory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/products">
                  View All Products
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/products?search=">
                  Search Products
                </Link>
              </Button>
            </div>
          </section>
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
