/**
 * PCForge — Monitor anônimo de atividades
 *
 * Este código deve ser colado em Extensões > Apps Script na planilha
 * "PCForge — Monitor de Atividades".
 */

const MONITOR_CONFIG = Object.freeze({
  recipient: 'lucas.gomes.rosendo@gmail.com',
  timezone: 'America/Sao_Paulo',
  activitySheet: 'Atividades',
  reportSheet: 'Relatórios',
  configSheet: 'Configuração',
  maxRequestsPerMinute: 120,
});

const ALLOWED_EVENTS = Object.freeze([
  'page_view',
  'build_started',
  'build_completed',
  'pdf_downloaded',
  'build_shared',
  'contact_opened',
  'contact_submitted',
  'application_error',
]);

const ALLOWED_PAGES = Object.freeze([
  'home',
  'wizard',
  'result',
  'notebook',
  'manual',
  'contact',
  'faq',
  'policy',
]);

const ALLOWED_MODES = Object.freeze(['', 'guiado', 'avancado', 'notebook']);
const ALLOWED_DEVICES = Object.freeze(['desktop', 'tablet', 'mobile']);

function setupMonitor() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error('Abra este script a partir da planilha do monitor.');
  }

  PropertiesService.getScriptProperties().setProperties({
    PCFORGE_SPREADSHEET_ID: spreadsheet.getId(),
    PCFORGE_LAST_REPORT_AT: String(Date.now()),
  });

  removeExampleRow_(spreadsheet);
  installHourlyTrigger_();

  const configSheet = spreadsheet.getSheetByName(MONITOR_CONFIG.configSheet);
  if (configSheet) {
    configSheet.getRange('B8').setValue('Ativo — aguardando implantação do Web App');
  }

  MailApp.sendEmail({
    to: MONITOR_CONFIG.recipient,
    subject: '✅ Monitor de atividades do PCForge ativado',
    htmlBody: [
      '<h2>Monitor do PCForge ativado</h2>',
      '<p>A planilha e o relatório automático de hora em hora foram configurados.</p>',
      '<p>O monitor não registra IP, nome, e-mail, mensagens ou configurações completas.</p>',
    ].join(''),
  });
}

function doGet() {
  return jsonResponse_({ ok: true, service: 'pcforge-activity-monitor' });
}

