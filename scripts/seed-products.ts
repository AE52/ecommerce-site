import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
  const sampleProducts = [
    {
      name: 'Wireless Earbuds',
      description: 'Compact earbuds with high-fidelity sound',
      price: 89.99,
      image_url: 'https://images.unsplash.com/photo-1585386959984-a415522c1f66?w=300&h=300&fit=crop&crop=center',
      category: 'Electronics',
      stock_quantity: 30,
      is_active: true,
    },
    {
      name: 'Yoga Mat',
      description: 'Eco-friendly non-slip yoga mat',
      price: 39.99,
      image_url: 'https://images.unsplash.com/photo-1571019613912-76c54cebb3a2?w=300&h=300&fit=crop&crop=center',
      category: 'Sports',
      stock_quantity: 50,
      is_active: true,
    },
    {
      name: 'Stainless Steel Water Bottle',
      description: 'Keeps drinks cold for 24 hours',
      price: 24.99,
      image_url: 'https://images.unsplash.com/photo-1526401485004-2fa5b4b5d237?w=300&h=300&fit=crop&crop=center',
      category: 'Sports',
      stock_quantity: 80,
      is_active: true,
    },
  ]

  const { error } = await supabase.from('products').insert(sampleProducts)

  if (error) {
    console.error('Failed to seed products:', error)
    process.exit(1)
  }
  console.log('🌱 Seeded products successfully!')
}

seed() 