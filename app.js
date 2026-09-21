// ==========================================================================
// 고교학점제 로그 (High School Credit PokéRogue) 48 Wave Strategic Engine
// 속성 상성(Type Matchup) & 양방향 가변 데미지 & 진학부장 오리엔테이션 스토리
// ==========================================================================

const SAVE_KEY = 'creditRogueSave_v1';

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
      playerHp: BALANCE_CONFIG.start.playerHp,
      maxPlayerHp: BALANCE_CONFIG.start.playerHp,

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
      mentorUses: BALANCE_CONFIG.start.mentorUses,
      currentQuizType: 'normal',
      
      completedSubjects: [],
      currentEnemy: null,
      currentEnemyHp: 240,
      maxEnemyHp: 240,
      currentQuiz: null,
      currentQuizOptionOrder: null, // 현재 퀴즈의 보기 표시 순서 (표시 인덱스 -> 원본 인덱스)
      quizQueue: null, // 현재 몬스터전 동안 아직 안 낸 퀴즈 목록 (다 소진되면 재셔플)
      isBossWave: false,
      isEnraged: false,
      
      // 최소성취수준 보장지도 (그로기) 상태
      isGroggy: false,

      // 보스전 2페이즈 시스템 (HP 임계값 통과 시 보스별 고유 기믹 발동)
      bossPhase: 1,

      // 에픽 보상카드 전용 소모형 충전 (자동 정답 / 오답 반격 무효화)
      autoCorrectCharges: 0,
      failInsuranceCharges: 0
    };

    // 몬스터 스프라이트 이미지 존재 여부 캐시 (enemyId -> true/false), 적별로 1회만 검사
    this.spriteCache = {};

    // 진학부장 오기준 선생님 오리엔테이션 대사집
    this.introDialogues = [
      "고등학교 입학을 진심으로 축하한다! 🎉 나는 너의 3년 고교생활과 192학점 설계를 함께할 진학지도부장 '오기준' 선생님이란다.",
      "2022 개정 교육과정의 고교학점제는 학생 스스로 원하는 과목을 선택하고 깊이 있게 탐구하여 192학점을 채워가는 특별한 모험이지!",
      "고등학교의 모든 과목들은 4대 교과 속성(🟦 수리·논리, 🟩 자연·탐구, 🟨 인문·사회, 🟪 창의·융합)을 지니고 서로 상성을 이룬단다.",
      "자! 네가 3년간 가장 열정을 쏟고 싶은 너만의 '희망 진로 트랙(스타팅 속성)'을 아래에서 선택해 보렴! 👇"
    ];

    this.initElements();
    this.initEvents();
    this.refreshContinueButton();
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

    // 이어하기(세이브) 요소
    this.continueGameWrap = document.getElementById('continue-game-wrap');
    this.btnContinueGame = document.getElementById('btn-continue-game');
    this.btnDeleteSave = document.getElementById('btn-delete-save');

    // 배틀 요소
    this.elEnemyName = document.getElementById('enemy-name');
    this.elEnemyBadge = document.getElementById('enemy-type-badge');
    this.elEnemyElementBadge = document.getElementById('enemy-element-badge');
    this.elEnemyHpBar = document.getElementById('enemy-hp-bar');
    this.elEnemyHpText = document.getElementById('enemy-hp-text');
    this.elEnemySprite = document.getElementById('enemy-sprite');
    this.elEnemyBox = document.getElementById('enemy-status-box');

    this.elPlayerName = document.getElementById('player-name');
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
      this.elSoundBtn.setAttribute('aria-pressed', String(enabled));
    });

    // 오리엔테이션 대화 진행 버튼
    this.btnDialogNext.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.advanceIntroDialogue();
    });

    // 저장된 게임 이어하기 / 삭제
    this.btnContinueGame.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.loadGame();
    });

    this.btnDeleteSave.addEventListener('click', () => {
      window.soundEngine.playClick();
      this.clearSave();
      this.refreshContinueButton();
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

    // 퀴즈 보기에 표시되는 1~4 숫자와 매칭되는 키보드 단축키
    document.addEventListener('keydown', (e) => {
      if (!this.quizOverlay.classList.contains('active')) return;
      const num = parseInt(e.key, 10);
      if (!(num >= 1 && num <= 4)) return;

      const btns = this.quizOptionsList.querySelectorAll('.quiz-option-btn');
      const btn = btns[num - 1];
      if (btn && !btn.disabled) {
        btn.click();
      }
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

    if (viewName === 'battle') {
      if (this.state.isBossWave) {
        window.soundEngine.startBossBgm();
      } else {
        window.soundEngine.startBattleBgm();
      }
    } else {
      window.soundEngine.stopBgm();
    }
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

  // 세이브/이어하기: 웨이브 시작 시점(적 조우 전) 상태를 체크포인트로 저장
  saveGame() {
    const s = this.state;
    const snapshot = {
      wave: s.wave,
      track: s.track,
      playerHp: s.playerHp,
      maxPlayerHp: s.maxPlayerHp,
      stats: { ...s.stats },
      credits: s.credits,
      targetCredits: s.targetCredits,
      creativeCredits: s.creativeCredits,
      mentorUses: s.mentorUses,
      skillCooldown: s.skillCooldown,
      completedSubjects: s.completedSubjects,
      isGroggy: s.isGroggy,
      autoCorrectCharges: s.autoCorrectCharges,
      failInsuranceCharges: s.failInsuranceCharges
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
    } catch (e) {
      // 저장 공간 부족 등 예외는 무시 (세이브 실패해도 진행에는 지장 없음)
    }
  }

  readSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (!data || typeof data.wave !== 'number' || !data.track) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  clearSave() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch (e) {
      // 접근 불가 환경(프라이빗 모드 등)은 무시
    }
  }

  hasSavedGame() {
    return !!this.readSave();
  }

  // 타이틀 화면의 "이어하기" 버튼 표시 여부 갱신
  refreshContinueButton() {
    this.continueGameWrap.style.display = this.hasSavedGame() ? 'flex' : 'none';
  }

  // 저장된 체크포인트를 불러와 해당 웨이브 시작 지점으로 복귀
  loadGame() {
    const saved = this.readSave();
    if (!saved) return false;

    Object.assign(this.state, saved);
    this.state.battleTurn = 1;
    this.state.isGuarding = false;
    this.state.isEnraged = false;

    this.mainHeader.classList.remove('intro-mode');
    this.elWave.style.display = 'inline-block';
    this.elCreditTracker.style.display = 'flex';

    this.startWave(this.state.wave);
    return true;
  }

  // 2. 게임 시작 (배틀 화면으로 전환)
  startGame() {
    this.state.wave = 1;
    this.state.credits = BALANCE_CONFIG.start.credits;
    this.state.creativeCredits = BALANCE_CONFIG.start.creativeCredits;
    this.state.playerHp = BALANCE_CONFIG.start.playerHp;
    this.state.maxPlayerHp = BALANCE_CONFIG.start.playerHp;
    this.state.completedSubjects = [];
    this.state.mentorUses = BALANCE_CONFIG.start.mentorUses;
    this.state.skillCooldown = 0;
    this.state.autoCorrectCharges = 0;
    this.state.failInsuranceCharges = 0;

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
    this.tipCareer.textContent = `크리티컬 확률 ${Math.min(BALANCE_CONFIG.quizAttack.critChanceCap, Math.round(s.career * BALANCE_CONFIG.quizAttack.critChanceCareerMult))}%`;
    this.tipSelf.textContent = `방어 시 회복 +${Math.round(s.selfDirected / BALANCE_CONFIG.guard.healSelfDirectedDivisor)}`;
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
      const m = BALANCE_CONFIG.matchup.superEffective;
      return {
        type: 'super_effective',
        playerMult: m.playerMult,
        enemyMult: m.enemyMult,
        label: '🔥 우세 상성 (+50% / 적 공격 -25%)',
        color: '#22c55e'
      };
    } else if (playerDef.weakAgainst === enemyElemKey) {
      const m = BALANCE_CONFIG.matchup.notEffective;
      return {
        type: 'not_effective',
        playerMult: m.playerMult,
        enemyMult: m.enemyMult,
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
      this.elPlayerTrackBadge.textContent = this.state.track.name.split(' ')[0];
      this.elPlayerTrackBadge.style.background = this.state.track.color;

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
    this.state.bossPhase = 1;
    this.elPlayerBox.classList.remove('shield-active');
    this.elEnemySprite.classList.remove('enraged-monster');

    // 자기주도역량 비례 자연 회복
    const regen = Math.round(this.state.stats.selfDirected / BALANCE_CONFIG.regenPerWave.selfDirectedDivisor);
    if (regen > 0 && this.state.playerHp < this.state.maxPlayerHp) {
      this.state.playerHp = Math.min(this.state.maxPlayerHp, this.state.playerHp + regen);
    }

    if (waveNum > this.state.maxWaves) {
      this.triggerEnding();
      return;
    }

    // 웨이브 시작 = 세이브 체크포인트 (적 조우 전 상태로 이어하기)
    this.saveGame();

    const currentSchedule = GAME_DATA.waveSchedule[waveNum - 1];

    if (currentSchedule.type === 'event') {
      const eventId = this.resolveEventId(waveNum, currentSchedule.eventSlot);
      this.startEventWave(eventId);
    } else if (currentSchedule.type === 'boss') {
      this.startBossWave(currentSchedule.bossIndex);
    } else {
      const subjectId = currentSchedule.subjectId || this.resolveTrackSubject(waveNum, currentSchedule.trackSlot);
      this.startBattleWave(subjectId);
    }
  }

  // 2·3학년 전투 웨이브의 과목을 트랙별 조합(trackSubjectRoutes)에서 조회
  // (1학년 공통과목은 currentSchedule.subjectId로 고정되어 있어 이 함수를 타지 않음)
  resolveTrackSubject(waveNum, slot) {
    const trackId = this.state.track ? this.state.track.id : 'tech';
    const yearKey = waveNum <= 32 ? 'year2' : 'year3';
    const route = GAME_DATA.trackSubjectRoutes[trackId];
    return route[yearKey][slot];
  }

  // 이벤트 웨이브의 실제 이벤트를 후보 풀(eventRoutes)에서 랜덤 선택
  // 1학년은 트랙 공통 풀, 2·3학년은 트랙별 풀에서 조회 — 같은 트랙 재도전 시에도 매번 다른 이벤트가 나올 수 있음
  resolveEventId(waveNum, slot) {
    let pool;
    if (waveNum <= 16) {
      pool = GAME_DATA.eventRoutes.common[slot];
    } else {
      const trackId = this.state.track ? this.state.track.id : 'tech';
      const yearKey = waveNum <= 32 ? 'year2' : 'year3';
      pool = GAME_DATA.eventRoutes.byTrack[trackId][yearKey][slot];
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 7. 배틀 웨이브 시작
  startBattleWave(subjectId) {
    this.state.isBossWave = false;
    const subject = GAME_DATA.subjects[subjectId] || GAME_DATA.subjects['korean_common'];
    this.state.currentEnemy = subject;
    this.state.maxEnemyHp = subject.hp;
    this.state.currentEnemyHp = subject.hp;

    this.state.quizQueue = null; // 새 몬스터 조우 = 퀴즈 큐 초기화

    this.switchView('battle');
    this.loadEnemySprite(subject);
    this.updateBattleUI();

    this.setDialog(`👾 야생의 [${subject.categoryName}] ${subject.name} 출현! ${subject.flavor || ''}`);
  }

  // 8. 보스 웨이브 시작 (16, 32, 48)
  startBossWave(bossIndex) {
    this.state.isBossWave = true;
    const boss = GAME_DATA.bosses[bossIndex];
    this.state.currentEnemy = boss;
    this.state.maxEnemyHp = boss.hp;
    this.state.currentEnemyHp = boss.hp;

    this.state.quizQueue = null; // 새 몬스터 조우 = 퀴즈 큐 초기화

    window.soundEngine.playBossEncounter();
    this.switchView('battle');
    this.loadEnemySprite(boss);
    this.updateBattleUI();

    const phase1Desc = boss.bossMechanic ? ` ${boss.bossMechanic.phase1Desc}` : '';
    this.setDialog(`👑 [보스전] ${boss.name} 등장! ${boss.flavor || ''}${phase1Desc}`);
  }

  // 배틀 UI 갱신
  updateBattleUI() {
    const enemy = this.state.currentEnemy;

    this.elEnemyName.textContent = enemy.name;
    this.elEnemyBadge.textContent = enemy.categoryName || '학기말 보스';

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

    // 몬스터 HP 저하 시 분노 각성 모드 (보스는 자체 2페이즈 기믹을 쓰므로 제외)
    const enrageCfg = BALANCE_CONFIG.enrage;
    if (!this.state.isBossWave && enemyHpPct <= enrageCfg.hpThresholdPct && !this.state.isEnraged && this.state.currentEnemyHp > 0) {
      this.state.isEnraged = true;
      this.elEnemySprite.classList.add('enraged-monster');
      const boostPct = Math.round((enrageCfg.damageMult - 1) * 100);
      this.setDialog(`⚠️ [경고] [${enemy.name}]이(가) '시험 직전 벼락치기 각성 모드'에 돌입했습니다! 공격력이 ${boostPct}% 상승합니다!`);
    }

    // 보스전 2페이즈 전환 체크 (HP 임계값 통과 시 보스별 고유 기믹 발동)
    if (this.state.isBossWave) {
      this.checkBossPhaseTransition(enemyHpPct);
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
    const skillLockedByBoss = this.state.isBossWave && this.state.bossPhase === 1
      && enemy.bossMechanic && enemy.bossMechanic.skillLockedPhase1;
    if (skillLockedByBoss) {
      this.elBtnSkill.disabled = true;
      this.elSkillCdText.textContent = '(페이즈 1 봉인)';
    } else if (this.state.skillCooldown > 0) {
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

  // 보스전 2페이즈 전환 체크 — HP가 보스별 임계값(phase2Threshold) 이하로 내려가면 1회 발동
  checkBossPhaseTransition(enemyHpPct) {
    const enemy = this.state.currentEnemy;
    if (!enemy.bossMechanic) return;

    if (this.state.bossPhase === 1 && this.state.currentEnemyHp > 0 && enemyHpPct <= enemy.bossMechanic.phase2Threshold) {
      this.state.bossPhase = 2;
      this.elEnemySprite.classList.add('enraged-monster');
      window.soundEngine.playBossEncounter();
      this.setDialog(enemy.bossMechanic.phase2Desc);
    }
  }

  // 몬스터 스프라이트 이미지 로드 (적별 1회만 존재 여부 검사 후 캐시, 이후엔 캐시된 결과 재사용)
  loadEnemySprite(enemy) {
    const id = enemy.id;
    if (!id) {
      this.elEnemySprite.textContent = enemy.icon || '📖';
      return;
    }

    const cached = this.spriteCache[id];
    if (cached === true) {
      this.elEnemySprite.innerHTML = `<img src="images/${id}.png" alt="${enemy.name}" style="width:100%; height:100%; object-fit:contain; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.6));">`;
      return;
    }
    if (cached === false) {
      this.elEnemySprite.textContent = enemy.icon || '📖';
      return;
    }

    const testImg = new Image();
    testImg.onload = () => {
      this.spriteCache[id] = true;
      this.elEnemySprite.innerHTML = `<img src="images/${id}.png" alt="${enemy.name}" style="width:100%; height:100%; object-fit:contain; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.6));">`;
    };
    testImg.onerror = () => {
      this.spriteCache[id] = false;
      this.elEnemySprite.textContent = enemy.icon || '📖';
    };
    testImg.src = `images/${id}.png`;
  }

  setHpColor(element, pct) {
    if (pct > 50) element.style.background = 'var(--hp-green)';
    else if (pct > 25) element.style.background = 'var(--hp-yellow)';
    else element.style.background = 'var(--hp-red)';
  }

  setDialog(text) {
    this.elDialog.textContent = text;
  }

  // 긴급 경고/알림 모달 오픈 (확인 버튼 문구도 상황에 맞게 커스텀)
  showNotice(title, bodyHtml, confirmText = '확인') {
    this.noticeTitle.textContent = title;
    this.noticeBody.innerHTML = bodyHtml;
    this.btnNoticeConfirm.textContent = confirmText;
    this.noticeOverlay.classList.add('active');
  }

  // 배열 셔플 (Fisher-Yates)
  shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // 같은 몬스터를 상대하는 동안 퀴즈 풀을 다 보여줄 때까지 중복 없이 뽑고,
  // 다 소진되면 재셔플하되 직전 퀴즈가 바로 다시 나오지는 않게 한다.
  pickNextQuiz(pool) {
    if (!this.state.quizQueue || this.state.quizQueue.length === 0) {
      const nextBatch = this.shuffleArray(pool);
      if (pool.length > 1 && this.state.currentQuiz && nextBatch[0] === this.state.currentQuiz) {
        [nextBatch[0], nextBatch[1]] = [nextBatch[1], nextBatch[0]];
      }
      this.state.quizQueue = nextBatch;
    }
    this.state.currentQuiz = this.state.quizQueue.shift();
  }

  // 9. 퀴즈 모달 오픈
  openQuizModal() {
    const pool = this.state.currentEnemy && this.state.currentEnemy.quizzes;
    if (pool && pool.length) {
      this.pickNextQuiz(pool);
    }

    const quiz = this.state.currentQuiz;
    if (!quiz) return;

    // 보기를 매번 셔플해서 정답이 항상 같은 자리(1번)에 나오지 않게 한다.
    // quiz.ans는 원본 인덱스이므로, order[표시 인덱스] = 원본 인덱스로 매핑해 정답을 추적한다.
    const order = this.shuffleArray(quiz.options.map((_, i) => i));
    this.state.currentQuizOptionOrder = order;

    const isSkill = (this.state.currentQuizType === 'skill');
    this.quizBadge.innerHTML = `<span>📝 [${this.state.currentEnemy.name}] ${isSkill ? '🔥 심화 탐구 퀴즈' : '개념 확인 퀴즈'}</span>`;
    this.quizQuestion.textContent = quiz.q;
    this.quizOptionsList.innerHTML = '';
    this.quizExpBox.style.display = 'none';

    order.forEach((originalIdx, displayIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="quiz-option-num">${displayIdx + 1}</span>
        <span>${quiz.options[originalIdx]}</span>
      `;

      btn.addEventListener('click', () => {
        this.submitAnswer(displayIdx, btn);
      });

      this.quizOptionsList.appendChild(btn);
    });

    this.quizOverlay.classList.add('active');
  }

  // 10. 퀴즈 정답 제출 처리
  submitAnswer(chosenIdx, btnElem) {
    const quiz = this.state.currentQuiz;
    const order = this.state.currentQuizOptionOrder || quiz.options.map((_, i) => i);
    let isCorrect = (order[chosenIdx] === quiz.ans);

    // 🔮 족집게 예상문제집: 오답이어도 1회 자동 정답 처리
    let usedAutoCorrect = false;
    if (!isCorrect && this.state.autoCorrectCharges > 0) {
      this.state.autoCorrectCharges--;
      isCorrect = true;
      usedAutoCorrect = true;
    }

    const allBtns = this.quizOptionsList.querySelectorAll('.quiz-option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (isCorrect) {
      btnElem.style.background = 'rgba(34, 197, 94, 0.3)';
      btnElem.style.borderColor = '#22c55e';
      window.soundEngine.playCorrect();

      this.quizExpBox.classList.remove('is-wrong');
      this.quizExpBox.classList.add('is-correct');
      this.quizExpBox.style.display = 'block';
      this.quizExpBox.innerHTML = usedAutoCorrect
        ? `<strong>🔮 족집게 예상문제집 발동!</strong> 자동으로 정답 처리되었습니다!<br>${quiz.exp}`
        : `<strong>✨ 정답입니다!</strong><br>${quiz.exp}`;

      setTimeout(() => {
        this.quizOverlay.classList.remove('active');
        this.handlePlayerAttackSuccess();
      }, 1400);
    } else {
      btnElem.style.background = 'rgba(239, 68, 68, 0.3)';
      btnElem.style.borderColor = '#ef4444';
      window.soundEngine.playDamage();

      const correctDisplayIdx = order.indexOf(quiz.ans);
      if (allBtns[correctDisplayIdx]) {
        allBtns[correctDisplayIdx].style.borderColor = '#22c55e';
        allBtns[correctDisplayIdx].style.background = 'rgba(34, 197, 94, 0.15)';
        const markSpan = document.createElement('span');
        markSpan.className = 'quiz-correct-mark';
        markSpan.textContent = '✓ 정답';
        allBtns[correctDisplayIdx].appendChild(markSpan);
      }

      this.quizExpBox.classList.remove('is-correct');
      this.quizExpBox.classList.add('is-wrong');
      this.quizExpBox.style.display = 'block';
      this.quizExpBox.innerHTML = `<strong>❌ 아쉽게 틀렸습니다! 정답은 "${quiz.options[quiz.ans]}"입니다.</strong><br>${quiz.exp}`;

      // 오답 해설을 충분히 읽을 수 있도록 정답 처리 때보다 더 오래 보여준 뒤 반격으로 넘어간다.
      setTimeout(() => {
        this.quizOverlay.classList.remove('active');
        this.handlePlayerAttackFail();
      }, 2600);
    }
  }

  // 11. 플레이어 공격 성공 (가변 데미지 + 상성 + 크리티컬)
  handlePlayerAttackSuccess() {
    const cfg = BALANCE_CONFIG.quizAttack;
    const academic = this.state.stats.academic;
    const career = this.state.stats.career;
    const isSkill = (this.state.currentQuizType === 'skill');

    const power = isSkill ? cfg.skill : cfg.normal;
    let basePower = power.min + Math.random() * power.range;
    let damage = basePower * (1 + academic / 100);

    const matchup = this.getMatchupEffectiveness();
    damage = damage * matchup.playerMult;

    const rngVariance = cfg.rngVarianceMin + Math.random() * cfg.rngVarianceRange;
    damage = damage * rngVariance;

    let isCrit = false;
    let critChance = Math.round(career * cfg.critChanceCareerMult + (isSkill ? cfg.critChanceSkillBonus : 0));

    // 보스 2페이즈 기믹: 3년간 쌓은 실력이 발현되어 크리티컬 확률 상승
    const enemy = this.state.currentEnemy;
    if (this.state.isBossWave && this.state.bossPhase === 2 && enemy.bossMechanic && enemy.bossMechanic.playerCritBonusPhase2) {
      critChance += enemy.bossMechanic.playerCritBonusPhase2;
    }
    critChance = Math.min(cfg.critChanceCap, critChance);

    if (Math.random() * 100 < critChance) {
      isCrit = true;
      damage = damage * cfg.critDamageMult;
    }

    const finalDamage = Math.max(cfg.minDamage, Math.round(damage));

    if (isSkill) {
      this.state.skillCooldown = cfg.skillCooldownTurns;
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
      this.state.skillCooldown = BALANCE_CONFIG.quizAttack.skillCooldownTurns;
    }

    // 🛡️ 완벽한 오답 노트: 오답 반격을 1회 완전 무효화
    if (this.state.failInsuranceCharges > 0) {
      this.state.failInsuranceCharges--;
      this.setDialog('🛡️ [완벽한 오답 노트 발동!] 오답 페널티가 무효화되어 몬스터의 반격을 완전히 피했습니다!');
      this.state.battleTurn++;
      if (this.state.skillCooldown > 0) this.state.skillCooldown--;
      this.updateBattleUI();
      return;
    }

    this.setDialog(`개념 혼동으로 공격이 빗나갔다! 몬스터의 반격이 다가온다!`);
    setTimeout(() => {
      this.triggerEnemyTurn(BALANCE_CONFIG.enemyAttack.failPenaltyMult);
    }, 1000);
  }

  // 13. 오답노트 방어 액션
  executeGuardAction() {
    const cfg = BALANCE_CONFIG.guard;
    const enemy = this.state.currentEnemy;
    this.state.isGuarding = true;
    this.elPlayerBox.classList.add('shield-active');

    // 보스 2페이즈 기믹: 위계성 재검증 압박으로 방어 회복 효과 무효화
    const healNullified = this.state.isBossWave && this.state.bossPhase === 2
      && enemy.bossMechanic && enemy.bossMechanic.guardHealNullifyPhase2;

    const baseHeal = cfg.healBase + Math.round(this.state.stats.selfDirected / cfg.healSelfDirectedDivisor);
    const healVal = healNullified ? 0 : Math.round(baseHeal * (cfg.healVarianceMin + Math.random() * cfg.healVarianceRange));

    this.state.playerHp = Math.min(this.state.maxPlayerHp, this.state.playerHp + healVal);
    this.updateBattleUI();

    const reductionPct = Math.round((1 - cfg.enemyDamageMult) * 100);
    if (healNullified) {
      this.setDialog(`🛡️ [방어 태세] 위계성 재검증 압박으로 회복 효과가 무효화되었다! 그래도 적의 공격을 ${reductionPct}% 경감합니다!`);
    } else {
      this.setDialog(`🛡️ [오답노트 방어 태세] 멘탈을 +${healVal} 회복하고 이번 턴 적의 공격을 ${reductionPct}% 경감합니다!`);
    }

    setTimeout(() => {
      this.triggerEnemyTurn();
    }, 1000);
  }

  // 14. 친구 멘토링 찬스 (50:50)
  executeMentorAction() {
    window.soundEngine.playClick();
    if (this.state.mentorUses <= 0) {
      this.showNotice(
        '🤝 멘토링 찬스 소진',
        '친구 멘토링 찬스가 모두 소진되었습니다!<br>보상 카드에서 "찬스 충전" 카드를 선택하면 다시 채울 수 있어요.'
      );
      return;
    }
    this.state.mentorUses--;
    this.updateGlobalHeader();

    this.state.currentQuizType = 'normal';
    this.openQuizModal();

    setTimeout(() => {
      const quiz = this.state.currentQuiz;
      const order = this.state.currentQuizOptionOrder || quiz.options.map((_, i) => i);
      const correctDisplayIdx = order.indexOf(quiz.ans);
      const allBtns = this.quizOptionsList.querySelectorAll('.quiz-option-btn');
      let eliminated = 0;

      allBtns.forEach((btn, idx) => {
        if (idx !== correctDisplayIdx && eliminated < 2) {
          btn.disabled = true;
          btn.style.opacity = '0.2';
          eliminated++;
        }
      });
    }, 200);
  }

  // 15. 몬스터 반격 턴
  triggerEnemyTurn(penaltyMultiplier = 1.0) {
    const cfg = BALANCE_CONFIG.enemyAttack;
    const enemy = this.state.currentEnemy;
    let baseDmg = enemy.attackDmg || cfg.fallbackDmg;

    const matchup = this.getMatchupEffectiveness();
    let dmg = baseDmg * matchup.enemyMult;

    if (this.state.isEnraged) {
      dmg = dmg * BALANCE_CONFIG.enrage.damageMult;
    }

    // 보스 2페이즈 기믹: 공격력 상승
    if (this.state.isBossWave && this.state.bossPhase === 2 && enemy.bossMechanic && enemy.bossMechanic.enemyDmgMultPhase2) {
      dmg = dmg * enemy.bossMechanic.enemyDmgMultPhase2;
    }

    const rngVariance = cfg.rngVarianceMin + Math.random() * cfg.rngVarianceRange;
    dmg = dmg * rngVariance * penaltyMultiplier;

    let isEnemyCrit = false;
    if (Math.random() * 100 < cfg.critChance) {
      isEnemyCrit = true;
      dmg = dmg * cfg.critDamageMult;
    }

    if (this.state.isGuarding) {
      dmg = dmg * BALANCE_CONFIG.guard.enemyDamageMult;
      this.state.isGuarding = false;
      this.elPlayerBox.classList.remove('shield-active');
    }

    const finalDmg = Math.max(cfg.minDamage, Math.round(dmg));

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
      // 1차 쓰러짐: 보장지도 부활 & 그로기 상태 부여
      this.state.isGroggy = true;
      this.state.playerHp = Math.round(this.state.maxPlayerHp * BALANCE_CONFIG.groggy.reviveHpPct);
      window.soundEngine.playDamage();
      this.updateBattleUI();

      this.showNotice(
        '최소성취수준 미도달 위기 경보!',
        `멘탈(HP)이 0이 되어 <strong>[최소성취수준 보장지도 대상자(그로기 상태)]</strong>로 지정되었습니다!<br><br>
        선생님의 특별 보충지도를 이수하며 <strong>멘탈 40%로 기사회생</strong>했지만, 이 상태에서 한 번 더 쓰러지면 과목 <strong>'미이수(I등급)'</strong>로 즉시 최종 탈락(게임 오버)합니다!`,
        '확인하고 재도전하기 ➡️'
      );

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

    const earnedCredits = this.state.isBossWave ? BALANCE_CONFIG.victory.bossCredits : (enemy.credits || BALANCE_CONFIG.victory.defaultSubjectCredits);
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
        credits: enemy.credits || BALANCE_CONFIG.victory.defaultSubjectCredits,
        icon: enemy.icon
      });
    }

    this.updateGlobalHeader();
    this.setDialog(`🎉 [${enemy.name}] 완벽 격파 & 이수 완료! (+${earnedCredits}학점 및 역량 스탯 획득)`);

    setTimeout(() => {
      this.showRewardScreen();
    }, 1200);
  }

  // 18. 보상 카드 선택 화면 (3택 1, 희귀도 가중 추첨)
  showRewardScreen() {
    this.switchView('reward');
    window.soundEngine.playRewardPick();

    this.rewardContainer.innerHTML = '';

    const selectedCards = this.pickRewardCards(3);
    const rarityLabel = { common: '일반', rare: '레어', epic: '에픽' };

    selectedCards.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = `reward-card rarity-${card.rarity}`;
      cardEl.innerHTML = `
        <span class="reward-card-rarity-tag rarity-${card.rarity}">${rarityLabel[card.rarity] || '일반'}</span>
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

  // 희귀도 가중 추첨으로 중복 없는 카드 N장을 뽑음 (일반 60% / 레어 30% / 에픽 10%)
  pickRewardCards(count) {
    const weights = { epic: 10, rare: 30, common: 60 };
    const chosen = [];
    const usedIds = new Set();
    let guard = 0;

    while (chosen.length < count && guard < 200) {
      guard++;
      const roll = Math.random() * 100;
      const rarity = roll < weights.epic ? 'epic' : (roll < weights.epic + weights.rare ? 'rare' : 'common');
      const pool = GAME_DATA.rewardCards.filter(c => c.rarity === rarity && !usedIds.has(c.id));
      if (pool.length === 0) continue;

      const card = pool[Math.floor(Math.random() * pool.length)];
      usedIds.add(card.id);
      chosen.push(card);
    }
    return chosen;
  }

  applyRewardCard(card) {
    const eff = card.effect;

    if (eff.stat && eff.value) {
      this.addStat(eff.stat, eff.value);
    }
    if (eff.stats) {
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
    if (eff.type === 'resetSkillCooldown') {
      this.state.skillCooldown = 0;
    }
    if (eff.type === 'autoCorrect') {
      this.state.autoCorrectCharges += eff.uses || 1;
    }
    if (eff.type === 'failInsurance') {
      this.state.failInsuranceCharges += eff.uses || 1;
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
      const flavor = (GAME_DATA.subjects[s.id] || {}).flavor || '';

      const item = document.createElement('div');
      item.className = 'deck-subject-card';
      if (flavor) item.title = flavor;
      item.innerHTML = `
        <span style="font-size:1.6rem;">${s.icon || '📖'}</span>
        <div>
          <div style="font-weight:700; color:#fff; display:flex; align-items:center; gap:4px;">${s.name} ${elemBadge}</div>
          <div style="font-size:0.75rem; color:#94a3b8;">${s.categoryName} (${s.credits}학점)</div>
          ${flavor ? `<div class="deck-subject-flavor">${flavor}</div>` : ''}
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
    this.clearSave();
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
    this.clearSave();
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
    this.refreshContinueButton();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new CreditRogueGame();
});
