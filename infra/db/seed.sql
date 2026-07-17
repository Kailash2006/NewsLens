-- Minimal live-mode seed so the app isn't empty on first `docker compose up`.
-- The authoritative demo dataset lives in apps/api/src/data/seed/*.json (mock
-- mode). For a full live seed, run the pipeline's live write path or import
-- those JSON files. This file seeds just enough to smoke-test the schema.

INSERT INTO sources (id, name, slug, homepage, bias, bias_source, trust_score, country, brand_color) VALUES
  ('src_reuters', 'Reuters', 'reuters', 'https://www.reuters.com', 'center', 'AllSides', 94, 'GB', '#ff8000'),
  ('src_guardian', 'The Guardian', 'guardian', 'https://www.theguardian.com', 'left', 'AllSides', 80, 'GB', '#052962'),
  ('src_wsj', 'The Wall Street Journal', 'wsj', 'https://www.wsj.com', 'center-right', 'AllSides', 85, 'US', '#000000');

INSERT INTO clusters (id, headline, neutral_summary, topics) VALUES
  ('cl_ai_rules', 'Regulators move to enforce sweeping new rules on general-purpose AI',
   'Governments began enforcing new obligations on the largest AI model providers.', ARRAY['ai','regulation']);

INSERT INTO articles (id, source_id, cluster_id, title, url, published_at, topics, reading_minutes, summary) VALUES
  ('art_ai_reuters', 'src_reuters', 'cl_ai_rules', 'AI providers face first enforcement deadline under new transparency rules',
   'https://www.reuters.com/technology/ai-transparency-rules-2026', '2026-07-17T07:55:00Z',
   ARRAY['ai','regulation'], 4, 'Large AI providers reached their first compliance deadline under new transparency rules.'),
  ('art_ai_guardian', 'src_guardian', 'cl_ai_rules', 'Long-overdue AI rules finally force Big Tech to open up, campaigners say',
   'https://www.theguardian.com/technology/ai-rules-accountability-2026', '2026-07-17T08:10:00Z',
   ARRAY['ai','regulation'], 5, 'Campaigners welcomed the new AI transparency obligations as long overdue.');

INSERT INTO users (id, name, email, avatar_color, plan, onboarded) VALUES
  ('usr_demo', 'Demo Reader', 'demo@newslens.app', '#6366f1', 'reader', true);

INSERT INTO user_preferences (user_id, topics, followed_source_ids, bias_filter) VALUES
  ('usr_demo', ARRAY['ai','regulation'], ARRAY['src_reuters'], 'all');
