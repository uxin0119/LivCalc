-- Calculator Data 테이블
CREATE TABLE IF NOT EXISTS calculator_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_calculator_data_user_id ON calculator_data(user_id);

-- RLS 활성화
ALTER TABLE calculator_data ENABLE ROW LEVEL SECURITY;
