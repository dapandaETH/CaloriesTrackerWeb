# Calories Tracker Design

**Date:** 2026-04-08
**Project:** Personal Calories Tracker with AI Food Recognition
**Target Platform:** iPhone 16 (responsive mobile web)

## Overview

A mobile-first web application that allows users to take photos of their meals and automatically estimate calories using AI vision. The app includes full analytics, daily tracking, and cloud storage with real-time sync across devices.

## Tech Stack

- **Frontend:** Next.js 14 (React App Router)
- **Styling:** Tailwind CSS
- **Hosting:** Cloudflare Pages
- **Serverless:** Cloudflare Functions (Next.js API routes)
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (meal photos)
- **AI/ML:** OpenRouter API (vision models like gpt-4-vision-preview)
- **Authentication:** Supabase Auth

## Architecture

```
User (iPhone 16)
    ↓
Next.js Frontend (Cloudflare Pages)
    ↓
Cloudflare Functions (API Routes)
    ↓
├── OpenRouter API (AI food analysis)
└── Supabase (Database + Storage)
```

## Core Features

1. **Photo Capture & AI Analysis**
   - Take photo with device camera
   - Automatically analyze food using AI vision
   - Estimate calories, portion size, and meal type

2. **Meal Management**
   - View today's meals with thumbnails
   - Edit calorie estimates (manual override)
   - Delete or adjust meal entries

3. **Daily Tracking**
   - Today's total calories display
   - Daily goal progress bar
   - Quick add meal button

4. **Analytics**
   - Daily/weekly calorie charts
   - Trends and averages
   - Meal breakdown by meal type
   - Goal vs actual comparison

5. **Settings**
   - Customizable daily calorie goal
   - Clear all data option
   - Account management

## Screens

### 1. Camera Screen (Primary)
- Full-screen camera viewfinder
- Large capture button at bottom
- Flash toggle
- Recent meal count overlay

### 2. Results Screen
- Image preview
- AI analysis display (food name, calories, portion, confidence)
- "Save" and "Retake" buttons
- Editable calorie field

### 3. Dashboard/Home
- Today's total calories (prominent)
- Daily goal progress bar
- FAB for quick photo capture
- Today's meal list (thumbnails, time, calories)

### 4. Analytics View
- Calorie charts (daily/weekly)
- Trends and averages
- Meal type breakdown
- Goal comparison

### 5. Settings
- Daily calorie goal slider
- Clear data option
- Sign out

## Data Models

### Meals Table
```sql
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  image_url TEXT NOT NULL,
  food_name TEXT NOT NULL,
  estimated_calories INTEGER NOT NULL,
  actual_calories INTEGER,  -- nullable, user override
  portion_size TEXT,
  confidence_score FLOAT,  -- 0-1
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  consumed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_meals_user_date ON meals(user_id, date(consumed_at));
```

### User Settings Table
```sql
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  daily_calorie_goal INTEGER DEFAULT 2000,
  timezone TEXT DEFAULT 'UTC',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Buckets
- `meal-photos` (public) - uploaded food images

## API Endpoints

### POST /api/analyze-meal
- Receives image file (multipart/form-data)
- Calls OpenRouter API with vision model
- Uploads image to Supabase Storage
- Saves meal record to database
- Returns meal data

### GET /api/meals
- Fetches meals for authenticated user
- Optional date filtering
- Returns paginated results

### GET /api/analytics
- Aggregates calorie data for charts
- Computes daily totals, averages, trends
- Returns analytics summary

### PUT /api/meals/:id
- Updates meal (e.g., edit calories)
- User can only update their own meals

### DELETE /api/meals/:id
- Deletes meal and associated image
- User can only delete their own meals

## OpenRouter Integration

**Model:** openai/gpt-4-vision-preview (or similar)

**Prompt:**
```
Analyze this food image and return a JSON object with:
{
  "food_name": "name of the dish",
  "calories": estimated integer calories,
  "portion_size": "estimated portion (e.g., '1 cup', '200g')",
  "meal_type": "breakfast|lunch|dinner|snack",
  "confidence_score": 0.0-1.0
}
```

**Benefits:**
- Access to multiple vision models
- Unified billing
- Potentially cheaper than direct OpenAI
- Easy model switching

## Error Handling

### Image Capture
- Camera permission denied → clear error + settings link
- Invalid format → validate before upload
- Upload timeout → retry with progress indicator

### AI API
- Rate limit → queue request, show "processing" state
- API failure → offer manual calorie entry
- Low confidence (<0.6) → flag for user review

### Data Sync
- Offline mode → queue locally, sync when online
- Sync conflicts → last-write-wins with notification
- Storage quota → alert + cleanup suggestion

### Validation
- Calories: 0-5000 range
- Date range: last 7 days to 1 year for analytics
- Image size: max 5MB before compression

## Environment Variables

```
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=openai/gpt-4-vision-preview
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

1. Push code to GitHub
2. Connect repository to Cloudflare Pages
3. Configure environment variables in Cloudflare dashboard
4. Automatic deployment on push to main branch

**Cost:**
- Cloudflare Pages: Free
- Cloudflare Functions: Free tier (100k requests/day)
- Supabase: Free tier (500MB database, 1GB storage)
- OpenRouter: ~$0.01 per image (personal use: < $5/month)

## Success Criteria

- Users can capture food photos and receive calorie estimates
- Analytics provide meaningful insights into eating patterns
- App loads quickly on iPhone 16 (< 3s)
- Offline mode works for basic viewing
- Data syncs correctly across devices
- Total monthly cost: < $10
