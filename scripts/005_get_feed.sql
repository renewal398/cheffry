CREATE OR REPLACE FUNCTION get_feed(p_user_id UUID, p_user_country TEXT)
RETURNS TABLE (
    id UUID,
    created_at TIMESTAMPTZ,
    content TEXT,
    media_urls TEXT[],
    user_id UUID,
    country TEXT,
    profiles JSON,
    likes_count BIGINT,
    dislikes_count BIGINT,
    comments_count BIGINT,
    user_interaction TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH post_interactions AS (
        SELECT
            post_id,
            COUNT(*) FILTER (WHERE type = 'like') AS likes_count,
            COUNT(*) FILTER (WHERE type = 'dislike') AS dislikes_count
        FROM interactions
        GROUP BY post_id
    ),
    post_comments AS (
        SELECT
            post_id,
            COUNT(*) AS comments_count
        FROM comments
        GROUP BY post_id
    ),
    user_country_ranks AS (
      SELECT
          country,
          ROW_NUMBER() OVER(ORDER BY interaction_count DESC) as rank
      FROM user_country_interactions
      WHERE user_country_interactions.user_id = p_user_id
    )
    SELECT
        p.id,
        p.created_at,
        p.content,
        p.media_urls,
        p.user_id,
        p.country,
        json_build_object(
            'id', pr.id,
            'name', pr.name,
            'avatar_url', pr.avatar_url,
            'country', pr.country
        ) AS profiles,
        COALESCE(pi.likes_count, 0) AS likes_count,
        COALESCE(pi.dislikes_count, 0) AS dislikes_count,
        COALESCE(pc.comments_count, 0) AS comments_count,
        i.type AS user_interaction
    FROM posts p
    JOIN profiles pr ON p.user_id = pr.id
    LEFT JOIN post_interactions pi ON p.id = pi.post_id
    LEFT JOIN post_comments pc ON p.id = pc.post_id
    LEFT JOIN interactions i ON p.id = i.post_id AND i.user_id = p_user_id
    LEFT JOIN user_country_ranks ucr ON p.country = ucr.country
    ORDER BY
        CASE WHEN p.country = p_user_country THEN 0 ELSE 1 END,
        ucr.rank NULLS LAST,
        p.created_at DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;
