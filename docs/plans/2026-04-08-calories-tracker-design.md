# Calories Tracker - Design Document

**Date:** 2026-04-08
**Author:** Claude
**Status:** Approved

## Overview

A mobile-first web app for iPhone 16 that allows users to track calories by taking photos of food. The app uses AI to estimate calories from food images and provides full analytics with daily/weekly trends.

## Tech Stack

- **Frontend:** Next.js 14 with App Router, Tailwind CSS
- **Hosting:** Cloudflare Pages
- **Backend:** Cloudflare Functions (Next.js API Routes)
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage (for meal photos)
- **AI Service:** OpenRouter API (vision-capable models)

## Target Device

- iPhone 16 viewport: ~393px × 852px
- Mobile-first responsive design
- No desktop optimization required

## User Requirements

- Personal use (daily meal tracking)
- Full analytics (daily totals, weekly trends, charts)
- Cloud-first storage (data synced across devices)
- Easy/cheap deployment (prefer free tiers)
- Free/low-cost AI (OpenRouter)

## Architecture

### Key Flow

1. User takes photo → client uploads to Cloudflare Function
2. Function sends image to OpenRouter Vision API → returns food analysis + calories
3. Function stores data in Supabase
4. Frontend receives real-time update → displays in dashboard

## Screens

### 1. Camera Screen (Primary)
- Large camera viewfinder filling the screen
- Single large "Capture" button at bottom
- Flash toggle button

### 2. Results Screen (Post-capture)
- Image preview of captured food
- AI analysis: food name, estimated calories, portion size
- Confidence score
- "Save" and "Retake" buttons
- Editable calorie field (manual override)

### 3. Dashboard/Home
- Today's total calories (large, prominent)
- Daily goal progress bar
- Quick "Add Meal" FAB (floating action button)
- Today's meal list (thumbnails, time, calories)

### 4. Analytics View
- Daily/weekly calorie charts
- Trends and averages
- Meal breakdown by meal type
- Calorie goal vs actual comparison

### 5. Settings
- Daily calorie goal slider
- Clear data option

## Data Models

### Meals Table (Supabase)
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users)
- `image_url` (text) - stored in Supabase Storage
- `food_name` (text)
- `estimated_calories` (integer)
- `actual_calories` (integer, nullable) - user can edit
- `portion_size` (text) - e.g., "1 cup", "200g"
- `confidence_score` (float) - AI confidence 0-1
- `meal_type` (enum: breakfast, lunch, dinner, snack)
- `consumed_at` (timestamp with time zone)
- `created_at` (timestamp with time zone)

### User Settings Table
- `user_id` (uuid, primary key)
- `daily_calorie_goal` (integer, default: 2000)
- `timezone` (text)

### Storage Buckets
- `meal-photos` - public bucket for uploaded food images

## API Endpoints

### POST /api/analyze-meal
- Receives image file (multipart/form-data)
- Calls OpenRouter Vision API
- Uploads image to Supabase Storage
- Saves meal record to Supabase
- Returns meal data to frontend

### GET /api/meals
- Fetches meals for user with date filtering
- Returns paginated results

### GET /api/analytics
- Aggregates calorie data for charts
- Computes daily totals, averages, trends

## AI Integration

### OpenRouter Vision
- Model: openai/gpt-4-vision-preview (or similar)
- Prompt: "Identify this food, estimate calories, portion size, and meal type. Return JSON with food_name, calories, portion_size, meal_type, confidence_score"
- Max tokens: 500
- Image compression: resize to max 1024px before API call

## Environment Variables
- `OPENROUTER_API_KEY` - OpenRouter API key
- `OPENROUTER_MODEL` - Default vision model
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service key

## Error Handling

### Image Capture Errors
- Camera permission denied → clear error with link to settings
- Invalid image format → validate before upload
- Upload timeout → retry with progress indicator

### AI API Errors
- OpenRouter rate limit → queue request, show "processing" state
- API failure → offer manual calorie entry option
- Low confidence (<0.6) → flag for user review before saving

### Data Sync Errors
- Offline mode → queue meals locally, sync when online
- Sync conflicts → last-write-wins with notification
- Storage quota → alert user

### Validation
- Calorie range: 0-5000
- Image size: max 5MB before compression

## Deployment

- Cloudflare Pages (free tier)
- GitHub integration for automatic deployments
- Environment variables configured in Cloudflare dashboard
