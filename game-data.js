// 2022 개정 교육과정 고교학점제 공시 과목 편제표 기반 데이터

// 전투/밸런스 수치 전용 설정 (app.js의 데미지 공식 등에서 참조). 값 자체는 기존과 동일하며,
// 코드에 흩어져 있던 매직 넘버를 튜닝하기 쉽도록 한 곳으로 모은 것입니다.
const BALANCE_CONFIG = {
  // 게임 시작 시 초기값
  start: {
    playerHp: 100,
    credits: 12,
    creativeCredits: 2,
    mentorUses: 2
  },

  // 웨이브 시작 시 자기주도역량 비례 자연 회복
  regenPerWave: {
    selfDirectedDivisor: 4
  },

  // 퀴즈 공격(개념 퀴즈 / 심화 탐구 스킬) 데미지 공식
  quizAttack: {
    normal: { min: 48, range: 22 },
    skill: { min: 115, range: 35 },
    rngVarianceMin: 0.86,
    rngVarianceRange: 0.28,
    critChanceCareerMult: 1.5,
    critChanceSkillBonus: 25,
    critChanceCap: 85,
    critDamageMult: 1.55,
    minDamage: 12,
    skillCooldownTurns: 3
  },

  // 오답노트 방어 (회복 + 적 공격 경감)
  guard: {
    healBase: 15,
    healSelfDirectedDivisor: 3,
    healVarianceMin: 0.9,
    healVarianceRange: 0.25,
    enemyDamageMult: 0.4 // 방어 시 적 데미지를 이 배율만큼만 적용 (= 60% 경감)
  },

  // 몬스터 반격 데미지 공식
  enemyAttack: {
    fallbackDmg: 16,
    rngVarianceMin: 0.85,
    rngVarianceRange: 0.30,
    critChance: 15,
    critDamageMult: 1.4,
    minDamage: 4,
    failPenaltyMult: 1.3 // 퀴즈 오답 시 반격 데미지 배율
  },

  // 몬스터 HP 저하 시 분노 각성 모드
  enrage: {
    hpThresholdPct: 35,
    damageMult: 1.35
  },

  // 속성 상성 배율
  matchup: {
    superEffective: { playerMult: 1.5, enemyMult: 0.75 },
    notEffective: { playerMult: 0.75, enemyMult: 1.3 }
  },

  // 전투 승리 시 학점 보상
  victory: {
    bossCredits: 10,
    defaultSubjectCredits: 4
  },

  // 최소성취수준 보장지도(그로기) 회복 비율
  groggy: {
    reviveHpPct: 0.40
  }
};

