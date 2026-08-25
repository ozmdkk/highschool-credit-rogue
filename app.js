// ==========================================================================
// 고교학점제 로그 (High School Credit PokéRogue) 48 Wave Strategic Engine
// 속성 상성(Type Matchup) & 양방향 가변 데미지 & 진학부장 오리엔테이션 스토리
// ==========================================================================

class CreditRogueGame {
  constructor() {
    this.state = {
      wave: 1,
      maxWaves: 48,
      year: 1,
      semester: 1,
      track: null,
      
      // 오리엔테이션 대화 단계
      introStep: 0,
      
      // 멘탈 = 체력(HP)
      playerHp: 100,
      maxPlayerHp: 100,

      // 4대 핵심 역량 스탯
      stats: {
        academic: 20,    // 📚 학업역량 (퀴즈 데미지 증가)
        career: 20,      // 🎯 진로역량 (크리티컬 확률 & 엔딩)
        selfDirected: 20,// ⚡ 자기주도역량 (턴당 멘탈 회복 & 방어 효율)
        community: 20    // 🤝 공동체역량 (이벤트 특별 선택지 & 멘토링)
      },

      credits: 0,
      targetCredits: 192,
      creativeCredits: 0,
      
      // 배틀 턴 및 스킬 상태
      battleTurn: 1,
      skillCooldown: 0,
      isGuarding: false,
      mentorUses: 2,
      currentQuizType: 'normal',
      
      completedSubjects: [],
      currentEnemy: null,
      currentEnemyHp: 240,
      maxEnemyHp: 240,
      currentQuiz: null,
      isBossWave: false,
      isEnraged: false,
      
      // 최소성취수준 보장지도 (그로기) 상태
      isGroggy: false
    };

    // 진학부장 오기준 선생님 오리엔테이션 대사집
    this.introDialogues = [
      "고등학교 입학을 진심으로 축하한다! 🎉 나는 너의 3년 고교생활과 192학점 설계를 함께할 진학지도부장 '오기준' 선생님이란다.",
      "2022 개정 교육과정의 고교학점제는 학생 스스로 원하는 과목을 선택하고 깊이 있게 탐구하여 192학점을 채워가는 특별한 모험이지!",
      "고등학교의 모든 과목들은 4대 교과 속성(🟦 수리·논리, 🟩 자연·탐구, 🟨 인문·사회, 🟪 창의·융합)을 지니고 서로 상성을 이룬단다.",
      "자! 네가 3년간 가장 열정을 쏟고 싶은 너만의 '희망 진로 트랙(스타팅 속성)'을 아래에서 선택해 보렴! 👇"
    ];

    this.initElements();
    this.initEvents();
    this.switchView('title');
    this.renderTrackSelection();
  }

  // DOM 요소 캐싱
  initElements() {
    this.views = {
      title: document.getElementById('view-title'),
      battle: document.getElementById('view-battle'),
      reward: document.getElementById('view-reward'),
      event: document.getElementById('view-event'),
      ending: document.getElementById('view-ending')
    };

    // 헤더 요소
    this.mainHeader = document.getElementById('main-header');
    this.elWave = document.getElementById('wave-indicator');
    this.elYear = document.getElementById('year-semester-title');
    this.elCreditTracker = document.getElementById('header-credit-tracker');
    this.elCreditText = document.getElementById('credit-count-text');
    this.elCreditBar = document.getElementById('credit-progress-bar');
    this.elSoundBtn = document.getElementById('btn-sound-toggle');

    // 오리엔테이션 요소
    this.mentorBubble = document.getElementById('mentor-speech-bubble');
    this.btnDialogNext = document.getElementById('btn-dialog-next');
    this.trackSelectionWrap = document.getElementById('track-selection-wrapper');

    // 배틀 요소
    this.elEnemyName = document.getElementById('enemy-name');
    this.elEnemyBadge = document.getElementById('enemy-type-badge');
    this.elEnemyElementBadge = document.getElementById('enemy-element-badge');
    this.elEnemyHpBar = document.getElementById('enemy-hp-bar');
    this.elEnemyHpText = document.getElementById('enemy-hp-text');
    this.elEnemySprite = document.getElementById('enemy-sprite');
    this.elEnemyBox = document.getElementById('enemy-status-box');

    this.elPlayerName = document.getElementById('player-name');
    this.elPlayerBadge = document.getElementById('player-track-badge');
    this.elPlayerTrackBadge = document.getElementById('player-track-badge');
    this.elPlayerElementBadge = document.getElementById('player-element-badge');
    this.elPlayerHpBar = document.getElementById('player-hp-bar');
    this.elPlayerHpText = document.getElementById('player-hp-text');
    this.elPlayerSprite = document.getElementById('player-sprite');
    this.elPlayerBox = document.getElementById('player-status-box');
    this.elPlayerAvatarContainer = document.getElementById('player-avatar-container');

    // 머리 위 플로팅 4대 스탯
    this.elStatAcademic = document.getElementById('stat-val-academic');
    this.elStatCareer = document.getElementById('stat-val-career');
    this.elStatSelf = document.getElementById('stat-val-self');
    this.elStatComm = document.getElementById('stat-val-comm');

    // 스탯 툴팁
    this.tipAcademic = document.getElementById('tip-academic');
    this.tipCareer = document.getElementById('tip-career');
    this.tipSelf = document.getElementById('tip-self');
    this.tipComm = document.getElementById('tip-comm');

    this.elDialog = document.getElementById('battle-dialog-text');
    this.elMatchupEval = document.getElementById('info-matchup-eval');
    
    // 4대 배틀 커맨드 버튼
    this.elBtnQuiz = document.getElementById('btn-act-quiz');
    this.elBtnSkill = document.getElementById('btn-act-skill');
    this.elBtnGuard = document.getElementById('btn-act-guard');
    this.elBtnMentor = document.getElementById('btn-act-mentor');
    this.elSkillCdText = document.getElementById('skill-cd-text');
    this.elMentorCountText = document.getElementById('mentor-count-text');

    this.elBtnDeck = document.getElementById('btn-act-deck');
    this.elInfoBattleTurn = document.getElementById('info-battle-turn');

    // 퀴즈 모달
    this.quizOverlay = document.getElementById('quiz-overlay');
    this.quizBadge = document.getElementById('quiz-badge');
    this.quizQuestion = document.getElementById('quiz-question-text');
    this.quizOptionsList = document.getElementById('quiz-options-list');
    this.quizExpBox = document.getElementById('quiz-exp-box');

    // 긴급 경고/알림 모달
    this.noticeOverlay = document.getElementById('notice-overlay');
    this.noticeTitle = document.getElementById('notice-title');
    this.noticeBody = document.getElementById('notice-body');
    this.btnNoticeConfirm = document.getElementById('btn-notice-confirm');

    // 시간표 도감 모달
    this.deckOverlay = document.getElementById('deck-overlay');
    this.btnCloseDeck = document.getElementById('btn-close-deck');
    this.deckStatAcademic = document.getElementById('deck-stat-academic');
    this.deckStatCareer = document.getElementById('deck-stat-career');
    this.deckStatSelf = document.getElementById('deck-stat-self');
    this.deckStatComm = document.getElementById('deck-stat-comm');
    this.deckCommonCredits = document.getElementById('deck-common-credits');
    this.deckElectiveCredits = document.getElementById('deck-elective-credits');
    this.deckCreativeCredits = document.getElementById('deck-creative-credits');
    this.deckTotalCredits = document.getElementById('deck-total-credits');
    this.deckSubjectsGrid = document.getElementById('deck-subjects-grid');

    // 이벤트 뷰
    this.eventTag = document.getElementById('event-tag');
    this.eventTitle = document.getElementById('event-title');
    this.eventDesc = document.getElementById('event-desc');
    this.eventChoicesList = document.getElementById('event-choices-list');
    this.eventResultBox = document.getElementById('event-result-box');
    this.btnEventNext = document.getElementById('btn-event-next');

    // 보상 뷰
    this.rewardContainer = document.getElementById('reward-cards-container');

    // 엔딩 뷰
    this.btnRestart = document.getElementById('btn-restart-game');
    this.btnStart = document.getElementById('btn-start-game');
  }

