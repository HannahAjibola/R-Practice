/*
  # Create leaderboard table

  1. New Tables
    - `leaderboard`
      - `id` (uuid, primary key, auto-generated)
      - `player_name` (text, not null) - Display name of the player
      - `score` (integer, not null) - Final score achieved
      - `best_tile` (integer, not null) - Highest tile value reached
      - `created_at` (timestamptz, default now()) - When the score was submitted

  2. Security
    - Enable RLS on `leaderboard` table
    - Allow anyone to read the leaderboard (public SELECT)
    - Allow anyone to insert scores (public INSERT) - no auth required for casual game
    - Prevent updates and deletes to preserve score integrity

  3. Notes
    - This is a casual game leaderboard, so we allow unauthenticated inserts
    - Scores cannot be modified or deleted once submitted
    - An index on score (descending) optimizes the leaderboard query
*/

CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL CHECK (char_length(player_name) BETWEEN 1 AND 20),
  score integer NOT NULL CHECK (score >= 0),
  best_tile integer NOT NULL CHECK (best_tile >= 2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_leaderboard_score_desc ON leaderboard (score DESC);

CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can submit scores"
  ON leaderboard FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
