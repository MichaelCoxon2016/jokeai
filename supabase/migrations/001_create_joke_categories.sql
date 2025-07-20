-- Create jokes table
CREATE TABLE IF NOT EXISTS jokes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_ai_generated BOOLEAN DEFAULT true,
    model_used TEXT,
    prompt_used TEXT,
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT true,
    reported_count INTEGER DEFAULT 0
);

-- Create joke categories table
CREATE TABLE IF NOT EXISTS joke_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    emoji TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create joke ratings table
CREATE TABLE IF NOT EXISTS joke_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    joke_id UUID REFERENCES jokes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(joke_id, user_id)
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    preferred_categories TEXT[] DEFAULT '{}',
    content_filter_level TEXT DEFAULT 'medium' CHECK (content_filter_level IN ('low', 'medium', 'high')),
    max_joke_length INTEGER DEFAULT 500,
    favorite_models TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS joke_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    joke_id UUID REFERENCES jokes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(joke_id, user_id)
);

-- Create generation history table
CREATE TABLE IF NOT EXISTS generation_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    category TEXT NOT NULL,
    model_used TEXT NOT NULL,
    generated_joke_id UUID REFERENCES jokes(id) ON DELETE SET NULL,
    generation_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default categories (only if they don't exist)
INSERT INTO joke_categories (id, name, description)
SELECT gen_random_uuid(), name, description FROM (
    VALUES
        ('general', 'General audience jokes'),
        ('dad-jokes', 'Classic dad jokes and puns'),
        ('programming', 'Tech and programming humor'),
        ('animals', 'Animal-themed jokes'),
        ('food', 'Food and cooking jokes'),
        ('workplace', 'Office and work humor'),
        ('clean', 'Family-friendly clean jokes'),
        ('one-liners', 'Short one-liner jokes'),
        ('riddles', 'Riddle-style jokes'),
        ('seasonal', 'Holiday and seasonal jokes')
) AS new_categories(name, description)
WHERE NOT EXISTS (
    SELECT 1 FROM joke_categories 
    WHERE joke_categories.name = new_categories.name
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jokes_category ON jokes(category);
CREATE INDEX IF NOT EXISTS idx_jokes_created_at ON jokes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jokes_author_id ON jokes(author_id);
CREATE INDEX IF NOT EXISTS idx_jokes_is_public ON jokes(is_public);
CREATE INDEX IF NOT EXISTS idx_joke_ratings_joke_id ON joke_ratings(joke_id);
CREATE INDEX IF NOT EXISTS idx_joke_ratings_user_id ON joke_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_joke_favorites_user_id ON joke_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_history_user_id ON generation_history(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_jokes_updated_at BEFORE UPDATE ON jokes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE jokes ENABLE ROW LEVEL SECURITY;
ALTER TABLE joke_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE joke_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;

-- Jokes policies
CREATE POLICY "Public jokes are viewable by everyone" ON jokes
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own jokes" ON jokes
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can create jokes" ON jokes
    FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own jokes" ON jokes
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own jokes" ON jokes
    FOR DELETE USING (auth.uid() = author_id);

-- Ratings policies
CREATE POLICY "Users can view all ratings" ON joke_ratings
    FOR SELECT USING (true);

CREATE POLICY "Users can create ratings" ON joke_ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON joke_ratings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" ON joke_ratings
    FOR DELETE USING (auth.uid() = user_id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON joke_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" ON joke_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON joke_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Generation history policies
CREATE POLICY "Users can view their own generation history" ON generation_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generation history" ON generation_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Categories are public (no RLS needed)
ALTER TABLE joke_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON joke_categories
    FOR SELECT USING (true);