function doPost(event) {
  try {
    if (!event || !event.parameter) return jsonResponse_({ ok: false });
    if (!allowRequest_()) return jsonResponse_({ ok: false, limited: true });

    const activity = validateActivity_(event.parameter);
    if (!activity) return jsonResponse_({ ok: false });

    const spreadsheet = openMonitorSpreadsheet_();
    const sheet = spreadsheet.getSheetByName(MONITOR_CONFIG.activitySheet);
    if (!sheet) throw new Error('Aba Atividades não encontrada.');

    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      sheet.appendRow([
        new Date(),
        activity.event,
        activity.page,
        activity.mode,
        activity.device,
        activity.detail,
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse_({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false });
  }
}

function sendHourlyReport() {
  const spreadsheet = openMonitorSpreadsheet_();
  const activitySheet = spreadsheet.getSheetByName(MONITOR_CONFIG.activitySheet);
  const reportSheet = spreadsheet.getSheetByName(MONITOR_CONFIG.reportSheet);
  if (!activitySheet || !reportSheet) throw new Error('Abas do monitor não encontradas.');

  const properties = PropertiesService.getScriptProperties();
  const end = new Date();
  const storedStart = Number(properties.getProperty('PCFORGE_LAST_REPORT_AT'));
  const start = new Date(Number.isFinite(storedStart) && storedStart > 0
    ? storedStart
    : end.getTime() - 60 * 60 * 1000);

  const rows = activitySheet.getLastRow() > 1
    ? activitySheet.getRange(2, 1, activitySheet.getLastRow() - 1, 6).getValues()
    : [];
  const periodRows = rows.filter(row => {
    const timestamp = row[0] instanceof Date ? row[0].getTime() : 0;
    return timestamp > start.getTime() && timestamp <= end.getTime();
  });

  const counts = countEvents_(periodRows);
  const subject = periodRows.length
    ? `📊 PCForge: ${periodRows.length} atividade(s) na última hora`
    : '📊 PCForge: nenhuma atividade na última hora';

  MailApp.sendEmail({
    to: MONITOR_CONFIG.recipient,
    subject,
    htmlBody: buildReportHtml_(start, end, periodRows, counts),
  });

  reportSheet.appendRow([
    new Date(),
    start,
    end,
    periodRows.length,
    counts.page_view || 0,
    counts.build_completed || 0,
    counts.pdf_downloaded || 0,
    'Enviado',
  ]);
  properties.setProperty('PCFORGE_LAST_REPORT_AT', String(end.getTime()));
}

function validateActivity_(params) {
  const activity = {
    event: safeValue_(params.event, 40),
    page: safeValue_(params.page, 24),
    mode: safeValue_(params.mode, 16),
    device: safeValue_(params.device, 12),
    detail: safeValue_(params.detail, 80),
  };

  if (!ALLOWED_EVENTS.includes(activity.event)) return null;
  if (!ALLOWED_PAGES.includes(activity.page)) return null;
  if (!ALLOWED_MODES.includes(activity.mode)) return null;
  if (!ALLOWED_DEVICES.includes(activity.device)) return null;
  if (activity.detail && !/^[a-z0-9_-]+$/i.test(activity.detail)) return null;
  return activity;
}

function safeValue_(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

function allowRequest_() {
  const cache = CacheService.getScriptCache();
  const minuteKey = `requests_${Utilities.formatDate(new Date(), 'UTC', 'yyyyMMddHHmm')}`;
  const current = Number(cache.get(minuteKey) || 0);
  if (current >= MONITOR_CONFIG.maxRequestsPerMinute) return false;
  cache.put(minuteKey, String(current + 1), 90);
  return true;
}

function countEvents_(rows) {
  return rows.reduce((counts, row) => {
    const eventName = String(row[1] || '');
    counts[eventName] = (counts[eventName] || 0) + 1;
    return counts;
  }, {});
}

function buildReportHtml_(start, end, rows, counts) {
  const format = date => Utilities.formatDate(date, MONITOR_CONFIG.timezone, 'dd/MM/yyyy HH:mm');
  const devices = {};
  const modes = {};
  rows.forEach(row => {
    const device = String(row[4] || 'não informado');
    const mode = String(row[3] || 'não informado');
    devices[device] = (devices[device] || 0) + 1;
    modes[mode] = (modes[mode] || 0) + 1;
  });

  const metric = (label, value) => `
    <td style="padding:14px;border:1px solid #ddd;text-align:center">
      <strong style="font-size:22px;color:#6c63ff">${value}</strong><br>
      <span style="color:#555">${label}</span>
    </td>`;

  return `
    <div style="font-family:Arial,sans-serif;color:#222;max-width:680px">
      <h2 style="color:#6c63ff">⚙️ Relatório de atividades do PCForge</h2>
      <p><strong>Período:</strong> ${format(start)} até ${format(end)}</p>
      <table style="border-collapse:collapse;width:100%;margin:20px 0"><tr>
        ${metric('Acessos', counts.page_view || 0)}
        ${metric('Builds iniciadas', counts.build_started || 0)}
        ${metric('Builds concluídas', counts.build_completed || 0)}
        ${metric('PDFs baixados', counts.pdf_downloaded || 0)}
      </tr></table>
      <p><strong>Compartilhamentos:</strong> ${counts.build_shared || 0}<br>
      <strong>Contatos enviados:</strong> ${counts.contact_submitted || 0}<br>
      <strong>Erros registrados:</strong> ${counts.application_error || 0}</p>
      <p><strong>Dispositivos:</strong> ${formatBreakdown_(devices)}<br>
      <strong>Modos:</strong> ${formatBreakdown_(modes)}</p>
      <p style="color:#666;font-size:12px">
        Relatório anônimo: não contém IP, nome, e-mail, mensagem ou configuração completa.
      </p>
    </div>`;
}

function formatBreakdown_(values) {
  const entries = Object.entries(values);
  return entries.length
    ? entries.map(([label, total]) => `${label || 'não informado'}: ${total}`).join(' · ')
    : 'sem atividade';
}

function installHourlyTrigger_() {
  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === 'sendHourlyReport')
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger('sendHourlyReport')
    .timeBased()
    .everyHours(1)
    .create();
}

function removeExampleRow_(spreadsheet) {
  const sheet = spreadsheet.getSheetByName(MONITOR_CONFIG.activitySheet);
  if (sheet && String(sheet.getRange('B2').getValue()).startsWith('exemplo_')) {
    sheet.deleteRow(2);
  }
}

function openMonitorSpreadsheet_() {
  const spreadsheetId = PropertiesService.getScriptProperties()
    .getProperty('PCFORGE_SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('Execute setupMonitor primeiro.');
  return SpreadsheetApp.openById(spreadsheetId);
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
