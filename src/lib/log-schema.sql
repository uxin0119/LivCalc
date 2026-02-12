-- Calculator Logs 테이블
CREATE TABLE IF NOT EXISTS calculator_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  daily_available BIGINT NOT NULL,
  total_expense BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_calculator_logs_user_date ON calculator_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_calculator_logs_created_at ON calculator_logs(created_at);