  // 이벤트 리스너 바인딩
  initEvents() {
    this.elSoundBtn.addEventListener('click', () => {
      const enabled = window.soundEngine.toggle();
      this.elSoundBtn.textContent = enabled ? '🔊' : '🔇';
    });

    // 오리엔테이션 대화 진행 버튼
    this.btnDialogNext.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.advanceIntroDialogue();
    });

    this.btnStart.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.startGame();
    });

    // 1. 개념 퀴즈 공격
    this.elBtnQuiz.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.state.currentQuizType = 'normal';
      this.openQuizModal();
    });

    // 2. 심화 탐구 스킬
    this.elBtnSkill.addEventListener('click', () => {
      if (this.state.skillCooldown > 0) return;
      window.soundEngine.playClick();
      this.state.currentQuizType = 'skill';
      this.openQuizModal();
    });

    // 3. 오답노트 방어 & 멘탈 회복
    this.elBtnGuard.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.executeGuardAction();
    });

    // 4. 친구 멘토링 (50:50 찬스)
    this.elBtnMentor.addEventListener('click', () => {
      this.executeMentorAction();
    });

    this.elBtnDeck.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.openDeckModal();
    });

    this.btnCloseDeck.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.deckOverlay.classList.remove('active');
    });

    this.btnEventNext.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.nextWave();
    });

    this.btnRestart.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.resetGame();
    });

    this.btnNoticeConfirm.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.noticeOverlay.classList.remove('active');
    });
  }

  // 뷰 전환 (철저한 단일 뷰 활성화)
  switchView(viewName) {
    Object.keys(this.views).forEach(key => {
      if (key === viewName) {
        this.views[key].classList.add('active');
      } else {
        this.views[key].classList.remove('active');
      }
    });
  }

  // 오리엔테이션 대화 진행
  advanceIntroDialogue() {
    this.state.introStep++;
    if (this.state.introStep < this.introDialogues.length) {
      this.mentorBubble.textContent = `"${this.introDialogues[this.state.introStep]}"`;
      if (this.state.introStep === this.introDialogues.length - 1) {
        this.btnDialogNext.style.display = 'none';
        this.trackSelectionWrap.style.display = 'flex';
        this.btnStart.style.display = 'block';
      }
    }
  }

  // 1. 스타팅 진로 트랙 렌더링
  renderTrackSelection() {
    const grid = document.getElementById('track-cards-grid');
    grid.innerHTML = '';

    GAME_DATA.tracks.forEach(t => {
      const card = document.createElement('div');
      card.className = 'track-card';
      card.dataset.id = t.id;

      const elemDef = GAME_DATA.elements[t.element];
      const stats = t.initialStats;

      card.innerHTML = `
        <div class="track-card-header">
          <span class="track-icon">${t.icon}</span>
          <div>
            <div class="track-name">${t.name} <span class="element-tag-badge" style="background:${elemDef.color};">${elemDef.icon} ${elemDef.name}</span></div>
            <div class="track-initial-stats">
              <span class="stat-chip" style="color:var(--stat-academic);">📚 학업 ${stats.academic}</span>
              <span class="stat-chip" style="color:var(--stat-career);">🎯 진로 ${stats.career}</span>
              <span class="stat-chip" style="color:var(--stat-self);">⚡ 자기주도 ${stats.selfDirected}</span>
              <span class="stat-chip" style="color:var(--stat-comm);">🤝 공동체 ${stats.community}</span>
            </div>
          </div>
        </div>
        <p class="track-desc">${t.desc}</p>
      `;

      card.addEventListener('click', () => {
        window.soundEngine.playRewardPick();
        document.querySelectorAll('.track-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.state.track = t;
        this.btnStart.disabled = false;
        this.btnStart.textContent = `🎒 [${t.name}] 시간표를 받고 1학년 1학기 등교하기! 🚀`;

        // 진학부장 선생님의 피드백 대사
        const praises = {
          tech: "💻 [AI·소프트웨어 공학] 트랙이구나! 복잡한 자연 현상을 수식과 알고리즘으로 명쾌하게 규명하는 🟦 수리·논리 속성이지!",
          bio: "🧬 [의약·생명과학] 트랙이구나! 막연한 상상을 과학적 실증과 자연 법칙으로 규명하는 🟩 자연·탐구 속성이지!",
          social: "🌍 [인문·사회·글로벌] 트랙이구나! 차가운 기계 알고리즘에 인간 존엄과 법적 가치를 더하는 🟨 인문·사회 속성이지!",
          art: "🎨 [창의·문화·융합예술] 트랙이구나! 딱딱한 제도를 감성적 스토리텔링과 미디어로 혁신하는 🟪 창의·융합 속성이지!"
        };
        this.mentorBubble.textContent = `"${praises[t.id]} 훌륭한 선택이다! 첫 학점을 채우러 1학년 1학기 수업으로 가볼까?"`;
      });

      grid.appendChild(card);
    });
  }

  // 2. 게임 시작 (배틀 화면으로 전환)
  startGame() {
    this.state.wave = 1;
    this.state.credits = 12;
    this.state.creativeCredits = 2;
    this.state.playerHp = 100;
    this.state.maxPlayerHp = 100;
    this.state.completedSubjects = [];
    this.state.mentorUses = 2;
    this.state.skillCooldown = 0;

    if (this.state.track && this.state.track.initialStats) {
      this.state.stats = { ...this.state.track.initialStats };
    }

    // 헤더를 인트로 모드에서 배틀 HUD 모드로 전환
    this.mainHeader.classList.remove('intro-mode');
    this.elWave.style.display = 'inline-block';
    this.elCreditTracker.style.display = 'flex';

    this.updateGlobalHeader();
    this.updatePlayerStatsUI();
    this.startWave(this.state.wave);
  }

  // 3. 머리 위 플로팅 4대 스탯 갱신
  updatePlayerStatsUI() {
    const s = this.state.stats;
    this.elStatAcademic.textContent = s.academic;
    this.elStatCareer.textContent = s.career;
    this.elStatSelf.textContent = s.selfDirected;
    this.elStatComm.textContent = s.community;

    this.tipAcademic.textContent = `퀴즈 데미지 +${s.academic}%`;
    this.tipCareer.textContent = `크리티컬 확률 ${Math.min(85, Math.round(s.career * 1.5))}%`;
    this.tipSelf.textContent = `방어 시 회복 +${Math.round(s.selfDirected / 3)}`;
    this.tipComm.textContent = `이벤트 고보상 해금 & 멘토링 찬스`;
  }

  // 머리 위 스탯 증가 팝업
  showFloatingStatDelta(statKey, delta) {
    if (delta <= 0) return;
    const def = GAME_DATA.statDefinitions[statKey];
    if (!def) return;

    const popup = document.createElement('div');
    popup.className = 'stat-delta-popup';
    popup.style.color = def.color;
    popup.textContent = `+${delta} ${def.icon} ${def.name}!`;

    this.elPlayerAvatarContainer.appendChild(popup);
    setTimeout(() => popup.remove(), 1400);
  }

  // 가변 데미지 플로팅 팝업
  showFloatingDamage(targetElem, damage, isCrit = false, isPlayerHit = false) {
    const popup = document.createElement('div');
    popup.className = `floating-damage-text ${isCrit ? 'crit' : ''}`;
    popup.style.color = isPlayerHit ? '#f87171' : (isCrit ? '#fbbf24' : '#60a5fa');
    popup.textContent = `${isCrit ? '💥 CRITICAL! -' : '-'}${damage}`;

    targetElem.appendChild(popup);
    setTimeout(() => popup.remove(), 1200);
  }

  addStat(statKey, amount) {
    if (!this.state.stats[statKey]) this.state.stats[statKey] = 0;
    this.state.stats[statKey] += amount;
    this.showFloatingStatDelta(statKey, amount);
    this.updatePlayerStatsUI();
  }

  // 4. 상성 계산 엔진
  getMatchupEffectiveness() {
    const playerElemKey = this.state.track ? this.state.track.element : 'logic';
    const enemyElemKey = this.state.currentEnemy ? this.state.currentEnemy.element : 'all';

    if (enemyElemKey === 'all' || !GAME_DATA.elements[playerElemKey] || !GAME_DATA.elements[enemyElemKey]) {
      return { type: 'neutral', playerMult: 1.0, enemyMult: 1.0, label: '보통 (1.0x)', color: '#94a3b8' };
    }

    const playerDef = GAME_DATA.elements[playerElemKey];
    if (playerDef.strongAgainst === enemyElemKey) {
      return { 
        type: 'super_effective', 
        playerMult: 1.5, 
        enemyMult: 0.75, 
        label: '🔥 우세 상성 (+50% / 적 공격 -25%)', 
        color: '#22c55e' 
      };
    } else if (playerDef.weakAgainst === enemyElemKey) {
      return { 
        type: 'not_effective', 
        playerMult: 0.75, 
        enemyMult: 1.3, 
        label: '⚠️ 열세 상성 (-25% / 적 공격 +30%)', 
        color: '#ef4444' 
      };
    } else {
      return { type: 'neutral', playerMult: 1.0, enemyMult: 1.0, label: '동등 속성 (1.0x)', color: '#cbd5e1' };
    }
  }

  // 5. 글로벌 헤더 갱신
  updateGlobalHeader() {
    const w = this.state.wave;
    if (w <= 16) {
      this.state.year = 1;
      this.state.semester = w <= 8 ? 1 : 2;
    } else if (w <= 32) {
      this.state.year = 2;
      this.state.semester = w <= 24 ? 1 : 2;
    } else {
      this.state.year = 3;
      this.state.semester = w <= 40 ? 1 : 2;
    }

    this.elWave.textContent = `Wave ${w} / ${this.state.maxWaves}`;
    this.elYear.textContent = `${this.state.year}학년 ${this.state.semester}학기`;
    this.elCreditText.textContent = `${this.state.credits} / ${this.state.targetCredits}`;

    const pct = Math.min(100, Math.round((this.state.credits / this.state.targetCredits) * 100));
    this.elCreditBar.style.width = `${pct}%`;

    this.elWave.classList.toggle('boss-wave', [16, 32, 48].includes(w));
    this.elMentorCountText.textContent = this.state.mentorUses;

    if (this.state.track) {
      this.elPlayerBadge.textContent = this.state.track.name.split(' ')[0];
      this.elPlayerBadge.style.background = this.state.track.color;

      const pElem = GAME_DATA.elements[this.state.track.element];
      if (pElem) {
        this.elPlayerElementBadge.textContent = `${pElem.icon} ${pElem.name}`;
        this.elPlayerElementBadge.style.background = pElem.color;
      }
    }
  }

  // 6. 웨이브 시작 컨트롤러
  startWave(waveNum) {
    this.updateGlobalHeader();
    this.updatePlayerStatsUI();

    this.state.battleTurn = 1;
    this.state.isGuarding = false;
    this.state.isEnraged = false;
    this.elPlayerBox.classList.remove('shield-active');
    this.elEnemySprite.classList.remove('enraged-monster');

    // 자기주도역량 비례 자연 회복
    const regen = Math.round(this.state.stats.selfDirected / 4);
    if (regen > 0 && this.state.playerHp < this.state.maxPlayerHp) {
      this.state.playerHp = Math.min(this.state.maxPlayerHp, this.state.playerHp + regen);
    }

    if (waveNum > this.state.maxWaves) {
      this.triggerEnding();
      return;
    }

    const currentSchedule = GAME_DATA.waveSchedule[waveNum - 1];

    if (currentSchedule.type === 'event') {
      this.startEventWave(currentSchedule.eventId);
    } else if (currentSchedule.type === 'boss') {
      this.startBossWave(currentSchedule.bossIndex);
    } else {
      this.startBattleWave(currentSchedule.subjectId);
    }
  }

  // 7. 배틀 웨이브 시작
  startBattleWave(subjectId) {
    this.state.isBossWave = false;
    const subject = GAME_DATA.subjects[subjectId] || GAME_DATA.subjects['korean_common'];
    this.state.currentEnemy = subject;
    this.state.maxEnemyHp = subject.hp;
    this.state.currentEnemyHp = subject.hp;

    const qIndex = Math.floor(Math.random() * subject.quizzes.length);
    this.state.currentQuiz = subject.quizzes[qIndex];

    this.switchView('battle');
    this.updateBattleUI();

    const matchup = this.getMatchupEffectiveness();
    this.setDialog(`야생의 [${subject.categoryName}] ${subject.name} 과목 출현! (${matchup.label})`);
  }

  // 8. 보스 웨이브 시작 (16, 32, 48)
  startBossWave(bossIndex) {
    this.state.isBossWave = true;
    const boss = GAME_DATA.bosses[bossIndex];
    this.state.currentEnemy = boss;
    this.state.maxEnemyHp = boss.hp;
    this.state.currentEnemyHp = boss.hp;

    const qIndex = Math.floor(Math.random() * boss.quizzes.length);
    this.state.currentQuiz = boss.quizzes[qIndex];

    window.soundEngine.playBossEncounter();
    this.switchView('battle');
    this.updateBattleUI();
    this.setDialog(`👑 [보스전] ${boss.name}이 등장했다! 강력한 시험 공세를 방어하며 격파하라!`);
  }

  // 배틀 UI 갱신
  updateBattleUI() {
    const enemy = this.state.currentEnemy;

    this.elEnemyName.textContent = enemy.name;
    this.elEnemyBadge.textContent = enemy.categoryName || '학기말 보스';
    // 적 스프라이트 이미지 자동 감지 및 로딩 (이미지 파일 존재 시 자동 표시, 없을 시 이모지 폴백)
    const imgFilename = enemy.id ? `${enemy.id}.png` : '';
    const testImg = new Image();
    testImg.onload = () => {
      this.elEnemySprite.innerHTML = `<img src="images/${imgFilename}" alt="${enemy.name}" style="width:100%; height:100%; object-fit:contain; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.6));">`;
    };
    testImg.onerror = () => {
      this.elEnemySprite.textContent = enemy.icon || '📖';
    };
    testImg.src = `images/${imgFilename}`;

    // 적 속성 배지
    if (enemy.element === 'all') {
      this.elEnemyElementBadge.textContent = '🌟 무속성 (보스)';
      this.elEnemyElementBadge.style.background = '#e11d48';
    } else if (GAME_DATA.elements[enemy.element]) {
      const eElem = GAME_DATA.elements[enemy.element];
      this.elEnemyElementBadge.textContent = `${eElem.icon} ${eElem.name}`;
      this.elEnemyElementBadge.style.background = eElem.color;
    }

    // 적 체력바 & 텍스트
    const enemyHpPct = Math.max(0, Math.round((this.state.currentEnemyHp / this.state.maxEnemyHp) * 100));
    this.elEnemyHpBar.style.width = `${enemyHpPct}%`;
    this.elEnemyHpText.textContent = `${this.state.currentEnemyHp} / ${this.state.maxEnemyHp}`;
    this.setHpColor(this.elEnemyHpBar, enemyHpPct);

    // 몬스터 HP 35% 이하 시 분노 각성 모드
    if (enemyHpPct <= 35 && !this.state.isEnraged && this.state.currentEnemyHp > 0) {
      this.state.isEnraged = true;
      this.elEnemySprite.classList.add('enraged-monster');
      this.setDialog(`⚠️ [경고] [${enemy.name}]이(가) '시험 직전 벼락치기 각성 모드'에 돌입했습니다! 공격력이 35% 상승합니다!`);
    }

    // 플레이어 멘탈(HP)바 & 텍스트
    const playerHpPct = Math.max(0, Math.round((this.state.playerHp / this.state.maxPlayerHp) * 100));
    this.elPlayerHpBar.style.width = `${playerHpPct}%`;
    this.elPlayerHpText.textContent = `${this.state.playerHp} / ${this.state.maxPlayerHp}`;
    this.setHpColor(this.elPlayerHpBar, playerHpPct);

    // 최소성취수준 보장지도(그로기) 시각화
    if (this.state.isGroggy) {
      this.elPlayerSprite.classList.add('player-groggy-aura');
      this.elPlayerTrackBadge.textContent = '⚠️ 보장지도 이수중';
      this.elPlayerTrackBadge.className = 'unit-type-tag groggy-badge';
    } else {
      this.elPlayerSprite.classList.remove('player-groggy-aura');
      this.elPlayerTrackBadge.textContent = this.state.track ? this.state.track.name.split('·')[0] : '학생';
      this.elPlayerTrackBadge.className = 'unit-type-tag';
      this.elPlayerTrackBadge.style.background = this.state.track ? this.state.track.color : '#3b82f6';
    }

    // 상성 정보 갱신
    const matchup = this.getMatchupEffectiveness();
    this.elMatchupEval.textContent = matchup.label.split(' ')[0];
    this.elMatchupEval.style.color = matchup.color;

    // 턴 & 스킬 쿨타임 표시
    this.elInfoBattleTurn.textContent = `Turn ${this.state.battleTurn}`;
    if (this.state.skillCooldown > 0) {
      this.elBtnSkill.disabled = true;
      this.elSkillCdText.textContent = `(${this.state.skillCooldown}턴 남음)`;
    } else {
      this.elBtnSkill.disabled = false;
      this.elSkillCdText.textContent = `(준비완료)`;
    }

    this.updatePlayerStatsUI();
    this.elBtnQuiz.disabled = false;
    this.elBtnGuard.disabled = false;
  }

  setHpColor(element, pct) {
    if (pct > 50) element.style.background = 'var(--hp-green)';
    else if (pct > 25) element.style.background = 'var(--hp-yellow)';
    else element.style.background = 'var(--hp-red)';
  }

  setDialog(text) {
    this.elDialog.textContent = text;
  }

  // 9. 퀴즈 모달 오픈
  openQuizModal() {
    const quiz = this.state.currentQuiz;
    if (!quiz) return;

    const isSkill = (this.state.currentQuizType === 'skill');
    this.quizBadge.innerHTML = `<span>📝 [${this.state.currentEnemy.name}] ${isSkill ? '🔥 심화 탐구 퀴즈' : '개념 확인 퀴즈'}</span>`;
    this.quizQuestion.textContent = quiz.q;
    this.quizOptionsList.innerHTML = '';
    this.quizExpBox.style.display = 'none';

    quiz.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="quiz-option-num">${idx + 1}</span>
        <span>${opt}</span>
      `;

      btn.addEventListener('click', () => {
        this.submitAnswer(idx, btn);
      });

      this.quizOptionsList.appendChild(btn);
    });

    this.quizOverlay.classList.add('active');
  }

  // 10. 퀴즈 정답 제출 처리
  submitAnswer(chosenIdx, btnElem) {
    const quiz = this.state.currentQuiz;
    const isCorrect = (chosenIdx === quiz.ans);

    const allBtns = this.quizOptionsList.querySelectorAll('.quiz-option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      btnElem.style.background = 'rgba(34, 197, 94, 0.3)';
      btnElem.style.borderColor = '#22c55e';
      window.soundEngine.playCorrect();

      this.quizExpBox.style.display = 'block';
      this.quizExpBox.innerHTML = `<strong>✨ 정답입니다!</strong><br>${quiz.exp}`;

      setTimeout(() => {
        this.quizOverlay.classList.remove('active');
        this.handlePlayerAttackSuccess();
      }, 1400);
    } else {
      btnElem.style.background = 'rgba(239, 68, 68, 0.3)';
      btnElem.style.borderColor = '#ef4444';
      window.soundEngine.playDamage();

      if (allBtns[quiz.ans]) {
        allBtns[quiz.ans].style.borderColor = '#22c55e';
      }

      this.quizExpBox.style.display = 'block';
      this.quizExpBox.innerHTML = `<strong>❌ 아쉽게 틀렸습니다!</strong><br>${quiz.exp}`;

      setTimeout(() => {
        this.quizOverlay.classList.remove('active');
        this.handlePlayerAttackFail();
      }, 1800);
    }
  }

  // 11. 플레이어 공격 성공 (가변 데미지 + 상성 + 크리티컬)
  handlePlayerAttackSuccess() {
    const academic = this.state.stats.academic;
    const career = this.state.stats.career;
    const isSkill = (this.state.currentQuizType === 'skill');

    let basePower = isSkill ? (115 + Math.random() * 35) : (48 + Math.random() * 22);
    let damage = basePower * (1 + academic / 100);

    const matchup = this.getMatchupEffectiveness();
    damage = damage * matchup.playerMult;

    const rngVariance = 0.86 + Math.random() * 0.28;
    damage = damage * rngVariance;

    let isCrit = false;
    const critChance = Math.min(85, Math.round(career * 1.5 + (isSkill ? 25 : 0)));
    if (Math.random() * 100 < critChance) {
      isCrit = true;
      damage = damage * 1.55;
    }

    const finalDamage = Math.max(12, Math.round(damage));

    if (isSkill) {
      this.state.skillCooldown = 3;
    }

    this.state.currentEnemyHp = Math.max(0, this.state.currentEnemyHp - finalDamage);
    this.elEnemyBox.classList.add('shake-damage');
    setTimeout(() => this.elEnemyBox.classList.remove('shake-damage'), 350);

    this.showFloatingDamage(this.elEnemyBox, finalDamage, isCrit, false);
    this.updateBattleUI();

    let logMsg = '';
    if (matchup.type === 'super_effective') {
      logMsg += '💥 [효과가 굉장했다!] ';
    } else if (matchup.type === 'not_effective') {
      logMsg += '💧 [효과가 별로인 듯하다...] ';
    }

    if (isCrit) {
      logMsg += `🎯 급소에 맞았다! [진로 크리티컬!] ${finalDamage}의 치명타를 가했습니다!`;
    } else {
      logMsg += `명쾌한 정답! [가변 위력 ${finalDamage} 데미지]를 적중시켰습니다!`;
    }
    this.setDialog(logMsg);

    if (this.state.currentEnemyHp <= 0) {
      setTimeout(() => {
        this.handleBattleVictory();
      }, 1000);
    } else {
      setTimeout(() => {
        this.triggerEnemyTurn();
      }, 1200);
    }
  }

  // 12. 퀴즈 오답 시
  handlePlayerAttackFail() {
    if (this.state.currentQuizType === 'skill') {
      this.state.skillCooldown = 3;
    }
    this.setDialog(`개념 혼동으로 공격이 빗나갔다! 몬스터의 반격이 다가온다!`);
    setTimeout(() => {
      this.triggerEnemyTurn(1.3);
    }, 1000);
  }

  // 13. 오답노트 방어 액션
  executeGuardAction() {
    this.state.isGuarding = true;
    this.elPlayerBox.classList.add('shield-active');

    const baseHeal = 15 + Math.round(this.state.stats.selfDirected / 3);
    const healVal = Math.round(baseHeal * (0.9 + Math.random() * 0.25));

    this.state.playerHp = Math.min(this.state.maxPlayerHp, this.state.playerHp + healVal);
    this.updateBattleUI();

    this.setDialog(`🛡️ [오답노트 방어 태세] 멘탈을 +${healVal} 회복하고 이번 턴 적의 공격을 60% 경감합니다!`);

    setTimeout(() => {
      this.triggerEnemyTurn();
    }, 1000);
  }

  // 14. 친구 멘토링 찬스 (50:50)
  executeMentorAction() {
    if (this.state.mentorUses <= 0) {
      alert('친구 멘토링 찬스가 모두 소진되었습니다! 보상 카드에서 충전할 수 있습니다.');
      return;
    }
    window.soundEngine.playClick();
    this.state.mentorUses--;
    this.updateGlobalHeader();

    this.state.currentQuizType = 'normal';
    this.openQuizModal();

    setTimeout(() => {
      const quiz = this.state.currentQuiz;
      const allBtns = this.quizOptionsList.querySelectorAll('.quiz-option-btn');
      let eliminated = 0;

      allBtns.forEach((btn, idx) => {
        if (idx !== quiz.ans && eliminated < 2) {
          btn.disabled = true;
          btn.style.opacity = '0.2';
          eliminated++;
        }
      });
    }, 200);
  }

  // 15. 몬스터 반격 턴
  triggerEnemyTurn(penaltyMultiplier = 1.0) {
    const enemy = this.state.currentEnemy;
    let baseDmg = enemy.attackDmg || 16;

    const matchup = this.getMatchupEffectiveness();
    let dmg = baseDmg * matchup.enemyMult;

    if (this.state.isEnraged) {
      dmg = dmg * 1.35;
    }

    const rngVariance = 0.85 + Math.random() * 0.30;
    dmg = dmg * rngVariance * penaltyMultiplier;

    let isEnemyCrit = false;
    if (Math.random() * 100 < 15) {
      isEnemyCrit = true;
      dmg = dmg * 1.4;
    }

    if (this.state.isGuarding) {
      dmg = dmg * 0.4;
      this.state.isGuarding = false;
      this.elPlayerBox.classList.remove('shield-active');
    }

    const finalDmg = Math.max(4, Math.round(dmg));

    this.state.playerHp = Math.max(0, this.state.playerHp - finalDmg);
    this.elPlayerBox.classList.add('shake-damage');
    window.soundEngine.playDamage();
    setTimeout(() => this.elPlayerBox.classList.remove('shake-damage'), 350);

    this.showFloatingDamage(this.elPlayerBox, finalDmg, isEnemyCrit, true);

    let logMsg = '';
    if (this.state.isGuarding) {
      logMsg = `🛡️ [방어 성공!] [${enemy.name}]의 '${enemy.attackName}'을 막아내어 ${finalDmg} 데미지만 입었습니다!`;
    } else if (isEnemyCrit) {
      logMsg = `💥 [몬스터의 회심의 일격!] '${enemy.attackName}'으로 멘탈에 치명타 -${finalDmg} 데미지!`;
    } else {
      logMsg = `💥 [${enemy.name}]이 '${enemy.attackName}'(으)로 멘탈에 -${finalDmg} 데미지를 가했다!`;
    }
    this.setDialog(logMsg);

    this.state.battleTurn++;
    if (this.state.skillCooldown > 0) this.state.skillCooldown--;
    this.updateBattleUI();

    if (this.state.playerHp <= 0) {
      setTimeout(() => {
        this.handlePlayerKnockout();
      }, 800);
    }
  }

  // 16. 멘탈 소진 시 최소성취수준 보장지도(1회) & 2회 소진 시 과목 미이수 엔딩
  handlePlayerKnockout() {
    if (!this.state.isGroggy) {
      // 1차 쓰러짐: 40% 체력으로 보장지도 부활 & 그로기 상태 부여
      this.state.isGroggy = true;
      this.state.playerHp = Math.round(this.state.maxPlayerHp * 0.40);
      window.soundEngine.playDamage();
      this.updateBattleUI();

      this.noticeTitle.textContent = '최소성취수준 미도달 위기 경보!';
      this.noticeBody.innerHTML = `
        멘탈(HP)이 0이 되어 <strong>[최소성취수준 보장지도 대상자(그로기 상태)]</strong>로 지정되었습니다!<br><br>
        선생님의 특별 보충지도를 이수하며 <strong>멘탈 40%로 기사회생</strong>했지만, 이 상태에서 한 번 더 쓰러지면 과목 <strong>'미이수(I등급)'</strong>로 즉시 최종 탈락(게임 오버)합니다!
      `;
      this.noticeOverlay.classList.add('active');

      this.setDialog('⚠️ [최소성취수준 보장지도 이수 중] 멘탈 40%로 회복! 한 번 더 쓰러지면 과목 미이수(I등급)로 탈락합니다!');
    } else {
      // 2차 쓰러짐: 최종 미이수(I등급) 탈락 엔딩
      window.soundEngine.playDamage();
      this.setDialog('🚫 [미이수 확정] 최소성취수준에 도달하지 못해 과목 미이수(I등급) 판정을 받았습니다...');
      setTimeout(() => {
        this.triggerIncompleteEnding();
      }, 900);
    }
  }

  // 17. 전투 승리 처리 & 학점/스탯 누적
  handleBattleVictory() {
    window.soundEngine.playVictory();
    const enemy = this.state.currentEnemy;

    // 학년말 보스 격파 시 그로기(보장지도) 상태 해제
    if (this.state.isBossWave && this.state.isGroggy) {
      this.state.isGroggy = false;
      this.setDialog(`✨ [학년말 종합평가 통과!] 학업 성취를 인정받아 '최소성취수준 보장지도' 상태에서 벗어났습니다!`);
    }

    const earnedCredits = this.state.isBossWave ? 10 : (enemy.credits || 4);
    this.state.credits = Math.min(this.state.targetCredits, this.state.credits + earnedCredits);

    if (enemy.statRewards) {
      Object.keys(enemy.statRewards).forEach(st => {
        this.addStat(st, enemy.statRewards[st]);
      });
    }

    if (!this.state.isBossWave) {
      this.state.completedSubjects.push({
        id: enemy.id,
        name: enemy.name,
        category: enemy.category,
        categoryName: enemy.categoryName,
        element: enemy.element,
        credits: enemy.credits || 4,
        icon: enemy.icon
      });
    }

    this.updateGlobalHeader();
    this.setDialog(`🎉 [${enemy.name}] 완벽 격파 & 이수 완료! (+${earnedCredits}학점 및 역량 스탯 획득)`);

    setTimeout(() => {
      this.showRewardScreen();
    }, 1200);
  }

  // 18. 보상 카드 선택 화면 (3택 1)
  showRewardScreen() {
    this.switchView('reward');
    window.soundEngine.playRewardPick();

    this.rewardContainer.innerHTML = '';

    const shuffled = [...GAME_DATA.rewardCards].sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, 3);

    selectedCards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'reward-card';
      cardEl.innerHTML = `
        <span class="reward-card-icon">${card.icon}</span>
        <div class="reward-card-name">${card.name}</div>
        <span class="reward-card-badge">${card.type === 'creative' ? '창체 & 역량' : '학습 아이템'}</span>
        <p class="reward-card-desc">${card.desc}</p>
      `;

      cardEl.addEventListener('click', () => {
        window.soundEngine.playRewardPick();
        this.applyRewardCard(card);
      });

      this.rewardContainer.appendChild(cardEl);
    });
  }

  applyRewardCard(card) {
    const eff = card.effect;

    if (eff.stat && eff.value) {
      this.addStat(eff.stat, eff.value);
    }
    if (eff.multiStat && eff.stats) {
      Object.keys(eff.stats).forEach(k => this.addStat(k, eff.stats[k]));
    }
    if (eff.maxMental) {
      this.state.maxPlayerHp += eff.maxMental;
      this.state.playerHp = this.state.maxPlayerHp;
    }
    if (eff.hintCharge) {
      this.state.mentorUses += eff.hintCharge;
    }
    if (eff.creativeCredit) {
      this.state.creativeCredits += eff.creativeCredit;
      this.state.credits = Math.min(this.state.targetCredits, this.state.credits + eff.creativeCredit);
    }
    if (eff.type === 'healFull') {
      this.state.playerHp = this.state.maxPlayerHp;
    }

    this.nextWave();
  }

  // 19. 딜레마 이벤트 웨이브 시작
  startEventWave(eventId) {
    const event = GAME_DATA.events.find(e => e.id === eventId) || GAME_DATA.events[0];
    this.switchView('event');

    this.eventTag.textContent = `🏫 ${this.state.year}학년 학교생활 돌발 이벤트`;
    this.eventTitle.textContent = event.title;
    this.eventDesc.textContent = event.desc;
    this.eventResultBox.style.display = 'none';
    this.btnEventNext.style.display = 'none';
    this.eventChoicesList.innerHTML = '';

    event.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'btn-event-choice';

      let isReqPassed = true;
      let reqTagHtml = '';

      if (ch.reqStat) {
        const playerVal = this.state.stats[ch.reqStat.stat] || 0;
        const reqMin = ch.reqStat.min;
        const statDef = GAME_DATA.statDefinitions[ch.reqStat.stat];
        isReqPassed = playerVal >= reqMin;

        if (isReqPassed) {
          reqTagHtml = `<span class="choice-req-tag passed">✓ ${statDef.name} ${playerVal}/${reqMin}</span>`;
        } else {
          reqTagHtml = `<span class="choice-req-tag">✗ ${statDef.name} ${playerVal}/${reqMin} 필요</span>`;
        }
      }

      btn.innerHTML = `
        <span>${ch.text}</span>
        ${reqTagHtml}
      `;

      if (!isReqPassed) {
        btn.disabled = true;
      }

      btn.addEventListener('click', () => {
        window.soundEngine.playClick();
        this.handleEventChoice(ch);
      });

      this.eventChoicesList.appendChild(btn);
    });
  }

  handleEventChoice(choice) {
    this.eventChoicesList.querySelectorAll('.btn-event-choice').forEach(b => b.disabled = true);

    if (choice.creditBonus) {
      this.state.credits = Math.min(this.state.targetCredits, this.state.credits + choice.creditBonus);
      this.state.creativeCredits += 1;
    }
    if (choice.statReward) {
      Object.keys(choice.statReward).forEach(k => this.addStat(k, choice.statReward[k]));
    }
    if (choice.mentalHeal) {
      this.state.playerHp = Math.min(this.state.maxPlayerHp, Math.max(10, this.state.playerHp + choice.mentalHeal));
    }

    this.updateGlobalHeader();
    window.soundEngine.playRewardPick();

    this.eventResultBox.style.display = 'block';
    this.eventResultBox.innerHTML = `<strong>결과 피드백:</strong><br>${choice.resultText}`;
    this.btnEventNext.style.display = 'block';
  }

  // 20. 시간표 도감 모달
  openDeckModal() {
    let commonCredits = 0;
    let electiveCredits = 0;

    this.deckSubjectsGrid.innerHTML = '';

    this.state.completedSubjects.forEach(s => {
      if (s.category === 'common') commonCredits += s.credits;
      else electiveCredits += s.credits;

      const eElem = GAME_DATA.elements[s.element];
      const elemBadge = eElem ? `<span class="element-tag-badge" style="background:${eElem.color}; font-size:0.65rem;">${eElem.icon} ${eElem.name}</span>` : '';

      const item = document.createElement('div');
      item.className = 'deck-subject-card';
      item.innerHTML = `
        <span style="font-size:1.6rem;">${s.icon || '📖'}</span>
        <div>
          <div style="font-weight:700; color:#fff; display:flex; align-items:center; gap:4px;">${s.name} ${elemBadge}</div>
          <div style="font-size:0.75rem; color:#94a3b8;">${s.categoryName} (${s.credits}학점)</div>
        </div>
      `;
      this.deckSubjectsGrid.appendChild(item);
    });

    if (this.state.completedSubjects.length === 0) {
      this.deckSubjectsGrid.innerHTML = '<p style="color:#64748b; padding:20px; grid-column:span 2; text-align:center;">아직 이수한 과목이 없습니다. 웨이브를 클리어하여 시간표를 채워보세요!</p>';
    }

    this.deckStatAcademic.textContent = this.state.stats.academic;
    this.deckStatCareer.textContent = this.state.stats.career;
    this.deckStatSelf.textContent = this.state.stats.selfDirected;
    this.deckStatComm.textContent = this.state.stats.community;

    this.deckCommonCredits.textContent = `${commonCredits}학점`;
    this.deckElectiveCredits.textContent = `${electiveCredits}학점`;
    this.deckCreativeCredits.textContent = `${this.state.creativeCredits}학점`;
    this.deckTotalCredits.textContent = `${this.state.credits} / 192`;

    this.deckOverlay.classList.add('active');
  }

  // 21. 다음 웨이브 진행
  nextWave() {
    this.state.wave++;
    this.startWave(this.state.wave);
  }

  // 22. 최종 졸업 & 멀티엔딩 판정 (정상 졸업)
  triggerEnding() {
    this.switchView('ending');
    window.soundEngine.playEndingFanfare();

    const endingCardWrap = document.querySelector('.ending-card-wrap');
    if (endingCardWrap) endingCardWrap.classList.remove('ending-incomplete');

    let matchedEnding = null;
    const trackId = this.state.track ? this.state.track.id : 'tech';

    matchedEnding = GAME_DATA.endings.find(e => e.track === trackId && this.state.credits >= e.minCredits);

    if (!matchedEnding) {
      if (this.state.credits >= 170) {
        matchedEnding = GAME_DATA.endings.find(e => e.id === 'all_rounder');
      } else {
        matchedEnding = GAME_DATA.endings.find(e => e.id === 'comeback_hero');
      }
    }

    document.getElementById('ending-badge').textContent = matchedEnding.badge;
    document.getElementById('ending-title').textContent = matchedEnding.title;
    document.getElementById('ending-summary-text').textContent = matchedEnding.summary;
    document.getElementById('ending-next-step').textContent = `🚀 진로 로드맵 제언: ${matchedEnding.nextStep}`;

    document.getElementById('end-stat-academic').textContent = this.state.stats.academic;
    document.getElementById('end-stat-career').textContent = this.state.stats.career;
    document.getElementById('end-stat-self').textContent = this.state.stats.selfDirected;
    document.getElementById('end-stat-comm').textContent = this.state.stats.community;
  }

  // 23. 최소성취수준 미도달 & 과목 미이수(I등급) 게임오버 엔딩
  triggerIncompleteEnding() {
    this.switchView('ending');
    window.soundEngine.playDamage();

    const endingCardWrap = document.querySelector('.ending-card-wrap');
    if (endingCardWrap) endingCardWrap.classList.add('ending-incomplete');

    const enemyName = this.state.currentEnemy ? this.state.currentEnemy.name : '해당 과목';
    const gradeYear = this.state.wave <= 16 ? 1 : (this.state.wave <= 32 ? 2 : 3);

    document.getElementById('ending-badge').textContent = '⚠️ 과목 미이수(I등급) 통보서';
    document.getElementById('ending-title').textContent = `🚫 ${gradeYear}학년 학업 중단 & 최소성취수준 미도달`;
    document.getElementById('ending-summary-text').innerHTML = `
      <strong>[${enemyName}]</strong> 수업의 최소 학업성취수준(40%)에 미도달하여 최종 <strong>'과목 미이수(I등급)'</strong> 판정을 받았습니다.<br><br>
      2022 개정 고교학점제에서는 192학점 이수 기준을 충족하지 못하면 졸업이 유예되거나 다음 학기 재이수(방학 보충과정)를 거쳐야 합니다.<br>
      <span style="color:#f87171; font-weight:700;">(현재까지 취득 학점: ${this.state.credits} / 192학점, 도달 Wave: ${this.state.wave} / 48)</span>
    `;
    document.getElementById('ending-next-step').textContent = `💡 지도 조언: 다음 도전에서는 '🛡️ 오답노트 방어'와 '⚡ 자기주도역량'을 적극 활용하여 멘탈 관리를 철저히 해보세요!`;

    document.getElementById('end-stat-academic').textContent = this.state.stats.academic;
    document.getElementById('end-stat-career').textContent = this.state.stats.career;
    document.getElementById('end-stat-self').textContent = this.state.stats.selfDirected;
    document.getElementById('end-stat-comm').textContent = this.state.stats.community;
  }

  // 게임 리셋
  resetGame() {
    this.state.introStep = 0;
    this.state.isGroggy = false;
    this.mentorBubble.textContent = `"${this.introDialogues[0]}"`;
    this.btnDialogNext.style.display = 'inline-block';
    this.trackSelectionWrap.style.display = 'none';
    this.btnStart.style.display = 'none';
    this.btnStart.disabled = true;
    this.state.track = null;
    this.mainHeader.classList.add('intro-mode');
    this.elWave.style.display = 'none';
    this.elCreditTracker.style.display = 'none';
    this.elYear.textContent = '🏫 신입생 진로 오리엔테이션';

    const endingCardWrap = document.querySelector('.ending-card-wrap');
    if (endingCardWrap) endingCardWrap.classList.remove('ending-incomplete');

    this.switchView('title');
    document.querySelectorAll('.track-card').forEach(c => c.classList.remove('selected'));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new CreditRogueGame();
});
