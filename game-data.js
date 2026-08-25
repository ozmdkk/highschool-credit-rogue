// 2022 개정 교육과정 고교학점제 공시 과목 편제표 기반 데이터
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

  // 48 Wave 스케줄러 (2022 개정 정식 교과목 배정)
  waveSchedule: [
    // === 1학년 (Wave 1 ~ 16) : 공통과목 중심 ===
    { wave: 1, type: 'battle', subjectId: 'korean_common1' },
    { wave: 2, type: 'battle', subjectId: 'math_common1' },
    { wave: 3, type: 'event', eventId: 'y1_club_interview' },
    { wave: 4, type: 'battle', subjectId: 'english_common1' },
    { wave: 5, type: 'battle', subjectId: 'soc_common1' },
    { wave: 6, type: 'event', eventId: 'y1_assignment_hell' },
    { wave: 7, type: 'battle', subjectId: 'sci_common1' },
    { wave: 8, type: 'battle', subjectId: 'korean_history1' },
    { wave: 9, type: 'event', eventId: 'y1_midterm_stress' },
    { wave: 10, type: 'battle', subjectId: 'tech_home' },
    { wave: 11, type: 'battle', subjectId: 'music_art' },
    { wave: 12, type: 'event', eventId: 'y1_peer_dilemma' },
    { wave: 13, type: 'battle', subjectId: 'sci_exp1' },
    { wave: 14, type: 'battle', subjectId: 'pe1' },
    { wave: 15, type: 'event', eventId: 'y1_course_survey' },
    { wave: 16, type: 'boss', bossIndex: 0 }, // 👑 1학년 학업평가전 보스

    // === 2학년 (Wave 17 ~ 32) : 일반선택 중심 ===
    { wave: 17, type: 'battle', subjectId: 'algebra' }, // 대수 (구 수학Ⅰ)
    { wave: 18, type: 'battle', subjectId: 'physics' }, // 물리학
    { wave: 19, type: 'event', eventId: 'y2_course_registration' },
    { wave: 20, type: 'battle', subjectId: 'chemistry' }, // 화학
    { wave: 21, type: 'battle', subjectId: 'biology' }, // 생명과학
    { wave: 22, type: 'event', eventId: 'y2_min_achievement_crisis' },
    { wave: 23, type: 'battle', subjectId: 'global_geo' }, // 세계시민과 지리
    { wave: 24, type: 'battle', subjectId: 'world_history' }, // 세계사
    { wave: 25, type: 'event', eventId: 'y2_mock_exam_slump' },
    { wave: 26, type: 'battle', subjectId: 'info' }, // 정보
    { wave: 27, type: 'battle', subjectId: 'soc_culture' }, // 사회와 문화
    { wave: 28, type: 'event', eventId: 'y2_small_class_crisis' },
    { wave: 29, type: 'battle', subjectId: 'calculus1' }, // 미적분Ⅰ (구 수학Ⅱ)
    { wave: 30, type: 'battle', subjectId: 'earth_sci' }, // 지구과학
    { wave: 31, type: 'event', eventId: 'y2_festival_prep' },
    { wave: 32, type: 'boss', bossIndex: 1 }, // 👑 2학년 학업설계 심사 보스

    // === 3학년 (Wave 33 ~ 48) : 진로선택 & 융합선택 중심 ===
    { wave: 33, type: 'battle', subjectId: 'ai_basic' }, // 인공지능 기초 (진로)
    { wave: 34, type: 'battle', subjectId: 'calculus2' }, // 미적분Ⅱ (진로)
    { wave: 35, type: 'event', eventId: 'y3_joint_curriculum' },
    { wave: 36, type: 'battle', subjectId: 'quantum_em' }, // 전자기와 양자 (진로)
    { wave: 37, type: 'battle', subjectId: 'politics_law_soc' }, // 정치·법과 사회 (진로)
    { wave: 38, type: 'event', eventId: 'y3_mock_interview' },
    { wave: 39, type: 'battle', subjectId: 'media_comm' }, // 매체 의사소통 (융합)
    { wave: 40, type: 'battle', subjectId: 'robotics_eng' }, // 로봇과 공학세계 (진로)
    { wave: 41, type: 'event', eventId: 'y3_research_report' },
    { wave: 42, type: 'battle', subjectId: 'intl_relations' }, // 국제 관계의 이해 (진로)
    { wave: 43, type: 'battle', subjectId: 'gene_heredity' }, // 생물의 유전 (진로)
    { wave: 44, type: 'event', eventId: 'y3_exam_pressure' },
    { wave: 45, type: 'battle', subjectId: 'music_media' }, // 음악과 미디어 (융합)
    { wave: 46, type: 'battle', subjectId: 'social_problem' }, // 사회문제 탐구 (융합)
    { wave: 47, type: 'event', eventId: 'y3_portfolio_expo' },
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
      quizzes: [
        {
          q: '2022 개정 교육과정 공통국어에서 강조하는 비판적 사고의 핵심은?',
          options: ['주장과 근거의 타당성을 평가하며 읽기', '교과서 본문 기계적 암기', '맞춤법 규정만 외우기', '친구 의견 무조건 비난'],
          ans: 0,
          exp: '글의 논리적 구조와 타당성을 주체적으로 검증하는 태도가 핵심입니다.'
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
      quizzes: [
        {
          q: '2022 개정 공통수학1에 디지털·AI 소양 강화를 위해 다시 도입된 수학 단원은?',
          options: ['행렬(Matrix)', '구면삼각법', '텐서(Tensor)', '미분방정식'],
          ans: 0,
          exp: '공통수학1에는 인공지능과 데이터 처리의 기초가 되는 행렬이 부활 도입되었습니다.'
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
      quizzes: [
        {
          q: '글로벌 진로 소통에서 정중하게 다른 관점을 제시하는 적절한 표현은?',
          options: ['"I see your point, but consider this perspective..."', '"You are totally wrong."', '"I don\'t care."', '"Stop talking."'],
          ans: 0,
          exp: '상대방의 의견을 존중하며 완곡하게 대안을 제시하는 것이 성숙한 소통입니다.'
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
      quizzes: [
        {
          q: '통합사회에서 현대 사회의 다양한 문제를 분석하는 4대 관점에 포함되지 않는 것은?',
          options: ['사주명리학적 관점', '시간적 관점', '공간적 관점', '윤리적 관점'],
          ans: 0,
          exp: '통합사회 4대 관점은 시간적, 공간적, 사회적, 윤리적 관점입니다.'
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
      quizzes: [
        {
          q: '우주 초기에 수소와 헬륨이 생성되고 물질 시스템이 형성되었다는 이론은?',
          options: ['빅뱅 우주론', '지동설', '천동설', '판구조론'],
          ans: 0,
          exp: '빅뱅 우주론에 따라 우주 초기 수소와 헬륨이 생성되었습니다.'
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
      quizzes: [
        {
          q: '1919년 3·1 운동의 결실로 수립되어 민주공화제의 기틀을 마련한 정부는?',
          options: ['대한민국 임시정부', '조선총독부', '통신기획단', '의정부'],
          ans: 0,
          exp: '3·1 운동을 계기로 상하이에 대한민국 임시정부가 수립되었습니다.'
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
      quizzes: [
        {
          q: '자신의 미래 진로와 재무 목표를 체계적으로 계획하고 실천하는 것은?',
          options: ['생애 재무 및 생애주기 설계', '충동 소비', '복권 무한 구매', '무계획 지출'],
          ans: 0,
          exp: '생애주기별 목표와 위험 관리를 계획하는 것이 생애 설계입니다.'
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
      quizzes: [
        {
          q: '2022 개정 교육과정 예술 교과가 강조하는 핵심 소양은?',
          options: ['심미적 감성과 창의적 표현력', '단순 테크닉 암기', '화가 이름 외우기', '그림 복제 기술'],
          ans: 0,
          exp: '예술을 통한 공감과 창의적 감수성 함양이 핵심입니다.'
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
      quizzes: [
        {
          q: '실험에서 결과를 관찰하고자 의도적으로 변화시키는 요인은?',
          options: ['조작 변인(Independent Variable)', '통제 변인', '종속 변인', '외부 노이즈'],
          ans: 0,
          exp: '실험자가 조작하는 원인이 되는 변인을 조작 변인이라 합니다.'
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
      quizzes: [
        {
          q: '고등학교 3년의 장기적인 학업과 진로 탐구를 지탱하는 가장 기초적인 바탕은?',
          options: ['규칙적인 운동과 체력·건강 관리', '하루 2시간 자고 공부하기', '에너지 음료 매일 마시기', '끼니 거르기'],
          ans: 0,
          exp: '지속 가능한 학업을 위해서는 신체적·정신적 건강 관리가 최우선입니다.'
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
      quizzes: [
        {
          q: '2022 개정 교육과정에서 지수·로그함수와 삼각함수, 수열을 다루는 일반선택 과목명은?',
          options: ['대수(Algebra)', '기하', '확률과 통계', '실용 수학'],
          ans: 0,
          exp: '2022 개정 교육과정에서는 2015의 수학Ⅰ이 ‘대수’로 개편되었습니다.'
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
      quizzes: [
        {
          q: '뉴턴의 운동 제2법칙(가속도의 법칙)을 나타내는 공식은?',
          options: ['F = ma', 'E = mc²', 'V = IR', 'P = IV'],
          ans: 0,
          exp: '힘(F)은 질량(m)과 가속도(a)의 곱과 같습니다.'
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
      quizzes: [
        {
          q: '물질을 구성하는 가장 작은 단위 입자로 양성자, 중성자, 전자로 이루어진 것은?',
          options: ['원자(Atom)', '분자', '이온', '화합물'],
          ans: 0,
          exp: '물질의 기본 입자는 원자입니다.'
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
      quizzes: [
        {
          q: '세포 내에서 생명체의 유전 정보를 저장하고 있는 고분자 핵산은?',
          options: ['DNA', 'ATP', '포도당', '헤모글로빈'],
          ans: 0,
          exp: '유전 정보는 DNA(디옥시리보핵산)에 저장됩니다.'
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
      quizzes: [
        {
          q: '지구 표면이 여러 개의 판으로 이루어져 서서히 이동한다는 이론은?',
          options: ['판구조론(Plate Tectonics)', '천동설', '상대성 이론', '열역학 제1법칙'],
          ans: 0,
          exp: '지각 변동과 대륙 이동을 설명하는 핵심 이론은 판구조론입니다.'
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
      quizzes: [
        {
          q: '2022 개정 교육과정에서 함수의 극한과 다항함수의 미적분을 다루는 일반선택 과목명은?',
          options: ['미적분Ⅰ (구 수학Ⅱ)', '기하', '대수', '확률과 통계'],
          ans: 0,
          exp: '2022 개정 교육과정에서는 2015의 수학Ⅱ가 ‘미적분Ⅰ’로 명칭 변경되었습니다.'
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
      quizzes: [
        {
          q: '프로그래밍에서 문제를 해결하기 위한 명확한 절차나 명령어의 집합은?',
          options: ['알고리즘(Algorithm)', '인터페이스', '컴파일러', '데이터베이스'],
          ans: 0,
          exp: '문제 해결 절차와 규칙을 알고리즘이라고 합니다.'
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
      quizzes: [
        {
          q: '물질문화의 변동 속도를 비물질문화(제도, 의식)가 따라가지 못해 발생하는 부조화는?',
          options: ['문화 지체 (Cultural Lag)', '문화 융합', '문화 사대주의', '문화 상대주의'],
          ans: 0,
          exp: '기술 발전 속도에 제도가 미처 따르지 못하는 현상을 문화 지체라 합니다.'
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
      quizzes: [
        {
          q: '18세기 후반 증기기관 발명과 기계화로 사회 경제 구조를 바꾼 대변혁은?',
          options: ['산업혁명', '프랑스대혁명', '르네상스', '종교개혁'],
          ans: 0,
          exp: '산업혁명은 기계의 발명으로 생산력의 혁신을 이끈 사건입니다.'
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
      quizzes: [
        {
          q: '지구촌의 환경, 자원, 분쟁 문제를 세계시민의 관점에서 탐구하는 2022 개정 지리 과목은?',
          options: ['세계시민과 지리', '한국지리 탐구', '여행지리', '경제지리'],
          ans: 0,
          exp: '2022 개정 교육과정 사회과 일반선택 지리 과목명은 ‘세계시민과 지리’입니다.'
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
      quizzes: [
        {
          q: '인공지능이 대량의 데이터를 스스로 학습하여 특징 패턴을 추출하는 기술은?',
          options: ['머신러닝 & 딥러닝', '단순 수동 코딩', '인터넷 캐싱', '파일 압축'],
          ans: 0,
          exp: '데이터로부터 모델이 패턴을 학습하는 인공지능 분야를 머신러닝이라 부릅니다.'
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
      quizzes: [
        {
          q: '지수함수, 로그함수, 삼각함수 등 초월함수의 미적분을 다루는 2022 개정 진로선택 수학은?',
          options: ['미적분Ⅱ (구 미적분)', '미적분Ⅰ', '기하', '대수'],
          ans: 0,
          exp: '2022 개정 교육과정에서는 이공계 심화 초월함수 미적분을 ‘미적분Ⅱ’(진로선택)에서 다룹니다.'
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
      quizzes: [
        {
          q: '로봇이 주변 환경 정보를 물리적으로 감지하여 전기 신호로 변환하는 장치는?',
          options: ['센서(Sensor)', '배터리', '외관 커버', '바퀴'],
          ans: 0,
          exp: '센서는 빛, 거리, 온도 등을 측정하여 로봇 제어기에 전달합니다.'
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
      quizzes: [
        {
          q: '미시 세계에서 입자가 파동의 성질을 동시에 가지며 상태가 중첩되어 존재한다는 물리학 분야는?',
          options: ['양자역학(Quantum Mechanics)', '고전역학', '지구역학', '화학평형'],
          ans: 0,
          exp: '2022 개정 과학 진로선택 ‘전자기와 양자’에서 양자물리학의 기본 원리를 탐구합니다.'
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
      quizzes: [
        {
          q: '특정 DNA 염기서열을 정밀하게 교정하는 첨단 생명공학 기술은?',
          options: ['크리스퍼 유전자 가위 (CRISPR-Cas9)', '단순 현미경 관찰', '세포 염색법', '단백질 침전법'],
          ans: 0,
          exp: '2022 개정 진로선택 ‘생물의 유전’에서 분자유전학과 유전자 가위 기술을 심층 탐구합니다.'
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
      quizzes: [
        {
          q: '국민의 기본권을 보장하고 국가 권력의 남용을 방지하기 위한 국가 최고 규범은?',
          options: ['헌법(Constitution)', '지방조례', '사규', '학급 규칙'],
          ans: 0,
          exp: '헌법은 국가의 최고 기본법입니다.'
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
      quizzes: [
        {
          q: '전 세계의 평화 유지와 인도적 문제 해결을 위해 설립된 대표적인 국제기구는?',
          options: ['국제연합 (UN)', '국제올림픽위원회 (IOC)', '글로벌 팬클럽', '세계은행 단독'],
          ans: 0,
          exp: 'UN(국제연합)은 국제 평화와 안보를 주 목적으로 하는 글로벌 기구입니다.'
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
      quizzes: [
        {
          q: '사회문제를 객관적으로 조사하고 해결책을 제시할 때 가장 신뢰할 만한 탐구 방법은?',
          options: ['통계 데이터 분석 및 현장 설문·인터뷰 교차 검증', '인터넷 커뮤니티 댓글 인용', '개인적인 직감만으로 결론', '가짜 뉴스 인용'],
          ans: 0,
          exp: '체계적인 연구 방법론과 신뢰할 수 있는 데이터 수집이 사회문제 탐구의 핵심입니다.'
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
      quizzes: [
        {
          q: '디지털 미디어 정보를 무비판적으로 수용하지 않고 주체적으로 비판·분석하는 역량은?',
          options: ['디지털 미디어 리터러시', '단순 카피 페이스트', '어그로 클릭 유도', '스팸 발송'],
          ans: 0,
          exp: '2022 개정 국어과 융합선택 ‘매체 의사소통’은 미디어 리터러시와 윤리적 제작 역량을 기릅니다.'
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
      quizzes: [
        {
          q: '영상, 게임, 인터랙티브 콘텐츠에 어우러져 감정과 몰입감을 극대화하는 음악 분야는?',
          options: ['미디어 사운드트랙 & 효과음 디자인', '단순 악보 필사', '무음 방송', '소음 발생'],
          ans: 0,
          exp: '2022 개정 예술 융합선택 ‘음악과 미디어’는 디지털 미디어 속 음악의 창작과 융합을 다룹니다.'
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
      statRewards: { academic: 20, selfDirected: 15 },
      quizzes: [
        {
          q: '고교학점제에서 3년간 졸업을 위해 반드시 채워야 하는 총 이수 학점 수는?',
          options: ['192학점 (교과 174 + 창체 18)', '204학점', '150학점', '300학점'],
          ans: 0,
          exp: '2022 개정 교육과정 고교학점제 기준 총 192학점(교과 174 + 창체 18)이 졸업 기준입니다.'
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
      statRewards: { career: 25, selfDirected: 20 },
      quizzes: [
        {
          q: '2022 개정 수학 교과에서 위계성(선수과목)을 올바르게 지킨 경로는?',
          options: ['공통수학1 → 대수 → 미적분Ⅱ', '미적분Ⅱ → 공통수학1 → 대수', '기하 → 공통수학1', '미적분Ⅰ → 공통수학1'],
          ans: 0,
          exp: '기초가 되는 공통수학과 대수를 먼저 이수해야 심화인 미적분Ⅱ를 올바르게 수강할 수 있습니다.'
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
      statRewards: { academic: 30, career: 30, selfDirected: 30, community: 30 },
      quizzes: [
        {
          q: '고등학교 3년 동안 자기주도적으로 설계한 교육과정 이수 기록이 주는 가장 큰 가치는?',
          options: ['나만의 고유한 꿈과 역량을 증명하는 맞춤형 포트폴리오', '남들과 똑같은 판박이 생활기록부', '단순 암기 시험 점수표', '아무런 의미가 없다'],
          ans: 0,
          exp: '학생이 주도적으로 선택하고 성취한 과목들의 궤적은 미래 대학과 사회에서 가장 높이 평가받는 나만의 무기입니다.'
        }
      ]
    }
  ],

  // 보상 카드 풀 (3택 1)
  rewardCards: [
    {
      id: 'study_planner',
      name: '플래너 마스터 뱃지',
      type: 'item',
      icon: '📅',
      desc: '매일 시간표를 체계적으로 관리! ⚡ 자기주도 +15 & 최대 멘탈 +25',
      effect: { type: 'stat', stat: 'selfDirected', value: 15, maxMental: 25 }
    },
    {
      id: 'mentor_advice',
      name: '진로 부장님의 특별 조언',
      type: 'item',
      icon: '💡',
      desc: '진로 방향성을 명확히 확립! 🎯 진로역량 +15 & 멘토링 찬스 2회 충전',
      effect: { type: 'stat', stat: 'career', value: 15, hintCharge: 2 }
    },
    {
      id: 'club_activity',
      name: '전공 심화 자율동아리 개설',
      type: 'creative',
      icon: '🏆',
      desc: '친구들과 협력하여 전공 탐구! 🤝 공동체역량 +15 & 창체 4학점 획득',
      effect: { type: 'stat', stat: 'community', value: 15, creativeCredit: 4 }
    },
    {
      id: 'ai_mentor',
      name: 'AI 맞춤형 오답노트',
      type: 'item',
      icon: '💻',
      desc: '약점 개념을 완벽 분석! 📚 학업역량 +15 & 퀴즈 데미지 상승',
      effect: { type: 'stat', stat: 'academic', value: 15 }
    },
    {
      id: 'energy_drink',
      name: '비타민 충전 세트',
      type: 'item',
      icon: '🥤',
      desc: '피로를 즉시 회복! 멘탈(HP) 100% 완전 회복 & ⚡ 자기주도 +10',
      effect: { type: 'healFull', stat: 'selfDirected', value: 10 }
    },
    {
      id: 'reading_camp',
      name: '융합 독서 프로젝트',
      type: 'creative',
      icon: '📚',
      desc: '인문·자연을 넘나드는 통섭 독서! 📚 학업 +10, 🤝 공동체 +10 & 창체 3학점',
      effect: { type: 'multiStat', stats: { academic: 10, community: 10 }, creativeCredit: 3 }
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
