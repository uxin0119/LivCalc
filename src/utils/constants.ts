// 게임 상수 정의

export const GAME_CONSTANTS = {
  // 초기 스탯
  INITIAL_CLICK_DAMAGE: 1,
  INITIAL_AUTO_ATTACK_DPS: 0,
  INITIAL_CRITICAL_CHANCE: 0,
  INITIAL_CRITICAL_MULTIPLIER: 2,
  INITIAL_GOLD: 0,
  INITIAL_LEVEL: 1,
  INITIAL_EXP: 0,

  // 레벨링
  BASE_EXP_TO_LEVEL: 100,
  EXP_SCALING: 1.5, // 레벨당 필요 경험치 증가율

  // 적 스탯 (레벨별 스케일링)
  ENEMY_BASE_HEALTH: 10,
  ENEMY_HEALTH_SCALING: 1.5,
  ENEMY_GOLD_REWARD: 50, // 테스트용으로 증가
  ENEMY_GOLD_SCALING: 1.5, // 레벨당 증가율도 상향
  ENEMY_EXP_REWARD: 20, // 경험치도 증가
  ENEMY_EXP_SCALING: 1.3,

  // 업그레이드 비용
  UPGRADE_COSTS: {
    clickDamage: {
      base: 10,
      multiplier: 1.5,
    },
    autoAttack: {
      base: 50,
      multiplier: 2,
    },
    criticalChance: {
      base: 100,
      multiplier: 2,
    },
    goldMultiplier: {
      base: 200,
      multiplier: 2.5,
    },
  },

  // 업그레이드 효과
  UPGRADE_EFFECTS: {
    clickDamageIncrease: 1,
    autoAttackIncrease: 1,
    criticalChanceIncrease: 5, // 5% 씩 증가
    goldMultiplierIncrease: 0.1, // 10% 씩 증가
  },

  // 게임 설정
  AUTO_SAVE_INTERVAL: 10000, // 10초마다 자동 저장
  AUTO_ATTACK_INTERVAL: 1000, // 1초마다 자동 공격
  STORAGE_KEY: 'hidden_clicker_save',
  SYSTEM_MONITOR_DUNGEON_STORAGE_KEY: 'system_monitor_dungeon_save',
} as const;
