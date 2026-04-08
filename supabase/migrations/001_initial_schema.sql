-- Create meals table
CREATE TABLE meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  image_url TEXT,
  food_name TEXT NOT NULL,
  estimated_calories INTEGER NOT NULL,
  actual_calories INTEGER,
  portion_size TEXT,
  confidence_score FLOAT DEFAULT 0.5,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) DEFAULT 'snack',
  consumed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE user_settings (
  user_id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000',
  daily_calorie_goal INTEGER DEFAULT 2000,
  timezone TEXT DEFAULT 'UTC'
);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('meal-photos', 'meal-photos', true);

-- Create storage policy
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'meal-photos');

CREATE POLICY "Auth upload access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'meal-photos');

-- Enable RLS
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Public read meals" ON meals FOR SELECT USING (true);
CREATE POLICY "Public insert meals" ON meals FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update meals" ON meals FOR UPDATE USING (true);
CREATE POLICY "Public delete meals" ON meals FOR DELETE USING (true);

CREATE POLICY "Public read settings" ON user_settings FOR SELECT USING (true);
CREATE POLICY "Public update settings" ON user_settings FOR UPDATE USING (true);
