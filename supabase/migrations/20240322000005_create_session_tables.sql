-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  pin TEXT NOT NULL,
  host_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session_viewers table
CREATE TABLE IF NOT EXISTS session_viewers (
  id SERIAL PRIMARY KEY,
  session_id TEXT REFERENCES sessions(session_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  connection_quality TEXT DEFAULT 'good',
  UNIQUE(session_id, user_id)
);

-- Create session_content table
CREATE TABLE IF NOT EXISTS session_content (
  id SERIAL PRIMARY KEY,
  session_id TEXT REFERENCES sessions(session_id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_source TEXT NOT NULL,
  content_title TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session_messages table
CREATE TABLE IF NOT EXISTS session_messages (
  id SERIAL PRIMARY KEY,
  session_id TEXT REFERENCES sessions(session_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  message_type TEXT NOT NULL,
  message_text TEXT NOT NULL,
  video_timestamp FLOAT,
  reaction_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session_playback_state table
CREATE TABLE IF NOT EXISTS session_playback_state (
  id SERIAL PRIMARY KEY,
  session_id TEXT REFERENCES sessions(session_id) ON DELETE CASCADE,
  is_playing BOOLEAN DEFAULT false,
  current_playback_time FLOAT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT NOT NULL
);

-- Enable realtime for all tables
alter publication supabase_realtime add table sessions;
alter publication supabase_realtime add table session_viewers;
alter publication supabase_realtime add table session_content;
alter publication supabase_realtime add table session_messages;
alter publication supabase_realtime add table session_playback_state;