const GAME_DATA = {
  // 4대 교과 속성 정의
  elements: {
    logic: {
      id: 'logic',
      name: '수리·논리',
      icon: '🟦',
      color: '#3b82f6',
      strongAgainst: 'nature',
      weakAgainst: 'social',
      desc: '자연 현상을 정밀한 수식과 알고리즘으로 명쾌하게 규명합니다. (자연·탐구에 강세)'
    },
    nature: {
      id: 'nature',
      name: '자연·탐구',
      icon: '🟩',
      color: '#10b981',
      strongAgainst: 'fusion',
      weakAgainst: 'logic',
      desc: '막연한 상상을 과학적 실증과 자연 법칙으로 압도합니다. (창의·융합에 강세)'
    },
    fusion: {
      id: 'fusion',
      name: '창의·융합',
      icon: '🟪',
      color: '#a855f7',
      strongAgainst: 'social',
      weakAgainst: 'nature',
      desc: '딱딱한 사회 제도와 규범을 감성적 스토리텔링과 미디어로 혁신합니다. (인문·사회에 강세)'
    },
    social: {
      id: 'social',
      name: '인문·사회',
      icon: '🟨',
      color: '#f59e0b',
      strongAgainst: 'logic',
      weakAgainst: 'fusion',
      desc: '차가운 기계와 알고리즘에 인간 중심의 철학, 법, 윤리적 가치를 부여합니다. (수리·논리에 강세)'
    }
  },

  // 4대 핵심 역량 스탯 정의
  statDefinitions: {
    academic: {
      name: '학업역량',
      icon: '📚',
      color: '#3b82f6',
      desc: '탐구력과 기초 학력. 퀴즈 정답 시 기본 공격 데미지를 증가시킵니다.'
    },
    career: {
      name: '진로역량',
      icon: '🎯',
      color: '#8b5cf6',
      desc: '진로 관심 분야에 대한 전문성. 진로 연계 과목 조우 시 크리티컬 확률 및 위력을 높입니다.'
    },
    selfDirected: {
      name: '자기주도역량',
      icon: '⚡',
      color: '#f59e0b',
      desc: '계획 수립과 회복탄력성. 턴마다 멘탈(HP)을 회복하며, 방어 효율을 극대화합니다.'
    },
    community: {
      name: '공동체역량',
      icon: '🤝',
      color: '#10b981',
      desc: '협업과 나눔의 리더십. 학교생활 돌발 이벤트에서 특별 선택지를 해금하고 멘토링을 돕습니다.'
    }
  },

  // 진로 트랙 (스타팅) - 2022 개정 연계
  tracks: [
    {
      id: 'tech',
      name: 'AI·소프트웨어 공학',
      element: 'logic',
      icon: '💻',
      desc: '대수, 미적분, 정보, 인공지능 기초, 로봇과 공학세계를 탐구하는 트랙',
      color: '#3b82f6',
      initialStats: { academic: 25, career: 30, selfDirected: 20, community: 15 },
      targetSubjects: ['ai_basic', 'info', 'algebra', 'calculus1', 'calculus2', 'physics', 'robotics_eng']
    },
    {
      id: 'bio',
      name: '의약·생명과학',
      element: 'nature',
      icon: '🧬',
      desc: '통합과학, 물리학, 화학, 생명과학, 생물의 유전을 탐구하는 트랙',
      color: '#10b981',
      initialStats: { academic: 30, career: 25, selfDirected: 20, community: 15 },
      targetSubjects: ['sci_common1', 'biology', 'chemistry', 'gene_heredity', 'quantum_em']
    },
    {
      id: 'social',
      name: '인문·사회·글로벌 리더',
      element: 'social',
      icon: '🌍',
      desc: '통합사회, 세계사, 사회와 문화, 정치·법과 사회, 국제 관계의 이해를 이끄는 트랙',
      color: '#f59e0b',
      initialStats: { academic: 20, career: 25, selfDirected: 15, community: 30 },
      targetSubjects: ['soc_common1', 'soc_culture', 'politics_law_soc', 'world_history', 'intl_relations', 'social_problem']
    },
    {
      id: 'art',
      name: '창의·문화·융합예술',
      element: 'fusion',
      icon: '🎨',
      desc: '공통영어, 음악·미술, 매체 의사소통, 음악과 미디어를 융합 창작하는 트랙',
      color: '#ec4899',
      initialStats: { academic: 20, career: 25, selfDirected: 30, community: 15 },
      targetSubjects: ['english_common1', 'music_art', 'media_comm', 'music_media']
    }
  ],

  // 트랙별 2·3학년 전투과목 조합 & 순서 (트랙 선택이 실제 진행 경로에 반영되도록 함)
  // waveSchedule의 각 학년 전투 웨이브는 trackSlot(0~9) 인덱스로 이 배열을 순서대로 참조합니다.
  trackSubjectRoutes: {
    tech: {
      year2: ['algebra', 'calculus1', 'info', 'physics', 'geometry', 'mechanics_energy', 'earth_sci', 'fusion_science_inquiry', 'global_geo', 'modern_ethics'],
      year3: ['ai_basic', 'calculus2', 'robotics_eng', 'ai_math', 'quantum_em', 'chem_reactions_world', 'economics', 'media_comm', 'literature_and_film', 'social_problem']
    },
    bio: {
      year2: ['biology', 'chemistry', 'physics', 'earth_sci', 'mechanics_energy', 'fusion_science_inquiry', 'modern_ethics', 'algebra', 'calculus1', 'global_geo'],
      year3: ['gene_heredity', 'quantum_em', 'chem_reactions_world', 'ai_basic', 'ai_math', 'economics', 'social_problem', 'intl_relations', 'politics_law_soc', 'calculus2']
    },
    social: {
      year2: ['soc_culture', 'world_history', 'global_geo', 'modern_ethics', 'earth_sci', 'fusion_science_inquiry', 'info', 'algebra', 'calculus1', 'biology'],
      year3: ['politics_law_soc', 'intl_relations', 'social_problem', 'economics', 'media_comm', 'literature_and_film', 'ai_basic', 'gene_heredity', 'music_media', 'quantum_em']
    },
    art: {
      year2: ['fusion_science_inquiry', 'soc_culture', 'world_history', 'global_geo', 'modern_ethics', 'info', 'geometry', 'earth_sci', 'mechanics_energy', 'algebra'],
      year3: ['media_comm', 'music_media', 'literature_and_film', 'economics', 'social_problem', 'intl_relations', 'politics_law_soc', 'ai_basic', 'calculus2', 'gene_heredity']
    }
  },

  // 이벤트 슬롯(0~4)별 후보 이벤트 풀 — 1학년은 트랙 공통, 2·3학년은 트랙별로 다른 이벤트를 겪음
  // 슬롯당 후보가 2개 이상이라 같은 트랙으로 다회차 플레이해도 다른 이벤트가 등장할 수 있음
  eventRoutes: {
    common: {
      0: ['y1_club_interview', 'y1_seatmate_intro'],
      1: ['y1_assignment_hell', 'y1_group_project_conflict'],
      2: ['y1_midterm_stress', 'y1_grade_comparison_stress'],
      3: ['y1_peer_dilemma', 'y1_class_election'],
      4: ['y1_course_survey', 'y1_record_worry']
    },
    byTrack: {
      tech: {
        year2: {
          0: ['y2_course_registration', 'y2s0_tech'],
          1: ['y2_min_achievement_crisis', 'y2s1_tech'],
          2: ['y2_mock_exam_slump', 'y2s2_tech'],
          3: ['y2_small_class_crisis', 'y2s3_tech'],
          4: ['y2_festival_prep', 'y2s4_tech']
        },
        year3: {
          0: ['y3_joint_curriculum', 'y3s0_tech'],
          1: ['y3_mock_interview', 'y3s1_tech'],
          2: ['y3_research_report', 'y3s2_tech'],
          3: ['y3_exam_pressure', 'y3s3_tech'],
          4: ['y3_portfolio_expo', 'y3s4_tech']
        }
      },
      bio: {
        year2: {
          0: ['y2_course_registration', 'y2s0_bio'],
          1: ['y2_min_achievement_crisis', 'y2s1_bio'],
          2: ['y2_mock_exam_slump', 'y2s2_bio'],
          3: ['y2_small_class_crisis', 'y2s3_bio'],
          4: ['y2_festival_prep', 'y2s4_bio']
        },
        year3: {
          0: ['y3_joint_curriculum', 'y3s0_bio'],
          1: ['y3_mock_interview', 'y3s1_bio'],
          2: ['y3_research_report', 'y3s2_bio'],
          3: ['y3_exam_pressure', 'y3s3_bio'],
          4: ['y3_portfolio_expo', 'y3s4_bio']
        }
      },
      social: {
        year2: {
          0: ['y2_course_registration', 'y2s0_social'],
          1: ['y2_min_achievement_crisis', 'y2s1_social'],
          2: ['y2_mock_exam_slump', 'y2s2_social'],
          3: ['y2_small_class_crisis', 'y2s3_social'],
          4: ['y2_festival_prep', 'y2s4_social']
        },
        year3: {
          0: ['y3_joint_curriculum', 'y3s0_social'],
          1: ['y3_mock_interview', 'y3s1_social'],
          2: ['y3_research_report', 'y3s2_social'],
          3: ['y3_exam_pressure', 'y3s3_social'],
          4: ['y3_portfolio_expo', 'y3s4_social']
        }
      },
      art: {
        year2: {
          0: ['y2_course_registration', 'y2s0_art'],
          1: ['y2_min_achievement_crisis', 'y2s1_art'],
          2: ['y2_mock_exam_slump', 'y2s2_art'],
          3: ['y2_small_class_crisis', 'y2s3_art'],
          4: ['y2_festival_prep', 'y2s4_art']
        },
        year3: {
          0: ['y3_joint_curriculum', 'y3s0_art'],
          1: ['y3_mock_interview', 'y3s1_art'],
          2: ['y3_research_report', 'y3s2_art'],
          3: ['y3_exam_pressure', 'y3s3_art'],
          4: ['y3_portfolio_expo', 'y3s4_art']
        }
      }
    }
  },

  // 48 Wave 스케줄러 (2022 개정 정식 교과목 배정)
  waveSchedule: [
    // === 1학년 (Wave 1 ~ 16) : 공통과목 중심 ===
    { wave: 1, type: 'battle', subjectId: 'korean_common1' },
    { wave: 2, type: 'battle', subjectId: 'math_common1' },
    { wave: 3, type: 'event', eventSlot: 0 },
    { wave: 4, type: 'battle', subjectId: 'english_common1' },
    { wave: 5, type: 'battle', subjectId: 'soc_common1' },
    { wave: 6, type: 'event', eventSlot: 1 },
    { wave: 7, type: 'battle', subjectId: 'sci_common1' },
    { wave: 8, type: 'battle', subjectId: 'korean_history1' },
    { wave: 9, type: 'event', eventSlot: 2 },
    { wave: 10, type: 'battle', subjectId: 'tech_home' },
    { wave: 11, type: 'battle', subjectId: 'music_art' },
    { wave: 12, type: 'event', eventSlot: 3 },
    { wave: 13, type: 'battle', subjectId: 'sci_exp1' },
    { wave: 14, type: 'battle', subjectId: 'pe1' },
    { wave: 15, type: 'event', eventSlot: 4 },
    { wave: 16, type: 'boss', bossIndex: 0 }, // 👑 1학년 학업평가전 보스

    // === 2학년 (Wave 17 ~ 32) : 일반선택 중심 (트랙별 조합은 trackSubjectRoutes/eventRoutes 참조) ===
    { wave: 17, type: 'battle', trackSlot: 0 },
    { wave: 18, type: 'battle', trackSlot: 1 },
    { wave: 19, type: 'event', eventSlot: 0 },
    { wave: 20, type: 'battle', trackSlot: 2 },
    { wave: 21, type: 'battle', trackSlot: 3 },
    { wave: 22, type: 'event', eventSlot: 1 },
    { wave: 23, type: 'battle', trackSlot: 4 },
    { wave: 24, type: 'battle', trackSlot: 5 },
    { wave: 25, type: 'event', eventSlot: 2 },
    { wave: 26, type: 'battle', trackSlot: 6 },
    { wave: 27, type: 'battle', trackSlot: 7 },
    { wave: 28, type: 'event', eventSlot: 3 },
    { wave: 29, type: 'battle', trackSlot: 8 },
    { wave: 30, type: 'battle', trackSlot: 9 },
    { wave: 31, type: 'event', eventSlot: 4 },
    { wave: 32, type: 'boss', bossIndex: 1 }, // 👑 2학년 학업설계 심사 보스

    // === 3학년 (Wave 33 ~ 48) : 진로선택 & 융합선택 중심 (트랙별 조합은 trackSubjectRoutes/eventRoutes 참조) ===
    { wave: 33, type: 'battle', trackSlot: 0 },
    { wave: 34, type: 'battle', trackSlot: 1 },
    { wave: 35, type: 'event', eventSlot: 0 },
    { wave: 36, type: 'battle', trackSlot: 2 },
    { wave: 37, type: 'battle', trackSlot: 3 },
    { wave: 38, type: 'event', eventSlot: 1 },
    { wave: 39, type: 'battle', trackSlot: 4 },
    { wave: 40, type: 'battle', trackSlot: 5 },
    { wave: 41, type: 'event', eventSlot: 2 },
    { wave: 42, type: 'battle', trackSlot: 6 },
    { wave: 43, type: 'battle', trackSlot: 7 },
    { wave: 44, type: 'event', eventSlot: 3 },
    { wave: 45, type: 'battle', trackSlot: 8 },
    { wave: 46, type: 'battle', trackSlot: 9 },
    { wave: 47, type: 'event', eventSlot: 4 },
    { wave: 48, type: 'boss', bossIndex: 2 } // 👑 3학년 최종 졸업 사정회 보스
  ],

  // 30종 2022 개정 정식 과목 몬스터 데이터
  subjects: {
    // === 1학년 공통과목 (10종) ===
    'korean_common1': {
      id: 'korean_common1',
      name: '공통국어1',
      element: 'social',
      category: 'common',
      categoryName: '공통과목',
      credits: 4,
      hp: 240,
      icon: '📖',
      color: '#f87171',
      attackName: '문맥 왜곡 공격',
      attackDmg: 15,
      flavor: '고대 한글 두루마리로 날개를 엮은 지혜의 부엉이. 깃털 펜 끝에서 논리적 문장이 빛난다.',
      quizzes: [
        {
          q: '2022 개정 교육과정 공통국어에서 강조하는 비판적 사고의 핵심은?',
          options: ['주장과 근거의 타당성을 평가하며 읽기', '교과서 본문 기계적 암기', '맞춤법 규정만 외우기', '친구 의견 무조건 비난'],
          ans: 0,
          exp: '글의 논리적 구조와 타당성을 주체적으로 검증하는 태도가 핵심입니다.'
        },
        {
          q: '상황과 맥락에 맞게 적절한 언어를 사용하는 화법 능력을 무엇이라 하는가?',
          options: ['화용적 언어 사용 능력', '맞춤법 검사기 사용법', '한자 급수 시험', '국어사전 통째로 외우기'],
          ans: 0,
          exp: '담화 상황과 맥락을 고려해 언어를 사용하는 능력을 화용 능력이라 합니다.'
        },
        {
          q: '문학 작품을 그것이 쓰인 시대적 배경과 사회 상황을 고려하여 해석하는 관점은?',
          options: ['반영론적 관점(역사·사회적 관점)', '절대주의적 관점', '작가를 배제한 관점', '무작위 해석 관점'],
          ans: 0,
          exp: '작품과 시대적 현실의 관계를 중심으로 해석하는 것이 반영론적 관점입니다.'
        }
      ]
    },
    'math_common1': {
      id: 'math_common1',
      name: '공통수학1',
      element: 'logic',
      category: 'common',
      categoryName: '공통과목',
      credits: 4,
      hp: 260,
      icon: '📐',
      color: '#60a5fa',
      attackName: '다항식 행렬 연산파',
      attackDmg: 17,
      flavor: '파란 정육면체들이 회전하며 만들어진 기하 골렘. 나침반 눈으로 좌표를 꿰뚫어 본다.',
      quizzes: [
        {
          q: '2022 개정 공통수학1에 디지털·AI 소양 강화를 위해 다시 도입된 수학 단원은?',
          options: ['행렬(Matrix)', '구면삼각법', '텐서(Tensor)', '미분방정식'],
          ans: 0,
          exp: '공통수학1에는 인공지능과 데이터 처리의 기초가 되는 행렬이 부활 도입되었습니다.'
        },
        {
          q: '이차함수 y=ax²+bx+c의 그래프가 x축과 만나는 점의 개수를 판별할 때 사용하는 것은?',
          options: ['판별식(b²-4ac)', '피타고라스 정리', '로그의 성질', '삼각비'],
          ans: 0,
          exp: '판별식의 값에 따라 이차방정식의 실근 개수가 결정됩니다.'
        },
        {
          q: '공통수학1에서 다항식의 연산과 이차함수를 배우는 근본적인 목적은?',
          options: ['실생활 문제를 수학적으로 모델링하는 능력 함양', '단순 계산 반복 훈련', '암산 대회 준비', '한자 숙어 암기'],
          ans: 0,
          exp: '수학적 모델링 능력은 다양한 실생활 문제 해결의 기초가 됩니다.'
        }
      ]
    },
    'english_common1': {
      id: 'english_common1',
      name: '공통영어1',
      element: 'fusion',
      category: 'common',
      categoryName: '공통과목',
      credits: 4,
      hp: 240,
      icon: '🗣️',
      color: '#fbbf24',
      attackName: '글로벌 소통 음파',
      attackDmg: 15,
      flavor: '알파벳 깃털을 휘날리는 글로벌 앵무새. 부리에서 터지는 소리 파동이 세계를 잇는다.',
      quizzes: [
        {
          q: '글로벌 진로 소통에서 정중하게 다른 관점을 제시하는 적절한 표현은?',
          options: ['"I see your point, but consider this perspective..."', '"You are totally wrong."', '"I don\'t care."', '"Stop talking."'],
          ans: 0,
          exp: '상대방의 의견을 존중하며 완곡하게 대안을 제시하는 것이 성숙한 소통입니다.'
        },
        {
          q: '영어 지문의 핵심 내용을 문단별로 요약할 때 가장 먼저 파악해야 할 것은?',
          options: ['주제문(Main idea)과 이를 뒷받침하는 문장 구분', '모든 단어를 그대로 옮겨쓰기', '문법 용어만 나열', '접속사 개수 세기'],
          ans: 0,
          exp: '주제문과 뒷받침 문장을 구분하면 글의 핵심을 빠르게 파악할 수 있습니다.'
        },
        {
          q: '다음 중 원인과 결과의 관계를 나타내는 연결어로 적절한 것은?',
          options: ['Therefore / As a result', 'However', 'In contrast', 'On the other hand'],
          ans: 0,
          exp: 'Therefore, as a result는 인과관계를 나타내는 대표적인 연결어입니다.'
        }
      ]
    },
    'soc_common1': {
      id: 'soc_common1',
      name: '통합사회1',
      element: 'social',
      category: 'common',
      categoryName: '공통과목',
      credits: 4,
      hp: 250,
      icon: '🌐',
      color: '#34d399',
      attackName: '사회 갈등 딜레마 파동',
      attackDmg: 16,
      flavor: '작은 지구본을 손끝에 띄운 고귀한 수호 거인. 반대쪽 손엔 정의의 저울이 늘 균형을 잡는다.',
      quizzes: [
        {
          q: '통합사회에서 현대 사회의 다양한 문제를 분석하는 4대 관점에 포함되지 않는 것은?',
          options: ['사주명리학적 관점', '시간적 관점', '공간적 관점', '윤리적 관점'],
          ans: 0,
          exp: '통합사회 4대 관점은 시간적, 공간적, 사회적, 윤리적 관점입니다.'
        },
        {
          q: '다음 중 사회현상을 "공간적 관점"에서 탐구하는 질문으로 가장 적절한 것은?',
          options: ['이 현상은 어느 지역에서, 왜 그곳에서 발생했는가?', '이 현상은 옳고 그른가?', '이 현상은 언제부터 시작되었는가?', '이 현상은 사회 구조와 어떤 관련이 있는가?'],
          ans: 0,
          exp: '공간적 관점은 위치, 분포, 지역 특성을 중심으로 현상을 살핍니다.'
        },
        {
          q: '통합사회가 궁극적으로 지향하는 인간상은?',
          options: ['시민성을 갖춘 민주 시민', '단편적 지식을 암기한 사람', '경쟁에서 승리하는 사람', '특정 이념만을 따르는 사람'],
          ans: 0,
          exp: '통합사회는 지속가능한 삶을 위한 민주 시민성 함양을 목표로 합니다.'
        }
      ]
    },
    'sci_common1': {
      id: 'sci_common1',
      name: '통합과학1',
      element: 'nature',
      category: 'common',
      categoryName: '공통과목',
      credits: 4,
      hp: 260,
      icon: '🔬',
      color: '#a78bfa',
      attackName: '빅뱅 원소 방출 빔',
      attackDmg: 17,
      flavor: '투명한 몸속에서 원자 전자가 궤도를 그리는 원소 슬라임. 빅뱅의 흔적을 품고 있다.',
      quizzes: [
        {
          q: '우주 초기에 수소와 헬륨이 생성되고 물질 시스템이 형성되었다는 이론은?',
          options: ['빅뱅 우주론', '지동설', '천동설', '판구조론'],
          ans: 0,
          exp: '빅뱅 우주론에 따라 우주 초기 수소와 헬륨이 생성되었습니다.'
        },
        {
          q: '세포막으로 둘러싸인, 생명체를 이루는 최소 단위 구조는?',
          options: ['세포(Cell)', '원자', '분자', '조직'],
          ans: 0,
          exp: '세포는 생명 활동이 일어나는 가장 작은 기본 단위입니다.'
        },
        {
          q: '에너지가 새로 생성되거나 소멸하지 않고 형태만 바뀐다는 물리 법칙은?',
          options: ['에너지 보존 법칙', '엔트로피 감소 법칙', '만유인력 법칙', '관성의 법칙'],
          ans: 0,
          exp: '에너지는 다른 형태로 전환될 뿐 총량은 항상 보존됩니다.'
        }
      ]
    },
    'korean_history1': {
      id: 'korean_history1',
      name: '한국사1',
      element: 'social',
      category: 'common',
      categoryName: '공통과목',
      credits: 3,
      hp: 250,
      icon: '🏯',
      color: '#fb923c',
      attackName: '역사의 소용돌이 일격',
      attackDmg: 16,
      flavor: '성벽 돌을 깎아 만든 전설의 해태. 갈기의 불꽃이 역사의 소용돌이를 태운다.',
      quizzes: [
        {
          q: '1919년 3·1 운동의 결실로 수립되어 민주공화제의 기틀을 마련한 정부는?',
          options: ['대한민국 임시정부', '조선총독부', '통신기획단', '의정부'],
          ans: 0,
          exp: '3·1 운동을 계기로 상하이에 대한민국 임시정부가 수립되었습니다.'
        },
        {
          q: '1919년, 일제의 무단통치에 저항해 전국적으로 일어난 대규모 만세 시위는?',
          options: ['3·1 운동', '동학농민운동', '갑신정변', '6월 민주항쟁'],
          ans: 0,
          exp: '3·1 운동은 민족 자결의 의지를 세계에 알린 대규모 독립운동입니다.'
        },
        {
          q: '고려의 중서문하성, 조선의 의정부처럼 국정을 총괄한 최고 통치 기구의 공통된 성격은?',
          options: ['중앙 최고 관서(국정 총괄 기구)', '지방 행정 기구', '군사 훈련 기관', '외교 사절단'],
          ans: 0,
          exp: '두 기구 모두 각 시대 국정을 총괄한 중앙 최고 관서였습니다.'
        }
      ]
    },
    'tech_home': {
      id: 'tech_home',
      name: '기술·가정',
      element: 'logic',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 230,
      icon: '🛠️',
      color: '#94a3b8',
      attackName: '생활 발명 압박',
      attackDmg: 14,
      flavor: '하이테크 고글을 쓴 발명가 비버. 회로기판 꼬리로 생활 속 아이디어를 뚝딱 조립한다.',
      quizzes: [
        {
          q: '자신의 미래 진로와 재무 목표를 체계적으로 계획하고 실천하는 것은?',
          options: ['생애 재무 및 생애주기 설계', '충동 소비', '복권 무한 구매', '무계획 지출'],
          ans: 0,
          exp: '생애주기별 목표와 위험 관리를 계획하는 것이 생애 설계입니다.'
        },
        {
          q: '청소년기에 예산을 세우고 필요와 욕구를 구분하며 소비하는 태도를 무엇이라 하는가?',
          options: ['합리적 소비', '무조건적 과시 소비', '타인 모방 소비', '무계획 충동구매'],
          ans: 0,
          exp: '필요와 욕구를 구분해 예산 안에서 소비하는 것이 합리적 소비입니다.'
        },
        {
          q: '제품의 규격을 통일하여 부품의 호환성과 생산 효율을 높이는 것은?',
          options: ['표준화(Standardization)', '맞춤 소량 생산', '규격 다양화', '품질 저하'],
          ans: 0,
          exp: '표준화는 호환성을 높이고 생산·유지보수 비용을 낮춥니다.'
        }
      ]
    },
    'music_art': {
      id: 'music_art',
      name: '음악·미술',
      element: 'fusion',
      category: 'general',
      categoryName: '예술선택',
      credits: 4,
      hp: 230,
      icon: '🎵',
      color: '#ec4899',
      attackName: '심미적 감성 소닉웨이브',
      attackDmg: 14,
      flavor: '팔레트를 방패처럼 든 예술 요정. 음표 화살이 감성을 명중시킨다.',
      quizzes: [
        {
          q: '2022 개정 교육과정 예술 교과가 강조하는 핵심 소양은?',
          options: ['심미적 감성과 창의적 표현력', '단순 테크닉 암기', '화가 이름 외우기', '그림 복제 기술'],
          ans: 0,
          exp: '예술을 통한 공감과 창의적 감수성 함양이 핵심입니다.'
        },
        {
          q: '미술 작품에서 색채, 형태, 질감 등을 활용해 작가의 의도를 시각적으로 표현하는 원리는?',
          options: ['조형 원리를 활용한 표현', '무작위 낙서', '단순 색칠 공부', '사진을 그대로 베끼기'],
          ans: 0,
          exp: '조형 원리를 이해하고 활용하면 의도를 효과적으로 표현할 수 있습니다.'
        },
        {
          q: '음악에서 일정한 박자와 강약이 반복되며 곡의 흐름을 이끄는 기본 요소는?',
          options: ['리듬(Rhythm)', '가사', '악기 브랜드', '공연장 크기'],
          ans: 0,
          exp: '리듬은 음악을 구성하는 가장 기본적인 요소 중 하나입니다.'
        }
      ]
    },
    'sci_exp1': {
      id: 'sci_exp1',
      name: '과학탐구실험1',
      element: 'nature',
      category: 'common',
      categoryName: '공통과목',
      credits: 2,
      hp: 240,
      icon: '🧪',
      color: '#10b981',
      attackName: '실험 오차 폭발',
      attackDmg: 15,
      flavor: '부글거리는 플라스크 로켓을 탄 장난기 가득한 연금술사 임프. 실험은 늘 예측불가.',
      quizzes: [
        {
          q: '실험에서 결과를 관찰하고자 의도적으로 변화시키는 요인은?',
          options: ['조작 변인(Independent Variable)', '통제 변인', '종속 변인', '외부 노이즈'],
          ans: 0,
          exp: '실험자가 조작하는 원인이 되는 변인을 조작 변인이라 합니다.'
        },
        {
          q: '다른 변인의 영향을 배제하기 위해 실험 중 일정하게 유지하는 변인은?',
          options: ['통제 변인(Controlled Variable)', '조작 변인', '종속 변인', '무작위 변인'],
          ans: 0,
          exp: '통제 변인을 일정하게 유지해야 실험 결과의 신뢰성이 높아집니다.'
        },
        {
          q: '조작 변인의 변화에 따라 측정되어 결과로 나타나는 변인은?',
          options: ['종속 변인(Dependent Variable)', '통제 변인', '독립 변인', '무관 변인'],
          ans: 0,
          exp: '종속 변인은 조작 변인의 변화 결과로서 관찰·측정되는 값입니다.'
        }
      ]
    },
    'pe1': {
      id: 'pe1',
      name: '체육1',
      element: 'nature',
      category: 'general',
      categoryName: '체육선택',
      credits: 4,
      hp: 240,
      icon: '🏃',
      color: '#06b6d4',
      attackName: '지구력 소진 어택',
      attackDmg: 15,
      flavor: '불타는 스니커즈를 신은 열정 가득한 호랑이 운동선수. 지치지 않는 지구력이 자랑이다.',
      quizzes: [
        {
          q: '고등학교 3년의 장기적인 학업과 진로 탐구를 지탱하는 가장 기초적인 바탕은?',
          options: ['규칙적인 운동과 체력·건강 관리', '하루 2시간 자고 공부하기', '에너지 음료 매일 마시기', '끼니 거르기'],
          ans: 0,
          exp: '지속 가능한 학업을 위해서는 신체적·정신적 건강 관리가 최우선입니다.'
        },
        {
          q: '심장과 폐의 기능을 향상시켜 지구력을 기르는 대표적인 운동 유형은?',
          options: ['유산소성 운동', '순간적인 무산소 운동만', '정적 스트레칭만', '장시간 수면'],
          ans: 0,
          exp: '유산소성 운동은 심폐 기능을 향상시켜 지구력을 길러줍니다.'
        },
        {
          q: '운동 전 부상을 예방하고 신체를 미리 준비시키기 위해 반드시 필요한 과정은?',
          options: ['충분한 준비운동(warm-up)', '바로 전력 질주', '식사 직후 격렬한 운동', '준비 없이 시작'],
          ans: 0,
          exp: '준비운동은 근육과 관절을 예열해 부상 위험을 크게 줄입니다.'
        }
      ]
    },

    // === 2학년 일반선택 과목 (10종) ===
    'algebra': {
      id: 'algebra',
      name: '대수',
      element: 'logic',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 300,
      icon: '📊',
      color: '#3b82f6',
      attackName: '지수·로그·수열 연쇄파',
      attackDmg: 19,
      flavor: '지수·로그의 나선 에너지를 뿔에서 뿜어내는 하늘빛 뱀 드래곤. 다항식 무늬가 비늘마다 새겨져 있다.',
      quizzes: [
        {
          q: '2022 개정 교육과정에서 지수·로그함수와 삼각함수, 수열을 다루는 일반선택 과목명은?',
          options: ['대수(Algebra)', '기하', '확률과 통계', '실용 수학'],
          ans: 0,
          exp: '2022 개정 교육과정에서는 2015의 수학Ⅰ이 ‘대수’로 개편되었습니다.'
        },
        {
          q: '등차수열의 일반항 an = a1 + (n-1)d에서 d가 의미하는 것은?',
          options: ['공차(common difference)', '공비', '첫째항', '항의 개수'],
          ans: 0,
          exp: 'd는 이웃한 항끼리의 일정한 차이인 공차를 뜻합니다.'
        },
        {
          q: '직각삼각형에서 빗변에 대한 높이의 비를 나타내는 삼각함수는?',
          options: ['sin(사인)', 'cos(코사인)', 'tan(탄젠트)', 'cot(코탄젠트)'],
          ans: 0,
          exp: 'sin은 빗변 대비 높이(마주보는 변)의 비를 나타냅니다.'
        }
      ]
    },
    'physics': {
      id: 'physics',
      name: '물리학',
      element: 'nature',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 310,
      icon: '⚡',
      color: '#6366f1',
      attackName: '작용·반작용 역습',
      attackDmg: 20,
      flavor: '말굽자석 견갑을 두른 메카 에너지 기사. 중력구를 띄운 채 전기 스파크를 흩뿌린다.',
      quizzes: [
        {
          q: '뉴턴의 운동 제2법칙(가속도의 법칙)을 나타내는 공식은?',
          options: ['F = ma', 'E = mc²', 'V = IR', 'P = IV'],
          ans: 0,
          exp: '힘(F)은 질량(m)과 가속도(a)의 곱과 같습니다.'
        },
        {
          q: '물체에 힘이 작용하지 않으면 정지 상태나 등속도 운동을 계속 유지한다는 법칙은?',
          options: ['관성의 법칙(뉴턴 제1법칙)', '작용·반작용 법칙', '에너지 보존 법칙', '만유인력 법칙'],
          ans: 0,
          exp: '외부 힘이 없으면 물체는 원래의 운동 상태를 그대로 유지합니다.'
        },
        {
          q: '전압(V), 전류(I), 저항(R)의 관계를 나타내는 옴의 법칙 공식은?',
          options: ['V = IR', 'F = ma', 'E = mc²', 'P = mgh'],
          ans: 0,
          exp: '옴의 법칙에 따라 전압은 전류와 저항의 곱과 같습니다.'
        }
      ]
    },
    'chemistry': {
      id: 'chemistry',
      name: '화학',
      element: 'nature',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 300,
      icon: '🧪',
      color: '#14b8a6',
      attackName: '산화·환원 반응 플래시',
      attackDmg: 19,
      flavor: '주기율표 방패를 든 신비한 물약 마스터. 양손에서 화염과 냉기의 산화·환원 구슬을 동시에 다룬다.',
      quizzes: [
        {
          q: '물질을 구성하는 가장 작은 단위 입자로 양성자, 중성자, 전자로 이루어진 것은?',
          options: ['원자(Atom)', '분자', '이온', '화합물'],
          ans: 0,
          exp: '물질의 기본 입자는 원자입니다.'
        },
        {
          q: '원소들을 원자번호 순서와 화학적 성질에 따라 규칙적으로 배열한 표는?',
          options: ['주기율표(Periodic Table)', '성적표', '좌표평면', '유전자 지도'],
          ans: 0,
          exp: '주기율표는 원소의 성질을 체계적으로 파악할 수 있게 해줍니다.'
        },
        {
          q: '산과 염기가 반응하여 물과 염을 생성하는 반응을 무엇이라 하는가?',
          options: ['중화반응(Neutralization)', '산화반응', '핵분열반응', '광합성 반응'],
          ans: 0,
          exp: '산과 염기가 만나면 중화반응이 일어나 물과 염이 생성됩니다.'
        }
      ]
    },
    'biology': {
      id: 'biology',
      name: '생명과학',
      element: 'nature',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 300,
      icon: '🌱',
      color: '#22c55e',
      attackName: '유전 정보 암호 교란',
      attackDmg: 19,
      flavor: 'DNA 이중나선 꼬리를 반짝이는 자연 정령. 나뭇잎 날개로 생명의 신비를 실어 나른다.',
      quizzes: [
        {
          q: '세포 내에서 생명체의 유전 정보를 저장하고 있는 고분자 핵산은?',
          options: ['DNA', 'ATP', '포도당', '헤모글로빈'],
          ans: 0,
          exp: '유전 정보는 DNA(디옥시리보핵산)에 저장됩니다.'
        },
        {
          q: '생명체가 세포 호흡을 통해 얻어 생명 활동에 직접 사용하는 에너지 화합물은?',
          options: ['ATP', 'DNA', '포도당 그 자체', '산소 그 자체'],
          ans: 0,
          exp: 'ATP는 세포가 직접 사용할 수 있는 에너지 저장·전달 물질입니다.'
        },
        {
          q: '부모의 형질이 자손에게 전달되는 원리를 연구하는 생명과학 분야는?',
          options: ['유전학(Genetics)', '생태학', '분류학', '해부학'],
          ans: 0,
          exp: '유전학은 형질의 대물림과 변이를 다루는 학문입니다.'
        }
      ]
    },
    'earth_sci': {
      id: 'earth_sci',
      name: '지구과학',
      element: 'nature',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 300,
      icon: '🌍',
      color: '#0284c7',
      attackName: '판구조론 판 충돌 지진파',
      attackDmg: 19,
      flavor: '판구조 갑옷을 두른 거대한 지질 타이탄. 갈라진 틈마다 용암이 흐르고 구름이 감돈다.',
      quizzes: [
        {
          q: '지구 표면이 여러 개의 판으로 이루어져 서서히 이동한다는 이론은?',
          options: ['판구조론(Plate Tectonics)', '천동설', '상대성 이론', '열역학 제1법칙'],
          ans: 0,
          exp: '지각 변동과 대륙 이동을 설명하는 핵심 이론은 판구조론입니다.'
        },
        {
          q: '태양계에서 태양으로부터 세 번째 행성이며 현재 유일하게 생명체가 확인된 행성은?',
          options: ['지구(Earth)', '화성', '금성', '목성'],
          ans: 0,
          exp: '지구는 태양계에서 생명체가 존재하는 것으로 확인된 유일한 행성입니다.'
        },
        {
          q: '대기, 수권, 지권, 생물권이 서로 물질과 에너지를 주고받는다는 개념은?',
          options: ['지구시스템(권역 간 상호작용)', '단일 폐쇄계', '정적 평형 상태', '무한 팽창 이론'],
          ans: 0,
          exp: '지구의 각 권역은 서로 영향을 주고받으며 하나의 시스템을 이룹니다.'
        }
      ]
    },
    'calculus1': {
      id: 'calculus1',
      name: '미적분Ⅰ',
      element: 'logic',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 320,
      icon: '📈',
      color: '#2563eb',
      attackName: '다항함수 미적분 파동',
      attackDmg: 21,
      flavor: '도함수 곡선의 검을 휘두르는 예리한 기사. 벤 자리마다 극한의 왜곡 고리가 남는다.',
      quizzes: [
        {
          q: '2022 개정 교육과정에서 함수의 극한과 다항함수의 미적분을 다루는 일반선택 과목명은?',
          options: ['미적분Ⅰ (구 수학Ⅱ)', '기하', '대수', '확률과 통계'],
          ans: 0,
          exp: '2022 개정 교육과정에서는 2015의 수학Ⅱ가 ‘미적분Ⅰ’로 명칭 변경되었습니다.'
        },
        {
          q: '함수 f(x) = x²을 미분하면 얻어지는 도함수는?',
          options: ['2x', 'x', '2', 'x³'],
          ans: 0,
          exp: '미분법에 따라 x²의 도함수는 2x입니다.'
        },
        {
          q: '정적분의 값이 그래프에서 나타내는 기하학적 의미는?',
          options: ['곡선과 x축 사이의 넓이', '곡선의 기울기', '원의 둘레', '두 점의 좌표'],
          ans: 0,
          exp: '정적분은 구간에서 곡선과 x축이 이루는 넓이를 나타냅니다.'
        }
      ]
    },
    'info': {
      id: 'info',
      name: '정보',
      element: 'logic',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 300,
      icon: '💻',
      color: '#0ea5e9',
      attackName: '알고리즘 스택 오버플로우',
      attackDmg: 19,
      flavor: '이진코드로 몸을 이룬 사이버 늑대. 광섬유 회로가 등줄기를 따라 맥동한다.',
      quizzes: [
        {
          q: '프로그래밍에서 문제를 해결하기 위한 명확한 절차나 명령어의 집합은?',
          options: ['알고리즘(Algorithm)', '인터페이스', '컴파일러', '데이터베이스'],
          ans: 0,
          exp: '문제 해결 절차와 규칙을 알고리즘이라고 합니다.'
        },
        {
          q: '0과 1, 두 가지 상태만으로 정보를 표현하는 컴퓨터의 기본 진법은?',
          options: ['이진법(Binary)', '십진법', '로마 숫자', '한자 숫자'],
          ans: 0,
          exp: '컴퓨터는 전기 신호의 on/off를 0과 1로 표현하는 이진법을 사용합니다.'
        },
        {
          q: '문제를 작은 단위로 나누어 같은 방식으로 반복 해결하는 알고리즘 설계 기법은?',
          options: ['재귀(Recursion)/분할정복', '무작위 시도', '단순 나열', '무조건 암기'],
          ans: 0,
          exp: '분할정복은 큰 문제를 작은 부분 문제로 나누어 해결하는 방식입니다.'
        }
      ]
    },
    'soc_culture': {
      id: 'soc_culture',
      name: '사회와 문화',
      element: 'social',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 290,
      icon: '👥',
      color: '#eab308',
      attackName: '문화 지체 현상 충격',
      attackDmg: 18,
      flavor: '두 얼굴을 지닌 카멜레온. 한쪽은 전통, 한쪽은 유행을 비추며 사회의 기호를 띄운다.',
      quizzes: [
        {
          q: '물질문화의 변동 속도를 비물질문화(제도, 의식)가 따라가지 못해 발생하는 부조화는?',
          options: ['문화 지체 (Cultural Lag)', '문화 융합', '문화 사대주의', '문화 상대주의'],
          ans: 0,
          exp: '기술 발전 속도에 제도가 미처 따르지 못하는 현상을 문화 지체라 합니다.'
        },
        {
          q: '한 사회의 문화를 구성하는 대표적인 3요소로 옳은 것은?',
          options: ['물질문화, 제도문화, 관념문화', '정치, 경제, 군사', '법, 도덕, 관습만 별개', '언어, 인종, 국적'],
          ans: 0,
          exp: '문화는 물질문화, 제도문화, 관념문화가 상호작용하며 이루어집니다.'
        },
        {
          q: '서로 다른 문화가 접촉하며 각자의 고유성을 유지한 채 함께 공존하는 현상은?',
          options: ['문화 병존(다문화)', '문화 동화', '문화 말살', '문화 고립'],
          ans: 0,
          exp: '문화 병존은 이질적인 문화가 나란히 공존하는 현상입니다.'
        }
      ]
    },
    'world_history': {
      id: 'world_history',
      name: '세계사',
      element: 'social',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 290,
      icon: '🏛️',
      color: '#f97316',
      attackName: '인류 문명 연대기',
      attackDmg: 18,
      flavor: '등껍질 위에 콜로세움과 피라미드, 증기기관을 얹고 걷는 고대 거북. 문명의 무게를 그대로 짊어졌다.',
      quizzes: [
        {
          q: '18세기 후반 증기기관 발명과 기계화로 사회 경제 구조를 바꾼 대변혁은?',
          options: ['산업혁명', '프랑스대혁명', '르네상스', '종교개혁'],
          ans: 0,
          exp: '산업혁명은 기계의 발명으로 생산력의 혁신을 이끈 사건입니다.'
        },
        {
          q: '1789년 절대왕정을 무너뜨리고 자유·평등·박애의 이념을 전 세계에 확산시킨 사건은?',
          options: ['프랑스대혁명', '명예혁명', '신해혁명', '메이지유신'],
          ans: 0,
          exp: '프랑스대혁명은 근대 민주주의 이념 확산에 큰 영향을 끼쳤습니다.'
        },
        {
          q: '고대부터 동서양의 교역과 문화 교류를 촉진했던 대표적인 육상 무역로는?',
          options: ['실크로드(비단길)', '파나마 운하', '수에즈 운하', '베링 해협'],
          ans: 0,
          exp: '실크로드는 동서 문명을 이어준 대표적인 교역·문화 교류로였습니다.'
        }
      ]
    },
    'global_geo': {
      id: 'global_geo',
      name: '세계시민과 지리',
      element: 'social',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 290,
      icon: '🗺️',
      color: '#d97706',
      attackName: '지정학적 갈등 기류',
      attackDmg: 18,
      flavor: '지형도 날개를 펼친 탐험가 매. 발톱의 나침반이 기후와 국경을 넘나든다.',
      quizzes: [
        {
          q: '지구촌의 환경, 자원, 분쟁 문제를 세계시민의 관점에서 탐구하는 2022 개정 지리 과목은?',
          options: ['세계시민과 지리', '한국지리 탐구', '여행지리', '경제지리'],
          ans: 0,
          exp: '2022 개정 교육과정 사회과 일반선택 지리 과목명은 ‘세계시민과 지리’입니다.'
        },
        {
          q: '지구 온난화 문제에 국제 사회가 공동 대응하기 위해 채택한 대표적인 기후 협약은?',
          options: ['파리협정(Paris Agreement)', '베르사유조약', '카이로선언', '몬로선언'],
          ans: 0,
          exp: '파리협정은 온실가스 감축을 위한 국제 사회의 대표적 합의입니다.'
        },
        {
          q: '한 지역의 기후·지형 등 자연환경이 주민의 생활양식에 미치는 영향을 탐구하는 관점은?',
          options: ['자연환경과 인간생활의 상호작용', '자연현상은 인간과 무관하다는 관점', '정치 체제만 분석하는 관점', '경제 지표만 분석하는 관점'],
          ans: 0,
          exp: '지리 탐구는 자연환경과 인간 생활이 서로 영향을 주고받는다고 봅니다.'
        }
      ]
    },
    'geometry': {
      id: 'geometry',
      name: '기하',
      element: 'logic',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 310,
      icon: '📏',
      color: '#1e40af',
      attackName: '평면·공간도형 좌표 임팩트',
      attackDmg: 20,
      flavor: '벡터 화살과 이차곡선 궤도로 몸을 이룬 공간 기하 스피릿. 회전할 때마다 완벽한 원뿔곡선을 그려낸다.',
      quizzes: [
        {
          q: '2022 개정 수학 교과에서 벡터, 평면좌표, 공간도형과 이차곡선을 다루는 일반선택 과목은?',
          options: ['기하(Geometry)', '대수', '미적분Ⅰ', '확률과 통계'],
          ans: 0,
          exp: '기하는 도형과 공간을 좌표와 벡터로 다루는 2022 개정 수학 일반선택 과목입니다.'
        },
        {
          q: '평면 위에서 방향과 크기를 모두 가지며, 화살표로 표현되는 수학적 대상은?',
          options: ['벡터(Vector)', '스칼라', '행렬', '수열'],
          ans: 0,
          exp: '벡터는 크기와 방향을 함께 나타내는 양입니다.'
        },
        {
          q: '원, 타원, 포물선, 쌍곡선처럼 원뿔을 평면으로 잘랐을 때 나타나는 곡선을 통칭하는 말은?',
          options: ['이차곡선(원뿔곡선)', '직선', '다각형', '함수'],
          ans: 0,
          exp: '원뿔을 다양한 각도로 자르면 원, 타원, 포물선, 쌍곡선 등의 이차곡선이 나타납니다.'
        }
      ]
    },
    'modern_ethics': {
      id: 'modern_ethics',
      name: '현대사회와 윤리',
      element: 'social',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 290,
      icon: '🧭',
      color: '#fbbf24',
      attackName: '윤리적 딜레마 성찰파',
      attackDmg: 18,
      flavor: '두 개의 저울을 양손에 든 성찰의 스핑크스. 생명·정보·환경 윤리의 딜레마를 조용히 되묻는다.',
      quizzes: [
        {
          q: '생명공학기술의 발전으로 발생하는 윤리적 쟁점을 주로 다루는 응용윤리 분야는?',
          options: ['생명윤리', '정보윤리', '환경윤리', '직업윤리'],
          ans: 0,
          exp: '생명윤리는 생명 관련 기술과 의료 행위의 도덕적 쟁점을 다룹니다.'
        },
        {
          q: '인공지능·빅데이터 시대에 개인정보 보호와 알고리즘의 공정성을 다루는 윤리 분야는?',
          options: ['정보윤리', '생명윤리', '환경윤리', '성 윤리'],
          ans: 0,
          exp: '정보윤리는 디지털 정보사회에서의 도덕적 책임을 다룹니다.'
        },
        {
          q: '현대사회와 윤리에서 다루는 다양한 응용윤리 학습의 공통된 목표는?',
          options: ['현실의 윤리적 딜레마에 대한 성찰과 실천적 해결', '과거 윤리학설의 단순 암기', '도덕적 판단의 회피', '타인의 의견 무조건 수용'],
          ans: 0,
          exp: '응용윤리는 실제 삶의 딜레마를 성찰하고 실천적 해법을 모색하는 것을 목표로 합니다.'
        }
      ]
    },
    'mechanics_energy': {
      id: 'mechanics_energy',
      name: '역학과 에너지',
      element: 'nature',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 305,
      icon: '🔩',
      color: '#0891b2',
      attackName: '운동·에너지 충격파',
      attackDmg: 19,
      flavor: '구심력의 톱니바퀴를 두른 강철 골렘. 몸속에서 위치·운동 에너지가 끊임없이 순환한다.',
      quizzes: [
        {
          q: '물체의 운동에서 위치 에너지와 운동 에너지의 합이 일정하게 유지된다는 법칙은?',
          options: ['역학적 에너지 보존 법칙', '열역학 제2법칙', '전자기 유도 법칙', '케플러 법칙'],
          ans: 0,
          exp: '외력이 작용하지 않으면 역학적 에너지의 총합은 일정하게 보존됩니다.'
        },
        {
          q: '힘이 물체에 작용하여 이동시킬 때, 힘과 이동 거리의 곱으로 정의되는 물리량은?',
          options: ['일(Work)', '속도', '가속도', '질량'],
          ans: 0,
          exp: '일은 힘과 그 힘의 방향으로 이동한 거리의 곱으로 정의됩니다.'
        },
        {
          q: '물체가 등속 원운동을 할 때, 원의 중심 방향으로 작용하는 힘은?',
          options: ['구심력', '원심력(실재하는 힘)', '마찰력', '부력'],
          ans: 0,
          exp: '구심력은 물체를 원의 중심 방향으로 끌어당겨 원운동을 유지시킵니다.'
        }
      ]
    },
    'fusion_science_inquiry': {
      id: 'fusion_science_inquiry',
      name: '융합과학탐구',
      element: 'fusion',
      category: 'general',
      categoryName: '일반선택',
      credits: 4,
      hp: 300,
      icon: '🧩',
      color: '#c026d3',
      attackName: '통합 탐구 융합파',
      attackDmg: 19,
      flavor: '물리·화학·생물·지구과학의 조각을 이어붙인 퍼즐 크리처. 흩어진 분야를 하나의 답으로 융합한다.',
      quizzes: [
        {
          q: '기후변화처럼 물리·화학·생물·지구과학 여러 분야가 얽힌 문제를 통합적으로 탐구하는 접근은?',
          options: ['융합적 과학 탐구', '단일 분야 암기', '실험 없이 추측', '한 과목만 고집하는 탐구'],
          ans: 0,
          exp: '복합적인 문제는 여러 과학 분야를 융합해 통합적으로 접근해야 합니다.'
        },
        {
          q: '가설을 세우고 실험으로 검증한 뒤 결론을 도출하는 과학적 탐구의 기본 절차는?',
          options: ['가설 설정 → 실험 검증 → 결론 도출', '무작위 시도', '직감에 의한 결론', '타인 결과 무단 복제'],
          ans: 0,
          exp: '과학적 탐구는 체계적인 가설-검증-결론의 절차를 따릅니다.'
        },
        {
          q: '서로 다른 과학 분야의 개념을 연결해 새로운 문제를 해결하는 능력을 무엇이라 하는가?',
          options: ['융합적 사고력', '단편적 지식 나열', '분야 간 배타적 구분', '기계적 반복 학습'],
          ans: 0,
          exp: '융합적 사고력은 여러 분야의 지식을 연결해 새로운 해법을 찾는 역량입니다.'
        }
      ]
    },

    // === 3학년 진로선택 & 융합선택 과목 (10종) ===
    'ai_basic': {
      id: 'ai_basic',
      name: '인공지능 기초',
      element: 'logic',
      category: 'career',
      categoryName: '진로선택',
      credits: 4,
      hp: 380,
      icon: '🤖',
      color: '#8b5cf6',
      attackName: '과적합(Overfitting) 파동',
      attackDmg: 23,
      flavor: '시냅스처럼 빛나는 신경망 코어를 지닌 안드로이드. 텐서 다이어그램이 주위를 홀로그램으로 떠다닌다.',
      quizzes: [
        {
          q: '인공지능이 대량의 데이터를 스스로 학습하여 특징 패턴을 추출하는 기술은?',
          options: ['머신러닝 & 딥러닝', '단순 수동 코딩', '인터넷 캐싱', '파일 압축'],
          ans: 0,
          exp: '데이터로부터 모델이 패턴을 학습하는 인공지능 분야를 머신러닝이라 부릅니다.'
        },
        {
          q: '인공신경망이 학습 데이터에 지나치게 맞춰져 새로운 데이터에는 성능이 떨어지는 현상은?',
          options: ['과적합(Overfitting)', '과소적합', '정상 학습', '완전한 일반화'],
          ans: 0,
          exp: '과적합은 학습 데이터에만 특화되어 일반화 성능이 낮아지는 문제입니다.'
        },
        {
          q: '이미지 속 사물을 인식하고 분류하는 대표적인 딥러닝 신경망 구조는?',
          options: ['합성곱 신경망(CNN)', '엑셀 스프레드시트', '워드프로세서', '단순 계산기'],
          ans: 0,
          exp: 'CNN은 이미지의 공간적 특징을 추출하는 데 특화된 신경망입니다.'
        }
      ]
    },
    'calculus2': {
      id: 'calculus2',
      name: '미적분Ⅱ',
      element: 'logic',
      category: 'career',
      categoryName: '진로선택',
      credits: 4,
      hp: 400,
      icon: '∫',
      color: '#1d4ed8',
      attackName: '초월함수 무한적분 폭풍',
      attackDmg: 25,
      flavor: '무한대 기호를 소환하는 대마법사. 거대한 적분 마법진이 허공에 펼쳐진다.',
      quizzes: [
        {
          q: '지수함수, 로그함수, 삼각함수 등 초월함수의 미적분을 다루는 2022 개정 진로선택 수학은?',
          options: ['미적분Ⅱ (구 미적분)', '미적분Ⅰ', '기하', '대수'],
          ans: 0,
          exp: '2022 개정 교육과정에서는 이공계 심화 초월함수 미적분을 ‘미적분Ⅱ’(진로선택)에서 다룹니다.'
        },
        {
          q: '자연로그의 밑으로 사용되며, 미분해도 자기 자신이 되는 지수함수와 관련된 상수는?',
          options: ['오일러 수 e', '원주율 π', '황금비 φ', '허수 단위 i'],
          ans: 0,
          exp: 'e는 자연로그의 밑으로, e^x는 미분해도 형태가 변하지 않습니다.'
        },
        {
          q: '함수의 극값(최댓값/최솟값)을 구할 때, 도함수 값이 0이 되는 지점을 무엇이라 하는가?',
          options: ['임계점(극값 후보)', '접점', '원점', '교점'],
          ans: 0,
          exp: '도함수가 0이 되는 임계점에서 극값이 나타날 수 있습니다.'
        }
      ]
    },
    'robotics_eng': {
      id: 'robotics_eng',
      name: '로봇과 공학세계',
      element: 'logic',
      category: 'career',
      categoryName: '진로선택',
      credits: 4,
      hp: 380,
      icon: '🦾',
      color: '#0284c7',
      attackName: '다관절 매니퓰레이터 레이저',
      attackDmg: 23,
      flavor: '다관절 레이저 팔을 장착한 중전투 메크. 라이다 센서가 쉴 새 없이 주변을 스캔한다.',
      quizzes: [
        {
          q: '로봇이 주변 환경 정보를 물리적으로 감지하여 전기 신호로 변환하는 장치는?',
          options: ['센서(Sensor)', '배터리', '외관 커버', '바퀴'],
          ans: 0,
          exp: '센서는 빛, 거리, 온도 등을 측정하여 로봇 제어기에 전달합니다.'
        },
        {
          q: '로봇의 관절을 움직여 실제 물리적 동작을 만들어내는 구동 장치는?',
          options: ['액추에이터(Actuator)', '센서', '배터리 팩', '디스플레이'],
          ans: 0,
          exp: '액추에이터는 전기 신호를 받아 실제 움직임을 만들어내는 구동부입니다.'
        },
        {
          q: '공학 설계 과정에서 문제를 정의한 후 가장 먼저 수행해야 할 단계는?',
          options: ['요구사항 분석 및 아이디어 구상', '바로 완제품 생산', '예산 없이 무작정 제작', '설계도 없이 조립'],
          ans: 0,
          exp: '요구사항 분석과 아이디어 구상이 공학 설계의 첫 단계입니다.'
        }
      ]
    },
    'quantum_em': {
      id: 'quantum_em',
      name: '전자기와 양자',
      element: 'nature',
      category: 'career',
      categoryName: '진로선택',
      credits: 4,
      hp: 390,
      icon: '⚛️',
      color: '#7c3aed',
      attackName: '양자 중첩 불확정성 충격',
      attackDmg: 24,
      flavor: '확률구름에 휩싸인 양자파동 존재. 얽힌 광자 입자가 전자기 flux와 함께 명멸한다.',
      quizzes: [
        {
          q: '미시 세계에서 입자가 파동의 성질을 동시에 가지며 상태가 중첩되어 존재한다는 물리학 분야는?',
          options: ['양자역학(Quantum Mechanics)', '고전역학', '지구역학', '화학평형'],
          ans: 0,
          exp: '2022 개정 과학 진로선택 ‘전자기와 양자’에서 양자물리학의 기본 원리를 탐구합니다.'
        },
        {
          q: '전기장과 자기장이 서로를 유도하며 공간을 퍼져나가는 파동은?',
          options: ['전자기파(Electromagnetic Wave)', '음파', '지진파', '수면파'],
          ans: 0,
          exp: '전자기파는 전기장과 자기장이 서로 유도하며 진행하는 파동입니다.'
        },
        {
          q: '빛이 입자처럼 행동하여 금속 표면에서 전자를 튀어나오게 하는 현상은?',
          options: ['광전효과(Photoelectric Effect)', '도플러효과', '단순 굴절현상', '단순 반사현상'],
          ans: 0,
          exp: '광전효과는 빛의 입자성을 실증하는 대표적인 현상입니다.'
        }
      ]
    },
    'gene_heredity': {
      id: 'gene_heredity',
      name: '생물의 유전',
      element: 'nature',
      category: 'career',
      categoryName: '진로선택',
      credits: 4,
      hp: 390,
      icon: '🧬',
      color: '#16a34a',
      attackName: '유전자 가위(CRISPR) 절단',
      attackDmg: 24,
      flavor: '크리스퍼 유전자 가위 모양의 쌍검을 다루는 생체분자 발키리. 유전 나선을 정밀하게 편집한다.',
      quizzes: [
        {
          q: '특정 DNA 염기서열을 정밀하게 교정하는 첨단 생명공학 기술은?',
          options: ['크리스퍼 유전자 가위 (CRISPR-Cas9)', '단순 현미경 관찰', '세포 염색법', '단백질 침전법'],
          ans: 0,
          exp: '2022 개정 진로선택 ‘생물의 유전’에서 분자유전학과 유전자 가위 기술을 심층 탐구합니다.'
        },
        {
          q: '부모의 유전 형질이 자손에게 전달되는 최소 단위로, DNA의 특정 부분을 무엇이라 하는가?',
          options: ['유전자(Gene)', '세포막', '리보솜', '미토콘드리아'],
          ans: 0,
          exp: '유전자는 형질 정보를 담고 있는 DNA의 특정 부위입니다.'
        },
        {
          q: '생식세포가 형성될 때 염색체 수가 절반으로 줄어드는 세포분열은?',
          options: ['감수분열(Meiosis)', '체세포분열(Mitosis)', '무성생식', '이분법'],
          ans: 0,
          exp: '감수분열을 통해 생식세포의 염색체 수가 체세포의 절반이 됩니다.'
        }
      ]
    },
    'politics_law_soc': {
      id: 'politics_law_soc',
      name: '정치·법과 사회',
      element: 'social',
      category: 'career',
      categoryName: '진로선택',
      credits: 4,
      hp: 370,
      icon: '⚖️',
      color: '#8b5cf6',
      attackName: '헌법 재판 위헌 해머',
      attackDmg: 22,
      flavor: '헌법 갑옷을 걸친 사자 판사. 황금 정의의 망치가 위헌을 가른다.',
      quizzes: [
        {
          q: '국민의 기본권을 보장하고 국가 권력의 남용을 방지하기 위한 국가 최고 규범은?',
          options: ['헌법(Constitution)', '지방조례', '사규', '학급 규칙'],
          ans: 0,
          exp: '헌법은 국가의 최고 기본법입니다.'
        },
        {
          q: '국가 권력을 입법·행정·사법으로 나누어 서로 견제하게 하는 민주주의 원리는?',
          options: ['권력분립(삼권분립)', '권력 집중', '왕권신수설', '계엄통치'],
          ans: 0,
          exp: '권력분립은 권력 남용을 막기 위해 국가 기능을 나누어 견제하게 합니다.'
        },
        {
          q: '법률이 헌법에 위반되는지를 심판하는 우리나라의 헌법기관은?',
          options: ['헌법재판소', '대법원 단독', '국회', '지방자치단체'],
          ans: 0,
          exp: '헌법재판소는 법률의 위헌 여부 등을 심판하는 헌법기관입니다.'
        }
      ]
    },
    'intl_relations': {
      id: 'intl_relations',
      name: '국제 관계의 이해',
      element: 'social',
      category: 'career',
      categoryName: '진로선택',
      credits: 4,
      hp: 360,
      icon: '🌐',
      color: '#6366f1',
      attackName: '외교 안보 다자협상 압박',
      attackDmg: 22,
      flavor: '올리브 왕관을 쓴 외교관 백호. 세계 각국의 국기가 날개처럼 겹쳐 펼쳐진다.',
      quizzes: [
        {
          q: '전 세계의 평화 유지와 인도적 문제 해결을 위해 설립된 대표적인 국제기구는?',
          options: ['국제연합 (UN)', '국제올림픽위원회 (IOC)', '글로벌 팬클럽', '세계은행 단독'],
          ans: 0,
          exp: 'UN(국제연합)은 국제 평화와 안보를 주 목적으로 하는 글로벌 기구입니다.'
        },
        {
          q: '국가 간 무역 장벽을 낮추고 자유로운 교역을 촉진하기 위해 체결하는 협정은?',
          options: ['자유무역협정(FTA)', '관세 전면 금지법', '쇄국정책', '고립주의 선언'],
          ans: 0,
          exp: 'FTA는 국가 간 관세 및 무역 장벽을 완화하는 협정입니다.'
        },
        {
          q: '국제사회에서 자국의 이익과 실리를 우선하여 접근하는 외교 방식은?',
          options: ['현실주의 외교', '무조건적 이상주의', '완전한 고립주의', '무정부주의'],
          ans: 0,
          exp: '현실주의 외교는 국가 이익과 힘의 균형을 중시하는 접근입니다.'
        }
      ]
    },
    'social_problem': {
      id: 'social_problem',
      name: '사회문제 탐구',
      element: 'social',
      category: 'fusion',
      categoryName: '융합선택',
      credits: 4,
      hp: 360,
      icon: '🔍',
      color: '#d97706',
      attackName: '사회 양극화 모순 일격',
      attackDmg: 22,
      flavor: '모노클을 쓴 탐정 까마귀. 빅데이터 확대경으로 불평등의 단서를 파헤친다.',
      quizzes: [
        {
          q: '사회문제를 객관적으로 조사하고 해결책을 제시할 때 가장 신뢰할 만한 탐구 방법은?',
          options: ['통계 데이터 분석 및 현장 설문·인터뷰 교차 검증', '인터넷 커뮤니티 댓글 인용', '개인적인 직감만으로 결론', '가짜 뉴스 인용'],
          ans: 0,
          exp: '체계적인 연구 방법론과 신뢰할 수 있는 데이터 수집이 사회문제 탐구의 핵심입니다.'
        },
        {
          q: '저출산·고령화처럼 인구 구조 변화로 인한 사회문제를 탐구할 때 가장 필요한 자료는?',
          options: ['통계청 등 공신력 있는 인구 통계 자료', '근거 없는 소문', '개인 블로그 후기만', '연예인 SNS 게시물'],
          ans: 0,
          exp: '공신력 있는 통계 자료를 근거로 삼아야 신뢰할 수 있는 분석이 가능합니다.'
        },
        {
          q: '사회문제 탐구보고서를 작성할 때 연구자가 반드시 지켜야 할 연구 윤리는?',
          options: ['데이터를 조작하지 않고 출처를 밝혀 인용하기', '유리한 데이터만 골라 조작하기', '타인의 연구를 표절하기', '결과를 임의로 바꾸기'],
          ans: 0,
          exp: '출처를 정확히 밝히고 데이터를 조작하지 않는 것이 연구 윤리의 기본입니다.'
        }
      ]
    },
    'media_comm': {
      id: 'media_comm',
      name: '매체 의사소통',
      element: 'fusion',
      category: 'fusion',
      categoryName: '융합선택',
      credits: 4,
      hp: 350,
      icon: '🎬',
      color: '#db2777',
      attackName: '미디어 리터러시 파동',
      attackDmg: 21,
      flavor: '카메라 렌즈 눈을 가진 팝아트 미디어 괴수. 안테나 뿔에서 디지털 글리치가 흩날린다.',
      quizzes: [
        {
          q: '디지털 미디어 정보를 무비판적으로 수용하지 않고 주체적으로 비판·분석하는 역량은?',
          options: ['디지털 미디어 리터러시', '단순 카피 페이스트', '어그로 클릭 유도', '스팸 발송'],
          ans: 0,
          exp: '2022 개정 국어과 융합선택 ‘매체 의사소통’은 미디어 리터러시와 윤리적 제작 역량을 기릅니다.'
        },
        {
          q: '뉴스나 정보의 출처와 사실 여부를 다른 자료와 교차 확인하는 과정을 무엇이라 하는가?',
          options: ['팩트체크(Fact-check)', '무조건적 신뢰', '출처 무시', '무조건 재전송'],
          ans: 0,
          exp: '팩트체크는 정보의 진위를 검증하는 미디어 리터러시의 핵심 과정입니다.'
        },
        {
          q: '1인 미디어 콘텐츠 제작 시 저작권과 초상권을 존중하는 태도는 어떤 역량에 해당하는가?',
          options: ['미디어 윤리 및 법적 책임 의식', '조회수만 극대화하는 전략', '타인 콘텐츠 무단 도용', '허위 정보 유포'],
          ans: 0,
          exp: '콘텐츠 제작에는 법적·윤리적 책임을 지는 태도가 반드시 필요합니다.'
        }
      ]
    },
    'music_media': {
      id: 'music_media',
      name: '음악과 미디어',
      element: 'fusion',
      category: 'fusion',
      categoryName: '융합선택',
      credits: 4,
      hp: 350,
      icon: '🎧',
      color: '#e11d48',
      attackName: '디지털 사운드트랙 쇼크',
      attackDmg: 21,
      flavor: '이퀄라이저 헤드폰을 낀 사이버 DJ. 홀로그램 믹서 데크로 신스웨이브를 지휘한다.',
      quizzes: [
        {
          q: '영상, 게임, 인터랙티브 콘텐츠에 어우러져 감정과 몰입감을 극대화하는 음악 분야는?',
          options: ['미디어 사운드트랙 & 효과음 디자인', '단순 악보 필사', '무음 방송', '소음 발생'],
          ans: 0,
          exp: '2022 개정 예술 융합선택 ‘음악과 미디어’는 디지털 미디어 속 음악의 창작과 융합을 다룹니다.'
        },
        {
          q: '영화나 게임의 특정 장면에서 감정을 극대화하기 위해 삽입되는 배경음악을 무엇이라 하는가?',
          options: ['스코어(Score)/배경음악', '메인 테마 가사', '자막', '엔딩 크레딧 텍스트'],
          ans: 0,
          exp: '스코어는 장면의 분위기와 감정을 강화하는 배경음악을 뜻합니다.'
        },
        {
          q: '디지털 음원을 컴퓨터로 작곡·편집·믹싱할 때 사용하는 소프트웨어를 통칭하는 용어는?',
          options: ['DAW(Digital Audio Workstation)', '워드프로세서', '스프레드시트', '웹 브라우저'],
          ans: 0,
          exp: 'DAW는 디지털 음악 제작에 특화된 소프트웨어 환경입니다.'
        }
      ]
    },
    'economics': {
      id: 'economics',
      name: '경제',
      element: 'social',
      category: 'career',
      categoryName: '진로선택',
      credits: 4,
      hp: 365,
      icon: '💰',
      color: '#ca8a04',
      attackName: '수요·공급 시장 충격',
      attackDmg: 22,
      flavor: '동전을 저글링하는 시장의 광대. 수요와 공급의 균형점에서만 완벽하게 웃는다.',
      quizzes: [
        {
          q: '가격이 오르면 수요량이 줄고, 가격이 내리면 수요량이 늘어나는 일반적 관계는?',
          options: ['수요의 법칙', '공급의 법칙', '희소성의 원칙', '기회비용의 법칙'],
          ans: 0,
          exp: '수요의 법칙은 가격과 수요량이 반대로 움직이는 일반적 경향을 설명합니다.'
        },
        {
          q: '한정된 자원으로 최선의 선택을 할 때, 포기해야 하는 다른 선택의 가치를 무엇이라 하는가?',
          options: ['기회비용', '매몰비용', '고정비용', '명시적 비용'],
          ans: 0,
          exp: '기회비용은 하나를 선택함으로써 포기하게 되는 다른 대안의 가치입니다.'
        },
        {
          q: '시장에서 수요와 공급이 일치하여 가격과 거래량이 결정되는 상태는?',
          options: ['시장균형', '독점 상태', '완전경쟁 실패', '가격 통제 상태'],
          ans: 0,
          exp: '수요곡선과 공급곡선이 만나는 지점에서 시장균형 가격과 거래량이 정해집니다.'
        }
      ]
    },
    'chem_reactions_world': {
      id: 'chem_reactions_world',
      name: '화학 반응의 세계',
      element: 'nature',
      category: 'career',
      categoryName: '진로선택',
      credits: 4,
      hp: 385,
      icon: '⚗️',
      color: '#0d9488',
      attackName: '화학평형 반응 폭발',
      attackDmg: 23,
      flavor: '플라스크 심장 속에서 정반응과 역반응이 끝없이 맞부딪히는 평형의 정령.',
      quizzes: [
        {
          q: '화학반응의 속도에 영향을 주는 요인이 아닌 것은?',
          options: ['반응물의 색깔', '온도', '농도', '촉매'],
          ans: 0,
          exp: '반응 속도는 온도, 농도, 촉매, 표면적 등에 영향을 받으며 색깔과는 무관합니다.'
        },
        {
          q: '가역 반응에서 정반응과 역반응의 속도가 같아져 겉보기에 반응이 멈춘 것처럼 보이는 상태는?',
          options: ['화학평형', '반응 종결', '촉매 소멸', '완전 반응'],
          ans: 0,
          exp: '화학평형 상태에서는 정반응과 역반응이 같은 속도로 계속 일어나고 있습니다.'
        },
        {
          q: '반응 속도를 증가시키지만 반응 후에도 자신은 변하지 않는 물질은?',
          options: ['촉매(Catalyst)', '생성물', '반응물', '부산물'],
          ans: 0,
          exp: '촉매는 활성화 에너지를 낮춰 반응 속도를 높이지만 자신은 소모되지 않습니다.'
        }
      ]
    },
    'ai_math': {
      id: 'ai_math',
      name: '인공지능 수학',
      element: 'logic',
      category: 'career',
      categoryName: '진로선택',
      credits: 4,
      hp: 395,
      icon: '🔢',
      color: '#4f46e5',
      attackName: '경사하강 최적화 연산파',
      attackDmg: 24,
      flavor: '행렬과 벡터로 짜인 그물을 두른 지능형 거미. 경사하강의 발걸음으로 오차를 좁혀간다.',
      quizzes: [
        {
          q: '인공지능 수학에서 데이터를 벡터와 행렬로 표현해 연산하는 수학 분야는?',
          options: ['선형대수(Linear Algebra)', '정수론', '집합론', '평면기하학'],
          ans: 0,
          exp: '선형대수는 인공지능 모델의 데이터 표현과 연산의 기초가 됩니다.'
        },
        {
          q: '인공지능 모델이 예측 오차를 줄이기 위해 파라미터를 점진적으로 조정하는 최적화 기법은?',
          options: ['경사하강법(Gradient Descent)', '완전 탐색법', '무작위 추측법', '고정값 대입법'],
          ans: 0,
          exp: '경사하강법은 오차를 줄이는 방향으로 파라미터를 반복적으로 조정하는 기법입니다.'
        },
        {
          q: '불확실한 상황에서 특정 사건이 일어날 가능성을 수치로 나타낸 것은?',
          options: ['확률(Probability)', '평균', '표준편차', '상관계수'],
          ans: 0,
          exp: '확률은 인공지능 모델의 예측과 판단에 널리 활용되는 핵심 개념입니다.'
        }
      ]
    },
    'literature_and_film': {
      id: 'literature_and_film',
      name: '문학과 영상',
      element: 'fusion',
      category: 'fusion',
      categoryName: '융합선택',
      credits: 4,
      hp: 355,
      icon: '🎥',
      color: '#be185d',
      attackName: '매체 전환 몽타주 임팩트',
      attackDmg: 21,
      flavor: '책장이 필름 릴로 변신하는 셰이프시프터. 한 장의 글이 한 편의 영화로 펼쳐진다.',
      quizzes: [
        {
          q: '소설이 영화로 각색될 때, 문자로 서술된 내용이 화면과 소리로 표현되는 과정을 무엇이라 하는가?',
          options: ['매체 전환(각색)', '단순 복사', '원작 무시', '장르 파괴'],
          ans: 0,
          exp: '매체 전환은 문자 서사를 영상 언어로 옮기는 창작적 재구성 과정입니다.'
        },
        {
          q: '문학과 영상을 비교 감상할 때, 영상 매체만이 가지는 고유한 표현 수단은?',
          options: ['카메라 앵글과 편집, 음향', '인물의 심리 묘사', '비유와 상징', '서술자의 시점'],
          ans: 0,
          exp: '카메라 앵글, 편집, 음향은 문자로는 표현할 수 없는 영상만의 언어입니다.'
        },
        {
          q: '원작 소설과 영화화된 작품을 비교할 때 가장 바람직한 감상 태도는?',
          options: ['매체적 특성을 고려한 차이점과 공통점 분석', '원작과 다르면 무조건 실패로 평가', '영상은 무시하고 원작만 인정', '비교 없이 하나만 감상'],
          ans: 0,
          exp: '각 매체의 고유한 표현 방식을 이해하며 비교하는 것이 균형 잡힌 감상입니다.'
        }
      ]
    }
  },

  // 15종 학교생활 딜레마 이벤트
  events: [
    {
      id: 'y1_club_interview',
      title: '동아리 공개 모집 & 면접 시즌!',
      year: 1,
      desc: '고등학교 첫 동아리 선발 면접이다! 인기 만점 전공 심화 학술동아리와 자유롭고 재미있는 레저 동아리 사이에서 고민 중이다.',
      choices: [
        {
          text: '진로와 연계된 전공 심화 학술동아리에 지원한다! [🎯 진로 25 이상]',
          reqStat: { stat: 'career', min: 25 },
          resultText: '당당히 면접에 합격하여 우수 전공동아리 일원이 되었습니다! 진로역량 +15, 창체 4학점 획득!',
          statReward: { career: 15, community: 10 },
          creditBonus: 4
        },
        {
          text: '친구들과 함께 편안한 취미 동아리에 가입한다. (조건 없음)',
          resultText: '스트레스를 풀며 즐거운 학교생활을 시작합니다. 멘탈 +30 회복, 창체 2학점!',
          mentalHeal: 30,
          creditBonus: 2
        }
      ]
    },
    {
      id: 'y1_assignment_hell',
      title: '수행평가 폭풍 주간!',
      year: 1,
      desc: '공통과목 수행평가 마감이 한 주에 몰렸다! 밤샘 작업으로 멘탈이 위태롭다.',
      choices: [
        {
          text: '스터디 플래너를 1시간 단위로 쪼개어 체계적으로 끝낸다! [⚡ 자기주도 20 이상]',
          reqStat: { stat: 'selfDirected', min: 20 },
          resultText: '완벽한 시간 관리로 모든 수행평가 A등급 달성! 자기주도 +15, 학업 +10, 4학점 획득!',
          statReward: { selfDirected: 15, academic: 10 },
          creditBonus: 4
        },
        {
          text: '친구들과 조를 나누어 자료 조사를 분담한다. [🤝 공동체 15 이상]',
          reqStat: { stat: 'community', min: 15 },
          resultText: '협력의 시너지로 과제를 빠르게 끝냈습니다! 공동체 +15, 3학점 획득!',
          statReward: { community: 15 },
          creditBonus: 3
        },
        {
          text: '에너지 드링크를 마시며 벼락치기를 한다. (조건 없음)',
          resultText: '겨우 제출은 했지만 멘탈이 -25 깎였습니다.',
          mentalHeal: -25,
          creditBonus: 2
        }
      ]
    },
    {
      id: 'y1_midterm_stress',
      title: '첫 중간고사 성적표 수령!',
      year: 1,
      desc: '고등학교 첫 중간고사 성적이 나왔다. 중학교 때보다 어려워진 난이도에 살짝 충격을 받았다.',
      choices: [
        {
          text: '오답 노트를 만들고 취약 단원을 1:1로 철저히 분석한다. [📚 학업 25 이상]',
          reqStat: { stat: 'academic', min: 25 },
          resultText: '약점을 강점으로 바꾸는 메타인지 능력 발휘! 학업역량 +15, 자기주도 +10!',
          statReward: { academic: 15, selfDirected: 10 },
          creditBonus: 3
        },
        {
          text: '선생님을 찾아가 피드백과 학습 조언을 구한다. (조건 없음)',
          resultText: '따뜻한 격려와 명쾌한 학습법을 얻었습니다. 멘탈 +25 회복, 학업 +10!',
          statReward: { academic: 10 },
          mentalHeal: 25,
          creditBonus: 3
        }
      ]
    },
    {
      id: 'y1_peer_dilemma',
      title: '모둠 과제 무임승차 딜레마!',
      year: 1,
      desc: '통합사회1 융합 프로젝트 조별 과제에서 한 친구가 연락을 받지 않고 참여하지 않는다.',
      choices: [
        {
          text: '친구와 직접 대화하여 어려움을 파악하고 역할을 재조정해 이끈다! [🤝 공동체 20 이상]',
          reqStat: { stat: 'community', min: 20 },
          resultText: '탁월한 갈등 관리 리더십으로 최고 점수 획득! 공동체 +20, 창체 4학점!',
          statReward: { community: 20 },
          creditBonus: 4
        },
        {
          text: '내가 더 많은 분량을 맡아서 완성도를 높인다. [⚡ 자기주도 15 이상]',
          reqStat: { stat: 'selfDirected', min: 15 },
          resultText: '과제는 성공했으나 피로가 누적되었습니다. 자기주도 +10, 멘탈 -10.',
          statReward: { selfDirected: 10 },
          mentalHeal: -10,
          creditBonus: 3
        }
      ]
    },
    {
      id: 'y1_course_survey',
      title: '2학년 선택과목 1차 수요조사!',
      year: 1,
      desc: '내년에 배울 일반선택 과목을 조사한다. 내 진로 로드맵의 기초를 다질 시간이다.',
      choices: [
        {
          text: '대학 전공 가이드북과 위계성을 꼼꼼히 확인하고 신청한다. [🎯 진로 30 이상]',
          reqStat: { stat: 'career', min: 30 },
          resultText: '완벽한 3개년 이수 로드맵 수립! 진로역량 +20, 학업역량 +10, 4학점 획득!',
          statReward: { career: 20, academic: 10 },
          creditBonus: 4
        },
        {
          text: '진로 선생님의 1:1 상담을 통해 추천 과목을 결정한다. (조건 없음)',
          resultText: '균형 잡힌 시간표를 완성했습니다. 진로 +10, 자기주도 +10!',
          statReward: { career: 10, selfDirected: 10 },
          creditBonus: 3
        }
      ]
    },

    // 2학년 이벤트
    {
      id: 'y2_course_registration',
      title: '과목 선택의 갈림길!',
      year: 2,
      desc: '본격적인 수강신청 시즌이다! 친구들이 몰리는 쉬운 과목 vs 내 꿈에 꼭 필요한 어려운 과목!',
      choices: [
        {
          text: '내 진로에 꼭 필요한 도전적인 과목을 신청한다! [🎯 진로 35 이상]',
          reqStat: { stat: 'career', min: 35 },
          resultText: '입학사정관이 감탄할 주도적 교육과정 완성! 진로역량 +20, 4학점 획득!',
          statReward: { career: 20 },
          creditBonus: 4
        },
        {
          text: '친구와 함께 무난한 과목을 듣는다. (조건 없음)',
          resultText: '우정은 지켰지만 진로 전문성이 다소 아쉽습니다. 멘탈 +30 회복, 2학점.',
          mentalHeal: 30,
          creditBonus: 2
        }
      ]
    },
    {
      id: 'y2_min_achievement_crisis',
      title: '최소 학업성취수준(40%) 비상경보!',
      year: 2,
      desc: '어려운 선택과목의 중간평가 성취율이 38%로 미이수(I등급) 위기 경보가 울렸다!',
      choices: [
        {
          text: '방과 후 보충지도 프로그램에 성실히 참여한다. [⚡ 자기주도 25 이상]',
          reqStat: { stat: 'selfDirected', min: 25 },
          resultText: '1:1 클리닉 덕분에 성취율 85%로 대역전! 학업 +15, 자기주도 +15, 4학점!',
          statReward: { academic: 15, selfDirected: 15 },
          creditBonus: 4
        },
        {
          text: '친구들과 스터디 그룹을 결성한다. [🤝 공동체 25 이상]',
          reqStat: { stat: 'community', min: 25 },
          resultText: '협력 학습의 힘으로 위기를 넘겼습니다! 공동체 +15, 학업 +10, 4학점!',
          statReward: { community: 15, academic: 10 },
          creditBonus: 4
        },
        {
          text: '혼자 밤새워 벼락치기 공부를 한다. (조건 없음)',
          resultText: '가까스로 40%는 넘겼지만 멘탈이 -25 깎였습니다.',
          mentalHeal: -25,
          creditBonus: 2
        }
      ]
    },
    {
      id: 'y2_mock_exam_slump',
      title: '전국연합학력평가 슬럼프 극복!',
      year: 2,
      desc: '모의고사 결과가 기대에 미치지 못해 마음이 흔들린다. 어떻게 마인드를 다잡을까?',
      choices: [
        {
          text: '나만의 오답 원인을 메타인지로 정밀 진단하고 루틴을 회복한다. [⚡ 자기주도 30 이상]',
          reqStat: { stat: 'selfDirected', min: 30 },
          resultText: '슬럼프를 딛고 학업 효율 200% 상승! 자기주도 +20, 학업 +15, 멘탈 +20!',
          statReward: { selfDirected: 20, academic: 15 },
          mentalHeal: 20,
          creditBonus: 4
        },
        {
          text: '주말 동안 푹 쉬며 멘탈을 재충전한다. (조건 없음)',
          resultText: '충분한 휴식으로 활력을 되찾았습니다. 멘탈 +40 완전 회복!',
          mentalHeal: 40,
          creditBonus: 2
        }
      ]
    },
    {
      id: 'y2_small_class_crisis',
      title: '소인수 과목 폐강 위기!',
      year: 2,
      desc: '내가 꼭 듣고 싶은 심화 과목 신청자가 6명뿐이라 폐강 위기다!',
      choices: [
        {
          text: '선생님과 협의하여 [학교 간 공동교육과정]으로 개설을 추진한다! [🤝 공동체 30 이상]',
          reqStat: { stat: 'community', min: 30 },
          resultText: '학교의 벽을 넘어선 개설 성공! 공동체 +20, 진로 +15, 특별 4학점!',
          statReward: { community: 20, career: 15 },
          creditBonus: 4
        },
        {
          text: '다른 인원 많은 과목으로 변경한다. (조건 없음)',
          resultText: '무난하게 다른 과목을 이수했습니다. 학업 +10, 3학점.',
          statReward: { academic: 10 },
          creditBonus: 3
        }
      ]
    },
    {
      id: 'y2_festival_prep',
      title: '학교 축제 & 학술 부스 운영!',
      year: 2,
      desc: '동아리에서 1년간 탐구한 결과를 전교생 앞에서 전시하고 발표하는 축제날이다!',
      choices: [
        {
          text: '융합 실험 인터랙티브 부스를 기획해 대상을 수상한다! [🎯 진로 35 이상]',
          reqStat: { stat: 'career', min: 35 },
          resultText: '전교생의 폭발적 반응! 우수 동아리 표창! 진로 +20, 공동체 +15, 창체 4학점!',
          statReward: { career: 20, community: 15 },
          creditBonus: 4
        },
        {
          text: '친구들과 함께 축제 운영 스태프로 헌신한다. (조건 없음)',
          resultText: '멋진 축제를 함께 만들었습니다. 공동체 +15, 멘탈 +20!',
          statReward: { community: 15 },
          mentalHeal: 20,
          creditBonus: 3
        }
      ]
    },

    // 3학년 이벤트
    {
      id: 'y3_joint_curriculum',
      title: '온·오프라인 공동교육과정(꿈키움) 도전!',
      year: 3,
      desc: '우리 학교에 없는 첨단 융합 과목 야간/주말 강좌가 열렸다!',
      choices: [
        {
          text: '주말 야간 온라인 공동교육과정에 과감히 지원한다! [🎯 진로 40 이상]',
          reqStat: { stat: 'career', min: 40 },
          resultText: '전문 교수진과 함께 첨단 융합 탐구 완수! 진로 +25, 자기주도 +15, 융합 4학점!',
          statReward: { career: 25, selfDirected: 15 },
          creditBonus: 4
        },
        {
          text: '교내 자율 과제 탐구로 대체한다. [⚡ 자기주도 30 이상]',
          reqStat: { stat: 'selfDirected', min: 30 },
          resultText: '스스로 보고서를 완성하여 세특에 기록했습니다! 자기주도 +20, 3학점.',
          statReward: { selfDirected: 20 },
          creditBonus: 3
        }
      ]
    },
    {
      id: 'y3_mock_interview',
      title: '학생부 종합 모의 면접 캠프!',
      year: 3,
      desc: '입학사정관과 진로 선생님들이 3년간의 과목 이수 궤적을 심층 질문한다!',
      choices: [
        {
          text: '과목별 연계성과 융합 프로젝트 경험을 논리정연하게 답변한다! [📚 학업 40 이상]',
          reqStat: { stat: 'academic', min: 40 },
          resultText: '사정관들의 극찬! "자신의 진로를 가장 뚜렷하게 설계한 학생!" 학업 +20, 진로 +20, 4학점!',
          statReward: { academic: 20, career: 20 },
          creditBonus: 4
        },
        {
          text: '솔직하고 진정성 있는 태도로 나의 배움과 성장을 이야기한다. (조건 없음)',
          resultText: '좋은 인상을 남기며 실전 면접 감각을 익혔습니다. 멘탈 +20, 3학점.',
          mentalHeal: 20,
          creditBonus: 3
        }
      ]
    },
    {
      id: 'y3_research_report',
      title: '세부능력 및 특기사항(세특) 최종 보고서!',
      year: 3,
      desc: '3학년 융합선택 과목의 학술 탐구 보고서 마감일이다.',
      choices: [
        {
          text: '최신 논문 데이터와 통계를 인용하여 수준 높은 보고서를 제출한다! [📚 학업 40 이상]',
          reqStat: { stat: 'academic', min: 40 },
          resultText: '선생님께서 생기부 세특에 최상위 극찬 기록! 학업 +25, 진로 +15, 4학점!',
          statReward: { academic: 25, career: 15 },
          creditBonus: 4
        },
        {
          text: '조원들과 협력하여 실생활 적용 아이디어 위주로 작성한다. [🤝 공동체 30 이상]',
          reqStat: { stat: 'community', min: 30 },
          resultText: '실용성과 협업 능력을 높게 평가받았습니다. 공동체 +20, 3학점.',
          statReward: { community: 20 },
          creditBonus: 3
        }
      ]
    },
    {
      id: 'y3_exam_pressure',
      title: '졸업을 앞둔 최종 멘탈 관리!',
      year: 3,
      desc: '고등학교 3년의 대장정을 마무리하는 시점, 마지막 지침과 불안이 찾아온다.',
      choices: [
        {
          text: '3년간 걸어온 나만의 시간표와 성장을 믿고 마인드컨트롤한다! [⚡ 자기주도 35 이상]',
          reqStat: { stat: 'selfDirected', min: 35 },
          resultText: '불안을 확신으로 바꾼 강력한 멘탈리티! 멘탈 +50 완전 회복, 자기주도 +20!',
          statReward: { selfDirected: 20 },
          mentalHeal: 50,
          creditBonus: 4
        },
        {
          text: '선생님, 부모님과 진솔한 대화를 나누며 위로를 받는다. (조건 없음)',
          resultText: '따뜻한 응원에 힘을 얻어 마지막 힘을 냅니다. 멘탈 +35 회복!',
          mentalHeal: 35,
          creditBonus: 3
        }
      ]
    },
    {
      id: 'y3_portfolio_expo',
      title: '고교학점제 졸업 포트폴리오 박람회!',
      year: 3,
      desc: '후배들과 학부모님들 앞에서 나의 3개년 192학점 이수 포트폴리오를 발표한다!',
      choices: [
        {
          text: '나만의 진로 맞춤형 교육과정 설계 비결을 당당히 특강한다! [🎯 진로 45 이상]',
          reqStat: { stat: 'career', min: 45 },
          resultText: '후배들의 롤모델로 등극! 교육감 표창 수여! 진로 +25, 공동체 +20, 4학점!',
          statReward: { career: 25, community: 20 },
          creditBonus: 4
        },
        {
          text: '친구들과 함께 부스 전시를 멋지게 마친다. (조건 없음)',
          resultText: '3년의 보람을 느끼며 졸업 축하를 받았습니다. 공동체 +15, 3학점.',
          statReward: { community: 15 },
          creditBonus: 3
        }
      ]
    },

    // ===== 1학년 추가 이벤트 (공통, 다회차 재플레이 변주용) =====
    {
      id: 'y1_seatmate_intro',
      title: '짝꿍과의 첫 만남',
      year: 1,
      desc: '새 학기, 낯선 짝꿍과 한 학기를 함께 보내야 한다. 어떻게 다가갈까?',
      choices: [
        {
          text: '먼저 다가가 서로의 관심사를 나누며 친해진다. [🤝 공동체 15 이상]',
          reqStat: { stat: 'community', min: 15 },
          resultText: '좋은 친구가 되어 학교생활이 즐거워졌습니다! 공동체 +15, 멘탈 +20 회복!',
          statReward: { community: 15 },
          mentalHeal: 20,
          creditBonus: 3
        },
        {
          text: '조용히 각자의 시간을 존중하며 지낸다. (조건 없음)',
          resultText: '편안한 거리감으로 무난하게 지냈습니다. 자기주도 +10, 2학점.',
          statReward: { selfDirected: 10 },
          creditBonus: 2
        }
      ]
    },
    {
      id: 'y1_group_project_conflict',
      title: '조별 과제 무임승차 초기 갈등',
      year: 1,
      desc: '첫 조별 과제에서 한 명이 아무 의견도 내지 않고 있다. 마감은 다가온다.',
      choices: [
        {
          text: '직접 찾아가 어려움이 있는지 물어보고 역할을 조정한다. [🤝 공동체 15 이상]',
          reqStat: { stat: 'community', min: 15 },
          resultText: '대화를 통해 팀워크가 살아났습니다! 공동체 +15, 학업 +10!',
          statReward: { community: 15, academic: 10 },
          creditBonus: 3
        },
        {
          text: '남은 인원끼리 역할을 나눠 마무리한다. (조건 없음)',
          resultText: '힘들었지만 제출은 무사히 마쳤습니다. 자기주도 +10, 2학점.',
          statReward: { selfDirected: 10 },
          creditBonus: 2
        }
      ]
    },
    {
      id: 'y1_grade_comparison_stress',
      title: '성적 비교 스트레스',
      year: 1,
      desc: '친구들과 성적을 비교하다 보니 위축되고 스트레스를 받는다.',
      choices: [
        {
          text: '남과의 비교보다 나만의 성장 기록에 집중하기로 한다. [⚡ 자기주도 20 이상]',
          reqStat: { stat: 'selfDirected', min: 20 },
          resultText: '스스로의 성장에 집중하니 마음이 편해졌습니다! 자기주도 +15, 멘탈 +20 회복!',
          statReward: { selfDirected: 15 },
          mentalHeal: 20,
          creditBonus: 3
        },
        {
          text: '친구에게 고민을 털어놓고 위로받는다. (조건 없음)',
          resultText: '대화를 나누니 마음이 한결 가벼워졌습니다. 공동체 +10, 2학점.',
          statReward: { community: 10 },
          creditBonus: 2
        }
      ]
    },
    {
      id: 'y1_class_election',
      title: '학급 임원 선거 도전',
      year: 1,
      desc: '학급 회장 선거에 나가볼까 고민이 된다. 부담도 되지만 도전해보고 싶다.',
      choices: [
        {
          text: '공약을 준비해 당당히 후보로 출마한다! [🎯 진로 20 이상]',
          reqStat: { stat: 'career', min: 20 },
          resultText: '진솔한 공약으로 학급 회장에 당선되었습니다! 진로 +15, 공동체 +10!',
          statReward: { career: 15, community: 10 },
          creditBonus: 3
        },
        {
          text: '후보를 도와 선거운동을 지원한다. (조건 없음)',
          resultText: '조력자로서 뜻깊은 경험을 했습니다. 공동체 +10, 2학점.',
          statReward: { community: 10 },
          creditBonus: 2
        }
      ]
    },
    {
      id: 'y1_record_worry',
      title: '생활기록부 세특 작성 고민',
      year: 1,
      desc: '첫 학기 생활기록부 세부능력 특기사항에 무엇을 채워야 할지 고민이 된다.',
      choices: [
        {
          text: '한 학기 동안의 탐구 활동을 스스로 정리해 선생님께 전달한다. [📚 학업 20 이상]',
          reqStat: { stat: 'academic', min: 20 },
          resultText: '구체적인 자료 덕분에 알찬 세특이 완성됐습니다! 학업 +15, 진로 +10!',
          statReward: { academic: 15, career: 10 },
          creditBonus: 3
        },
        {
          text: '선생님과 상담하며 방향을 함께 정한다. (조건 없음)',
          resultText: '상담을 통해 앞으로의 방향을 잡았습니다. 자기주도 +10, 2학점.',
          statReward: { selfDirected: 10 },
          creditBonus: 2
        }
      ]
    },

    // ===== 2학년 트랙별 이벤트 (트랙마다 다른 이벤트 + 다회차 변주) =====
    {
      id: 'y2s0_tech',
      title: '코딩 동아리 해커톤 출전 제안',
      year: 2,
      desc: '교내 코딩 동아리에서 전국 해커톤 대회 출전 팀을 꾸린다는 소식이 들려온다. 밤새 코딩할 각오가 필요하다.',
      choices: [
        { text: '팀장을 맡아 프로젝트를 이끈다! [🎯 진로 25 이상]', reqStat: { stat: 'career', min: 25 }, resultText: '리더십을 발휘해 팀을 우승으로 이끌었습니다! 진로 +15, 학업 +10, 4학점!', statReward: { career: 15, academic: 10 }, creditBonus: 4 },
        { text: '팀원으로 참여해 힘을 보탠다. (조건 없음)', resultText: '협업의 즐거움을 느끼며 실력을 키웠습니다. 학업 +10, 2학점.', statReward: { academic: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s0_bio',
      title: '생명과학 실험실 심화반 지원',
      year: 2,
      desc: '방과후 생명과학 심화 실험반 모집이 시작됐다. 정원이 적어 지원서에 진지한 연구 계획이 필요하다.',
      choices: [
        { text: '구체적인 탐구 계획서를 작성해 지원한다! [📚 학업 25 이상]', reqStat: { stat: 'academic', min: 25 }, resultText: '탄탄한 계획서로 합격! 심화 실험을 통해 학업 +15, 자기주도 +10!', statReward: { academic: 15, selfDirected: 10 }, creditBonus: 4 },
        { text: '선배에게 조언을 구해 지원서를 다듬는다. (조건 없음)', resultText: '선배의 팁으로 무난히 합격했습니다. 공동체 +10, 2학점.', statReward: { community: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s0_social',
      title: '모의 유엔(MUN) 학교 대표 선발전',
      year: 2,
      desc: '모의 유엔 대회에 학교를 대표해 나갈 대표단을 선발한다. 국제 이슈에 대한 발표와 토론이 기다린다.',
      choices: [
        { text: '국제 분쟁 이슈를 깊이 조사해 발표를 준비한다! [🎯 진로 25 이상]', reqStat: { stat: 'career', min: 25 }, resultText: '설득력 있는 발표로 대표단에 선발! 진로 +15, 공동체 +10!', statReward: { career: 15, community: 10 }, creditBonus: 4 },
        { text: '팀원들과 역할을 나눠 자료를 조사한다. (조건 없음)', resultText: '협업을 통해 무난히 준비를 마쳤습니다. 공동체 +10, 2학점.', statReward: { community: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s0_art',
      title: '교내 미술제 큐레이터 참여 제안',
      year: 2,
      desc: '교내 미술제 전시를 기획할 학생 큐레이터를 모집한다. 작품 선정과 전시 구성 감각이 필요하다.',
      choices: [
        { text: '독창적인 전시 컨셉을 기획해 지원한다! [🎯 진로 25 이상]', reqStat: { stat: 'career', min: 25 }, resultText: '참신한 기획이 채택되어 큐레이터로 선발! 진로 +15, 창체 4학점!', statReward: { career: 15 }, creditBonus: 4 },
        { text: '작품 운반과 전시 설치를 돕는 스태프로 참여한다. (조건 없음)', resultText: '전시 준비 과정을 배우며 즐겁게 참여했습니다. 공동체 +10, 2학점.', statReward: { community: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s1_tech',
      title: '알고리즘 문제풀이 슬럼프',
      year: 2,
      desc: '정보 과목 알고리즘 문제를 며칠째 풀지 못해 자신감이 떨어졌다.',
      choices: [
        { text: '기초 개념부터 차근차근 다시 정리한다. [⚡ 자기주도 25 이상]', reqStat: { stat: 'selfDirected', min: 25 }, resultText: '기초를 다지자 막혔던 문제가 풀렸습니다! 자기주도 +15, 학업 +10!', statReward: { selfDirected: 15, academic: 10 }, creditBonus: 4 },
        { text: '일단 며칠 쉬면서 머리를 식힌다. (조건 없음)', resultText: '재충전 후 다시 도전하니 한결 나아졌습니다. 멘탈 +20 회복.', mentalHeal: 20, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s1_bio',
      title: '실험보고서 데이터 조작 유혹',
      year: 2,
      desc: '실험 결과가 예상과 다르게 나와서, 그럴듯하게 데이터를 손보고 싶은 유혹이 든다.',
      choices: [
        { text: '있는 그대로의 데이터로 원인을 재분석해 보고서를 쓴다. [📚 학업 25 이상]', reqStat: { stat: 'academic', min: 25 }, resultText: '정직한 분석으로 오히려 새로운 발견을 했습니다! 학업 +15, 자기주도 +10!', statReward: { academic: 15, selfDirected: 10 }, creditBonus: 4 },
        { text: '선생님께 실험 오차의 원인을 상담한다. (조건 없음)', resultText: '실험 오차를 이해하며 한층 성장했습니다. 학업 +10, 2학점.', statReward: { academic: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s1_social',
      title: '토론대회 팀원과의 의견 충돌',
      year: 2,
      desc: '토론대회를 준비하는데 팀원과 논지 방향이 크게 갈려 갈등이 생겼다.',
      choices: [
        { text: '서로의 논리를 경청하고 절충안을 제시한다. [🤝 공동체 25 이상]', reqStat: { stat: 'community', min: 25 }, resultText: '훌륭한 중재로 팀의 논리가 더 탄탄해졌습니다! 공동체 +15, 진로 +10!', statReward: { community: 15, career: 10 }, creditBonus: 4 },
        { text: '일단 각자 조사한 자료를 모두 취합해본다. (조건 없음)', resultText: '다양한 관점을 모아 무난히 정리했습니다. 학업 +10, 2학점.', statReward: { academic: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s1_art',
      title: '창작 아이디어 고갈(작가의 벽)',
      year: 2,
      desc: '다음 작품을 구상해야 하는데 며칠째 어떤 아이디어도 떠오르지 않는다.',
      choices: [
        { text: '다양한 예술 작품과 전시를 찾아보며 영감을 얻는다. [⚡ 자기주도 25 이상]', reqStat: { stat: 'selfDirected', min: 25 }, resultText: '새로운 영감으로 독창적인 아이디어를 떠올렸습니다! 자기주도 +15, 진로 +10!', statReward: { selfDirected: 15, career: 10 }, creditBonus: 4 },
        { text: '일단 손이 가는 대로 스케치를 시작해본다. (조건 없음)', resultText: '끄적이다 보니 조금씩 방향이 잡혔습니다. 멘탈 +20 회복.', mentalHeal: 20, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s2_tech',
      title: '정보 과목 코딩 테스트 압박',
      year: 2,
      desc: '정보 과목 실기 코딩 테스트 일정이 코앞으로 다가왔다.',
      choices: [
        { text: '매일 문제를 정해진 시간 안에 푸는 실전 연습을 한다. [📚 학업 25 이상]', reqStat: { stat: 'academic', min: 25 }, resultText: '실전 감각을 익혀 테스트를 완벽히 통과했습니다! 학업 +15, 자기주도 +10!', statReward: { academic: 15, selfDirected: 10 }, creditBonus: 4 },
        { text: '친구와 서로 코드 리뷰를 해준다. (조건 없음)', resultText: '서로의 코드를 보며 실력이 함께 늘었습니다. 공동체 +10, 2학점.', statReward: { community: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s2_bio',
      title: '화학 실험 정량분석 오차',
      year: 2,
      desc: '적정 실험에서 계속 오차가 발생해 결과가 들쭉날쭉하다.',
      choices: [
        { text: '실험 절차를 처음부터 꼼꼼히 재점검한다. [📚 학업 25 이상]', reqStat: { stat: 'academic', min: 25 }, resultText: '미세한 절차 오류를 찾아내 정확한 결과를 얻었습니다! 학업 +15, 자기주도 +10!', statReward: { academic: 15, selfDirected: 10 }, creditBonus: 4 },
        { text: '조교 선생님께 실험 팁을 여쭤본다. (조건 없음)', resultText: '유용한 팁으로 오차를 줄였습니다. 학업 +10, 2학점.', statReward: { academic: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s2_social',
      title: '세계사 연표 암기의 늪',
      year: 2,
      desc: '세계사 시험이 다가오는데 방대한 연표와 사건들이 뒤섞여 헷갈린다.',
      choices: [
        { text: '사건들을 흐름과 인과관계로 묶어 나만의 타임라인을 만든다. [📚 학업 25 이상]', reqStat: { stat: 'academic', min: 25 }, resultText: '맥락으로 이해하니 훨씬 오래 기억에 남았습니다! 학업 +15, 자기주도 +10!', statReward: { academic: 15, selfDirected: 10 }, creditBonus: 4 },
        { text: '친구들과 퀴즈를 내며 암기한다. (조건 없음)', resultText: '즐겁게 서로 문제를 내며 외웠습니다. 공동체 +10, 2학점.', statReward: { community: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s2_art',
      title: '음악·미술 실기고사 부담',
      year: 2,
      desc: '예술 실기고사가 코앞인데 완성도가 마음에 들지 않아 초조하다.',
      choices: [
        { text: '기초 테크닉부터 반복 연습하며 완성도를 높인다. [⚡ 자기주도 25 이상]', reqStat: { stat: 'selfDirected', min: 25 }, resultText: '꾸준한 연습으로 실기 완성도가 크게 올랐습니다! 자기주도 +15, 학업 +10!', statReward: { selfDirected: 15, academic: 10 }, creditBonus: 4 },
        { text: '선생님께 피드백을 받아 보완한다. (조건 없음)', resultText: '구체적인 피드백으로 부족한 점을 채웠습니다. 학업 +10, 2학점.', statReward: { academic: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s3_tech',
      title: 'AI 융합 수업 정원 미달 위기',
      year: 2,
      desc: '신설된 AI 융합 수업이 신청자 부족으로 폐강될 위기에 놓였다.',
      choices: [
        { text: '수업의 가치를 알리는 캠페인을 벌여 친구들을 모집한다! [🤝 공동체 25 이상]', reqStat: { stat: 'community', min: 25 }, resultText: '적극적인 홍보로 정원을 채워 수업을 지켜냈습니다! 공동체 +15, 진로 +10!', statReward: { community: 15, career: 10 }, creditBonus: 4 },
        { text: '선생님께 수업의 필요성을 직접 건의한다. (조건 없음)', resultText: '건의가 반영되어 소규모로라도 개설되었습니다. 진로 +10, 2학점.', statReward: { career: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s3_bio',
      title: '생명과학Ⅱ 폐강 위기',
      year: 2,
      desc: '심화 생명과학 수업이 신청 인원 부족으로 폐강 논의에 들어갔다.',
      choices: [
        { text: '수업의 필요성을 정리해 학교 측에 건의서를 제출한다! [🎯 진로 25 이상]', reqStat: { stat: 'career', min: 25 }, resultText: '논리적인 건의로 수업이 유지되었습니다! 진로 +15, 공동체 +10!', statReward: { career: 15, community: 10 }, creditBonus: 4 },
        { text: '다른 학교와 공동교육과정으로 수강하는 방법을 알아본다. (조건 없음)', resultText: '공동교육과정으로 수업을 계속 들을 수 있었습니다. 자기주도 +10, 2학점.', statReward: { selfDirected: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s3_social',
      title: '국제정치 소인수 수업 존속 청원',
      year: 2,
      desc: '신청자가 적은 국제정치 심화 수업이 폐강 위기에 놓여 학생들이 청원을 준비한다.',
      choices: [
        { text: '청원서를 작성하고 서명을 모아 학교에 제출한다! [🤝 공동체 25 이상]', reqStat: { stat: 'community', min: 25 }, resultText: '많은 서명을 모아 수업을 지켜냈습니다! 공동체 +15, 진로 +10!', statReward: { community: 15, career: 10 }, creditBonus: 4 },
        { text: '선생님과 면담해 대안을 논의한다. (조건 없음)', resultText: '온라인 공동수업으로 대체할 방법을 찾았습니다. 학업 +10, 2학점.', statReward: { academic: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s3_art',
      title: '예술 융합 수업 축소 논란',
      year: 2,
      desc: '예산 문제로 예술 융합 수업의 시수가 줄어들 수 있다는 소식이 들린다.',
      choices: [
        { text: '학생 작품 전시회를 열어 수업의 가치를 보여준다! [🎯 진로 25 이상]', reqStat: { stat: 'career', min: 25 }, resultText: '전시회가 큰 호응을 얻어 수업 시수가 유지되었습니다! 진로 +15, 공동체 +10!', statReward: { career: 15, community: 10 }, creditBonus: 4 },
        { text: '선생님과 함께 수업 개선안을 논의한다. (조건 없음)', resultText: '개선안이 반영되어 수업이 계속되었습니다. 자기주도 +10, 2학점.', statReward: { selfDirected: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s4_tech',
      title: '축제 앱 개발 부스 운영',
      year: 2,
      desc: '학교 축제에서 직접 만든 축제 안내 앱을 시연하는 부스를 운영하게 됐다.',
      choices: [
        { text: '실시간 부스 혼잡도 알림 기능까지 추가로 개발한다! [📚 학업 25 이상]', reqStat: { stat: 'academic', min: 25 }, resultText: '혁신적인 기능으로 큰 인기를 얻었습니다! 학업 +15, 진로 +10!', statReward: { academic: 15, career: 10 }, creditBonus: 4 },
        { text: '기본 기능으로 안정적으로 부스를 운영한다. (조건 없음)', resultText: '무난하게 부스를 운영해 좋은 반응을 얻었습니다. 공동체 +10, 2학점.', statReward: { community: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s4_bio',
      title: '과학 체험부스 안전 관리',
      year: 2,
      desc: '축제에서 화학·생명과학 체험 부스를 운영하는데, 안전 관리가 무엇보다 중요하다.',
      choices: [
        { text: '철저한 안전 수칙과 보호장비를 준비해 부스를 운영한다! [📚 학업 25 이상]', reqStat: { stat: 'academic', min: 25 }, resultText: '안전하고 알기 쉬운 체험으로 큰 호응을 얻었습니다! 학업 +15, 공동체 +10!', statReward: { academic: 15, community: 10 }, creditBonus: 4 },
        { text: '선생님과 함께 기본 안전 수칙만 확인하고 운영한다. (조건 없음)', resultText: '무사히 부스를 마쳤습니다. 자기주도 +10, 2학점.', statReward: { selfDirected: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s4_social',
      title: '모의 유엔 캠페인 부스',
      year: 2,
      desc: '축제에서 국제 이슈를 알리는 캠페인 부스를 운영하게 되었다.',
      choices: [
        { text: '실제 통계와 자료를 활용한 전시로 캠페인을 기획한다! [🎯 진로 25 이상]', reqStat: { stat: 'career', min: 25 }, resultText: '설득력 있는 캠페인으로 많은 학생의 관심을 끌었습니다! 진로 +15, 공동체 +10!', statReward: { career: 15, community: 10 }, creditBonus: 4 },
        { text: '친구들과 역할을 나눠 부스를 운영한다. (조건 없음)', resultText: '협업으로 무난하게 캠페인을 마쳤습니다. 공동체 +10, 2학점.', statReward: { community: 10 }, creditBonus: 2 }
      ]
    },
    {
      id: 'y2s4_art',
      title: '축제 전시·공연 총괄 기획',
      year: 2,
      desc: '축제의 예술 전시와 공연 전체를 기획하는 총괄을 맡게 되었다.',
      choices: [
        { text: '전시와 공연을 잇는 통합 테마를 기획한다! [🎯 진로 25 이상]', reqStat: { stat: 'career', min: 25 }, resultText: '인상적인 통합 기획으로 축제의 하이라이트가 되었습니다! 진로 +15, 공동체 +10!', statReward: { career: 15, community: 10 }, creditBonus: 4 },
        { text: '각 팀의 의견을 모아 무리 없이 진행한다. (조건 없음)', resultText: '모두의 의견을 반영해 순조롭게 마쳤습니다. 공동체 +10, 2학점.', statReward: { community: 10 }, creditBonus: 2 }
      ]
    },

    // ===== 3학년 트랙별 이벤트 (트랙마다 다른 이벤트 + 다회차 변주) =====
    {
      id: 'y3s0_tech',
      title: '대학 연계 AI 캠프 참가',
      year: 3,
      desc: '대학교와 연계된 AI 심화 캠프 참가 기회가 주어졌다. 밀도 높은 프로젝트 실습이 예정되어 있다.',
      choices: [
        { text: '팀 프로젝트 리더를 자원해 심화 과제를 이끈다! [🎯 진로 35 이상]', reqStat: { stat: 'career', min: 35 }, resultText: '뛰어난 성과로 캠프 우수상을 받았습니다! 진로 +20, 학업 +15, 4학점!', statReward: { career: 20, academic: 15 }, creditBonus: 4 },
        { text: '팀원으로서 맡은 역할에 최선을 다한다. (조건 없음)', resultText: '값진 실전 경험을 쌓았습니다. 학업 +10, 3학점.', statReward: { academic: 10 }, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s0_bio',
      title: '대학 연구실 탐방 프로그램',
      year: 3,
      desc: '의약·생명과학 계열 대학 연구실을 직접 탐방하는 프로그램에 선발되었다.',
      choices: [
        { text: '연구자에게 날카로운 질문을 던지며 적극적으로 배운다! [📚 학업 35 이상]', reqStat: { stat: 'academic', min: 35 }, resultText: '연구자의 깊은 통찰을 얻어 진로가 더 명확해졌습니다! 학업 +20, 진로 +15, 4학점!', statReward: { academic: 20, career: 15 }, creditBonus: 4 },
        { text: '조용히 견학하며 필기로 기록한다. (조건 없음)', resultText: '차분히 관찰하며 많은 것을 배웠습니다. 자기주도 +10, 3학점.', statReward: { selfDirected: 10 }, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s0_social',
      title: '국제기구 화상 인턴십 체험',
      year: 3,
      desc: '국제기구와 연계된 화상 인턴십 체험 프로그램에 참여할 기회가 생겼다.',
      choices: [
        { text: '국제 이슈 보고서를 작성해 적극적으로 참여한다! [🎯 진로 35 이상]', reqStat: { stat: 'career', min: 35 }, resultText: '우수한 보고서로 담당자에게 좋은 평가를 받았습니다! 진로 +20, 학업 +15, 4학점!', statReward: { career: 20, academic: 15 }, creditBonus: 4 },
        { text: '차분히 회의를 참관하며 배운다. (조건 없음)', resultText: '국제기구의 실제 업무를 이해하게 되었습니다. 공동체 +10, 3학점.', statReward: { community: 10 }, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s0_art',
      title: '예술대학 연계 포트폴리오 특강',
      year: 3,
      desc: '예술대학과 연계된 포트폴리오 특강에 참여할 기회가 생겼다.',
      choices: [
        { text: '그동안의 작품을 정리해 전문가의 첨삭을 받는다! [🎯 진로 35 이상]', reqStat: { stat: 'career', min: 35 }, resultText: '전문적인 피드백으로 포트폴리오가 한층 완성되었습니다! 진로 +20, 학업 +15, 4학점!', statReward: { career: 20, academic: 15 }, creditBonus: 4 },
        { text: '다른 학생들의 작품을 보며 안목을 넓힌다. (조건 없음)', resultText: '다양한 스타일을 접하며 시야가 넓어졌습니다. 자기주도 +10, 3학점.', statReward: { selfDirected: 10 }, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s1_tech',
      title: '개발자 모의 면접 리허설',
      year: 3,
      desc: '진로 특강에서 현직 개발자와의 모의 면접 기회가 주어졌다.',
      choices: [
        { text: '포트폴리오 프로젝트를 논리적으로 설명한다. [📚 학업 35 이상]', reqStat: { stat: 'academic', min: 35 }, resultText: '명확한 설명으로 좋은 피드백을 받았습니다! 학업 +20, 진로 +15!', statReward: { academic: 20, career: 15 }, creditBonus: 4 },
        { text: '긴장했지만 솔직하게 배운 점을 이야기한다. (조건 없음)', resultText: '솔직한 태도가 좋은 인상을 남겼습니다. 멘탈 +20 회복.', mentalHeal: 20, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s1_bio',
      title: '의약계열 모의 면접',
      year: 3,
      desc: '진로 특강에서 의약·생명과학 계열 전문가와의 모의 면접 기회가 주어졌다.',
      choices: [
        { text: '생명윤리에 대한 자신의 관점을 논리적으로 답변한다. [📚 학업 35 이상]', reqStat: { stat: 'academic', min: 35 }, resultText: '깊이 있는 답변으로 전문가에게 인상을 남겼습니다! 학업 +20, 진로 +15!', statReward: { academic: 20, career: 15 }, creditBonus: 4 },
        { text: '솔직하게 자신의 경험과 배운 점을 이야기한다. (조건 없음)', resultText: '진솔한 태도가 좋은 평가를 받았습니다. 멘탈 +20 회복.', mentalHeal: 20, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s1_social',
      title: '외교관 모의 면접',
      year: 3,
      desc: '진로 특강에서 외교관·국제기구 전문가와의 모의 면접 기회가 주어졌다.',
      choices: [
        { text: '국제 이슈에 대한 균형 잡힌 시각을 논리적으로 제시한다. [📚 학업 35 이상]', reqStat: { stat: 'academic', min: 35 }, resultText: '균형 잡힌 시각이 인상적이라는 평가를 받았습니다! 학업 +20, 진로 +15!', statReward: { academic: 20, career: 15 }, creditBonus: 4 },
        { text: '솔직하게 관심을 갖게 된 계기를 이야기한다. (조건 없음)', resultText: '진솔한 이야기가 좋은 인상을 남겼습니다. 멘탈 +20 회복.', mentalHeal: 20, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s1_art',
      title: '크리에이터 모의 면접',
      year: 3,
      desc: '진로 특강에서 현직 콘텐츠 크리에이터와의 모의 면접 기회가 주어졌다.',
      choices: [
        { text: '자신의 창작 철학과 대표작을 논리적으로 설명한다. [📚 학업 35 이상]', reqStat: { stat: 'academic', min: 35 }, resultText: '뚜렷한 창작 철학이 좋은 평가를 받았습니다! 학업 +20, 진로 +15!', statReward: { academic: 20, career: 15 }, creditBonus: 4 },
        { text: '솔직하게 작업 과정의 고민을 이야기한다. (조건 없음)', resultText: '진솔한 태도가 좋은 인상을 남겼습니다. 멘탈 +20 회복.', mentalHeal: 20, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s2_tech',
      title: '인공지능 윤리 탐구보고서',
      year: 3,
      desc: '인공지능의 편향성과 윤리 문제를 주제로 심화 탐구보고서를 작성해야 한다.',
      choices: [
        { text: '실제 AI 편향 사례를 조사해 데이터로 분석한다. [📚 학업 35 이상]', reqStat: { stat: 'academic', min: 35 }, resultText: '탄탄한 데이터 분석으로 우수 보고서로 선정되었습니다! 학업 +20, 진로 +15!', statReward: { academic: 20, career: 15 }, creditBonus: 4 },
        { text: '관련 기사와 책을 참고해 보고서를 작성한다. (조건 없음)', resultText: '성실하게 조사해 무난한 보고서를 완성했습니다. 자기주도 +10, 3학점.', statReward: { selfDirected: 10 }, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s2_bio',
      title: '유전자 편집 기술 탐구보고서',
      year: 3,
      desc: '크리스퍼 유전자 가위 기술의 가능성과 한계를 주제로 탐구보고서를 작성해야 한다.',
      choices: [
        { text: '최신 논문을 찾아 근거를 바탕으로 심층 분석한다. [📚 학업 35 이상]', reqStat: { stat: 'academic', min: 35 }, resultText: '심층적인 분석으로 우수 보고서로 선정되었습니다! 학업 +20, 진로 +15!', statReward: { academic: 20, career: 15 }, creditBonus: 4 },
        { text: '교과서와 참고자료 중심으로 보고서를 작성한다. (조건 없음)', resultText: '기본에 충실한 보고서를 완성했습니다. 자기주도 +10, 3학점.', statReward: { selfDirected: 10 }, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s2_social',
      title: '국제 분쟁 사례 탐구보고서',
      year: 3,
      desc: '현대 국제 분쟁의 원인과 해결 방안을 주제로 탐구보고서를 작성해야 한다.',
      choices: [
        { text: '다양한 국가의 입장을 균형 있게 비교 분석한다. [📚 학업 35 이상]', reqStat: { stat: 'academic', min: 35 }, resultText: '균형 잡힌 분석으로 우수 보고서로 선정되었습니다! 학업 +20, 진로 +15!', statReward: { academic: 20, career: 15 }, creditBonus: 4 },
        { text: '뉴스 기사를 중심으로 보고서를 작성한다. (조건 없음)', resultText: '시사에 밝은 보고서를 완성했습니다. 자기주도 +10, 3학점.', statReward: { selfDirected: 10 }, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s2_art',
      title: '미디어 콘텐츠와 저작권 탐구보고서',
      year: 3,
      desc: '디지털 콘텐츠 시대의 저작권 문제를 주제로 탐구보고서를 작성해야 한다.',
      choices: [
        { text: '실제 저작권 분쟁 사례를 조사해 심층 분석한다. [📚 학업 35 이상]', reqStat: { stat: 'academic', min: 35 }, resultText: '생생한 사례 분석으로 우수 보고서로 선정되었습니다! 학업 +20, 진로 +15!', statReward: { academic: 20, career: 15 }, creditBonus: 4 },
        { text: '관련 법령을 정리해 기본적인 보고서를 작성한다. (조건 없음)', resultText: '착실하게 정리한 보고서를 완성했습니다. 자기주도 +10, 3학점.', statReward: { selfDirected: 10 }, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s3_tech',
      title: '정보 과목 수행평가 폭탄',
      year: 3,
      desc: '정보 과목의 대형 프로젝트 마감이 다가오는데 아직 절반도 완성하지 못했다.',
      choices: [
        { text: '우선순위를 정해 핵심 기능부터 완성한다. [⚡ 자기주도 35 이상]', reqStat: { stat: 'selfDirected', min: 35 }, resultText: '효율적인 시간 관리로 프로젝트를 완성했습니다! 자기주도 +20, 학업 +15!', statReward: { selfDirected: 20, academic: 15 }, creditBonus: 4 },
        { text: '밤을 새워서라도 끝까지 완성한다. (조건 없음)', resultText: '힘들었지만 끝까지 해냈습니다. 멘탈 -15 소모, 학업 +10!', statReward: { academic: 10 }, mentalHeal: -15, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s3_bio',
      title: '생명과학 논술형 평가 압박',
      year: 3,
      desc: '생명과학 논술형 수행평가 준비 시간이 부족해 압박감이 크다.',
      choices: [
        { text: '핵심 개념 위주로 답안 구조를 미리 짜서 연습한다. [⚡ 자기주도 35 이상]', reqStat: { stat: 'selfDirected', min: 35 }, resultText: '체계적인 연습으로 논술 실력이 크게 향상되었습니다! 자기주도 +20, 학업 +15!', statReward: { selfDirected: 20, academic: 15 }, creditBonus: 4 },
        { text: '친구들과 스터디를 꾸려 서로 첨삭해준다. (조건 없음)', resultText: '서로의 답안을 보며 부족한 점을 채웠습니다. 공동체 +10, 3학점.', statReward: { community: 10 }, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s3_social',
      title: '사회탐구 발표 준비 압박',
      year: 3,
      desc: '사회문제 탐구 발표가 코앞인데 자료가 아직 정리되지 않았다.',
      choices: [
        { text: '발표 시나리오와 슬라이드를 체계적으로 미리 준비한다. [⚡ 자기주도 35 이상]', reqStat: { stat: 'selfDirected', min: 35 }, resultText: '철저한 준비로 발표가 성공적으로 끝났습니다! 자기주도 +20, 진로 +15!', statReward: { selfDirected: 20, career: 15 }, creditBonus: 4 },
        { text: '팀원들과 역할을 나눠 급히 마무리한다. (조건 없음)', resultText: '협업으로 겨우 시간 내에 마쳤습니다. 공동체 +10, 3학점.', statReward: { community: 10 }, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s3_art',
      title: '졸업 작품 완성 압박',
      year: 3,
      desc: '졸업 작품 전시 마감이 다가오는데 작품이 아직 미완성 상태다.',
      choices: [
        { text: '작업 계획을 다시 세워 남은 시간을 효율적으로 쓴다. [⚡ 자기주도 35 이상]', reqStat: { stat: 'selfDirected', min: 35 }, resultText: '계획적인 작업으로 작품을 완성했습니다! 자기주도 +20, 진로 +15!', statReward: { selfDirected: 20, career: 15 }, creditBonus: 4 },
        { text: '밤을 새워서라도 끝까지 완성한다. (조건 없음)', resultText: '힘들었지만 작품을 완성해냈습니다. 멘탈 -15 소모, 진로 +10!', statReward: { career: 10 }, mentalHeal: -15, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s4_tech',
      title: '개발 프로젝트 포트폴리오 박람회',
      year: 3,
      desc: '3년간 만든 개발 프로젝트들을 포트폴리오 박람회에서 발표하게 되었다.',
      choices: [
        { text: '프로젝트의 문제해결 과정을 스토리로 엮어 발표한다! [🎯 진로 35 이상]', reqStat: { stat: 'career', min: 35 }, resultText: '인상적인 스토리텔링으로 관람객들의 큰 관심을 받았습니다! 진로 +20, 학업 +15!', statReward: { career: 20, academic: 15 }, creditBonus: 4 },
        { text: '기술적 완성도를 중심으로 차분히 설명한다. (조건 없음)', resultText: '꼼꼼한 설명으로 좋은 평가를 받았습니다. 학업 +10, 3학점.', statReward: { academic: 10 }, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s4_bio',
      title: '생명과학 탐구 포트폴리오 박람회',
      year: 3,
      desc: '3년간의 생명과학 탐구 활동을 포트폴리오 박람회에서 발표하게 되었다.',
      choices: [
        { text: '탐구 과정에서의 실패와 극복 과정을 진솔하게 발표한다! [🎯 진로 35 이상]', reqStat: { stat: 'career', min: 35 }, resultText: '진솔한 발표가 큰 감동과 호응을 얻었습니다! 진로 +20, 학업 +15!', statReward: { career: 20, academic: 15 }, creditBonus: 4 },
        { text: '실험 데이터와 결과를 중심으로 차분히 설명한다. (조건 없음)', resultText: '꼼꼼한 설명으로 좋은 평가를 받았습니다. 학업 +10, 3학점.', statReward: { academic: 10 }, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s4_social',
      title: '사회참여 활동 포트폴리오 박람회',
      year: 3,
      desc: '3년간의 사회참여·국제교류 활동을 포트폴리오 박람회에서 발표하게 되었다.',
      choices: [
        { text: '활동을 통해 성장한 자신의 가치관 변화를 진솔하게 발표한다! [🎯 진로 35 이상]', reqStat: { stat: 'career', min: 35 }, resultText: '진솔한 발표가 큰 공감을 얻었습니다! 진로 +20, 공동체 +15!', statReward: { career: 20, community: 15 }, creditBonus: 4 },
        { text: '활동 기록과 성과를 중심으로 차분히 설명한다. (조건 없음)', resultText: '꼼꼼한 설명으로 좋은 평가를 받았습니다. 공동체 +10, 3학점.', statReward: { community: 10 }, creditBonus: 3 }
      ]
    },
    {
      id: 'y3s4_art',
      title: '창작 작품 포트폴리오 박람회',
      year: 3,
      desc: '3년간 만든 창작 작품들을 포트폴리오 박람회에서 전시·발표하게 되었다.',
      choices: [
        { text: '작품에 담긴 개인적 서사와 메시지를 진솔하게 발표한다! [🎯 진로 35 이상]', reqStat: { stat: 'career', min: 35 }, resultText: '진솔한 서사가 관람객들에게 깊은 인상을 남겼습니다! 진로 +20, 학업 +15!', statReward: { career: 20, academic: 15 }, creditBonus: 4 },
        { text: '작품의 제작 과정과 기법을 중심으로 설명한다. (조건 없음)', resultText: '전문적인 설명으로 좋은 평가를 받았습니다. 학업 +10, 3학점.', statReward: { academic: 10 }, creditBonus: 3 }
      ]
    }
  ],

  // 3대 보스 데이터 (Wave 16, 32, 48)
  bosses: [
    {
      wave: 16,
      year: 1,
      name: '1학년 종합 학업평가전 (공통과목 마스터)',
      element: 'all',
      icon: '🏫',
      hp: 750,
      color: '#ef4444',
      attackName: '공통 5대 과목 융합 공세',
      attackDmg: 20,
      flavor: '국어·수학·영어·사회·과학 5대 교과서 큐브가 융합된 거대한 시험 수호 토템. 무지개빛 합격 인장이 온몸을 감싼다.',
      statRewards: { academic: 20, selfDirected: 15 },
      // 2페이즈 보스 기믹: 1페이즈엔 심화 탐구 스킬 봉인(기초 5과목 통합 상태라 아직 심화 탐구 불가) →
      // HP 50% 이하 2페이즈에서 봉인 해제 & 벼락치기 각성으로 공격력 상승
      bossMechanic: {
        phase1Desc: '⚠️ [페이즈 1] 5대 공통과목이 융합된 상태라 심화 탐구가 통하지 않는다! 🔥 심화 탐구 스킬이 봉인된다!',
        skillLockedPhase1: true,
        phase2Threshold: 50,
        phase2Desc: '⚡ [페이즈 2 돌입] 벼락치기 각성! 심화 탐구 스킬 봉인이 풀렸지만, 보스의 공격력이 크게 상승했다!',
        enemyDmgMultPhase2: 1.35
      },
      quizzes: [
        {
          q: '고교학점제에서 3년간 졸업을 위해 반드시 채워야 하는 총 이수 학점 수는?',
          options: ['192학점 (교과 174 + 창체 18)', '204학점', '150학점', '300학점'],
          ans: 0,
          exp: '2022 개정 교육과정 고교학점제 기준 총 192학점(교과 174 + 창체 18)이 졸업 기준입니다.'
        },
        {
          q: '고교학점제에서 1학점을 이수했다고 인정받기 위한 수업량의 기준은?',
          options: ['50분 기준 16회(총 17회) 수업', '1시간 자유 학습', '시험 1회 응시', '출석 1일'],
          ans: 0,
          exp: '1학점은 50분 수업을 16회(총 17회) 이수하는 것을 원칙으로 합니다.'
        },
        {
          q: '고교학점제에서 최소 학업성취수준에 도달하지 못한 과목에 부여되는 미이수 등급은?',
          options: ['I등급(Incomplete)', 'A등급', 'P등급(Pass)', 'S등급'],
          ans: 0,
          exp: 'I등급은 성취기준에 도달하지 못해 학점을 인정받지 못하는 상태입니다.'
        }
      ]
    },
    {
      wave: 32,
      year: 2,
      name: '2학년 학업설계 심사위원단 (선택과목 마스터)',
      element: 'all',
      icon: '🧑‍🏫',
      hp: 950,
      color: '#8b5cf6',
      attackName: '위계성 검증 & I등급 압박',
      attackDmg: 25,
      flavor: '3개의 기계 가면을 띄운 삼위일체 심사 메크. 학점 매트릭스 태블릿에 위계성 위반이 없는지 새긴다.',
      statRewards: { career: 25, selfDirected: 20 },
      // 2페이즈 보스 기믹: HP 50% 이하 2페이즈에서 "위계성 재검증 압박" — 오답노트 방어의 회복 효과 무효화 + 공격력 상승
      bossMechanic: {
        phase1Desc: '⚠️ [페이즈 1] 선택과목의 위계성을 하나씩 검증하기 시작한다.',
        phase2Threshold: 50,
        phase2Desc: '⚡ [페이즈 2 돌입] 위계성 재검증 압박! 이제부터 오답노트 방어의 회복 효과가 무효화되고, 공격력이 상승한다!',
        guardHealNullifyPhase2: true,
        enemyDmgMultPhase2: 1.20
      },
      quizzes: [
        {
          q: '2022 개정 수학 교과에서 위계성(선수과목)을 올바르게 지킨 경로는?',
          options: ['공통수학1 → 대수 → 미적분Ⅱ', '미적분Ⅱ → 공통수학1 → 대수', '기하 → 공통수학1', '미적분Ⅰ → 공통수학1'],
          ans: 0,
          exp: '기초가 되는 공통수학과 대수를 먼저 이수해야 심화인 미적분Ⅱ를 올바르게 수강할 수 있습니다.'
        },
        {
          q: '고교학점제에서 학생이 스스로 진로에 맞는 과목을 선택하고 이수 계획을 세우는 것을 무엇이라 하는가?',
          options: ['개인별 학업설계', '담임의 강제 배정', '전과목 필수 지정', '무작위 추첨 배정'],
          ans: 0,
          exp: '개인별 학업설계는 학생이 진로에 맞춰 과목을 주도적으로 설계하는 것입니다.'
        },
        {
          q: '최소성취수준에 도달하지 못한 학생에게 제공되는 보충 지도 제도는?',
          options: ['최소성취수준 보장지도', '전과목 재수강 의무', '자동 유급 처리', '즉시 졸업 취소'],
          ans: 0,
          exp: '보장지도는 기초 학력 미달 학생을 지원하기 위한 제도입니다.'
        }
      ]
    },
    {
      wave: 48,
      year: 3,
      name: '최종 졸업 사정회 & 고교학점제 그랜드 마스터',
      element: 'all',
      icon: '🎓',
      hp: 1200,
      color: '#ec4899',
      attackName: '192학점 총괄 종합 검증',
      attackDmg: 30,
      flavor: '황금 학사모 왕관을 쓴 졸업의 그랜드 마스터. 192개의 학점 보석과 졸업장 날개가 빛을 뿜는다.',
      statRewards: { academic: 30, career: 30, selfDirected: 30, community: 30 },
      // 2페이즈 보스 기믹: HP 50% 이하 2페이즈에서 3년간 쌓은 실력이 발현 — 플레이어 크리티컬 확률 대폭 상승(긍정적 반전)
      bossMechanic: {
        phase1Desc: '⚠️ [페이즈 1] 3년간의 모든 기록을 총괄 검증하기 시작한다.',
        phase2Threshold: 50,
        phase2Desc: '🌟 [페이즈 2 돌입] 그동안 쌓아온 모든 실력이 마침내 발현된다! 크리티컬 확률이 크게 상승한다!',
        playerCritBonusPhase2: 20
      },
      quizzes: [
        {
          q: '고등학교 3년 동안 자기주도적으로 설계한 교육과정 이수 기록이 주는 가장 큰 가치는?',
          options: ['나만의 고유한 꿈과 역량을 증명하는 맞춤형 포트폴리오', '남들과 똑같은 판박이 생활기록부', '단순 암기 시험 점수표', '아무런 의미가 없다'],
          ans: 0,
          exp: '학생이 주도적으로 선택하고 성취한 과목들의 궤적은 미래 대학과 사회에서 가장 높이 평가받는 나만의 무기입니다.'
        },
        {
          q: '고교학점제 졸업 요건 중 교과 174학점 외에 창의적 체험활동으로 채워야 하는 학점은?',
          options: ['18학점', '30학점', '0학점', '50학점'],
          ans: 0,
          exp: '창의적 체험활동 18학점과 교과 174학점을 합쳐 총 192학점이 졸업 기준입니다.'
        },
        {
          q: '대학입시에서 고교학점제 이수 기록이 특히 중요하게 평가받는 이유는?',
          options: ['진로와 연계된 자기주도적 선택과 성장 과정을 보여주기 때문', '모든 학생이 똑같은 과목을 들었기 때문', '시험 점수만 반영되기 때문', '창체 활동은 평가에서 무시되기 때문'],
          ans: 0,
          exp: '자기주도적으로 설계한 이수 기록은 학생 고유의 성장 서사를 보여줍니다.'
        }
      ]
    }
  ],

  // 보상 카드 풀 (3택 1)
  // 보상 카드 풀 — 희귀도(rarity)에 따라 등장 확률이 다름 (common > rare > epic)
  rewardCards: [
    // ===== 커먼 (일반) =====
    {
      id: 'study_planner',
      name: '플래너 마스터 뱃지',
      type: 'item',
      rarity: 'common',
      icon: '📅',
      desc: '매일 시간표를 체계적으로 관리! ⚡ 자기주도 +15 & 최대 멘탈 +25',
      effect: { type: 'stat', stat: 'selfDirected', value: 15, maxMental: 25 }
    },
    {
      id: 'mentor_advice',
      name: '진로 부장님의 특별 조언',
      type: 'item',
      rarity: 'common',
      icon: '💡',
      desc: '진로 방향성을 명확히 확립! 🎯 진로역량 +15 & 멘토링 찬스 2회 충전',
      effect: { type: 'stat', stat: 'career', value: 15, hintCharge: 2 }
    },
    {
      id: 'club_activity',
      name: '전공 심화 자율동아리 개설',
      type: 'creative',
      rarity: 'common',
      icon: '🏆',
      desc: '친구들과 협력하여 전공 탐구! 🤝 공동체역량 +15 & 창체 4학점 획득',
      effect: { type: 'stat', stat: 'community', value: 15, creativeCredit: 4 }
    },
    {
      id: 'ai_mentor',
      name: 'AI 맞춤형 오답노트',
      type: 'item',
      rarity: 'common',
      icon: '💻',
      desc: '약점 개념을 완벽 분석! 📚 학업역량 +15 & 퀴즈 데미지 상승',
      effect: { type: 'stat', stat: 'academic', value: 15 }
    },
    {
      id: 'energy_drink',
      name: '비타민 충전 세트',
      type: 'item',
      rarity: 'common',
      icon: '🥤',
      desc: '피로를 즉시 회복! 멘탈(HP) 100% 완전 회복 & ⚡ 자기주도 +10',
      effect: { type: 'healFull', stat: 'selfDirected', value: 10 }
    },
    {
      id: 'reading_camp',
      name: '융합 독서 프로젝트',
      type: 'creative',
      rarity: 'common',
      icon: '📚',
      desc: '인문·자연을 넘나드는 통섭 독서! 📚 학업 +10, 🤝 공동체 +10 & 창체 3학점',
      effect: { type: 'multiStat', stats: { academic: 10, community: 10 }, creativeCredit: 3 }
    },

    // ===== 레어 =====
    {
      id: 'skill_cooldown_reset',
      name: '심화 탐구 즉시 재충전권',
      type: 'item',
      rarity: 'rare',
      icon: '🔄',
      desc: '🔥 심화 탐구 스킬의 쿨타임을 즉시 초기화합니다!',
      effect: { type: 'resetSkillCooldown' }
    },
    {
      id: 'senior_special_tutoring',
      name: '선배의 특별 과외',
      type: 'item',
      rarity: 'rare',
      icon: '🎓',
      desc: '멘토링 찬스 +3회 충전 & 📚 학업역량 +10!',
      effect: { type: 'stat', stat: 'academic', value: 10, hintCharge: 3 }
    },
    {
      id: 'hall_of_fame_trophy',
      name: '명예의 전당 트로피',
      type: 'creative',
      rarity: 'rare',
      icon: '🏅',
      desc: '대회 수상 경력 인정! 🎯 진로 +12, 🤝 공동체 +12 & 창체 3학점!',
      effect: { type: 'multiStat', stats: { career: 12, community: 12 }, creativeCredit: 3 }
    },
    {
      id: 'immersion_potion',
      name: '학습 몰입 물약',
      type: 'item',
      rarity: 'rare',
      icon: '🧪',
      desc: '최대 멘탈 +30 & 즉시 완전 회복!',
      effect: { type: 'healFull', maxMental: 30 }
    },

    // ===== 에픽 =====
    {
      id: 'exam_cheat_sheet',
      name: '족집게 예상문제집',
      type: 'item',
      rarity: 'epic',
      icon: '🔮',
      desc: '다음 퀴즈는 무엇을 고르든 무조건 정답 처리됩니다! (1회 한정)',
      effect: { type: 'autoCorrect', uses: 1 }
    },
    {
      id: 'mistake_insurance',
      name: '완벽한 오답 노트',
      type: 'item',
      rarity: 'epic',
      icon: '🛡️',
      desc: '다음에 퀴즈를 틀려도 몬스터의 반격을 완전히 무효화합니다! (1회 한정)',
      effect: { type: 'failInsurance', uses: 1 }
    },
    {
      id: 'genius_insight',
      name: '천재의 통찰',
      type: 'creative',
      rarity: 'epic',
      icon: '🌟',
      desc: '4대 핵심 역량이 모두 +10씩 상승합니다!',
      effect: { type: 'multiStat', stats: { academic: 10, career: 10, selfDirected: 10, community: 10 } }
    },
    {
      id: 'graduate_legacy',
      name: '졸업생 선배의 유산',
      type: 'creative',
      rarity: 'epic',
      icon: '👑',
      desc: '최대 멘탈 +40, 즉시 완전 회복 & 멘토링 찬스 +2회 충전!',
      effect: { type: 'healFull', maxMental: 40, hintCharge: 2 }
    }
  ],

  // 멀티엔딩 정의
  endings: [
    {
      id: 'tech_master',
      title: '🚀 미래를 코딩하는 AI·첨단기술 혁신가',
      track: 'tech',
      minCredits: 170,
      badge: '🏆 최우수 AI·SW 공학상',
      summary: '대수·미적분·정보·인공지능 기초 과목을 마스터하고, 기술로 세상을 바꿀 역량을 구축했습니다.',
      nextStep: '인공지능 연구원, 컴퓨터 소프트웨어 엔지니어, 빅데이터 전문가로 비상할 준비 완료!'
    },
    {
      id: 'bio_master',
      title: '🧬 인류의 미래를 치유하는 바이오 메디컬 연구자',
      track: 'bio',
      minCredits: 170,
      badge: '🏆 최우수 생명과학 탐구상',
      summary: '통합과학부터 화학, 생명과학, 생물의 유전까지 과학적 통찰력으로 생명의 신비를 밝혔습니다.',
      nextStep: '의사/약사, 바이오 신약 개발 연구원, 뇌과학 전문가로의 튼튼한 발판 마련!'
    },
    {
      id: 'social_master',
      title: '🌍 더 나은 사회를 설계하는 글로벌 정책 리더',
      track: 'social',
      minCredits: 170,
      badge: '🏆 최우수 사회혁신 리더십상',
      summary: '세계시민과 지리, 정치·법과 사회, 국제 관계의 이해를 통해 공존과 번영의 정책을 고민했습니다.',
      nextStep: '국제기구 전문가, 경제 정책 전략가, 사회 혁신가로 세상을 이끌 준비 완료!'
    },
    {
      id: 'art_master',
      title: '🎨 시대를 선도하는 창의 융합 크리에이터',
      track: 'art',
      minCredits: 170,
      badge: '🏆 최우수 창의 융합 예술상',
      summary: '매체 의사소통, 음악과 미디어를 융합하여 사람들의 마음을 움직이는 콘텐츠를 창조했습니다.',
      nextStep: '콘텐츠 디렉터, 미디어 크리에이터, 융합 디자이너로서 글로벌 무대 활약 기대!'
    },
    {
      id: 'all_rounder',
      title: '🌟 다재다능 올라운더 융합 인재',
      track: 'any',
      minCredits: 180,
      badge: '🏆 고교학점제 골든 앰배서더상',
      summary: '문·이과 경계를 자유롭게 넘나들며 인문, 과학, AI, 예술을 모두 섭렵한 21세기형 르네상스 인재!',
      nextStep: '다양한 분야를 연결하는 통섭형 기획자이자 융합 리더로 성장할 것입니다.'
    },
    {
      id: 'comeback_hero',
      title: '🌱 위기를 기회로 바꾼 성장 드라마의 주인공',
      track: 'any',
      minCredits: 150,
      badge: '🏆 불굴의 도전과 성장상',
      summary: '학업의 어려움과 I등급의 위기를 겪었지만, 보충지도와 끊임없는 노력으로 당당히 졸업 기준을 완주했습니다!',
      nextStep: '실패를 딛고 일어선 강력한 회복탄력성으로 어떤 난관도 극복할 수 있습니다.'
    }
  ]
};

if (typeof window !== 'undefined') {
  window.GAME_DATA = GAME_DATA;
}
