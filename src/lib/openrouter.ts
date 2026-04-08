interface OpenRouterResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

export async function analyzeFood(imageBase64: string): Promise<{
  food_name: string
  calories: number
  portion_size: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  confidence_score: number
}> {
  const model = process.env.OPENROUTER_MODEL || 'qwen/qwen3-vl-8b-instruct'
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
            {
              type: 'text',
              text: 'Identify this food and estimate its calories. Return JSON with: food_name (string), calories (integer), portion_size (string), meal_type (breakfast/lunch/dinner/snack based on time), confidence_score (0-1).',
            },
          ],
        },
      ],
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
  }

  const data: OpenRouterResponse = await response.json()
  const content = data.choices[0]?.message?.content || '{}'
  
  const cleanedContent = content.replace(/```json|```/g, '').trim()
  return JSON.parse(cleanedContent)
}
