// ============================================================
// PC FORGE - Main Application
// ============================================================

const App = (() => {

  // ─── State ───────────────────────────────────────────────
  let state = {
    view: 'home',           // home | wizard | result | notebook | manual | saved | compare | contact | faq
    wizardStep: 1,
    totalSteps: 4,
    answers: {},
    currentBuild: null,
    currentNotebook: null,
    savedBuilds: [],
    compareBuilds: [],
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

    state.savedBuilds = BuildEngine.Storage.getAll();

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
      case 'saved':    app.innerHTML = renderSaved(); break;
      case 'compare':  app.innerHTML = renderCompare(); break;
      case 'contact':  app.innerHTML = renderContact(); break;
      case 'faq':      app.innerHTML = renderFAQ(); break;
      default:         app.innerHTML = renderHome();
    }
    bindViewEvents();
    updatePriceBanner();
  }

  // ─── HOME ────────────────────────────────────────────────
  function renderHome() {
    const saved = BuildEngine.Storage.getAll();
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

      ${saved.length > 0 ? `
      <div class="saved-preview-section">
        <div class="section-header">
          <h2 class="section-title">Seus Builds Salvos</h2>
          <button class="btn btn-outline btn-sm" id="btn-all-saved">Ver todos</button>
        </div>
        <div class="builds-row">
          ${saved.slice(0, 3).map(b => renderSavedBuildCard(b, true)).join('')}
        </div>
      </div>` : ''}
    </div>`;
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
    const isSaved = BuildEngine.Storage.getAll().some(s => s.id === b.id);

    return `
    <div class="page result-page">
      <div class="result-header">
        <button class="btn btn-ghost" id="btn-back-home">← Início</button>
        <div class="result-title-wrap">
          <h2 class="result-title">🖥️ ${b.name}</h2>
          <span class="perf-badge badge-${b.perfLevel?.toLowerCase().replace('ó','o').replace('â','a').replace('é','e')}">${b.perfLevel}</span>
        </div>
        <div class="result-actions-top">
          <button class="btn btn-outline btn-sm ${isSaved ? 'saved' : ''}" id="btn-save-build">
            ${isSaved ? '✅ Salvo' : '💾 Salvar'}
          </button>
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
        <button class="btn btn-outline" id="btn-add-compare">📊 Comparar Builds</button>
        <button class="btn btn-primary" id="btn-new-build-2">🔄 Novo Build</button>
      </div>
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
        <button class="btn btn-outline btn-sm" id="btn-new-build">🔄 Nova Busca</button>
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

  // ─── SAVED BUILDS ────────────────────────────────────────
  function renderSaved() {
    const builds = BuildEngine.Storage.getAll();
    return `
    <div class="page saved-page">
      <div class="page-header">
        <button class="btn btn-ghost" id="btn-back-home">← Início</button>
        <h2>💾 Meus Builds Salvos</h2>
        ${builds.length > 0 ? `<button class="btn btn-outline btn-sm btn-danger" id="btn-clear-all">🗑️ Limpar Todos</button>` : ''}
      </div>

      ${builds.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">💾</div>
        <h3>Nenhum build salvo ainda</h3>
        <p>Monte seu primeiro PC e salve para acessar depois!</p>
        <button class="btn btn-primary" id="btn-start-new">🚀 Começar</button>
      </div>` : `
      <div class="builds-grid">
        ${builds.map(b => renderSavedBuildCard(b, false)).join('')}
      </div>
      ${builds.length >= 2 ? `
      <div class="compare-bar">
        <p>💡 Selecione 2 builds para comparar</p>
        <button class="btn btn-primary" id="btn-compare-selected" disabled>📊 Comparar Selecionados</button>
      </div>` : ''}
      `}
    </div>`;
  }

  function renderSavedBuildCard(b, compact = false) {
    const comps = b.components || {};
    return `
    <div class="saved-card ${compact ? 'compact' : ''}" data-build-id="${b.id}">
      <div class="saved-card-header">
        <div>
          <div class="saved-card-name">${b.name}</div>
          <div class="saved-card-date">${new Date(b.createdAt).toLocaleDateString('pt-BR')}</div>
        </div>
        <div class="saved-card-price">${formatPrice(b.totalPrice || 0)}</div>
      </div>
      ${!compact ? `
      <div class="saved-card-comps">
        ${comps.cpu ? `<span>🔷 ${comps.cpu.name}</span>` : ''}
        ${comps.gpu ? `<span>🟣 ${comps.gpu.name}</span>` : ''}
        ${comps.ram ? `<span>🟩 ${comps.ram.capacityGB}GB ${comps.ram.type}</span>` : ''}
      </div>` : ''}
      <div class="saved-card-footer">
        ${b.perfLevel ? `<span class="perf-badge badge-${b.perfLevel.toLowerCase().replace(/[óâé]/g, c => ({ó:'o',â:'a',é:'e'})[c])}">${b.perfLevel}</span>` : ''}
        <div class="saved-actions">
          <button class="btn btn-outline btn-xs btn-load" data-id="${b.id}">📂 Abrir</button>
          ${!compact ? `
          <button class="btn btn-outline btn-xs btn-compare-add" data-id="${b.id}">📊</button>
          <button class="btn btn-outline btn-xs btn-delete" data-id="${b.id}">🗑️</button>` : ''}
        </div>
      </div>
    </div>`;
  }

  // ─── COMPARE ─────────────────────────────────────────────
  function renderCompare() {
    const builds = state.compareBuilds;
    if (builds.length < 2) {
      return `
      <div class="page compare-page">
        <div class="page-header">
          <button class="btn btn-ghost" id="btn-back-home">← Início</button>
          <h2>📊 Comparar Builds</h2>
        </div>
        <div class="empty-state">
          <p>Selecione ao menos 2 builds salvos para comparar.</p>
          <button class="btn btn-primary" id="btn-go-saved">Ver Meus Builds</button>
        </div>
      </div>`;
    }

    const rows = [
      { label: 'Nome', fn: b => b.name },
      { label: '💰 Preço Total', fn: b => formatPrice(b.totalPrice) },
      { label: '📊 Performance', fn: b => b.perfLevel || '—' },
      { label: '🔷 CPU', fn: b => b.components?.cpu?.name || '—' },
      { label: '🟣 GPU', fn: b => b.components?.gpu?.name || '—' },
      { label: '🟩 RAM', fn: b => b.components?.ram ? `${b.components.ram.capacityGB}GB ${b.components.ram.type}` : '—' },
      { label: '💾 Storage', fn: b => b.components?.storage?.name || '—' },
      { label: '⚡ Fonte', fn: b => b.components?.psu?.name || '—' },
      { label: '⚡ Consumo', fn: b => `${b.powerUsage || '?'}W` },
      { label: '🧩 Compatível', fn: b => b.compatibility?.valid ? '✅ Sim' : '⚠️ Aviso' },
    ];

    return `
    <div class="page compare-page">
      <div class="page-header">
        <button class="btn btn-ghost" id="btn-back-home">← Início</button>
        <h2>📊 Comparação de Builds</h2>
      </div>

      <div class="compare-table-wrap">
        <table class="compare-table">
          <thead>
            <tr>
              <th>Componente</th>
              ${builds.map(b => `<th>${b.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                <td class="compare-label">${row.label}</td>
                ${builds.map(b => `<td>${row.fn(b)}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="compare-footer">
        <button class="btn btn-outline" id="btn-go-saved">← Voltar aos Builds</button>
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
                action="https://formspree.io/f/xpwzqnjp"
                method="POST">

            <input type="hidden" name="_subject" value="PC Forge — Nova mensagem de contato" />
            <input type="hidden" name="_next" value="" />

            <div class="form-group">
              <label for="contact-name">Seu nome *</label>
              <input type="text" id="contact-name" name="name"
                     placeholder="Ex: João Silva" required />
            </div>

            <div class="form-group">
              <label for="contact-email">Seu e-mail *</label>
              <input type="email" id="contact-email" name="email"
                     placeholder="seu@email.com" required />
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
                        placeholder="Escreva sua mensagem aqui..." required></textarea>
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
        cat: '🖥️ Sobre o PC Forge',
        items: [
          { q: 'O PC Forge é gratuito?', a: 'Sim, 100% gratuito e sem necessidade de cadastro. Basta acessar o site e começar a montar.' },
          { q: 'Os preços são reais?', a: 'Os preços são estimativas de mercado baseadas em valores médios praticados no Brasil, atualizados automaticamente a cada hora. Podem variar conforme o vendedor, região e promoções do dia. Sempre consulte o preço final na loja antes de comprar.' },
          { q: 'Com que frequência os preços são atualizados?', a: 'Os preços são recalculados automaticamente a cada 1 hora, refletindo as variações do dólar e do mercado de hardware.' },
          { q: 'Posso usar o PC Forge no celular?', a: 'Sim! O PC Forge foi desenvolvido com design responsivo e funciona em smartphones, tablets e computadores.' },
          { q: 'Meus builds salvos ficam guardados para sempre?', a: 'Os builds são salvos no armazenamento local do seu navegador. Eles permanecem enquanto você não limpar os dados do navegador ou acessar de outro dispositivo.' },
        ]
      },
      {
        cat: '🔧 Montagem de PCs',
        items: [
          { q: 'Qual a diferença entre PC Gamer e PC de Escritório?', a: 'O PC Gamer prioriza GPU (placa de vídeo) poderosa para rodar jogos em alta resolução e FPS elevado. O PC de Escritório foca em CPU eficiente, mais RAM e armazenamento rápido para multitarefa e softwares de produtividade.' },
          { q: 'Preciso de placa de vídeo dedicada para trabalho?', a: 'Depende. Para uso básico (Office, e-mails, reuniões), o gráfico integrado do processador é suficiente. Para edição de vídeo, renderização 3D ou Power BI com grandes bases de dados, uma GPU dedicada acelera muito o trabalho.' },
          { q: 'Qual a diferença entre DDR4 e DDR5?', a: 'DDR5 é a geração mais nova de memória RAM, com maior velocidade e largura de banda. Porém, exige placa-mãe e processador compatíveis (Intel 12ª gen+ ou AMD AM5). DDR4 ainda é excelente e mais barata.' },
          { q: 'NVMe é muito melhor que SSD SATA?', a: 'Sim, de 5 a 7 vezes mais rápido em leitura/escrita. Na prática, o sistema operacional e os jogos carregam significativamente mais rápido. Para o mesmo preço, prefira sempre NVMe M.2.' },
          { q: 'Quantos watts de fonte eu preciso?', a: 'O PC Forge calcula isso automaticamente. A regra geral é: some o TDP do CPU + GPU e multiplique por 1.5 para ter margem de segurança. Nunca use uma fonte no limite — isso reduz a vida útil.' },
          { q: 'Posso colocar qualquer RAM em qualquer placa-mãe?', a: 'Não. Você precisa verificar: (1) tipo: DDR4 ou DDR5, (2) velocidade suportada, (3) número de slots disponíveis. O PC Forge verifica tudo isso automaticamente no check de compatibilidade.' },
        ]
      },
      {
        cat: '💰 Orçamento e Compras',
        items: [
          { q: 'Onde comprar os componentes?', a: 'No Brasil, as principais lojas confiáveis são: Kabum, Pichau, Terabyteshop, Amazon Brasil e Mercado Livre (vendedores oficiais). Compare sempre os preços antes de comprar.' },
          { q: 'Vale a pena comprar componentes importados?', a: 'Pode ser mais barato em alguns casos, mas considere: imposto de importação (60% para pessoa física), risco de produto sem garantia no Brasil e dificuldade de troca em caso de defeito.' },
          { q: 'Qual a peça que mais impacta o desempenho em jogos?', a: 'A GPU (placa de vídeo) é responsável por ~70% do desempenho em jogos. Invista mais nela do que no CPU se o objetivo principal for gaming.' },
          { q: 'Existe uma configuração mínima para trabalho home office?', a: 'Para trabalho básico (Office, Teams, navegação): Intel i3 ou Ryzen 3, 8GB RAM, SSD 240GB. Para algo mais confortável: i5/Ryzen 5, 16GB RAM, SSD 500GB NVMe.' },
        ]
      },
      {
        cat: '🚀 Performance e Upgrades',
        items: [
          { q: 'O que é gargalo (bottleneck)?', a: 'Gargalo ocorre quando um componente limita o desempenho de outro. Exemplo: uma GPU RTX 4090 com um CPU i3 — o CPU não consegue alimentar a GPU com dados suficientemente rápido, desperdiçando o potencial da placa de vídeo.' },
          { q: 'Vale a pena overclock?', a: 'Para CPUs desbloqueados (Intel K ou AMD X) com refrigeração adequada, o overclock pode dar 5-15% de ganho de performance sem custo extra. Mas exige cuidados com temperatura e estabilidade.' },
          { q: 'Qual upgrade tem mais impacto por real gasto?', a: 'Em ordem de impacto: (1) Trocar HDD por SSD NVMe, (2) Adicionar mais RAM (8→16GB), (3) Upgrade de GPU, (4) Upgrade de CPU.' },
          { q: 'Meu PC esquenta muito. O que fazer?', a: 'Verifique: (1) limpeza de poeira no cooler e filtros, (2) troca da pasta térmica (a cada 2-3 anos), (3) airflow do gabinete (entradas na frente, saída atrás/topo), (4) cooler inadequado para o TDP do CPU.' },
        ]
      },
      {
        cat: '💻 Notebooks',
        items: [
          { q: 'Vale mais a pena notebook ou PC desktop?', a: 'Desktop: mais potente por real, fácil de upgradear, melhor refrigeração. Notebook: portabilidade, ocupa menos espaço, tudo em um. Se não precisa carregar, desktop sempre entrega mais performance pelo mesmo investimento.' },
          { q: 'Por que notebooks gamers têm bateria tão curta?', a: 'GPUs dedicadas consomem muita energia. Em jogos, um notebook gamer pode consumir 100-200W, esgotando a bateria em 1-3 horas. Sempre use tomada para gaming.' },
          { q: 'Posso colocar mais RAM em um notebook?', a: 'Depende do modelo. Muitos notebooks modernos têm RAM soldada na placa (não upgradável). Verifique as especificações antes de comprar se isso for importante para você.' },
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
        ${faqs.map(section => `
          <div class="faq-section">
            <h3 class="faq-cat">${section.cat}</h3>
            ${section.items.map((item, i) => `
              <div class="faq-item" data-q="${item.q.toLowerCase()}">
                <button class="faq-question" data-faq="${section.cat}-${i}">
                  <span>${item.q}</span>
                  <span class="faq-arrow">▼</span>
                </button>
                <div class="faq-answer" id="faq-${section.cat}-${i}">
                  <p>${item.a}</p>
                </div>
              </div>
            `).join('')}
          </div>
        `).join('')}
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
      Preços estimados atualizados às <strong>${time}</strong> · Atualização automática a cada hora
      <button class="pb-refresh" id="btn-refresh-prices" title="Atualizar agora">↻</button>
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
        document.querySelectorAll('.faq-question.open').forEach(b => b.classList.remove('open'));
        if (!isOpen) { answer.classList.add('open'); btn.classList.add('open'); }
      });
    });

    // FAQ search
    const faqSearch = document.getElementById('faq-search');
    if (faqSearch) {
      faqSearch.addEventListener('input', () => {
        const q = faqSearch.value.toLowerCase();
        document.querySelectorAll('.faq-item').forEach(item => {
          item.style.display = item.dataset.q.includes(q) ? '' : 'none';
        });
        document.querySelectorAll('.faq-section').forEach(sec => {
          const visible = [...sec.querySelectorAll('.faq-item')].some(i => i.style.display !== 'none');
          sec.style.display = visible ? '' : 'none';
        });
      });
    }

    // Contact form AJAX submission
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = document.getElementById('btn-contact-submit');
        const fb  = document.getElementById('contact-feedback');
        btn.disabled = true;
        btn.textContent = '⏳ Enviando...';
        try {
          const res = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
          });
          if (res.ok) {
            form.reset();
            fb.style.display = 'block';
            fb.className = 'contact-feedback success';
            fb.innerHTML = '✅ Mensagem enviada com sucesso! Responderemos em até 48h.';
            btn.textContent = '✅ Enviado';
          } else {
            throw new Error();
          }
        } catch {
          fb.style.display = 'block';
          fb.className = 'contact-feedback error';
          fb.innerHTML = '❌ Erro ao enviar. Tente novamente ou envie direto para <strong>lucas.gomes.rosendo@gmail.com</strong>';
          btn.disabled = false;
          btn.textContent = '📨 Enviar Mensagem';
        }
      });
    }
  }

  function handleClick(e) {
    const t = e.target.closest('[id], [data-answer], [data-comp], .alt-btn, .btn-load, .btn-delete, [data-nb-select], [data-id]');
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
      case 'btn-save-build':
        if (state.currentBuild) {
          BuildEngine.Storage.save(state.currentBuild);
          state.savedBuilds = BuildEngine.Storage.getAll();
          render();
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
      case 'btn-add-compare':
        if (state.currentBuild) {
          BuildEngine.Storage.save(state.currentBuild);
          state.savedBuilds = BuildEngine.Storage.getAll();
        }
        navigate('saved');
        return;
      case 'btn-all-saved':
      case 'btn-go-saved':
        navigate('saved');
        return;
      case 'btn-build-manual':
        buildManual();
        return;
      case 'btn-auto-build':
        state.answers = {};
        state.wizardStep = 1;
        navigate('wizard');
        return;
      case 'btn-clear-all':
        if (confirm('Apagar todos os builds salvos?')) {
          BuildEngine.Storage.clear();
          state.savedBuilds = [];
          state.compareBuilds = [];
          render();
        }
        return;
      case 'btn-start-new':
        state.answers = {};
        state.wizardStep = 1;
        navigate('wizard');
        return;
      case 'btn-compare-selected':
        navigate('compare');
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

    // Load saved build
    if (t.classList.contains('btn-load')) {
      const id = t.dataset.id;
      const build = BuildEngine.Storage.getAll().find(b => b.id === id);
      if (build) {
        state.currentBuild = build;
        navigate('result');
      }
      return;
    }

    // Delete saved build
    if (t.classList.contains('btn-delete')) {
      const id = t.dataset.id;
      if (confirm('Apagar este build?')) {
        BuildEngine.Storage.delete(id);
        state.savedBuilds = BuildEngine.Storage.getAll();
        render();
      }
      return;
    }

    // Compare add
    if (t.classList.contains('btn-compare-add')) {
      const id = t.dataset.id;
      const build = BuildEngine.Storage.getAll().find(b => b.id === id);
      if (build) {
        const idx = state.compareBuilds.findIndex(b => b.id === id);
        if (idx >= 0) {
          state.compareBuilds.splice(idx, 1);
        } else if (state.compareBuilds.length < 3) {
          state.compareBuilds.push(build);
        }
        if (state.compareBuilds.length >= 2) {
          document.getElementById('btn-compare-selected')?.removeAttribute('disabled');
        }
        showToast(state.compareBuilds.some(b => b.id === id) ? 'Adicionado à comparação' : 'Removido da comparação');
        t.classList.toggle('active');
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
