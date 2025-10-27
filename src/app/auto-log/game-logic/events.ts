// 이벤트 노드 시스템

import { Process, Item, Consumable } from '../types/game';

export interface EventChoice {
  id: string;
  text: string;
  command: string; // New property for the command to be used
  outcome: EventOutcome;
}

export interface EventOutcome {
  type: 'gain_process' | 'lose_process' | 'gain_btc' | 'lose_btc' | 'gain_integrity' | 'lose_integrity' | 'gain_item' | 'start_combat' | 'gain_consumable' | 'mixed';
  value?: number;
  process?: Process;
  item?: Item;
  consumable?: Consumable;
  description: string;
  combatDifficulty?: 'normal' | 'elite' | 'boss';
}

export interface GameEvent {
  id: string;
  title: string;
  description: string[];
  icon: string;
  choices: EventChoice[];
  rarity: 'common' | 'uncommon' | 'rare';
}

// 모든 이벤트 정의
export const ALL_EVENTS: GameEvent[] = [
  // 1. 익명의 지원자 (High Risk/High Reward)
  {
    id: 'anonymous_helper',
    title: '익명의 지원자',
    description: [
      '[INCOMING_MSG] Encrypted message received...',
      '[DECRYPT] "I can help you... for a price."',
      '[UNKNOWN] "Give me half your integrity, and I\'ll give you something powerful."',
      '[PROMPT] This stranger offers a dangerous deal...'
    ],
    icon: '🎭',
    choices: [
      {
        id: 'accept',
        text: 'Accept the deal',
        command: 'accept',
        outcome: {
          type: 'mixed',
          description: 'You lose half your integrity but gain a powerful rare process',
          value: -50 // percentage
        }
      },
      {
        id: 'decline',
        text: 'Decline and move on',
        command: 'decline',
        outcome: {
          type: 'gain_integrity',
          value: 5,
          description: 'You wisely decline. Gained 5 integrity for being cautious.'
        }
      }
    ],
    rarity: 'rare'
  },

  // 2. 다크웹 의뢰인
  {
    id: 'darkweb_contract',
    title: '다크웹 의뢰',
    description: [
      '[DARKWEB] Anonymous contract posted...',
      '[CONTRACT] "I need someone to breach a high-security server."',
      '[REWARD] "Payment: Double the usual rate."',
      '[WARNING] Target has advanced security systems...'
    ],
    icon: '💼',
    choices: [
      {
        id: 'accept_contract',
        text: 'Accept the contract',
        command: 'accept_contract',
        outcome: {
          type: 'start_combat',
          combatDifficulty: 'elite',
          description: 'You engage a heavily defended server. Rewards doubled on victory!'
        }
      },
      {
        id: 'decline_contract',
        text: 'Decline the contract',
        command: 'decline_contract',
        outcome: {
          type: 'gain_btc',
          value: 5,
          description: 'You decline. Found 5 ₿ in the message metadata.'
        }
      }
    ],
    rarity: 'uncommon'
  },

  // 3. 보안 전문가 (정직한)
  {
    id: 'security_expert_trade',
    title: '보안 전문가',
    description: [
      '[CHAT_REQUEST] Security researcher wants to talk...',
      '[MESSAGE] "I\'m studying exploit techniques."',
      '[OFFER] "I\'ll pay good money for one of your processes."',
      '[VERIFY] Digital signature verified - legitimate researcher'
    ],
    icon: '👨‍💻',
    choices: [
      {
        id: 'sell_process',
        text: 'Sell a random process',
        command: 'sell_process',
        outcome: {
          type: 'lose_process',
          value: 15, // BTC gained
          description: 'Sold a random process for 15 ₿ Bitcoin'
        }
      },
      {
        id: 'keep_processes',
        text: 'Keep your processes',
        command: 'keep_processes',
        outcome: {
          type: 'gain_btc',
          value: 3,
          description: 'Declined. The researcher gives you 3 ₿ for your time.'
        }
      }
    ],
    rarity: 'common'
  },

  // 4. 피싱 전문가 (사기꾼)
  {
    id: 'phishing_scam',
    title: '보안 업데이트?',
    description: [
      '[ALERT] Security update available!',
      '[SYSTEM] "Your system is out of date."',
      '[PROMPT] "Install security patch now?"',
      '[SUSPICIOUS] Something feels off about this message...'
    ],
    icon: '🎣',
    choices: [
      {
        id: 'install',
        text: 'Install the "update"',
        command: 'update',
        outcome: {
          type: 'mixed',
          value: 50, // 50% good, 50% bad
          description: 'Installing unknown software... This could go either way.'
        }
      },
      {
        id: 'ignore',
        text: 'Ignore and scan for malware',
        command: 'ignore',
        outcome: {
          type: 'gain_btc',
          value: 8,
          description: 'Good instincts! Found 8 ₿ in the scammer\'s wallet.'
        }
      }
    ],
    rarity: 'common'
  },

  // 5. 다크웹 게시글 (0-day Exploit)
  {
    id: 'darkweb_exploit',
    title: '다크웹 게시글',
    description: [
      '[FORUM] New post on underground forum...',
      '[USER] "Critical 0-day exploit leaked!"',
      '[DOWNLOAD] Download link: ████████.onion',
      '[WARNING] Could be legitimate... or a honeypot'
    ],
    icon: '💀',
    choices: [
      {
        id: 'download',
        text: 'Download the exploit',
        command: 'download',
        outcome: {
          type: 'mixed',
          description: '50% chance: Powerful exploit OR Malware infection',
          value: 50 // percentage chance
        }
      },
      {
        id: 'report',
        text: 'Report to authorities',
        command: 'report',
        outcome: {
          type: 'gain_btc',
          value: 12,
          description: 'Bug bounty reward: 12 ₿ Bitcoin'
        }
      }
    ],
    rarity: 'rare'
  },

  // 6. 버그 바운티
  {
    id: 'bug_bounty',
    title: '취약점 발견',
    description: [
      '[r/netsec] Posted 2 hours ago by u/anonymous_researcher',
      '',
      '"I found a critical RCE in a major cloud provider"',
      '',
      'So I was doing some routine pentesting and stumbled upon something huge.',
      'Turns out there\'s an unpatched buffer overflow in their authentication module.',
      'Full remote code execution. No user interaction needed. CVSS 9.8.',
      '',
      'I can literally pop a shell on any server in their infrastructure.',
      'The vendor has a bug bounty program offering up to $50k for critical vulns.',
      '',
      'But honestly? I could sell this on the dark web for 10x that amount.',
      'Or use it myself for... you know, whatever.',
      '',
      'Part of me wants to do the right thing. Part of me wants the money.',
      'What would you do?',
      '',
      'Edit: Yes, I\'ve already written a working PoC exploit.',
      'Edit2: Stop DMing me asking to buy it lol',
      '',
      '[⬆ 847] [💬 234 comments] [Share] [Save]'
    ],
    icon: '🐛',
    choices: [
      {
        id: 'report_vuln',
        text: 'Report to bug bounty program',
        command: 'report_vuln',
        outcome: {
          type: 'gain_btc',
          value: 20,
          description: 'Ethical choice! Gained 20 ₿ and restored 10 integrity.'
        }
      },
      {
        id: 'exploit_vuln',
        text: 'Weaponize the vulnerability',
        command: 'exploit_vuln',
        outcome: {
          type: 'gain_process',
          description: 'Gained a powerful attack process, but at what cost?'
        }
      }
    ],
    rarity: 'uncommon'
  },

  // 7. 랜섬웨어 갱
  {
    id: 'ransomware_gang',
    title: '랜섬웨어 갱',
    description: [
      '[THREAT] Your files have been encrypted!',
      '[DEMAND] "Pay 15 ₿ or lose everything!"',
      '[TIMER] Time remaining: 24:00:00',
      '[CHOICE] Pay or fight back?'
    ],
    icon: '🔒',
    choices: [
      {
        id: 'pay_ransom',
        text: 'Pay the ransom',
        command: 'pay_ransom',
        outcome: {
          type: 'lose_btc',
          value: 15,
          description: 'Files restored. Lost 15 ₿ Bitcoin.'
        }
      },
      {
        id: 'fight_back',
        text: 'Trace and counterattack',
        command: 'fight_back',
        outcome: {
          type: 'start_combat',
          combatDifficulty: 'normal',
          description: 'You traced their server! Prepare for battle.'
        }
      }
    ],
    rarity: 'uncommon'
  },

  // 8. 해커 포럼 (정보 교환)
  {
    id: 'hacker_forum_trade',
    title: '해커 포럼',
    description: [
      '[FORUM] Elite hacker community',
      '[TRADER] "I\'ll trade you a rare technique..."',
      '[OFFER] "Give me one of your processes, get one of mine."',
      '[REPUTATION] Trusted trader: ⭐⭐⭐⭐⭐'
    ],
    icon: '💬',
    choices: [
      {
        id: 'trade',
        text: 'Trade a common for a rare',
        command: 'trade',
        outcome: {
          type: 'mixed',
          description: 'Traded a random process for a rare one!'
        }
      },
      {
        id: 'no_trade',
        text: 'Decline the trade',
        command: 'no_trade',
        outcome: {
          type: 'gain_consumable',
          description: 'The trader gives you a consumable as a gesture of goodwill.'
        }
      }
    ],
    rarity: 'uncommon'
  },

  // 9. 시스템 관리자의 실수
  {
    id: 'admin_mistake',
    title: '관리자의 실수',
    description: [
      '[DISCOVERY] Found an unprotected server...',
      '[FILE] "passwords.txt" - Last modified: Today',
      '[CONTENTS] "admin:Password123"',
      '[LUCKY] Easy pickings!'
    ],
    icon: '🍀',
    choices: [
      {
        id: 'steal_data',
        text: 'Extract valuable data',
        command: 'steal_data',
        outcome: {
          type: 'gain_btc',
          value: 18,
          description: 'Easy money! Gained 18 ₿ Bitcoin.'
        }
      },
      {
        id: 'leave_note',
        text: 'Leave anonymous security tip',
        command: 'leave_note',
        outcome: {
          type: 'gain_integrity',
          value: 15,
          description: 'Good karma! Restored 15 integrity.'
        }
      }
    ],
    rarity: 'common'
  },

  // 10. 미스터리 패킷
  {
    id: 'mystery_packet',
    title: '미스터리 패킷',
    description: [
      '[INTERCEPT] Strange data packet captured...',
      '[ANALYSIS] Unknown origin, unknown purpose',
      '[CONTENTS] Encrypted payload detected',
      '[CURIOSITY] Execute it or destroy it?'
    ],
    icon: '📦',
    choices: [
      {
        id: 'execute',
        text: 'Execute the packet',
        command: 'execute',
        outcome: {
          type: 'mixed',
          value: 50, // 50% good, 50% bad
          description: 'Gambling... Good luck!'
        }
      },
      {
        id: 'destroy',
        text: 'Safely destroy it',
        command: 'destroy',
        outcome: {
          type: 'gain_integrity',
          value: 8,
          description: 'Safe choice. Gained 8 integrity.'
        }
      }
    ],
    rarity: 'common'
  },

  // 11. APT 그룹 초대
  {
    id: 'apt_invitation',
    title: 'APT 그룹 초대',
    description: [
      '[ENCRYPTED_MSG] You\'ve been noticed...',
      '[OFFER] "Join our Advanced Persistent Threat group"',
      '[BENEFITS] Access to military-grade exploits',
      '[COST] Complete loyalty required'
    ],
    icon: '🕵️',
    choices: [
      {
        id: 'join_apt',
        text: 'Join the APT group',
        command: 'join_apt',
        outcome: {
          type: 'mixed',
          description: 'Gained powerful tools, but you\'re being watched...'
        }
      },
      {
        id: 'decline_apt',
        text: 'Politely decline',
        command: 'decline_apt',
        outcome: {
          type: 'gain_btc',
          value: 10,
          description: 'Independence maintained. Gained 10 ₿.'
        }
      }
    ],
    rarity: 'rare'
  },

  // 12. 데이터 브로커
  {
    id: 'data_broker',
    title: '데이터 브로커',
    description: [
      '[CONTACT] Black market data broker',
      '[OFFER] "I buy exploits in bulk"',
      '[PAYMENT] "3 processes for 25 ₿"',
      '[MARKET] Current market rate above average'
    ],
    icon: '💰',
    choices: [
      {
        id: 'sell_bulk',
        text: 'Sell 3 processes',
        command: 'sell_bulk',
        outcome: {
          type: 'mixed',
          value: 25, // BTC value
          description: 'Sold 3 random processes for 25 ₿'
        }
      },
      {
        id: 'keep_all',
        text: 'Keep your arsenal',
        command: 'keep_all',
        outcome: {
          type: 'gain_consumable',
          description: 'The broker gives you a sample product.'
        }
      }
    ],
    rarity: 'uncommon'
  }
];

// 랜덤 이벤트 선택
export function getRandomEvent(): GameEvent {
  const rng = Math.random();

  let filteredEvents: GameEvent[];

  // 레어도별 확률
  if (rng < 0.10) {
    // 10% 확률로 rare
    filteredEvents = ALL_EVENTS.filter(e => e.rarity === 'rare');
  } else if (rng < 0.35) {
    // 25% 확률로 uncommon
    filteredEvents = ALL_EVENTS.filter(e => e.rarity === 'uncommon');
  } else {
    // 65% 확률로 common
    filteredEvents = ALL_EVENTS.filter(e => e.rarity === 'common');
  }

  if (filteredEvents.length === 0) {
    filteredEvents = ALL_EVENTS.filter(e => e.rarity === 'common');
  }

  return filteredEvents[Math.floor(Math.random() * filteredEvents.length)];
}
