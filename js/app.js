// ============================================================
// PC FORGE - Main Application
// ============================================================

const App = (() => {

  // ─── State ───────────────────────────────────────────────
  let state = {
    view: 'home',           // home | wizard | result | notebook | manual | contact | faq
    wizardStep: 1,
    totalSteps: 4,
    answers: {},
    currentBuild: null,
    currentNotebook: null,
    manualSelections: {},
    darkMode: true,
    userLevel: 'beginner',  // beginner | advanced
    lastPriceUpdate: null
  };

  // ─── Init ─────────────────────────────────────────────────
  function init() {
    // Apply dynamic prices before anything else
    state.lastPriceUpdate = PriceEngine.applyToComponents();

    // Schedule hourly price refresh
    setInterval(() => {
      state.lastPriceUpdate = PriceEngine.forceRefresh();
      if (state.view === 'home' || state.view === 'manual') render();
      updatePriceBanner();
    }, 60 * 60 * 1000);

    // Check for shared build in URL
    const params = new URLSearchParams(window.location.search);
    const sharedBuild = params.get('build');
    if (sharedBuild) {
      const build = BuildEngine.loadSharedBuild(sharedBuild);
      if (build) {
        state.currentBuild = build;
        navigate('result');
        return;
      }
      params.delete('build');
      const cleanQuery = params.toString();
      const cleanUrl = `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ''}${window.location.hash}`;
      window.history.replaceState(null, '', cleanUrl);
    }

    render();
    bindGlobalEvents();
  }

  // ─── Navigation ──────────────────────────────────────────
  function navigate(view, extra = {}) {
    state.view = view;
    Object.assign(state, extra);
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Render router ───────────────────────────────────────
  function render() {
    const app = document.getElementById('app');
    switch (state.view) {
      case 'home':     app.innerHTML = renderHome(); break;
      case 'wizard':   app.innerHTML = renderWizard(); break;
      case 'result':   app.innerHTML = renderResult(); break;
      case 'notebook': app.innerHTML = renderNotebook(); break;
      case 'manual':   app.innerHTML = renderManual(); break;
      case 'contact':  app.innerHTML = renderContact(); break;
      case 'faq':      app.innerHTML = renderFAQ(); break;
      default:         app.innerHTML = renderHome();
    }
    bindViewEvents();
    updatePriceBanner();
  }

  // ─── HOME ────────────────────────────────────────────────
  function renderHome() {
    return `
    <div class="page home-page">
      <div class="hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="logo-wrap">
            <span class="logo-icon">⚙️</span>
            <h1 class="logo-text">PC<span class="accent">Forge</span></h1>
          </div>
          <p class="hero-tagline">Monte o PC dos seus sonhos com inteligência.</p>
          <p class="hero-sub">Do iniciante ao expert — encontre a configuração perfeita para você.</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" id="btn-start">
              <span>🚀</span> Começar Montagem
            </button>
            <button class="btn btn-outline btn-lg" id="btn-manual">
              <span>⚙️</span> Modo Avançado
            </button>
          </div>
        </div>
        <div class="hero-visual">
          ${renderHeroVisual()}
        </div>
      </div>

      ${renderPartnershipNotice()}

      <div class="features-section">
        <h2 class="section-title">Por que PC Forge?</h2>
        <div class="features-grid">
          ${[
            ['🧠', 'Montagem Inteligente', 'Sistema seleciona os melhores componentes compatíveis automaticamente.'],
            ['🔍', 'Explicações Detalhadas', 'Cada peça explicada de forma simples, mesmo para iniciantes.'],
            ['💰', 'Estimativa de Custo', 'Veja o preço de cada componente e o total do seu build.'],
            ['📊', 'Simulação de Performance', 'Saiba quais jogos e softwares seu PC vai rodar com folga.'],
            ['🔁', 'Alternativas Inteligentes', 'Opções mais baratas e mais potentes para cada componente.'],
            ['🧩', 'Compatibilidade Garantida', 'Alertas em tempo real sobre incompatibilidades no seu build.'],
          ].map(([icon, title, desc]) => `
            <div class="feature-card">
              <div class="feature-icon">${icon}</div>
              <h3>${title}</h3>
              <p>${desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </div>`;
  }

  function renderPartnershipNotice(compact = false) {
    const titleId = compact ? 'result-partnership-title' : 'home-partnership-title';
    return `
      <aside class="home-notice ${compact ? 'result-notice' : ''}" aria-labelledby="${titleId}">
        <div class="home-notice-icon" aria-hidden="true">${compact ? '🤝' : '💡'}</div>
        <div class="home-notice-content">
          <span class="home-notice-label">${compact ? 'Um lembrete' : 'Importante'}</span>
          <h2 id="${titleId}">${compact ? 'Somos um assistente, não uma loja' : 'Somos seu assistente de escolha'}</h2>
          <p>
            O PC Forge ajuda você a entender e planejar sua configuração.
            No momento, não vendemos computadores, notebooks ou componentes.
            Lojas, profissionais e empresas interessados em colaborar são muito bem-vindos.
          </p>
        </div>
        <button class="btn btn-outline home-notice-action" id="btn-go-contact">
          🤝 Quero ser parceiro
        </button>
      </aside>`;
  }

  function renderHeroVisual() {
    return `
    <div class="pc-visual">
      <div class="pc-case">
        <div class="pc-window">
          <div class="pc-internals">
            <div class="comp-slot mobo">🟦 Placa-mãe</div>
            <div class="comp-slot cpu">🔷 CPU</div>
            <div class="comp-slot gpu">🟣 GPU</div>
            <div class="comp-slot ram">🟩 RAM x2</div>
            <div class="comp-slot ssd">⬜ SSD NVMe</div>
          </div>
        </div>
        <div class="pc-lights">
          <span class="rgb-light r1"></span>
          <span class="rgb-light r2"></span>
          <span class="rgb-light r3"></span>
        </div>
      </div>
    </div>`;
  }

  // ─── WIZARD ──────────────────────────────────────────────
  function renderWizard() {
    const step = state.wizardStep;
    const steps = ['Dispositivo', 'Objetivo', 'Intensidade', 'Orçamento'];

    return `
    <div class="page wizard-page">
      <div class="wizard-header">
        <button class="btn btn-ghost" id="btn-back-home">← Voltar</button>
        <h2>Configurar Build</h2>
        <div class="step-count">Passo ${step}/${state.totalSteps}</div>
      </div>

      <div class="wizard-progress">
        ${steps.map((s, i) => `
          <div class="step-item ${i + 1 === step ? 'active' : i + 1 < step ? 'done' : ''}">
            <div class="step-dot">${i + 1 < step ? '✓' : i + 1}</div>
            <span>${s}</span>
          </div>
        `).join('<div class="step-line"></div>')}
      </div>

      <div class="wizard-body">
        ${renderWizardStep(step)}
      </div>
    </div>`;
  }

  function renderWizardStep(step) {
    const a = state.answers;
    switch (step) {
      case 1: return `
        <div class="wizard-step" data-step="1">
          <h3>Que tipo de dispositivo você quer?</h3>
          <p class="step-desc">Isso define como vamos montar seu setup.</p>
          <div class="option-grid">
            ${[
              ['desktop', '🖥️', 'PC Desktop', 'Montagem personalizada, upgradável e mais potente por real.'],
              ['notebook', '💻', 'Notebook', 'Portátil, pronto para usar. Recomendamos o melhor modelo.'],
            ].map(([val, icon, label, desc]) => `
              <button class="option-card ${a.deviceType === val ? 'selected' : ''}" 
                      data-answer="deviceType" data-value="${val}">
                <div class="opt-icon">${icon}</div>
                <div class="opt-label">${label}</div>
                <div class="opt-desc">${desc}</div>
              </button>
            `).join('')}
          </div>
        </div>`;

      case 2: return `
        <div class="wizard-step" data-step="2">
          <h3>Qual será o principal uso?</h3>
          <p class="step-desc">Selecione a finalidade principal do seu ${a.deviceType === 'notebook' ? 'notebook' : 'PC'}.</p>
          <div class="option-grid">
            ${[
              ['gamer', '🎮', 'Gaming', 'Jogos, streaming e entretenimento.'],
              ['office', '💼', 'Trabalho/Escritório', 'Produtividade, criação de conteúdo e uso profissional.'],
            ].map(([val, icon, label, desc]) => `
              <button class="option-card ${a.useType === val ? 'selected' : ''}" 
                      data-answer="useType" data-value="${val}">
                <div class="opt-icon">${icon}</div>
                <div class="opt-label">${label}</div>
                <div class="opt-desc">${desc}</div>
              </button>
            `).join('')}
          </div>
        </div>`;

      case 3: {
        const isGamer = a.useType === 'gamer';
        const options = isGamer ? [
          ['light',   '🟢', 'Gamer Leve',   'CS2, Valorant, Minecraft, LoL. 60-144 FPS em 1080p.'],
          ['medium',  '🔵', 'Gamer Médio',  'GTA V, Apex, Fortnite. 60+ FPS em 1440p.'],
          ['heavy',   '🟣', 'Gamer Pesado', 'Cyberpunk, RDR2, Flight Sim. Alta qualidade 1440p/4K.'],
          ['extreme', '🔴', 'Extremo/Pro',  'Máximo de tudo. 4K@144Hz, Ray Tracing, streaming.'],
        ] : [
          ['light',   '🟢', 'Uso Leve',      'Excel, e-mail, reuniões online, navegação web.'],
          ['medium',  '🔵', 'Uso Médio',     'Power BI, Photoshop básico, programação, multitarefa.'],
          ['heavy',   '🟣', 'Uso Pesado',    'Edição de vídeo, renderização, múltiplas VMs.'],
          ['extreme', '🔴', 'Workstation',   'Render 3D profissional, Machine Learning, edição 4K/8K.'],
        ];
        return `
        <div class="wizard-step" data-step="3">
          <h3>Qual a intensidade de uso?</h3>
          <p class="step-desc">Isso define o nível de desempenho que seu ${a.deviceType === 'notebook' ? 'notebook' : 'PC'} precisa ter.</p>
          <div class="option-grid four">
            ${options.map(([val, icon, label, desc]) => `
              <button class="option-card ${a.intensity === val ? 'selected' : ''}" 
                      data-answer="intensity" data-value="${val}">
                <div class="opt-icon">${icon}</div>
                <div class="opt-label">${label}</div>
                <div class="opt-desc">${desc}</div>
              </button>
            `).join('')}
          </div>
        </div>`;
      }

      case 4: return `
        <div class="wizard-step" data-step="4">
          <h3>Qual seu nível de conhecimento?</h3>
          <p class="step-desc">Isso define como apresentamos as informações do seu build.</p>
          <div class="option-grid">
            ${[
              ['beginner', '🎓', 'Iniciante', 'Explicações detalhadas, linguagem simples, guiado passo a passo.'],
              ['advanced', '🛠️', 'Avançado',  'Especificações técnicas completas e modo de customização manual.'],
            ].map(([val, icon, label, desc]) => `
              <button class="option-card ${a.userLevel === val ? 'selected' : ''}" 
                      data-answer="userLevel" data-value="${val}">
                <div class="opt-icon">${icon}</div>
                <div class="opt-label">${label}</div>
                <div class="opt-desc">${desc}</div>
              </button>
            `).join('')}
          </div>
          <div class="wizard-nav">
            <button class="btn btn-outline" id="btn-prev-step">← Anterior</button>
            <button class="btn btn-primary btn-lg ${!a.userLevel ? 'disabled' : ''}" 
                    id="btn-generate" ${!a.userLevel ? 'disabled' : ''}>
              ⚡ Gerar Meu Build
            </button>
          </div>
        </div>`;

      default: return '';
    }
  }

  // ─── RESULT PAGE ─────────────────────────────────────────
  function renderResult() {
    const b = state.currentBuild;
    if (!b) return '<div class="page"><p>Build não encontrado.</p></div>';
    const advanced = state.userLevel === 'advanced' || state.answers?.userLevel === 'advanced';
    return `
    <div class="page result-page">
      <div class="result-header">
        <button class="btn btn-ghost" id="btn-back-home">← Início</button>
        <div class="result-title-wrap">
          <h2 class="result-title">🖥️ ${b.name}</h2>
          <span class="perf-badge badge-${b.perfLevel?.toLowerCase().replace('ó','o').replace('â','a').replace('é','e')}">${b.perfLevel}</span>
        </div>
        <div class="result-actions-top">
          <button class="btn btn-pdf btn-sm" id="btn-download-pdf">📄 Baixar PDF</button>
          <button class="btn btn-outline btn-sm" id="btn-share-build">🔗 Compartilhar</button>
          <button class="btn btn-outline btn-sm" id="btn-new-build">🔄 Novo Build</button>
        </div>
      </div>

      <!-- Summary Bar -->
      <div class="summary-bar">
        <div class="summary-item">
          <span class="sum-label">💰 Investimento Total</span>
          <span class="sum-value price-total">${formatPrice(b.totalPrice)}</span>
        </div>
        <div class="summary-item">
          <span class="sum-label">⚡ Consumo</span>
          <span class="sum-value">${b.powerUsage}W</span>
        </div>
        <div class="summary-item">
          <span class="sum-label">📊 Performance</span>
          <span class="sum-value">${b.performance?.level || 'N/A'}</span>
        </div>
        <div class="summary-item">
          <span class="sum-label">🧩 Compatibilidade</span>
          <span class="sum-value ${b.compatibility.valid ? 'text-success' : 'text-warning'}">
            ${b.compatibility.valid ? '✅ OK' : `⚠️ ${b.compatibility.issues.length} aviso(s)`}
          </span>
        </div>
      </div>

      <!-- Components Grid -->
      <section class="section">
        <h3 class="section-title">🔧 Componentes</h3>
        <div class="components-grid">
          ${renderComponentCards(b, advanced)}
        </div>
      </section>

      <!-- Compatibility -->
      <section class="section">
        <h3 class="section-title">🧩 Verificação de Compatibilidade</h3>
        <div class="compat-list">
          ${b.compatibility.ok.map(item => `
            <div class="compat-item ok">
              <span class="compat-icon">✅</span>
              <div><strong>${item.label}</strong><br><small>${item.detail}</small></div>
            </div>
          `).join('')}
          ${b.compatibility.issues.map(item => `
            <div class="compat-item issue">
              <span class="compat-icon">⚠️</span>
              <div><strong>${item.label}</strong><br><small>${item.detail}</small></div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Bottlenecks & Alerts -->
      ${b.bottlenecks?.alerts?.length > 0 ? `
      <section class="section">
        <h3 class="section-title">💡 Análise do Build</h3>
        <div class="alerts-list">
          ${b.bottlenecks.alerts.map(a => `
            <div class="alert-card alert-${a.type}">
              <span class="alert-icon">${a.icon}</span>
              <div>
                <strong>${a.title}</strong>
                <p>${a.detail}</p>
              </div>
            </div>
          `).join('')}
        </div>
        ${b.bottlenecks.upgrades?.length > 0 ? `
        <div class="upgrades-box">
          <h4>🚀 Upgrades Futuros Sugeridos</h4>
          <ul>${b.bottlenecks.upgrades.map(u => `<li>${u}</li>`).join('')}</ul>
        </div>` : ''}
      </section>` : ''}

      <!-- Performance -->
      ${renderPerformanceSection(b)}

      <!-- PC Visual -->
      <section class="section">
        <h3 class="section-title">🖥️ Preview do Setup</h3>
        ${renderPCPreview(b)}
      </section>

      <!-- Price Breakdown -->
      <section class="section">
        <h3 class="section-title">💰 Custo por Componente</h3>
        ${renderPriceBreakdown(b)}
      </section>

      <!-- Bottom actions -->
      <div class="result-footer">
        <button class="btn btn-outline" id="btn-customize">⚙️ Personalizar Build</button>
        <button class="btn btn-primary" id="btn-new-build-2">🔄 Novo Build</button>
      </div>

      ${renderPartnershipNotice(true)}
    </div>`;
  }

  function renderComponentCards(build, advanced) {
    const labels = {
      cpu: { icon: '🔷', label: 'Processador (CPU)' },
      gpu: { icon: '🟣', label: 'Placa de Vídeo (GPU)' },
      motherboard: { icon: '🟦', label: 'Placa-Mãe' },
      ram: { icon: '🟩', label: 'Memória RAM' },
      storage: { icon: '💾', label: 'Armazenamento' },
      psu: { icon: '⚡', label: 'Fonte de Energia' },
      case: { icon: '🖥️', label: 'Gabinete' },
      cooling: { icon: '❄️', label: 'Refrigeração' }
    };

    return Object.entries(build.components).map(([type, comp]) => {
      if (!comp) return '';
      const meta = labels[type] || { icon: '🔧', label: type };
      const alts = build.alternatives?.[type];

      return `
      <div class="comp-card">
        <div class="comp-card-header">
          <span class="comp-type-icon">${meta.icon}</span>
          <div>
            <div class="comp-type-label">${meta.label}</div>
            <div class="comp-name">${comp.name}</div>
            <div class="comp-brand">${comp.brand}</div>
          </div>
          <div class="comp-price-tag">${formatPrice(comp.price)}</div>
        </div>

        ${comp.tag ? `<span class="comp-badge">${comp.tag}</span>` : ''}

        <div class="comp-why">
          <span class="why-icon">💡</span>
          <p>${comp.why}</p>
        </div>

        ${advanced ? renderCompSpecs(type, comp) : ''}

        ${alts && (alts.cheaper || alts.powerful) ? `
        <div class="comp-alts">
          <div class="alts-title">Alternativas:</div>
          <div class="alts-row">
            ${alts.cheaper ? `
              <button class="alt-btn cheaper" 
                      data-type="${type}" data-id="${alts.cheaper.id}"
                      title="${alts.cheaper.name}">
                💚 Mais Barata<br>
                <small>${alts.cheaper.name}</small><br>
                <strong>${formatPrice(alts.cheaper.price)}</strong>
              </button>` : ''}
            ${alts.powerful ? `
              <button class="alt-btn powerful" 
                      data-type="${type}" data-id="${alts.powerful.id}"
                      title="${alts.powerful.name}">
                🔥 Mais Potente<br>
                <small>${alts.powerful.name}</small><br>
                <strong>${formatPrice(alts.powerful.price)}</strong>
              </button>` : ''}
          </div>
        </div>` : ''}
      </div>`;
    }).join('');
  }

  function renderCompSpecs(type, comp) {
    let specs = [];
    if (type === 'cpu') {
      specs = [`${comp.cores} núcleos / ${comp.threads} threads`, `Boost: ${comp.boostGHz}GHz`, `TDP: ${comp.tdp}W`, `Socket: ${comp.socket}`];
    } else if (type === 'gpu') {
      specs = [`VRAM: ${comp.vram}GB`, `TDP: ${comp.tdp}W`, `Score: ${comp.perfScore}/100`];
    } else if (type === 'ram') {
      specs = [`${comp.capacityGB}GB ${comp.type}`, `${comp.speedMHz}MHz`, `${comp.sticks}x módulos`];
    } else if (type === 'storage') {
      specs = [`${comp.type}`, `${comp.capacityGB}GB`, `Leitura: ${comp.readMBs}MB/s`];
    } else if (type === 'psu') {
      specs = [`${comp.wattage}W`, comp.rating, comp.modular ? 'Modular' : 'Não-modular'];
    } else if (type === 'motherboard') {
      specs = [`Socket: ${comp.socket}`, `Chipset: ${comp.chipset}`, `RAM: ${comp.ramType}`, `Form: ${comp.formFactor}`];
    } else if (type === 'cooling') {
      specs = [`Tipo: ${comp.type}`, `TDP máx: ${comp.tdpRating}W`];
    }
    if (!specs.length) return '';
    return `<div class="comp-specs">${specs.map(s => `<span class="spec-tag">${s}</span>`).join('')}</div>`;
  }

  function renderPerformanceSection(build) {
    const perf = build.performance;
    if (!perf) return '';

    const isGamer = build.answers?.useType === 'gamer' || build.components.gpu?.id !== 'igpu';

    return `
    <section class="section">
      <h3 class="section-title">📊 Simulação de Desempenho</h3>

      <div class="perf-overview">
        <div class="perf-score-wrap">
          <div class="perf-score-circle">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#1a1a2e" stroke-width="10"/>
              <circle cx="60" cy="60" r="52" fill="none" stroke="#6c63ff" stroke-width="10"
                stroke-dasharray="${(perf.overallScore / 100) * 327} 327"
                stroke-linecap="round" transform="rotate(-90 60 60)"/>
            </svg>
            <div class="score-inner">
              <span class="score-num">${perf.overallScore}</span>
              <span class="score-label">Score</span>
            </div>
          </div>
          <div class="perf-level-label">${perf.level}</div>
        </div>

        <div class="perf-software">
          <h4>✅ Softwares Suportados</h4>
          <ul class="software-list">
            ${perf.software.map(s => `<li>🟢 ${s}</li>`).join('')}
          </ul>
        </div>
      </div>

      ${isGamer && perf.games?.length > 0 ? `
      <h4 class="games-title">🎮 FPS Estimado em 1080p (Ultra/Alto)</h4>
      <div class="games-grid">
        ${perf.games.map(g => `
          <div class="game-card">
            <div class="game-name">${g.game}</div>
            <div class="game-fps-bar">
              <div class="fps-fill" style="width:${Math.min(g.fps, 300) / 3}%; background:${g.color}"></div>
            </div>
            <div class="game-fps" style="color:${g.color}">${g.fps > 0 ? g.fps + ' FPS' : 'N/A'}</div>
            <div class="game-rating" style="color:${g.color}">${g.rating}</div>
          </div>
        `).join('')}
      </div>` : ''}
    </section>`;
  }

  function renderPCPreview(build) {
    const comps = build.components;
    return `
    <div class="pc-preview-wrap">
      <div class="pc-preview-case">
        <div class="preview-window">
          <div class="preview-internals">
            ${comps.motherboard ? `<div class="prev-comp prev-mobo">🟦 ${comps.motherboard.brand} ${comps.motherboard.chipset}</div>` : ''}
            <div class="prev-row">
              ${comps.cpu ? `<div class="prev-comp prev-cpu">🔷 ${comps.cpu.brand} ${comps.cpu.name.split(' ').slice(-1)}</div>` : ''}
              ${comps.cooling ? `<div class="prev-comp prev-cool">❄️ ${comps.cooling.type}</div>` : ''}
            </div>
            ${comps.gpu && comps.gpu.id !== 'igpu' ? `<div class="prev-comp prev-gpu">🟣 ${comps.gpu.brand} ${comps.gpu.name.split(' ').slice(-1)}</div>` : ''}
            <div class="prev-row">
              ${comps.ram ? `<div class="prev-comp prev-ram">🟩 ${comps.ram.capacityGB}GB ${comps.ram.type}</div>` : ''}
              ${comps.storage ? `<div class="prev-comp prev-ssd">💾 ${comps.storage.type}</div>` : ''}
            </div>
            ${comps.psu ? `<div class="prev-comp prev-psu">⚡ ${comps.psu.wattage}W ${comps.psu.rating}</div>` : ''}
          </div>
        </div>
        <div class="preview-lights">
          <span class="rgb-dot a1"></span>
          <span class="rgb-dot a2"></span>
          <span class="rgb-dot a3"></span>
          <span class="rgb-dot a4"></span>
        </div>
      </div>
      <div class="preview-case-label">${comps.case?.name || 'Gabinete ATX'}</div>
    </div>`;
  }

  function renderPriceBreakdown(build) {
    const labels = { cpu: 'CPU', gpu: 'GPU', motherboard: 'Placa-mãe', ram: 'RAM', storage: 'Armazenamento', psu: 'Fonte', case: 'Gabinete', cooling: 'Refrigeração' };
    const entries = Object.entries(build.components).filter(([, v]) => v && v.price > 0);
    const total = build.totalPrice;

    return `
    <div class="price-breakdown">
      ${entries.map(([type, comp]) => {
        const pct = Math.round((comp.price / total) * 100);
        return `
        <div class="price-row">
          <span class="price-label">${labels[type] || type}</span>
          <div class="price-bar-wrap">
            <div class="price-bar" style="width:${pct}%"></div>
          </div>
          <span class="price-pct">${pct}%</span>
          <span class="price-val">${formatPrice(comp.price)}</span>
        </div>`;
      }).join('')}
      <div class="price-total-row">
        <span>Total</span>
        <span class="price-total-val">${formatPrice(total)}</span>
      </div>
    </div>`;
  }

  // ─── NOTEBOOK PAGE ───────────────────────────────────────
  function renderNotebook() {
    const nb = state.currentNotebook;
    if (!nb) return '<div class="page"><p>Notebook não encontrado.</p></div>';

    const alternatives = NOTEBOOKS.filter(n => n.category === nb.category && n.id !== nb.id);

    return `
    <div class="page result-page notebook-page">
      <div class="result-header">
        <button class="btn btn-ghost" id="btn-back-home">← Início</button>
        <h2>💻 Notebook Recomendado</h2>
        <div class="result-actions-top">
          <button class="btn btn-pdf btn-sm" id="btn-download-notebook-pdf">📄 Baixar PDF</button>
          <button class="btn btn-outline btn-sm" id="btn-new-build">🔄 Nova Busca</button>
        </div>
      </div>

      <div class="nb-main-card">
        <div class="nb-header">
          <div class="nb-title-wrap">
            <h3>${nb.name}</h3>
            <div class="nb-tags">
              <span class="perf-badge">${nb.category === 'gamer' ? '🎮 Gamer' : '💼 Trabalho'}</span>
              <span class="perf-badge badge-${nb.tier <= 1 ? 'basico' : nb.tier === 2 ? 'intermediario' : nb.tier === 3 ? 'avancado' : 'profissional'}">
                ${['', 'Básico', 'Intermediário', 'Avançado', 'Profissional'][nb.tier]}
              </span>
            </div>
          </div>
          <div class="nb-price">${formatPrice(nb.price)}</div>
        </div>

        <div class="nb-specs-grid">
          ${[
            ['🔷', 'Processador', nb.cpu],
            ['🟣', 'Placa de Vídeo', nb.gpu],
            ['🟩', 'Memória RAM', nb.ram],
            ['💾', 'Armazenamento', nb.storage],
            ['🖥️', 'Tela', nb.display],
            ['🔋', 'Bateria', nb.battery],
            ['⚖️', 'Peso', nb.weight],
          ].map(([icon, label, val]) => `
            <div class="nb-spec-item">
              <span class="nb-spec-icon">${icon}</span>
              <div>
                <div class="nb-spec-label">${label}</div>
                <div class="nb-spec-val">${val}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="nb-why">
          <h4>💡 Por que este notebook?</h4>
          <p>${nb.why}</p>
        </div>

        <div class="nb-pros-cons">
          <div class="pros-block">
            <h4>✅ Pontos Positivos</h4>
            <ul>${nb.pros.map(p => `<li>${p}</li>`).join('')}</ul>
          </div>
          <div class="cons-block">
            <h4>❌ Pontos de Atenção</h4>
            <ul>${nb.cons.map(c => `<li>${c}</li>`).join('')}</ul>
          </div>
        </div>

        ${(nb.games || nb.software) ? `
        <div class="nb-perf">
          <h4>📊 Desempenho</h4>
          ${nb.games ? `
            <div class="nb-games">
              ${Object.entries(nb.games).map(([k, v]) => `
                <div class="nb-game-row">
                  <span>${k.replace('_', ' ').replace('1080p', '1080p ')}</span>
                  <div class="fps-bar-sm"><div style="width:${Math.min(v, 200) / 2}%"></div></div>
                  <span>~${v} FPS</span>
                </div>`).join('')}
            </div>` : ''}
          ${nb.software ? `
            <div class="nb-software">
              <h4>💻 Softwares Compatíveis</h4>
              <div class="software-tags">${nb.software.map(s => `<span class="sw-tag">${s}</span>`).join('')}</div>
            </div>` : ''}
        </div>` : ''}
      </div>

      ${alternatives.length > 0 ? `
      <section class="section">
        <h3 class="section-title">🔁 Outras Opções</h3>
        <div class="nb-alts-grid">
          ${alternatives.map(nb2 => `
            <div class="nb-alt-card" data-nb="${nb2.id}">
              <div class="nb-alt-name">${nb2.name}</div>
              <div class="nb-alt-specs">${nb2.cpu} · ${nb2.gpu}</div>
              <div class="nb-alt-price">${formatPrice(nb2.price)}</div>
              <div class="nb-alt-tag">${['', 'Básico', 'Intermediário', 'Avançado', 'Profissional'][nb2.tier]}</div>
              <button class="btn btn-outline btn-sm" data-nb-select="${nb2.id}">Ver detalhes →</button>
            </div>
          `).join('')}
        </div>
      </section>` : ''}
    </div>`;
  }

  // ─── MANUAL MODE ─────────────────────────────────────────
  function renderManual() {
    const sel = state.manualSelections;
    const types = [
      { key: 'cpu', icon: '🔷', label: 'Processador (CPU)' },
      { key: 'gpu', icon: '🟣', label: 'Placa de Vídeo (GPU)' },
      { key: 'motherboard', icon: '🟦', label: 'Placa-Mãe' },
      { key: 'ram', icon: '🟩', label: 'Memória RAM' },
      { key: 'storage', icon: '💾', label: 'Armazenamento' },
      { key: 'psu', icon: '⚡', label: 'Fonte de Energia' },
      { key: 'case', icon: '🖥️', label: 'Gabinete' },
      { key: 'cooling', icon: '❄️', label: 'Refrigeração' }
    ];

    const partialBuild = {};
    types.forEach(({ key }) => {
      if (sel[key]) partialBuild[key] = getComponentById(key, sel[key]);
    });
    const total = BuildEngine.calcTotal(partialBuild);
    const compat = Object.keys(partialBuild).length >= 2
      ? BuildEngine.checkCompatibility(partialBuild)
      : null;
    const power = BuildEngine.calcPowerUsage(partialBuild);
    const allSelected = types.every(({ key }) => sel[key]);

    return `
    <div class="page manual-page">
      <div class="manual-header">
        <button class="btn btn-ghost" id="btn-back-home">← Início</button>
        <h2>⚙️ Modo Avançado — Montagem Manual</h2>
      </div>

      <div class="manual-layout">
        <div class="manual-components">
          ${types.map(({ key, icon, label }) => {
            const options = COMPONENTS[key] || [];
            const current = sel[key] ? getComponentById(key, sel[key]) : null;
            return `
            <div class="manual-section">
              <div class="manual-section-header">
                <span>${icon} ${label}</span>
                ${current ? `<span class="manual-price">${formatPrice(current.price)}</span>` : ''}
              </div>
              <select class="comp-select" data-comp="${key}">
                <option value="">— Selecionar —</option>
                ${options.map(opt => `
                  <option value="${opt.id}" ${sel[key] === opt.id ? 'selected' : ''}>
                    ${opt.name} — ${formatPrice(opt.price)}
                  </option>
                `).join('')}
              </select>
              ${current ? `
                <div class="manual-selected-info">
                  <span class="sel-tag">${current.tag || ''}</span>
                  <span class="sel-why">${current.why}</span>
                </div>` : ''}
            </div>`;
          }).join('')}
        </div>

        <div class="manual-sidebar">
          <div class="sidebar-card">
            <h4>💰 Total Estimado</h4>
            <div class="sidebar-total">${formatPrice(total)}</div>
          </div>

          <div class="sidebar-card">
            <h4>⚡ Consumo Estimado</h4>
            <div class="sidebar-stat">${power}W</div>
          </div>

          ${compat ? `
          <div class="sidebar-card">
            <h4>🧩 Compatibilidade</h4>
            <div class="compat-mini">
              ${compat.issues.map(i => `
                <div class="compat-mini-item issue">⚠️ ${i.label}: ${i.detail}</div>
              `).join('')}
              ${compat.ok.map(i => `
                <div class="compat-mini-item ok">✅ ${i.label}</div>
              `).join('')}
            </div>
          </div>` : ''}

          <button class="btn btn-primary full-width ${!allSelected ? 'disabled' : ''}" 
                  id="btn-build-manual" ${!allSelected ? 'disabled' : ''}>
            ⚡ Ver Build Completo
          </button>
          <button class="btn btn-outline full-width" id="btn-auto-build">
            🧠 Sugerir Automaticamente
          </button>
        </div>
      </div>
    </div>`;
  }

  // ─── CONTACT PAGE ────────────────────────────────────────
  function renderContact() {
    return `
    <div class="page contact-page">
      <div class="page-header">
        <button class="btn btn-ghost" id="btn-back-home">← Início</button>
        <h2>✉️ Fale Conosco</h2>
      </div>

      <div class="contact-layout">
        <div class="contact-form-wrap">
          <div class="contact-intro">
            <p>Tem dúvidas, sugestões ou encontrou algum problema? Envie sua mensagem e responderei em breve.</p>
          </div>

          <form class="contact-form" id="contact-form"
                action="https://formsubmit.co/ajax/lucas.gomes.rosendo@gmail.com"
                method="POST">

            <input type="hidden" name="_subject" value="PC Forge — Nova mensagem de contato" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="true" />
            <div class="contact-honeypot" aria-hidden="true">
              <label for="contact-website">Não preencha este campo</label>
              <input type="text" id="contact-website" name="_honey"
                     tabindex="-1" autocomplete="off" />
            </div>

            <div class="form-group">
              <label for="contact-name">Seu nome *</label>
              <input type="text" id="contact-name" name="name"
                     placeholder="Ex: João Silva" minlength="2" maxlength="80"
                     autocomplete="name" required />
            </div>

            <div class="form-group">
              <label for="contact-email">Seu e-mail *</label>
              <input type="email" id="contact-email" name="email"
                     placeholder="seu@email.com" maxlength="254"
                     autocomplete="email" required />
            </div>

            <div class="form-group">
              <label for="contact-subject">Assunto *</label>
              <select id="contact-subject" name="subject" required>
                <option value="">— Selecione —</option>
                <option value="Dúvida sobre montagem">Dúvida sobre montagem</option>
                <option value="Sugestão de melhoria">Sugestão de melhoria</option>
                <option value="Erro ou bug no sistema">Erro ou bug no sistema</option>
                <option value="Componente desatualizado">Componente desatualizado</option>
                <option value="Parceria ou negócio">Parceria ou negócio</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="contact-msg">Mensagem *</label>
              <textarea id="contact-msg" name="message" rows="5"
                        placeholder="Escreva sua mensagem aqui..."
                        minlength="10" maxlength="3000" required></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-lg full-width" id="btn-contact-submit">
              📨 Enviar Mensagem
            </button>

            <div id="contact-feedback" class="contact-feedback" style="display:none"></div>
          </form>
        </div>

        <div class="contact-info">
          <div class="contact-card">
            <div class="contact-card-icon">⚙️</div>
            <h3>PC Forge</h3>
            <p>Assistente inteligente de montagem de PCs para todos os níveis.</p>
          </div>
          <div class="contact-card">
            <div class="contact-card-icon">👤</div>
            <h3>Criador</h3>
            <p>Lucas Gomes<br>Brasil · 2026</p>
          </div>
          <div class="contact-card">
            <div class="contact-card-icon">⏱️</div>
            <h3>Tempo de resposta</h3>
            <p>Respondemos em até <strong>48 horas</strong> nos dias úteis.</p>
          </div>
          <div class="contact-card">
            <div class="contact-card-icon">💡</div>
            <h3>Antes de enviar</h3>
            <p>Confira a nossa <button class="btn-link" id="btn-go-faq">página de FAQ</button> — sua dúvida pode já estar respondida!</p>
          </div>
        </div>
      </div>
    </div>`;
  }

  // ─── FAQ PAGE ─────────────────────────────────────────────
  function renderFAQ() {
    const faqs = [
      {
        cat: '🚀 Primeiros passos',
        items: [
          { q: 'O que é o PC Forge?', a: 'É um assistente que ajuda você a escolher as peças de um computador ou encontrar um notebook de acordo com seu uso e orçamento.' },
          { q: 'Preciso entender de computadores para usar?', a: 'Não. A montagem guiada faz perguntas simples e explica cada escolha. Quem já conhece hardware pode usar o Modo Avançado.' },
          { q: 'O PC Forge é gratuito?', a: 'Sim. Você pode montar e exportar configurações sem pagar e sem criar uma conta.' },
          { q: 'Preciso criar uma conta ou fazer login?', a: 'Não. O PC Forge funciona como um assistente e não exige conta, login ou senha.' },
          { q: 'Funciona no celular?', a: 'Sim. O site se adapta a celulares, tablets e computadores.' },
          { q: 'Como começo uma configuração?', a: 'Clique em “Montar”, responda às perguntas sobre uso, nível e orçamento e depois escolha “Gerar minha configuração”.' },
        ]
      },
      {
        cat: '🧭 Montagem guiada e Modo Avançado',
        items: [
          { q: 'Qual é a diferença entre os dois modos?', a: 'A montagem guiada recomenda uma configuração completa. No Modo Avançado, você escolhe cada componente manualmente e acompanha preço, consumo e compatibilidade.' },
          { q: 'O que muda entre uso casual e profissional?', a: 'O uso casual prioriza economia e tarefas do dia a dia. O profissional reserva mais desempenho para programas pesados, multitarefa e trabalhos longos.' },
          { q: 'Qual é a diferença entre PC gamer e PC para trabalho?', a: 'Jogos normalmente exigem mais da placa de vídeo. Trabalho pode exigir mais processador, memória ou placa de vídeo, dependendo dos programas usados.' },
          { q: 'Posso trocar uma peça recomendada?', a: 'Sim. Veja as alternativas mais barata e mais potente ou monte tudo manualmente no Modo Avançado.' },
          { q: 'Por que o site explica a escolha de cada peça?', a: 'Para você entender o papel do componente, a relação com as outras peças e onde seu orçamento está sendo usado.' },
          { q: 'A configuração já vem montada?', a: 'Não. O PC Forge cria uma recomendação. A compra e a montagem física são feitas por você, uma loja ou um técnico de confiança.' },
        ]
      },
      {
        cat: '🧩 Peças e compatibilidade',
        items: [
          { q: 'O que significa “compatibilidade OK”?', a: 'Significa que as regras verificadas pelo site não encontraram conflito. Ainda confirme medidas, BIOS, conectores e especificações do fabricante antes de comprar.' },
          { q: 'Qualquer processador funciona em qualquer placa-mãe?', a: 'Não. O soquete e o chipset precisam aceitar o processador. Alguns modelos também exigem atualização de BIOS.' },
          { q: 'Posso usar qualquer memória RAM?', a: 'Não. A placa-mãe deve aceitar o tipo correto, como DDR4 ou DDR5. Verifique também capacidade, quantidade de módulos e velocidades suportadas.' },
          { q: 'Preciso de placa de vídeo dedicada?', a: 'Para navegação, estudos e escritório básico, o vídeo integrado pode bastar. Jogos pesados, edição, 3D e IA normalmente se beneficiam de uma placa dedicada.' },
          { q: 'Como escolher a potência da fonte?', a: 'A fonte deve suportar o consumo do conjunto com margem de segurança. Dê preferência a modelos de boa qualidade e confira a recomendação do fabricante da placa de vídeo.' },
          { q: 'Como saber se as peças cabem no gabinete?', a: 'Compare o formato da placa-mãe, o comprimento da placa de vídeo, a altura do cooler e o tamanho do radiador com os limites informados pelo gabinete.' },
          { q: 'SSD SATA e SSD NVMe são iguais?', a: 'Não. Ambos são rápidos, mas o NVMe costuma oferecer velocidades maiores. Confirme se a placa-mãe possui o encaixe M.2 compatível.' },
        ]
      },
      {
        cat: '💰 Preços e compra',
        items: [
          { q: 'Os preços mostrados são os valores das lojas em tempo real?', a: 'Não. São estimativas para ajudar no planejamento. O valor final pode mudar por loja, região, estoque, frete e promoção.' },
          { q: 'Por que o preço estimado pode estar diferente?', a: 'O mercado muda com frequência e cada vendedor pratica um valor. Compare o modelo exato em lojas confiáveis antes de fechar a compra.' },
          { q: 'O orçamento inclui monitor e acessórios?', a: 'A configuração principal considera os componentes exibidos no resultado. Monitor, teclado, mouse, sistema operacional e montagem só estão incluídos quando aparecerem na lista.' },
          { q: 'Devo comprar todas as peças na mesma loja?', a: 'Não é obrigatório. Compare preço, frete, prazo, garantia e reputação. Comprar em menos lojas pode facilitar o suporte e reduzir o frete.' },
          { q: 'Posso comprar peças usadas?', a: 'Pode, mas teste o produto, peça comprovante, verifique a garantia e avalie o histórico de uso. Tenha cuidado especial com fonte, armazenamento e placa de vídeo.' },
        ]
      },
      {
        cat: '📊 Desempenho e upgrades',
        items: [
          { q: 'O que é gargalo?', a: 'É quando uma peça limita o desempenho das outras. Um conjunto equilibrado aproveita melhor o dinheiro e evita componentes muito fortes ao lado de outros fracos.' },
          { q: 'A estimativa de desempenho é garantida?', a: 'Não. Ela é uma referência. O resultado real varia com resolução, qualidade gráfica, programa, drivers, temperatura e atualizações.' },
          { q: 'Qual upgrade devo fazer primeiro?', a: 'Depende do uso. SSD melhora a agilidade, mais RAM ajuda na multitarefa, placa de vídeo melhora jogos e 3D, e processador ajuda em tarefas de cálculo.' },
          { q: 'Como manter o PC frio?', a: 'Use gabinete ventilado, organize os cabos, instale ventoinhas corretamente e mantenha filtros e coolers limpos. Observe as temperaturas durante o uso.' },
          { q: 'Vale a pena fazer overclock?', a: 'Só para quem entende os riscos e possui peças e refrigeração adequadas. Para a maioria das pessoas, usar as configurações padrão é mais simples e seguro.' },
        ]
      },
      {
        cat: '💻 Notebooks',
        items: [
          { q: 'É melhor comprar notebook ou desktop?', a: 'Notebook oferece mobilidade e ocupa menos espaço. Desktop costuma entregar mais desempenho pelo preço e permite mais upgrades.' },
          { q: 'Notebook gamer funciona bem fora da tomada?', a: 'Para jogos, o melhor desempenho normalmente exige o carregador conectado. Na bateria, a potência é reduzida e a autonomia tende a ser menor.' },
          { q: 'Todo notebook permite aumentar RAM e SSD?', a: 'Não. Alguns possuem memória soldada ou poucos espaços livres. Consulte o manual e a página do fabricante do modelo exato.' },
          { q: 'Por que dois notebooks com a mesma placa de vídeo podem render diferente?', a: 'A potência configurada, a refrigeração, o processador e a memória mudam entre modelos. O nome da placa sozinho não define todo o desempenho.' },
        ]
      },
      {
        cat: '📄 PDF, compartilhamento e privacidade',
        items: [
          { q: 'Como salvo minha configuração?', a: 'Ao concluir, clique em “Baixar PDF”. O arquivo será salvo no seu dispositivo com as peças, os preços estimados e as explicações.' },
          { q: 'O site mantém um histórico das minhas configurações?', a: 'Não. O PC Forge não possui conta nem área de builds salvos. Baixe o PDF antes de iniciar uma nova configuração.' },
          { q: 'O que aparece no PDF?', a: 'O PDF reúne o resumo, as peças, os preços estimados e a explicação das escolhas para facilitar consulta e orçamento.' },
          { q: 'Como compartilho uma configuração?', a: 'No resultado, clique em “Compartilhar” e envie o link gerado. Quem abrir verá aquela configuração.' },
          { q: 'O site coleta meus dados pessoais?', a: 'A montagem não exige cadastro. O formulário de contato envia apenas os dados que você preencher voluntariamente.' },
          { q: 'Preciso informar senha para baixar o PDF?', a: 'Não. O download é feito diretamente pelo navegador e não exige login, senha ou cadastro.' },
        ]
      }
    ];

    return `
    <div class="page faq-page">
      <div class="page-header">
        <button class="btn btn-ghost" id="btn-back-home">← Início</button>
        <h2>❓ Perguntas Frequentes</h2>
      </div>

      <div class="faq-search-wrap">
        <input type="text" id="faq-search" class="faq-search"
               placeholder="🔍 Buscar pergunta..." />
      </div>

      <div class="faq-list" id="faq-list">
        ${faqs.map((section, sectionIndex) => `
          <div class="faq-section">
            <h3 class="faq-cat">${section.cat}</h3>
            ${section.items.map((item, i) => `
              <div class="faq-item">
                <button class="faq-question" data-faq="${sectionIndex}-${i}"
                        aria-expanded="false" aria-controls="faq-${sectionIndex}-${i}">
                  <span>${item.q}</span>
                  <span class="faq-arrow">▼</span>
                </button>
                <div class="faq-answer" id="faq-${sectionIndex}-${i}" role="region">
                  <p>${item.a}</p>
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}
        <div class="faq-empty" id="faq-empty" style="display:none">
          <span>🔎</span>
          <h3>Nenhuma resposta encontrada</h3>
          <p>Tente buscar por outra palavra ou fale conosco.</p>
        </div>
      </div>

      <div class="faq-footer">
        <p>Não encontrou sua resposta?</p>
        <button class="btn btn-primary" id="btn-go-contact">✉️ Fale Conosco</button>
      </div>
    </div>`;
  }

  // ─── Price Banner ─────────────────────────────────────────
  function updatePriceBanner() {
    const banner = document.getElementById('price-banner');
    if (!banner) return;
    const d = state.lastPriceUpdate || PriceEngine.getLastUpdated();
    const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    banner.innerHTML = `
      <span class="pb-dot"></span>
      <span class="pb-content">
        <span class="pb-label">Estimativa de mercado</span>
        <span class="pb-message">Preços estimados atualizados às <strong>${time}</strong>
          <span class="pb-separator">·</span> Atualização automática a cada hora
        </span>
      </span>
      <button class="pb-refresh" id="btn-refresh-prices"
              title="Atualizar estimativas agora" aria-label="Atualizar estimativas agora">↻</button>
    `;
    banner.style.display = 'flex';
  }

  // ─── Utility ─────────────────────────────────────────────
  function formatPrice(price) {
    return price > 0
      ? `R$ ${price.toLocaleString('pt-BR')}`
      : 'Incluso';
  }

  // ─── Events ──────────────────────────────────────────────
  function bindGlobalEvents() {
    document.addEventListener('click', handleClick);
    document.addEventListener('change', handleChange);
  }

  function bindViewEvents() {
    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = 'faq-' + btn.dataset.faq;
        const answer = document.getElementById(id);
        const isOpen = answer.classList.contains('open');
        document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
        document.querySelectorAll('.faq-question.open').forEach(b => {
          b.classList.remove('open');
          b.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          answer.classList.add('open');
          btn.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // FAQ search
    const faqSearch = document.getElementById('faq-search');
    if (faqSearch) {
      faqSearch.addEventListener('input', () => {
        const normalize = text => text.toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const q = normalize(faqSearch.value.trim());
        let totalVisible = 0;
        document.querySelectorAll('.faq-item').forEach(item => {
          const matches = normalize(item.textContent).includes(q);
          item.style.display = matches ? '' : 'none';
          if (matches) totalVisible++;
        });
        document.querySelectorAll('.faq-section').forEach(sec => {
          const visible = [...sec.querySelectorAll('.faq-item')].some(i => i.style.display !== 'none');
          sec.style.display = visible ? '' : 'none';
        });
        document.getElementById('faq-empty').style.display = totalVisible ? 'none' : 'grid';
      });
    }

    // Contact form AJAX submission
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = document.getElementById('btn-contact-submit');
        const fb  = document.getElementById('contact-feedback');
        const showFeedback = (message, type) => {
          fb.style.display = 'block';
          fb.className = `contact-feedback ${type}`;
          fb.textContent = message;
        };

        const lastSubmission = Number(sessionStorage.getItem('pcforge_contact_last_submit') || 0);
        if (Date.now() - lastSubmission < 30000) {
          showFeedback('Aguarde alguns segundos antes de enviar outra mensagem.', 'error');
          return;
        }
        if (form.dataset.submitting === 'true') return;

        form.dataset.submitting = 'true';
        btn.disabled = true;
        btn.textContent = '⏳ Enviando...';
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 15000);
        try {
          const res = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' },
            referrerPolicy: 'strict-origin-when-cross-origin',
            signal: controller.signal
          });
          if (res.ok) {
            const result = await res.json();
            if (result.success === false) throw new Error(result.message || 'Falha no envio');
            sessionStorage.setItem('pcforge_contact_last_submit', String(Date.now()));
            form.reset();
            showFeedback('✅ Mensagem enviada! Se este for o primeiro contato, confirme a ativação que chegará no e-mail do responsável.', 'success');
            btn.textContent = '✅ Enviado';
          } else {
            throw new Error();
          }
        } catch {
          showFeedback('❌ Não foi possível enviar. Tente novamente ou escreva para lucas.gomes.rosendo@gmail.com.', 'error');
          btn.disabled = false;
          btn.textContent = '📨 Enviar Mensagem';
        } finally {
          window.clearTimeout(timeout);
          form.dataset.submitting = 'false';
        }
      });
    }
  }

  async function handleClick(e) {
    const t = e.target.closest('[id], [data-answer], [data-comp], .alt-btn, [data-nb-select], [data-id]');
    if (!t) return;

    // Option cards (wizard)
    if (t.dataset.answer) {
      const key = t.dataset.answer;
      state.answers[key] = t.dataset.value;
      // Auto-advance steps 1-3, stay on step 4 to let user click Generate
      if (state.view === 'wizard' && state.wizardStep < 4) {
        setTimeout(() => { state.wizardStep++; render(); }, 180);
      } else {
        render();
      }
      return;
    }

    // ID-based buttons
    switch (t.id) {
      case 'btn-start':
        state.answers = {};
        state.wizardStep = 1;
        navigate('wizard');
        return;
      case 'btn-manual':
        state.manualSelections = {};
        navigate('manual');
        return;
      case 'btn-back-home':
        navigate('home');
        return;
      case 'btn-go-contact':
      case 'btn-contact-nav':
        navigate('contact');
        return;
      case 'btn-go-faq':
      case 'btn-faq-nav':
        navigate('faq');
        return;
      case 'btn-refresh-prices':
        state.lastPriceUpdate = PriceEngine.forceRefresh();
        showToast('Preços atualizados!');
        updatePriceBanner();
        return;
      case 'btn-prev-step':
        if (state.wizardStep > 1) { state.wizardStep--; render(); }
        return;
      case 'btn-generate':
        if (!state.answers.userLevel) return;
        generateBuild();
        return;
      case 'btn-download-pdf':
        if (state.currentBuild) {
          await downloadPDF(t, () => PDFExporter.exportBuild(state.currentBuild));
        }
        return;
      case 'btn-download-notebook-pdf':
        if (state.currentNotebook) {
          await downloadPDF(t, () => PDFExporter.exportNotebook(state.currentNotebook));
        }
        return;
      case 'btn-share-build':
        if (state.currentBuild) {
          const url = BuildEngine.shareBuild(state.currentBuild);
          navigator.clipboard?.writeText(url).then(() => showToast('Link copiado!')).catch(() => showToast(url, 6000));
        }
        return;
      case 'btn-new-build':
      case 'btn-new-build-2':
        state.answers = {};
        state.wizardStep = 1;
        navigate('wizard');
        return;
      case 'btn-customize':
        populateManualFromBuild(state.currentBuild);
        navigate('manual');
        return;
      case 'btn-build-manual':
        buildManual();
        return;
      case 'btn-auto-build':
        state.answers = {};
        state.wizardStep = 1;
        navigate('wizard');
        return;
    }

    // Alternative component buttons
    if (t.classList.contains('alt-btn')) {
      const type = t.dataset.type;
      const id = t.dataset.id;
      if (state.currentBuild && type && id) {
        const newComp = getComponentById(type, id);
        if (newComp) {
          state.currentBuild.components[type] = newComp;
          state.currentBuild.totalPrice    = BuildEngine.calcTotal(state.currentBuild.components);
          state.currentBuild.compatibility = BuildEngine.checkCompatibility(state.currentBuild.components);
          state.currentBuild.performance   = BuildEngine.calcPerformance(state.currentBuild.components, state.currentBuild.answers || {});
          state.currentBuild.bottlenecks   = BuildEngine.detectBottlenecks(state.currentBuild.components);
          state.currentBuild.alternatives  = BuildEngine.getComponentAlternatives(state.currentBuild.components);
          state.currentBuild.powerUsage    = BuildEngine.calcPowerUsage(state.currentBuild.components);
          showToast(`${newComp.name} aplicado!`);
          render();
        }
      }
      return;
    }

    // Notebook select
    if (t.dataset.nbSelect) {
      const nb = NOTEBOOKS.find(n => n.id === t.dataset.nbSelect);
      if (nb) {
        state.currentNotebook = nb;
        navigate('notebook');
      }
      return;
    }
  }

  function handleChange(e) {
    const t = e.target;
    if (t.classList.contains('comp-select') && t.dataset.comp) {
      state.manualSelections[t.dataset.comp] = t.value || null;
      render();
    }
  }

  function generateBuild() {
    const { deviceType, useType, intensity, userLevel } = state.answers;
    state.userLevel = userLevel || 'beginner';

    if (deviceType === 'notebook') {
      const nb = BuildEngine.getNotebookRecommendation({ useType, intensity });
      state.currentNotebook = nb;
      navigate('notebook');
    } else {
      const build = BuildEngine.buildFromPreset({ deviceType, useType, intensity });
      if (!build) {
        showToast('Erro ao gerar build. Tente novamente.', 3000);
        return;
      }
      state.currentBuild = build;
      navigate('result');
    }
  }

  function buildManual() {
    const build = BuildEngine.buildManual(state.manualSelections);
    state.currentBuild = build;
    navigate('result');
  }

  function populateManualFromBuild(build) {
    if (!build) return;
    state.manualSelections = {};
    Object.entries(build.components).forEach(([key, comp]) => {
      if (comp) state.manualSelections[key] = comp.id;
    });
  }

  async function downloadPDF(button, exporter) {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = '⏳ Gerando PDF...';
    try {
      await exporter();
      showToast('PDF baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      showToast('Não foi possível gerar o PDF. Verifique sua conexão e tente novamente.', 5000);
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  function showToast(msg, duration = 2500) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
