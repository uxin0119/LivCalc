// game-logic/constants.ts

/**
 * 네트워크 맵 생성 설정
 */
export const MAP_CONFIG = {
  LAYERS: 7, // 일반 노드 레이어 수 (보스 제외)
  NODES_PER_LAYER: [1, 2, 3, 4, 3, 2, 1], // 레이어별 노드 수 (근사치)
  BRANCHING_FACTOR: 0.4, // 노드가 여러 경로로 갈라질 확률

  // 노드 타입 생성 가중치
  NODE_TYPE_WEIGHTS: {
    combat: 0.6,
    event: 0.25,
    shop: 0.075,
    rest: 0.075,
  },

  // 특정 레이어에 보장되는 노드 타입
  GUARANTEED_NODES: {
    shop: 3, // 3번째 레이어에 상점 보장
    rest: 5, // 5번째 레이어에 휴식처 보장
  },
  
  // 엘리트 노드가 생성될 확률
  ELITE_COMBAT_CHANCE: 0.15, // 일반 전투 노드가 엘리트로 대체될 확률
};
