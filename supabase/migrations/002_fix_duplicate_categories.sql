-- Delete duplicate categories (keep the lowercase ones with UUID ids)
DELETE FROM joke_categories 
WHERE id IN (
  'animals',
  'clean', 
  'dad-jokes',
  'food',
  'general',
  'one-liners',
  'programming',
  'riddles',
  'seasonal',
  'workplace'
);

-- Update the remaining categories to have consistent naming (lowercase)
UPDATE joke_categories SET name = LOWER(name);

-- Add unique constraint to prevent future duplicates
ALTER TABLE joke_categories 
ADD CONSTRAINT unique_category_name UNIQUE (name);