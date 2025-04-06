-- Create playback state table for synchronized playback
CREATE TABLE IF NOT EXISTS session_playback_state (
  id SERIAL PRIMARY KEY,
  session_id TEXT REFERENCES sessions(session_id),
  is_playing BOOLEAN DEFAULT false,
  current_playback_time FLOAT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by TEXT NOT NULL
);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE session_playback_state;
