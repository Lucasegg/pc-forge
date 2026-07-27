// ============================================================
// PC FORGE - Build Engine
// ============================================================

const BuildEngine = (() => {

  // ─── Resolve preset key from wizard answers ──────────────
  function resolvePresetKey(answers) {
    const { deviceType, useType, intensity } = answers;
    const base = `${deviceType}_${useType}`;
    const tierMap = { light: 'light', medium: 'medium', heavy: 'heavy', extreme: 'extreme' };
    return `${base}_${tierMap[intensity] || 'medium'}`;
  }

  // ─── Build a complete PC from preset ─────────────────────
  function buildFromPreset(answers) {
    const key = resolvePresetKey(answers);
    const preset = BUILD_PRESETS[key];
    if (!preset) return null;

    const build = {
      id: 'build_' + Date.now(),
      name: preset.name,
      answers: { ...answers },
      presetKey: key,
      components: {
        cpu:         getComponentById('cpu', preset.cpu),
        gpu:         getComponentById('gpu', preset.gpu),
        motherboard: getComponentById('motherboard', preset.motherboard),
        ram:         getComponentById('ram', preset.ram),
        storage:     getComponentById('storage', preset.storage),
        psu:         getComponentById('psu', preset.psu),
        case:        getComponentById('case', preset.case),
        cooling:     getComponentById('cooling', preset.cooling)
      },
      perfLevel: preset.perfLevel,
      targetRes:  preset.targetRes,
      targetFPS:  preset.targetFPS,
      createdAt:  new Date().toISOString()
    };

    build.totalPrice   = calcTotal(build.components);
    build.compatibility = checkCompatibility(build.components);
    build.performance  = calcPerformance(build.components, answers);
    build.bottlenecks  = detectBottlenecks(build.components);
    build.alternatives = getComponentAlternatives(build.components);
    build.powerUsage   = calcPowerUsage(build.components);

    return build;
  }

  // ─── Calculate total price ───────────────────────────────
  function calcTotal(components) {
    return Object.values(components).reduce((sum, c) => sum + (c ? c.price : 0), 0);
  }

  // ─── Calculate power usage ───────────────────────────────
  function calcPowerUsage(components) {
    const cpuTdp  = components.cpu?.tdp || 0;
    const gpuTdp  = components.gpu?.tdp || 0;
    const sysTdp  = 80; // motherboard + RAM + storage + fans
    return Math.round((cpuTdp + gpuTdp + sysTdp) * 1.2); // 20% headroom
  }

  // ─── Compatibility check ─────────────────────────────────
  function checkCompatibility(components) {
    const issues = [];
    const ok = [];
    const { cpu, gpu, motherboard, ram, psu, cooling } = components;

    // CPU ↔ Motherboard socket
    if (cpu && motherboard) {
      if (cpu.socket === motherboard.socket) {
        ok.push({ label: 'CPU + Placa-mãe', detail: `Socket ${cpu.socket} compatível` });
      } else {
        issues.push({ label: 'CPU + Placa-mãe', detail: `Socket incompatível: CPU ${cpu.socket} ≠ Placa-mãe ${motherboard.socket}` });
      }
    }

    // RAM type ↔ Motherboard
    if (ram && motherboard) {
      if (motherboard.ramType === ram.type) {
        ok.push({ label: 'RAM + Placa-mãe', detail: `${ram.type} compatível com ${motherboard.chipset}` });
      } else {
        issues.push({ label: 'RAM + Placa-mãe', detail: `${ram.type} incompatível com placa-mãe ${motherboard.ramType}` });
      }
    }

    // CPU RAM type support
    if (cpu && ram) {
      const supported = cpu.ramTypes?.includes(ram.type);
      if (supported) {
        ok.push({ label: 'CPU + RAM', detail: `CPU suporta ${ram.type}` });
      } else {
        issues.push({ label: 'CPU + RAM', detail: `CPU não suporta ${ram.type}` });
      }
    }

    // PSU wattage
    if (psu) {
      const needed = calcPowerUsage(components);
      if (psu.wattage >= needed) {
        ok.push({ label: 'Fonte de Energia', detail: `${psu.wattage}W suficiente (sistema usa ~${needed}W)` });
      } else {
        issues.push({ label: 'Fonte de Energia', detail: `Fonte ${psu.wattage}W pode ser insuficiente (sistema usa ~${needed}W)` });
      }
    }

    // Cooling vs CPU TDP
    if (cooling && cpu && cooling.id !== 'stock') {
      if (cooling.tdpRating >= cpu.tdp) {
        ok.push({ label: 'Refrigeração + CPU', detail: `Cooler suporta até ${cooling.tdpRating}W (CPU: ${cpu.tdp}W)` });
      } else {
        issues.push({ label: 'Refrigeração + CPU', detail: `Cooler pode ser insuficiente para o CPU (${cooling.tdpRating}W < ${cpu.tdp}W)` });
      }
    }

    // GPU with no iGPU check
    if (cpu && !cpu.integratedGpu && (!gpu || gpu.id === 'igpu')) {
      issues.push({ label: 'GPU Necessária', detail: `${cpu.name} não tem gráfico integrado. É necessária uma GPU dedicada.` });
    }

    ok.push({ label: 'Placa-mãe + Storage', detail: 'Slots M.2 e SATA disponíveis' });

    return { issues, ok, valid: issues.length === 0 };
  }

  // ─── Performance calculation ─────────────────────────────
  function calcPerformance(components, answers) {
    const { gpu, cpu } = components;
    const gpuId = gpu?.id || 'igpu';

    // Games FPS
    const gameBench = GAMES_BENCHMARK[gpuId] || {};
    const games = Object.entries(gameBench).map(([game, fps]) => ({
      game,
      fps,
      rating: fps >= 144 ? 'Ultra' : fps >= 100 ? 'Alto' : fps >= 60 ? 'Médio' : fps >= 30 ? 'Baixo' : 'N/A',
      color: fps >= 144 ? '#00ff88' : fps >= 100 ? '#6c63ff' : fps >= 60 ? '#00d4ff' : fps >= 30 ? '#ffaa00' : '#ff4466'
    }));

    // Overall performance score
    const gpuScore = gpu?.perfScore || 0;
    const cpuScore = cpu?.perfScore || 0;
    const overallScore = Math.round((gpuScore * 0.65) + (cpuScore * 0.35));

    let level, softwareLevel;
    if (overallScore >= 80)      { level = 'Profissional'; softwareLevel = 'professional'; }
    else if (overallScore >= 60) { level = 'Avançado';     softwareLevel = 'advanced'; }
    else if (overallScore >= 35) { level = 'Intermediário';softwareLevel = 'intermediate'; }
    else                         { level = 'Básico';       softwareLevel = 'basic'; }

    const software = SOFTWARE_COMPAT[softwareLevel] || SOFTWARE_COMPAT.basic;

    return { games, overallScore, level, software };
  }

  // ─── Bottleneck detection ────────────────────────────────
  function detectBottlenecks(components) {
    const alerts = [];
    const { cpu, gpu, ram } = components;
    if (!cpu || !gpu) return alerts;

    const cpuScore = cpu.perfScore || 0;
    const gpuScore = gpu.perfScore || 0;
    const diff = Math.abs(cpuScore - gpuScore);

    if (gpuScore > cpuScore + 25) {
      alerts.push({
        type: 'warning',
        icon: '⚠️',
        title: 'CPU pode limitar a GPU',
        detail: `${cpu.name} pode não acompanhar ${gpu?.name} em plena carga. Considere um CPU mais potente.`
      });
    }
    if (cpuScore > gpuScore + 30) {
      alerts.push({
        type: 'info',
        icon: '💡',
        title: 'GPU é o gargalo',
        detail: `${cpu.name} é mais poderoso que o necessário para ${gpu?.name}. Uma GPU mais potente aproveitaria melhor o CPU.`
      });
    }
    if (ram && ram.capacityGB < 16 && gpuScore > 40) {
      alerts.push({
        type: 'warning',
        icon: '⚠️',
        title: 'RAM pode ser limitante',
        detail: `${ram.capacityGB}GB pode causar lentidão em jogos modernos. 16GB é o recomendado para gaming.`
      });
    }
    if (diff <= 15) {
      alerts.push({
        type: 'success',
        icon: '✅',
        title: 'Build bem balanceado',
        detail: 'CPU e GPU bem equilibrados. Você aproveita ao máximo cada componente sem desperdício.'
      });
    }

    // Upgrade suggestions
    const upgrades = [];
    if (gpuScore < 60) upgrades.push('Upgrade de GPU para próxima geração quando disponível');
    if (ram && ram.capacityGB <= 16) upgrades.push('Adicionar mais um kit de RAM (upgrade fácil)');
    if (components.storage?.type === 'SSD SATA') upgrades.push('Trocar SSD SATA por NVMe M.2 para maior velocidade');
    if (components.cooling?.tier <= 1 && cpu.tdp >= 95) upgrades.push('Considere um cooler melhor para temperaturas mais baixas');

    return { alerts, upgrades };
  }

  // ─── Get alternatives for all components ─────────────────
  function getComponentAlternatives(components) {
    const alts = {};
    const cpuSocket = components.cpu?.socket;

    ['cpu', 'gpu', 'ram', 'motherboard', 'storage', 'psu', 'case', 'cooling'].forEach(type => {
      const current = components[type];
      if (!current) return;
      alts[type] = getAlternatives(type, current.id, type === 'motherboard' ? cpuSocket : null);
    });

    return alts;
  }

  // ─── Build from manual selections ───────────────────────
  function buildManual(selections) {
    const components = {};
    ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case', 'cooling'].forEach(type => {
      if (selections[type]) {
        components[type] = getComponentById(type, selections[type]);
      }
    });

    const build = {
      id: 'build_' + Date.now(),
      name: 'Build Personalizado',
      answers: { mode: 'manual' },
      components,
      createdAt: new Date().toISOString()
    };

    build.totalPrice   = calcTotal(build.components);
    build.compatibility = checkCompatibility(build.components);
    build.performance  = calcPerformance(build.components, {});
    build.bottlenecks  = detectBottlenecks(build.components);
    build.powerUsage   = calcPowerUsage(build.components);
    build.perfLevel    = build.performance.level;

    return build;
  }

  // ─── Get notebook recommendation ────────────────────────
  function getNotebookRecommendation(answers) {
    const { useType, intensity } = answers;
    const tierMap = { light: 1, medium: 2, heavy: 3, extreme: 4 };
    const targetTier = tierMap[intensity] || 2;

    const candidates = NOTEBOOKS.filter(nb => nb.category === useType);
    return candidates.find(nb => nb.tier === targetTier) ||
           candidates.reduce((best, nb) => {
             return Math.abs(nb.tier - targetTier) < Math.abs(best.tier - targetTier) ? nb : best;
           }, candidates[0]);
  }

  // ─── Share build (encode to URL) ────────────────────────
  function shareBuild(build) {
    const data = {
      n: build.name,
      c: Object.entries(build.components).reduce((acc, [k, v]) => {
        if (v) acc[k] = v.id;
        return acc;
      }, {})
    };
    const encoded = btoa(JSON.stringify(data));
    return `${window.location.origin}${window.location.pathname}?build=${encoded}`;
  }

  function loadSharedBuild(encoded) {
    try {
      const data = JSON.parse(atob(encoded));
      return buildManual(data.c);
    } catch { return null; }
  }

  return {
    buildFromPreset,
    buildManual,
    getNotebookRecommendation,
    checkCompatibility,
    calcTotal,
    calcPowerUsage,
    calcPerformance,
    detectBottlenecks,
    shareBuild,
    loadSharedBuild,
    getComponentAlternatives
  };
})();
