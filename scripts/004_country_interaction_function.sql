-- Function to increment country interaction count
CREATE OR REPLACE FUNCTION increment_country_interaction(p_user_id UUID, p_country TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_country_interactions (user_id, country, interaction_count)
  VALUES (p_user_id, p_country, 1)
  ON CONFLICT (user_id, country)
  DO UPDATE SET interaction_count = user_country_interactions.interaction_count + 1;
END;
$$;
