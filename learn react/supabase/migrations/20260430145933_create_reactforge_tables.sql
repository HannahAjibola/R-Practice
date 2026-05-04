/*
  # Create ReactForge database schema (profiles table already exists)

  1. New Tables
    - `lesson_progress`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, not null, foreign key to profiles.id)
      - `lesson_id` (text, not null) - e.g. "01-what-is-react"
      - `status` (text, not null, default 'not_started') - 'not_started', 'in_progress', 'completed'
      - `completed_at` (timestamptz, nullable)
      - `created_at` (timestamptz, default now())

    - `quiz_results`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, not null, foreign key to profiles.id)
      - `lesson_id` (text, not null) - Which lesson the quiz belongs to
      - `score` (integer, not null) - Number of correct answers
      - `total` (integer, not null) - Total questions
      - `answers` (jsonb, default '{}') - Stored answers for review
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Users can only CRUD their own data
    - Lesson progress: full CRUD on own progress
    - Quiz results: insert and read own results

  3. Indexes
    - lesson_progress: unique index on user_id + lesson_id
    - quiz_results: index on user_id + lesson_id
*/

-- Lesson Progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS idx_lesson_progress_user_lesson ON lesson_progress (user_id, lesson_id);

CREATE POLICY "Users can read own progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON lesson_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Quiz Results
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  score integer NOT NULL,
  total integer NOT NULL,
  answers jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_quiz_results_user_lesson ON quiz_results (user_id, lesson_id);

CREATE POLICY "Users can read own quiz results"
  ON quiz_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
