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
    const buffer = Buffer.from(bytes)
    const imageBase64 = buffer.toString('base64')

    const analysis = await analyzeFood(imageBase64)

    const { data: imageData, error: uploadError } = await supabaseAdmin.storage
      .from('meal-photos')
      .upload(`${Date.now()}.jpg`, buffer, {
        contentType: 'image/jpeg',
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('meal-photos')
      .getPublicUrl(imageData?.path || '')

    const { data: meal, error: dbError } = await supabaseAdmin
      .from('meals')
      .insert({
        user_id: 'anonymous',
        image_url: urlData.publicUrl || '',
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
    }

    return NextResponse.json(meal)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
