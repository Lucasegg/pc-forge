// ============================================================
// PC FORGE - PDF Export
// ============================================================

const PDFExporter = (() => {
  const JSPDF_URL = 'https://cdn.jsdelivr.net/npm/jspdf@4.2.1/dist/jspdf.umd.min.js';
  const JSPDF_INTEGRITY = 'sha384-qovJwSBbRDPP5cEjCp8S0UP66wrvnjaa60XMOGzTNanrThcrGfXfnZkvgY8N1KT3';
  let libraryPromise = null;

  const componentLabels = {
    cpu: 'Processador (CPU)',
    gpu: 'Placa de vídeo (GPU)',
    motherboard: 'Placa-mãe',
    ram: 'Memória RAM',
    storage: 'Armazenamento',
    psu: 'Fonte de energia',
    case: 'Gabinete',
    cooling: 'Refrigeração'
  };

  const useLabels = {
    gamer: 'Jogos e entretenimento',
    office: 'Trabalho e produtividade'
  };

  const intensityLabels = {
    light: 'Uso leve',
    medium: 'Uso intermediário',
    heavy: 'Uso pesado',
    extreme: 'Uso extremo/profissional'
  };

  function loadJsPDF() {
    if (window.jspdf?.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
    if (libraryPromise) return libraryPromise;

    libraryPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${JSPDF_URL}"]`);
      const script = existing || document.createElement('script');
      const timeout = window.setTimeout(() => {
        reject(new Error('Tempo limite ao carregar o gerador de PDF.'));
      }, 15000);

      const finish = () => {
        window.clearTimeout(timeout);
        if (window.jspdf?.jsPDF) resolve(window.jspdf.jsPDF);
        else reject(new Error('O gerador de PDF não ficou disponível.'));
      };

      script.addEventListener('load', finish, { once: true });
      script.addEventListener('error', () => {
        window.clearTimeout(timeout);
        reject(new Error('Não foi possível carregar o gerador de PDF.'));
      }, { once: true });

      if (!existing) {
        script.src = JSPDF_URL;
        script.integrity = JSPDF_INTEGRITY;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    }).catch(error => {
      libraryPromise = null;
      throw error;
    });

    return libraryPromise;
  }

  function formatPrice(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(value) || 0);
  }

  function safeFilename(value) {
    return String(value || 'configuracao')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
  }

  function componentSpecs(type, component) {
    if (type === 'cpu') {
      return [
        component.cores && `${component.cores} núcleos`,
        component.threads && `${component.threads} threads`,
        component.boostGHz && `Boost ${component.boostGHz} GHz`,
        component.socket && `Socket ${component.socket}`
      ];
    }
    if (type === 'gpu') {
      return [
        component.vram && `${component.vram} GB VRAM`,
        component.tdp && `TDP ${component.tdp} W`
      ];
    }
    if (type === 'motherboard') {
      return [
        component.socket && `Socket ${component.socket}`,
        component.chipset && `Chipset ${component.chipset}`,
        component.ramType && `RAM ${component.ramType}`,
        component.formFactor && `Formato ${component.formFactor}`
      ];
    }
    if (type === 'ram') {
      return [
        component.capacityGB && `${component.capacityGB} GB`,
        component.type,
        component.speedMHz && `${component.speedMHz} MHz`,
        component.sticks && `${component.sticks} módulo(s)`
      ];
    }
    if (type === 'storage') {
      return [
        component.type,
        component.capacityGB && `${component.capacityGB} GB`,
        component.readMBs && `Leitura ${component.readMBs} MB/s`
      ];
    }
    if (type === 'psu') {
      return [
        component.wattage && `${component.wattage} W`,
        component.rating,
        component.modular ? 'Modular' : 'Não modular'
      ];
    }
    if (type === 'cooling') {
      return [
        component.type && `Tipo ${component.type}`,
        component.tdpRating && `Suporta até ${component.tdpRating} W`
      ];
    }
    return [];
  }

  function createDocument(jsPDF, title, subtitle) {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const margin = 16;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = pageWidth - (margin * 2);
    let y = 18;

    function ensureSpace(height = 12) {
      if (y + height > pageHeight - 18) {
        doc.addPage();
        y = 18;
      }
    }

    function text(value, options = {}) {
      const {
        size = 10,
        color = [47, 47, 70],
        style = 'normal',
        indent = 0,
        gap = 2,
        lineHeight = 4.8
      } = options;
      doc.setFont('helvetica', style);
      doc.setFontSize(size);
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(String(value || ''), contentWidth - indent);
      ensureSpace((lines.length * lineHeight) + gap);
      doc.text(lines, margin + indent, y);
      y += (lines.length * lineHeight) + gap;
    }

    function section(label) {
      ensureSpace(14);
      y += 3;
      doc.setFillColor(108, 99, 255);
      doc.roundedRect(margin, y - 5, contentWidth, 10, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(label, margin + 4, y + 1.5);
      y += 10;
    }

    function keyValue(label, value) {
      const labelWidth = 43;
      const valueLines = doc.splitTextToSize(
        String(value || 'Não informado'),
        contentWidth - labelWidth
      );
      const blockHeight = Math.max(6, valueLines.length * 4.6);
      ensureSpace(blockHeight);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(73, 73, 99);
      doc.text(`${label}:`, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(valueLines, margin + labelWidth, y);
      y += blockHeight;
    }

    function bullet(value, tone = 'normal') {
      const color = tone === 'warning' ? [186, 109, 0] : tone === 'success' ? [0, 128, 85] : [47, 47, 70];
      text(`• ${value}`, { size: 9.2, color, indent: 3, gap: 1.5, lineHeight: 4.3 });
    }

    doc.setFillColor(7, 7, 15);
    doc.rect(0, 0, pageWidth, 42, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('PC Forge', margin, 17);
    doc.setFontSize(15);
    doc.setTextColor(128, 121, 255);
    doc.text(title, margin, 27);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(204, 204, 222);
    doc.text(subtitle, margin, 34);
    y = 51;

    function finish(filename) {
      const pages = doc.getNumberOfPages();
      for (let page = 1; page <= pages; page++) {
        doc.setPage(page);
        doc.setDrawColor(225, 225, 235);
        doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(120, 120, 140);
        doc.text('PC Forge - estimativas sujeitas a alteração; confirme preços e disponibilidade antes da compra.', margin, pageHeight - 7);
        doc.text(`Página ${page} de ${pages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
      }
      doc.save(filename);
    }

    return { doc, text, section, keyValue, bullet, finish };
  }

  async function exportBuild(build) {
    if (!build?.components) throw new Error('Nenhuma configuração de PC disponível.');
    const jsPDF = await loadJsPDF();
    const report = createDocument(
      jsPDF,
      'Relatório de configuração',
      `Gerado em ${new Date().toLocaleString('pt-BR')}`
    );

    report.section('Resumo da configuração');
    report.keyValue('Nome', build.name);
    report.keyValue('Finalidade', useLabels[build.answers?.useType] || (build.answers?.mode === 'manual' ? 'Configuração manual' : 'Não informada'));
    report.keyValue('Intensidade', intensityLabels[build.answers?.intensity] || 'Personalizada');
    report.keyValue('Investimento estimado', formatPrice(build.totalPrice));
    report.keyValue('Consumo estimado', `${build.powerUsage || 0} W`);
    report.keyValue('Performance', build.performance?.level || build.perfLevel || 'Não calculada');
    report.keyValue('Compatibilidade', build.compatibility?.valid ? 'Aprovada' : `${build.compatibility?.issues?.length || 0} aviso(s)`);

    report.section('Peças escolhidas e justificativas');
    Object.entries(build.components).forEach(([type, component]) => {
      if (!component) return;
      report.text(`${componentLabels[type] || type}: ${component.name}`, {
        size: 11,
        style: 'bold',
        color: [48, 43, 120],
        gap: 1.5
      });
      report.keyValue('Marca', component.brand || 'Não informada');
      report.keyValue('Preço estimado', formatPrice(component.price));
      const specs = componentSpecs(type, component).filter(Boolean);
      if (specs.length) report.keyValue('Especificações', specs.join(' • '));
      report.text(`Por que foi escolhida: ${component.why || 'Escolha baseada na compatibilidade e no perfil informado.'}`, {
        size: 9.2,
        color: [73, 73, 99],
        indent: 2,
        gap: 4,
        lineHeight: 4.4
      });
    });

    report.section('Compatibilidade');
    (build.compatibility?.ok || []).forEach(item => {
      report.bullet(`${item.label}: ${item.detail}`, 'success');
    });
    (build.compatibility?.issues || []).forEach(item => {
      report.bullet(`${item.label}: ${item.detail}`, 'warning');
    });

    if (build.performance) {
      report.section('Desempenho estimado');
      report.keyValue('Score geral', `${build.performance.overallScore ?? 'N/A'}/100`);
      report.keyValue('Nível', build.performance.level);
      if (build.performance.software?.length) {
        report.text('Softwares suportados', { size: 10, style: 'bold', gap: 2 });
        build.performance.software.forEach(software => report.bullet(software));
      }
      if (build.performance.games?.length) {
        report.text('Jogos - FPS estimado em 1080p', { size: 10, style: 'bold', gap: 2 });
        build.performance.games.forEach(game => {
          report.bullet(`${game.game}: ${game.fps > 0 ? `${game.fps} FPS (${game.rating})` : 'não recomendado'}`);
        });
      }
    }

    if (build.bottlenecks?.alerts?.length || build.bottlenecks?.upgrades?.length) {
      report.section('Análise e próximos upgrades');
      (build.bottlenecks.alerts || []).forEach(alert => {
        report.bullet(`${alert.title}: ${alert.detail}`, alert.type === 'warning' ? 'warning' : 'normal');
      });
      (build.bottlenecks.upgrades || []).forEach(upgrade => {
        report.bullet(`Upgrade sugerido: ${upgrade}`);
      });
    }

    report.finish(`pc-forge-${safeFilename(build.name)}.pdf`);
  }

  async function exportNotebook(notebook) {
    if (!notebook) throw new Error('Nenhuma recomendação de notebook disponível.');
    const jsPDF = await loadJsPDF();
    const report = createDocument(
      jsPDF,
      'Relatório de notebook',
      `Gerado em ${new Date().toLocaleString('pt-BR')}`
    );

    report.section('Recomendação');
    report.keyValue('Modelo', notebook.name);
    report.keyValue('Categoria', notebook.category === 'gamer' ? 'Notebook gamer' : 'Notebook para trabalho');
    report.keyValue('Nível', ['', 'Básico', 'Intermediário', 'Avançado', 'Profissional'][notebook.tier] || 'Não informado');
    report.keyValue('Preço estimado', formatPrice(notebook.price));
    report.text(`Por que foi escolhido: ${notebook.why}`, {
      size: 9.5,
      color: [73, 73, 99],
      gap: 4,
      lineHeight: 4.5
    });

    report.section('Configuração completa');
    [
      ['Processador', notebook.cpu],
      ['Placa de vídeo', notebook.gpu],
      ['Memória RAM', notebook.ram],
      ['Armazenamento', notebook.storage],
      ['Tela', notebook.display],
      ['Bateria', notebook.battery],
      ['Peso', notebook.weight]
    ].forEach(([label, value]) => report.keyValue(label, value));

    report.section('Pontos positivos e de atenção');
    (notebook.pros || []).forEach(item => report.bullet(`Ponto positivo: ${item}`, 'success'));
    (notebook.cons || []).forEach(item => report.bullet(`Ponto de atenção: ${item}`, 'warning'));

    if (notebook.games || notebook.software) {
      report.section('Desempenho estimado');
      Object.entries(notebook.games || {}).forEach(([profile, fps]) => {
        report.bullet(`${profile.replaceAll('_', ' ')}: aproximadamente ${fps} FPS`);
      });
      (notebook.software || []).forEach(software => report.bullet(`Software compatível: ${software}`));
    }

    report.finish(`pc-forge-${safeFilename(notebook.name)}.pdf`);
  }

  return { exportBuild, exportNotebook };
})();
