/*
  # Create DevPulse database schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users.id
      - `display_name` (text, not null) - User's display name
      - `created_at` (timestamptz, default now())

    - `tasks`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, not null, foreign key to profiles.id)
      - `title` (text, not null) - Task description
      - `status` (text, not null, default 'todo') - One of: 'todo', 'in_progress', 'done'
      - `priority` (text, not null, default 'medium') - One of: 'low', 'medium', 'high'
      - `pomodoros_estimated` (integer, default 1) - Estimated pomodoro sessions
      - `pomodoros_completed` (integer, default 0) - Completed pomodoro sessions
      - `sort_order` (integer, default 0) - For ordering within status
      - `created_at` (timestamptz, default now())
      - `completed_at` (timestamptz, nullable) - When task was marked done

    - `standup_notes`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, not null, foreign key to profiles.id)
      - `date` (date, not null) - The standup date
      - `yesterday` (text, default '') - What I did yesterday
      - `today` (text, default '') - What I'm doing today
      - `blockers` (text, default '') - What's blocking me
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `pomodoro_sessions`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, not null, foreign key to profiles.id)
      - `task_id` (uuid, nullable, foreign key to tasks.id) - Optional link to task
      - `duration_minutes` (integer, not null, default 25) - Session duration
      - `type` (text, not null, default 'focus') - 'focus' or 'break'
      - `completed_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Users can only CRUD their own data
    - Profiles: users read/update own profile only
    - Tasks: full CRUD on own tasks
    - Standup notes: full CRUD on own notes
    - Pomodoro sessions: insert and read own sessions

  3. Indexes
    - tasks: index on user_id + status for filtered queries
    - standup_notes: unique index on user_id + date (one standup per day)
    - pomodoro_sessions: index on user_id + completed_at for daily stats
*/

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  pomodoros_estimated integer DEFAULT 1,
  pomodoros_completed integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks (user_id, status);

CREATE POLICY "Users can read own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Standup Notes
CREATE TABLE IF NOT EXISTS standup_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  yesterday text DEFAULT '',
  today text DEFAULT '',
  blockers text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE standup_notes ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX IF NOT EXISTS idx_standup_user_date ON standup_notes (user_id, date);

CREATE POLICY "Users can read own standup notes"
  ON standup_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own standup notes"
  ON standup_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own standup notes"
  ON standup_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own standup notes"
  ON standup_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Pomodoro Sessions
CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  duration_minutes integer NOT NULL DEFAULT 25,
  type text NOT NULL DEFAULT 'focus' CHECK (type IN ('focus', 'break')),
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_pomodoro_user_date ON pomodoro_sessions (user_id, completed_at DESC);

CREATE POLICY "Users can read own pomodoro sessions"
  ON pomodoro_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pomodoro sessions"
  ON pomodoro_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-update updated_at on standup_notes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_standup_updated_at ON standup_notes;
CREATE TRIGGER trigger_standup_updated_at
  BEFORE UPDATE ON standup_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
