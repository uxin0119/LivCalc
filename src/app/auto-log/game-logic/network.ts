// 네트워크 맵 생성 및 관리 (리팩토링 버전)

import { NetworkNode, NetworkMap, NodeType, LogEntry } from '../types/game';
import { MAP_CONFIG } from './constants';
import { createLog } from './combat';

// --- 헬퍼 함수 ---

function generateIP(layer: number, index: number): string {
  return `10.${Math.floor(Math.random() * 255)}.${layer}.${index}`;
}

function generateNodeName(type: NodeType): string {
  const names = {
    combat: ['web_server', 'database', 'api_gateway', 'cache_server'],
    elite: ['firewall_cluster', 'ids_system', 'security_hub'],
    event: ['corrupted_data', 'backdoor', 'honeypot'],
    shop: ['darknet_market', 'underground_exchange'],
    rest: ['safe_zone', 'isolated_subnet'],
    boss: ['mainframe_core', 'central_command']
  };
  const pool = names[type] || ['unknown_node'];
  return `${pool[Math.floor(Math.random() * pool.length)]}.${['sys', 'db', 'srv'][Math.floor(Math.random() * 3)]}`;
}

function generateNodeDescription(type: NodeType): string {
  const descriptions = {
    combat: 'Standard security system. Moderate threat level.',
    elite: 'Hardened security node. High threat level. Better rewards.',
    event: 'Unknown data signature detected. Proceed with caution.',
    shop: 'Black market server. Purchase upgrades and services.',
    rest: 'Unmonitored subnet. Safe for recovery operations.',
    boss: 'Primary target system. Maximum security protocols active.'
  };
  return descriptions[type] || 'Unknown node type.';
}

function getRandomNodeType(isElitePossible: boolean): NodeType {
  if (isElitePossible && Math.random() < MAP_CONFIG.ELITE_COMBAT_CHANCE) {
    return 'elite';
  }
  const weights = MAP_CONFIG.NODE_TYPE_WEIGHTS;
  const rand = Math.random();
  let cumulative = 0;
  for (const type in weights) {
    cumulative += weights[type as keyof typeof weights];
    if (rand < cumulative) {
      return type as NodeType;
    }
  }
  return 'combat'; // Fallback
}

// --- 새로운 맵 생성 알고리즘 ---

export function generateNetworkMap(floor: number): NetworkMap {
  const nodes: NetworkNode[] = [];
  const layers: NetworkNode[][] = [];
  let nodeIdCounter = 0;

  // 1. 레이어별 노드 생성
  for (let i = 0; i < MAP_CONFIG.LAYERS; i++) {
    const layerNodes: NetworkNode[] = [];
    const numNodes = Math.max(1, MAP_CONFIG.NODES_PER_LAYER[i] + Math.floor(Math.random() * 3) - 1); // 최소 1개 보장

    for (let j = 0; j < numNodes; j++) {
      let nodeType = getRandomNodeType(i > 1); // 첫 2개 레이어는 엘리트 없음

      // 보장된 노드 타입 적용
      if (MAP_CONFIG.GUARANTEED_NODES.shop === i + 1) {
        nodeType = 'shop';
      }
      if (MAP_CONFIG.GUARANTEED_NODES.rest === i + 1) {
        nodeType = 'rest';
      }

      const newNode: NetworkNode = {
        id: `node_${nodeIdCounter++}`,
        ip: generateIP(i + 1, j + 1),
        type: nodeType,
        name: generateNodeName(nodeType),
        description: generateNodeDescription(nodeType),
        status: 'locked',
        connections: [],
        layer: i + 1,
      };
      layerNodes.push(newNode);
    }
    layers.push(layerNodes);
    nodes.push(...layerNodes);
  }

  // 2. 시작 노드 및 보스 노드 생성
  const startNode: NetworkNode = {
    id: `node_${nodeIdCounter++}`,
    ip: generateIP(0, 1),
    type: 'combat', // 시작은 항상 전투
    name: 'entry_point.sys',
    description: 'Network entry point.',
    status: 'current',
    connections: [],
    layer: 0,
  };
  nodes.unshift(startNode);

  const bossNode: NetworkNode = {
    id: `node_${nodeIdCounter++}`,
    ip: generateIP(MAP_CONFIG.LAYERS + 1, 1),
    type: 'boss',
    name: generateNodeName('boss'),
    description: generateNodeDescription('boss'),
    status: 'locked',
    connections: [],
    layer: MAP_CONFIG.LAYERS + 1,
  };
  nodes.push(bossNode);

  // 3. 경로 연결
  // 시작 -> 첫 레이어
  layers[0].forEach(node => startNode.connections.push(node.ip));

  // 중간 레이어들 연결
  for (let i = 0; i < layers.length - 1; i++) {
    const currentLayer = layers[i];
    const nextLayer = layers[i + 1];

    // 레이어 1의 모든 노드를 레이어 2의 모든 노드에 연결
    if (i === 0) {
        currentLayer.forEach(node => {
            nextLayer.forEach(nextNode => {
                if (!node.connections.includes(nextNode.ip)) {
                    node.connections.push(nextNode.ip);
                }
            });
        });
    } else {
        currentLayer.forEach(node => {
            // 최소 1개는 무조건 연결
            const targetIndex = Math.floor(Math.random() * nextLayer.length);
            if (!node.connections.includes(nextLayer[targetIndex].ip)) {
                node.connections.push(nextLayer[targetIndex].ip);
            }

            // 분기 확률에 따라 추가 연결
            if (Math.random() < MAP_CONFIG.BRANCHING_FACTOR) {
                const extraTargetIndex = Math.floor(Math.random() * nextLayer.length);
                if (!node.connections.includes(nextLayer[extraTargetIndex].ip)) {
                    node.connections.push(nextLayer[extraTargetIndex].ip);
                }
            }
        });
    }
}
  
  // 마지막 레이어 -> 보스
  layers[layers.length - 1].forEach(node => node.connections.push(bossNode.ip));

  // 4. 시작 노드에서 접근 가능한 노드 상태 변경
  startNode.connections.forEach(ip => {
    const node = nodes.find(n => n.ip === ip);
    if (node) node.status = 'available';
  });

  return {
    floor,
    nodes,
    currentNodeId: startNode.id,
    completedCount: 1, // 시작 노드는 완료된 것으로 간주
  };
}


