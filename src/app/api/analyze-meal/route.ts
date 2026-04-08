import { NextResponse } from 'next/server'
import { analyzeFood } from '@/lib/openrouter'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const bytes = await image.arrayBuffer()
    const uint8Array = new Uint8Array(bytes)
    const binaryString = Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join('')
    const imageBase64 = btoa(binaryString)

    const analysis = await analyzeFood(imageBase64)

    const { data: imageData, error: uploadError } = await supabaseAdmin.storage
      .from('meal-photos')
      .upload(`${Date.now()}.jpg`, uint8Array, {
        contentType: 'image/jpeg',
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('meal-photos')
      .getPublicUrl(imageData?.path || '')

    if (!urlData?.publicUrl) {
      return NextResponse.json({ error: 'Failed to get image URL' }, { status: 500 })
    }

    const { data: meal, error: dbError } = await supabaseAdmin
      .from('meals')
      .insert({
        user_id: 'anonymous',
        image_url: urlData.publicUrl,
        food_name: analysis.food_name,
        estimated_calories: analysis.calories,
        portion_size: analysis.portion_size,
        meal_type: analysis.meal_type,
        confidence_score: analysis.confidence_score,
        consumed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (dbError) {
      console.error('DB error:', dbError)
      return NextResponse.json({ error: 'Failed to save meal' }, { status: 500 })
    }

    if (!meal) {
      return NextResponse.json({ error: 'Meal not created' }, { status: 500 })
    }

    return NextResponse.json(meal)
  } catch (error) {
    console.error('Error:', error)
    const message = error instanceof Error ? error.message : 'Analysis failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
