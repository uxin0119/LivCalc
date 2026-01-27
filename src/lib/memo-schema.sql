-- Calendar Memos 테이블
CREATE TABLE IF NOT EXISTS calendar_memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  memo_date DATE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, memo_date)
);

CREATE INDEX IF NOT EXISTS idx_calendar_memos_user_date ON calendar_memos(user_id, memo_date);