// --- 기존 유틸리티 함수 (일부 수정) ---

export function findNodeByIP(map: NetworkMap, ip: string): NetworkNode | null {
  return map.nodes.find(n => n.ip === ip) || null;
}

export function findNodeById(map: NetworkMap, id: string): NetworkNode | null {
  return map.nodes.find(n => n.id === id) || null;
}

export function getCurrentNode(map: NetworkMap): NetworkNode | null {
  return findNodeById(map, map.currentNodeId);
}

export function getConnectedNodes(map: NetworkMap, nodeIp: string): NetworkNode[] {
  const node = findNodeByIP(map, nodeIp);
  if (!node) return [];
  return node.connections
    .map(ip => findNodeByIP(map, ip))
    .filter((n): n is NetworkNode => n !== null);
}

export function getAvailableNodes(map: NetworkMap): NetworkNode[] {
  const current = getCurrentNode(map);
  if (!current) return [];
  return getConnectedNodes(map, current.ip).filter(node => node.status === 'available');
}

export function completeNode(map: NetworkMap, nodeId: string): NetworkMap {
  const completedNode = map.nodes.find(n => n.id === nodeId);
  if (!completedNode) return map;

  const nodesToUnlock = completedNode.connections;

  const updatedNodes = map.nodes.map(node => {
    // 1. 완료된 노드의 상태를 변경합니다.
    if (node.id === nodeId) {
      return { ...node, status: 'compromised' as const };
    }
    // 2. 연결된 다음 노드들의 상태를 'available'로 변경합니다.
    if (nodesToUnlock.includes(node.ip) && node.status === 'locked') {
      return { ...node, status: 'available' as const };
    }
    return node;
  });

  return {
    ...map,
    nodes: updatedNodes,
    completedCount: map.completedCount + 1,
  };
}

export function moveToNode(map: NetworkMap, targetIp: string): NetworkMap | null {
    const targetNode = findNodeByIP(map, targetIp);
    const currentNode = getCurrentNode(map);

    // 이동 유효성 검사
    if (!targetNode || !currentNode || !currentNode.connections.includes(targetIp) || targetNode.status !== 'available') {
        return null;
    }

    const updatedNodes = map.nodes.map(node => {
        // 현재 노드를 'compromised'로 설정
        if (node.id === currentNode.id) {
            return { ...node, status: 'compromised' as const };
        }
        // 목표 노드를 'current'로 설정합니다.
        if (node.id === targetNode.id) {
            return { ...node, status: 'current' as const };
        }
        return node;
    });

    return {
        ...map,
        nodes: updatedNodes,
        currentNodeId: targetNode.id,
    };
}

export function getNodeIcon(type: NodeType): string {
  const icons: Record<NodeType, string> = {
    combat: '[C]',
    elite: '[E]',
    event: '[?]',
    shop: '[$]',
    rest: '[R]',
    boss: '[B]'
  };
  return icons[type] || '[?]';
}

export function getNodeStatusColor(status: 'locked' | 'available' | 'compromised' | 'current'): 'system' | 'success' | 'warning' | 'error' {
  const colors = {
    locked: 'system',
    available: 'success',
    compromised: 'warning',
    current: 'error'
  };
  return colors[status] || 'system';
}

// --- 네트워크 연결 처리 ---

export interface ConnectionResult {
  success: boolean;
  updatedMap?: NetworkMap;
  targetNode?: NetworkNode;
  logs: LogEntry[];
}

export function handleConnect(map: NetworkMap, ip: string): ConnectionResult {
  const targetNode = findNodeByIP(map, ip);

  if (!targetNode) {
    return {
      success: false,
      logs: [createLog('error', `[ERROR] Host ${ip} not found`)]
    };
  }

  const updatedMap = moveToNode(map, ip);

  if (!updatedMap) {
    return {
      success: false,
      logs: [
        createLog('error', `[ERROR] Cannot connect to ${ip}`),
        createLog('warning', '[ACCESS_DENIED] Node is not available from current location')
      ]
    };
  }

  const connectLogs: LogEntry[] = [
    createLog('system', ''),
    createLog('success', `[CONNECTING] ${ip}...`),
    createLog('system', `[HANDSHAKE] Establishing secure connection...`),
    createLog('success', `[CONNECTED] ${targetNode.name}`),
    createLog('system', '')
  ];

  return {
    success: true,
    updatedMap,
    targetNode,
    logs: connectLogs
  };
}
