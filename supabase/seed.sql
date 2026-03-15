-- Seed data for Change180 Content Studio
-- Run after creating tables and a user account
-- Replace YOUR-USER-UUID with the actual user ID from auth.users

-- Brand Profile
insert into public.brand_profiles (user_id, brand_name, target_audience, mission, tone_rules, preferred_ctas, banned_phrases)
values (
  'YOUR-USER-UUID',
  'Change180',
  'Women 30-55 navigating personal reinvention',
  'Empowering women to rewrite their stories with clarity, courage, and sustained action.',
  'Warm, direct, hopeful. Never preachy or condescending.',
  'DM me, Save this, Share with someone who needs this',
  'Just be positive, hustle harder, good vibes only'
);

-- Content Posts
insert into public.content_posts (user_id, platform, content_type, pillar, goal, tone, topic, context, status, hook, body, cta, hashtags, visual_direction, scheduled_for)
values
  (
    'YOUR-USER-UUID',
    'Instagram', 'Caption Post', 'Mindset Shifts', 'Engagement',
    'Grounded, hopeful, direct',
    'Reset after a hard week',
    'Encourage honest reflection and small action.',
    'draft',
    'You do not need a new life overnight. You need one honest step today.',
    'Growth is rarely loud. Sometimes it looks like a hard conversation, a boundary kept, or a quiet decision to stop betraying yourself.',
    'Save this for the day you need a reset.',
    ARRAY['#Change180', '#MindsetShift', '#PersonalGrowth'],
    'Soft cream quote graphic with teal heading.',
    null
  ),
  (
    'YOUR-USER-UUID',
    'LinkedIn', 'Carousel', 'Practical Action', 'Education',
    'Reflective and clarifying',
    'Five signs you need clarity',
    'Professional audience dealing with burnout.',
    'approved',
    'Clarity often solves what pressure never will.',
    'Slide outline: five signals that point to confusion, not laziness, and one next step for each.',
    'Share this with someone carrying too much mental noise.',
    ARRAY['#Leadership', '#Clarity', '#Change180'],
    'Clean carousel with teal numerals and cream backgrounds.',
    '2026-03-18'
  ),
  (
    'YOUR-USER-UUID',
    'Facebook', 'Reel Script', 'Hope and Transformation', 'Community Building',
    'Warm and invitational',
    'Hope after self-sabotage',
    'Speak to people who feel behind in life.',
    'scheduled',
    'Your story is not over because you lost momentum.',
    'Short reel script about returning to truth after shame and restarting without dramatics.',
    'Message Change180 if you are ready to rebuild with guidance.',
    ARRAY['#Hope', '#Healing', '#Change180'],
    'Talking-head reel with subtitles and warm natural light.',
    '2026-03-20'
  );

-- Performance Log
insert into public.performance_logs (user_id, post_title, platform, outcome, insight, next_move)
values (
  'YOUR-USER-UUID',
  'Reset after a hard week',
  'Instagram',
  'Strong saves and shares',
  'Short hooks paired with grounded encouragement performed best.',
  'Create two more mindset reset captions next week.'
);
