import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Update a product
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Build partial update object, only include fields that are provided
    const updateData: Record<string, any> = {}
    const allowedFields = [
      'name',
      'description',
      'price',
      'image_url',
      'category',
      'stock_quantity',
      'is_active',
    ] as const

    for (const key of allowedFields) {
      if (key in body && body[key] !== undefined) {
        // type specific casting
        if (key === 'price') updateData[key] = parseFloat(body[key])
        else if (key === 'stock_quantity') updateData[key] = parseInt(body[key])
        else updateData[key] = body[key]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields provided for update' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }

    return NextResponse.json({ product: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete a product
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 