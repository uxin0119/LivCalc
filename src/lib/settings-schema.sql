-- Site Settings 테이블
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- 초기 데이터 삽입 (없을 경우)
-- calendar_retention_period: 데이터 보관 기간 (개월 단위)
INSERT INTO site_settings (key, value) VALUES ('calendar_retention_period', '2') ON CONFLICT DO NOTHING;
-- admin_email: 관리자 이메일 (초기값 없음)
INSERT INTO site_settings (key, value) VALUES ('admin_email', '') ON CONFLICT DO NOTHING;