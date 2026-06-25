import { FlowEngine } from './flow-engine.js';
import { FLOW_GROUPS } from './flow-data.js';

// ─── Supabase Configuration ──────────────────────────────────────────────────
let supabase = null;

function getSupabase() {
  if (supabase) return supabase;
  try {
    if (window.supabase) {
      const url = (import.meta.env.VITE_SUPABASE_URL || "").replace(/^["']|["']$/g, "");
      const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").replace(/^["']|["']$/g, "");
      if (!url || !key) {
        console.warn("Supabase URL or Anon Key is missing in environment variables.");
        return null;
      }
      supabase = window.supabase.createClient(url, key);
      console.log("Supabase client initialized successfully.");
    } else {
      console.warn("window.supabase is not defined on the window object.");
    }
  } catch (e) {
    console.error("Failed to initialize Supabase in briefing.js:", e);
  }
  return supabase;
}


// ─── Rate limiter (client-side guard) ─────────────────────────────────────────
const RATE_KEY = 'hublumi_submission_limit';
function checkRateLimit() {
  const d = JSON.parse(localStorage.getItem(RATE_KEY) || '{"count":0,"last":0}');
  if (Date.now() - d.last > 24 * 3600 * 1000) return { count: 0, last: 0 };
  return d;
}
function incrementRateLimit() {
  const d = checkRateLimit();
  d.count++;
  d.last = Date.now();
  localStorage.setItem(RATE_KEY, JSON.stringify(d));
}

// ─── Engine ────────────────────────────────────────────────────────────────────
const engine = new FlowEngine();

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const wizardSection  = document.getElementById('briefing');
const wizardMount    = document.getElementById('wizardMount');
const reviewMount    = document.getElementById('reviewMount');
const progressBar    = document.getElementById('progressBar');
const progressText   = document.getElementById('progressText');
const progressWrap   = document.getElementById('progressWrap');
const successOverlay = document.getElementById('successOverlay');
const resumeBanner   = document.getElementById('resumeBanner');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function collectStepAnswers() {
  const form = wizardMount.querySelector('form');
  if (!form) return {};
  const out = {};
  const data = new FormData(form);

  for (const [key] of data.entries()) {
    const els = form.querySelectorAll(`[name="${CSS.escape(key)}"]`);
    if (els.length === 1 && els[0].type !== 'checkbox') {
      out[key] = data.get(key);
    }
  }

  const checkboxNames = new Set();
  form.querySelectorAll('input[type="checkbox"]').forEach(cb => checkboxNames.add(cb.name));
  checkboxNames.forEach(name => {
    out[name] = [...form.querySelectorAll(`input[name="${CSS.escape(name)}"]:checked`)].map(cb => cb.value);
  });

  return out;
}

function updateProgress() {
  const p = engine.getProgress();
  if (progressBar)  progressBar.style.width = p.percent + '%';
  if (progressText) progressText.textContent = p.stepLabel;
}

// ─── Field Renderers ──────────────────────────────────────────────────────────

function renderField(field, savedValue) {
  const wrapper = document.createElement('div');
  wrapper.className = `wz-field${field.type === 'textarea' || field.type === 'checkbox-group' || field.type === 'radio-card' ? ' wz-field--full' : ''}`;

  const label = document.createElement('label');
  label.htmlFor = field.id;
  label.textContent = field.label + (field.required ? ' *' : '');
  wrapper.appendChild(label);

  if (field.type === 'text' || field.type === 'email' || field.type === 'tel') {
    const inp = document.createElement('input');
    inp.type = field.type;
    inp.id = field.id;
    inp.name = field.name;
    inp.placeholder = field.placeholder || '';
    inp.required = !!field.required;
    inp.value = savedValue || '';
    wrapper.appendChild(inp);
  }

  else if (field.type === 'textarea') {
    const ta = document.createElement('textarea');
    ta.id = field.id;
    ta.name = field.name;
    ta.rows = field.rows || 4;
    ta.placeholder = field.placeholder || '';
    ta.required = !!field.required;
    ta.value = savedValue || '';
    wrapper.appendChild(ta);
  }

  else if (field.type === 'select') {
    const sel = document.createElement('select');
    sel.id = field.id;
    sel.name = field.name;
    const blank = document.createElement('option');
    blank.value = '';
    blank.textContent = 'Selecione';
    sel.appendChild(blank);
    (field.options || []).forEach(opt => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      o.selected = savedValue === opt;
      sel.appendChild(o);
    });
    wrapper.appendChild(sel);
  }

  else if (field.type === 'checkbox-group') {
    const savedArr = Array.isArray(savedValue) ? savedValue : [];
    const grid = document.createElement('div');
    grid.className = 'wz-checks';
    (field.options || []).forEach(opt => {
      const lbl = document.createElement('label');
      lbl.className = 'wz-check';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.name = field.name;
      cb.value = opt;
      cb.checked = savedArr.includes(opt);
      lbl.appendChild(cb);
      lbl.appendChild(document.createTextNode(' ' + opt));
      grid.appendChild(lbl);
    });
    wrapper.appendChild(grid);
  }

  else if (field.type === 'radio-card') {
    const grid = document.createElement('div');
    grid.className = 'wz-radio-cards';
    (field.options || []).forEach(opt => {
      const lbl = document.createElement('label');
      lbl.className = 'wz-radio-card' + (savedValue === opt.value ? ' selected' : '');
      lbl.dataset.value = opt.value;

      const rb = document.createElement('input');
      rb.type = 'radio';
      rb.name = field.name;
      rb.value = opt.value;
      rb.required = !!field.required;
      rb.checked = savedValue === opt.value;

      const content = document.createElement('div');
      content.className = 'wz-radio-card__content';

      const titleEl = document.createElement('strong');
      titleEl.textContent = opt.label;

      const descEl = document.createElement('p');
      descEl.textContent = opt.desc;

      content.appendChild(titleEl);
      content.appendChild(descEl);
      lbl.appendChild(rb);
      lbl.appendChild(content);

      lbl.addEventListener('click', () => {
        grid.querySelectorAll('.wz-radio-card').forEach(c => c.classList.remove('selected'));
        lbl.classList.add('selected');
      });

      grid.appendChild(lbl);
    });
    wrapper.appendChild(grid);
  }

  return wrapper;
}

// ─── Step Renderer ────────────────────────────────────────────────────────────

function renderStep(group, direction = 'forward') {
  if (reviewMount) reviewMount.style.display = 'none';
  if (wizardMount) wizardMount.style.display = '';

  if (wizardSection) {
    wizardSection.scrollIntoView({ behavior: 'smooth' });
  }

  const animIn  = direction === 'forward' ? 'slide-in-right' : 'slide-in-left';
  const animOut = direction === 'forward' ? 'slide-out-left' : 'slide-out-right';

  const existing = wizardMount ? wizardMount.querySelector('.wz-step') : null;
  if (existing) {
    existing.classList.add(animOut);
    existing.addEventListener('animationend', () => existing.remove(), { once: true });
  }

  const step = document.createElement('div');
  step.className = `wz-step ${animIn}`;

  const header = document.createElement('div');
  header.className = 'wz-step__header';
  header.innerHTML = `
    <div>
      <h2 class="wz-step__title">${group.label}</h2>
      <p class="wz-step__help">${group.helpText}</p>
    </div>
  `;
  step.appendChild(header);

  const form = document.createElement('form');
  form.id = 'stepForm';
  form.noValidate = false;

  const fieldsGrid = document.createElement('div');
  fieldsGrid.className = 'wz-fields';

  group.fields.forEach(field => {
    const savedVal = engine.answers[field.name] !== undefined ? engine.answers[field.name] : '';
    fieldsGrid.appendChild(renderField(field, savedVal));
  });

  form.appendChild(fieldsGrid);
  step.appendChild(form);

  const nav = document.createElement('div');
  nav.className = 'wz-nav';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'wz-btn wz-btn--ghost';
  backBtn.id = 'btnBack';
  backBtn.textContent = '← Voltar';
  backBtn.disabled = engine.isFirstStep();
  backBtn.addEventListener('click', () => {
    engine.answers = { ...engine.answers, ...collectStepAnswers() };
    const prev = engine.prev();
    if (prev) renderStep(prev, 'backward');
    updateProgress();
  });

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'wz-btn wz-btn--primary';
  nextBtn.id = 'btnNext';

  const activePath = engine.getActivePath();
  const isLast = activePath.indexOf(group.id) === activePath.length - 1;
  nextBtn.textContent = isLast ? 'Revisar respostas →' : 'Próximo →';

  nextBtn.addEventListener('click', async () => {
    if (!form.reportValidity()) return;

    const stepAnswers = collectStepAnswers();

    // ─── Step 1: Identificação & Lead Capture ───
    if (group.id === 'identificacao') {
      nextBtn.disabled = true;
      nextBtn.textContent = 'Verificando...';

      const emailVal = stepAnswers['E-mail'];
      const nameVal = stepAnswers['Responsável pelo briefing'];

      try {
        // 1. Salvar os dados básicos de identificação na tabela 'briefings'
        const client = getSupabase();
        if (client) {
          await client
            .from('briefings')
            .insert([{
              contact_name: nameVal,
              email: emailVal,
              company_name: 'Pendente',
              full_payload: { name: nameVal, email: emailVal }
            }]);
        }

        // 2. Buscar histórico do usuário para exibição
        let pastBriefings = null;
        if (client) {
          const { data, error } = await client
            .from('hl_briefings')
            .select('*')
            .ilike('email', emailVal)
            .order('created_at', { ascending: false });

          if (error) throw error;
          pastBriefings = data;
        }

        if (pastBriefings && pastBriefings.length > 0) {
          renderHistory(pastBriefings, emailVal, nameVal, stepAnswers);
          return;
        }
      } catch (err) {
        console.error("Erro ao processar identificação/histórico:", err);
      } finally {
        nextBtn.disabled = false;
        nextBtn.textContent = isLast ? 'Revisar respostas →' : 'Próximo →';
      }
    }

    const nextGroup = engine.next(stepAnswers);

    if (nextGroup === null) {
      showReview();
    } else {
      renderStep(nextGroup, 'forward');
    }
    updateProgress();
  });

  nav.appendChild(backBtn);
  nav.appendChild(nextBtn);
  step.appendChild(nav);

  if (wizardMount) wizardMount.appendChild(step);
  updateProgress();
  if (progressWrap) progressWrap.style.display = '';
}

// ─── History Screen ───────────────────────────────────────────────────────────

function renderHistory(briefings, email, name, stepAnswers) {
  if (progressWrap) progressWrap.style.display = 'none';
  if (wizardMount) wizardMount.innerHTML = '';

  const historyDiv = document.createElement('div');
  historyDiv.className = 'wz-step slide-in-right';

  historyDiv.innerHTML = `
    <div class="wz-step__header" style="margin-bottom: 24px;">
      <div>
        <h2 class="wz-step__title">Olá, ${name}</h2>
        <p class="wz-step__help">Encontramos diagnósticos anteriores associados ao seu e-mail: <strong>${email}</strong></p>
      </div>
    </div>

    <div class="history-list" style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
      ${briefings.map((b, idx) => {
        const date = new Date(b.created_at).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        const company = b.company_name || 'Empresa não informada';

        let statusText = 'Novo';
        let statusClass = 'status-new';
        if (b.status === 'analyzing') { statusText = 'Em análise'; statusClass = 'status-analyzing'; }
        else if (b.status === 'completed') { statusText = 'Concluído'; statusClass = 'status-completed'; }

        return `
          <div class="history-item" style="border: 1px solid var(--line); border-radius: 20px; padding: 20px; display: flex; justify-content: space-between; align-items: center; background: #fafafa;">
            <div>
              <strong style="display: block; font-size: 16px; margin-bottom: 4px;">${company}</strong>
              <span style="font-size: 13px; color: var(--muted); display: block;">Enviado em: ${date}</span>
              <span class="status-badge ${statusClass}" style="margin-top: 8px;">${statusText}</span>
            </div>
            <button class="wz-btn wz-btn--ghost wz-btn--sm btn-view-details" data-idx="${idx}" type="button" style="border-radius: 12px; font-size: 13px; padding: 8px 16px;">Ver detalhes</button>
          </div>
        `;
      }).join('')}
    </div>

    <div class="wz-nav">
      <button class="wz-btn wz-btn--ghost" id="btnHistoryBack" type="button">← Voltar</button>
      <button class="wz-btn wz-btn--primary" id="btnHistoryNew" type="button">Iniciar novo diagnóstico →</button>
    </div>
  `;

  if (wizardMount) wizardMount.appendChild(historyDiv);

  document.getElementById('btnHistoryBack').addEventListener('click', () => {
    const current = engine.start(false);
    if (current) renderStep(current, 'backward');
  });

  document.getElementById('btnHistoryNew').addEventListener('click', () => {
    engine.answers = { ...engine.answers, ...stepAnswers };
    const nextGroup = engine.next(stepAnswers);
    if (nextGroup) renderStep(nextGroup, 'forward');
    updateProgress();
  });

  historyDiv.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.dataset.idx;
      const b = briefings[idx];
      showReadOnlyBriefing(b, () => renderHistory(briefings, email, name, stepAnswers));
    });
  });
}

function showReadOnlyBriefing(briefing, onBack) {
  if (wizardMount) wizardMount.innerHTML = '';
  if (progressWrap) progressWrap.style.display = 'none';

  const reviewDiv = document.createElement('div');
  reviewDiv.className = 'wz-step slide-in-right';

  const payload = briefing.full_payload || {};

  const date = new Date(briefing.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  let statusText = 'Novo';
  if (briefing.status === 'analyzing') statusText = 'Em análise';
  else if (briefing.status === 'completed') statusText = 'Concluído';

  let sectionsHTML = '';
  for (const [key, value] of Object.entries(payload)) {
    if (key.startsWith('_') || !value) continue;
    sectionsHTML += `
      <div class="review-item" style="padding: 12px 0; border-bottom: 1px solid rgba(0,0,0,.04); display: grid; grid-template-columns: 200px 1fr; gap: 12px;">
        <span class="review-item__label" style="font-weight: 700; color: var(--muted); font-size: 13px;">${key}</span>
        <span class="review-item__value" style="font-size: 15px; color: #111;">${Array.isArray(value) ? value.join(', ') : value}</span>
      </div>
    `;
  }

  reviewDiv.innerHTML = `
    <div class="wz-step__header" style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--line);">
      <div>
        <h2 class="wz-step__title">${briefing.company_name || 'Detalhes do Diagnóstico'}</h2>
        <p class="wz-step__help">Enviado em <strong>${date}</strong> · Status: <strong>${statusText}</strong></p>
      </div>
    </div>

    <div class="read-only-content" style="max-height: 400px; overflow-y: auto; margin-bottom: 32px; padding-right: 8px;">
      ${sectionsHTML}
    </div>

    <div class="wz-nav">
      <button class="wz-btn wz-btn--ghost" id="btnReadOnlyBack" type="button">← Voltar ao histórico</button>
    </div>
  `;

  if (wizardMount) wizardMount.appendChild(reviewDiv);

  document.getElementById('btnReadOnlyBack').addEventListener('click', onBack);
}

// ─── Review Screen ────────────────────────────────────────────────────────────

function showReview() {
  if (wizardMount) { wizardMount.innerHTML = ''; wizardMount.style.display = 'none'; }
  if (reviewMount) { reviewMount.style.display = ''; reviewMount.innerHTML = ''; }

  const header = document.createElement('div');
  header.className = 'review-header';
  header.innerHTML = `
    <h2>Revise suas respostas</h2>
    <p>Tudo certo? Confira abaixo e clique em enviar quando estiver pronto.</p>
  `;
  if (reviewMount) reviewMount.appendChild(header);

  const activePath = engine.getActivePath();
  activePath.forEach(groupId => {
    const group = FLOW_GROUPS.find(g => g.id === groupId);
    if (!group) return;

    const section = document.createElement('div');
    section.className = 'review-section';

    const secHeader = document.createElement('div');
    secHeader.className = 'review-section__header';
    secHeader.innerHTML = `
      <strong>${group.label}</strong>
    `;

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'wz-btn wz-btn--ghost wz-btn--sm';
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', () => {
      const g = engine.goTo(groupId);
      if (g) renderStep(g, 'backward');
      updateProgress();
    });

    secHeader.appendChild(editBtn);
    section.appendChild(secHeader);

    group.fields.forEach(field => {
      const val = engine.answers[field.name];
      if (!val || (Array.isArray(val) && val.length === 0)) return;
      const item = document.createElement('div');
      item.className = 'review-item';
      item.innerHTML = `
        <span class="review-item__label">${field.label}</span>
        <span class="review-item__value">${Array.isArray(val) ? val.join(', ') : val}</span>
      `;
      section.appendChild(item);
    });

    if (reviewMount) reviewMount.appendChild(section);
  });

  const submitCard = document.createElement('div');
  submitCard.className = 'final-card';
  submitCard.innerHTML = `
    <div>
      <div class="kicker">Finalização</div>
      <h2>Enviar diagnóstico.</h2>
      <p>Ao enviar, a HubLumi irá analisar o contexto da empresa, mapear oportunidades e estruturar possíveis caminhos de automação, integração, IA ou sistema sob medida.</p>
    </div>
    <div class="submit-box">
      <button class="btn btn-dark" type="button" id="btnSubmit">Enviar diagnóstico agora</button>
      <p>Após o envio, nossa equipe irá revisar as respostas e organizar os próximos passos.</p>
    </div>
  `;
  if (reviewMount) reviewMount.appendChild(submitCard);

  const btnSubmit = document.getElementById('btnSubmit');
  if (btnSubmit) btnSubmit.addEventListener('click', handleSubmit);

  if (progressBar)  progressBar.style.width = '100%';
  if (progressText) progressText.textContent = 'Revisão final';
}

// ─── Submission ───────────────────────────────────────────────────────────────

async function handleSubmit() {
  const limit = checkRateLimit();
  if (limit.count >= 50) {
    alert('Limite de envios atingido para hoje. Tente novamente amanhã.');
    return;
  }

  const submitBtn = document.getElementById('btnSubmit');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando...'; }

  try {
    const payload = engine.getFinalPayload();

    // 1. Salvar os dados completos na tabela 'hl_briefings'
    let dbError = null;
    const client = getSupabase();
    if (client) {
      const { error } = await client
        .from('hl_briefings')
        .insert([{
          company_name: payload['Nome da empresa'],
          segment: payload['Segmento de atuação'],
          contact_name: payload['Responsável pelo briefing'],
          email: payload['E-mail'],
          phone: payload['Telefone/WhatsApp'],
          full_payload: payload
        }]);
      dbError = error;
    } else {
      dbError = new Error("Supabase client is not initialized.");
    }

    if (dbError) throw new Error('Erro ao salvar no banco: ' + dbError.message);

    // 2. FormSubmit backup
    try {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 4000);
      await fetch('https://formsubmit.co/ajax/contato.hublumi@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...payload, _subject: 'Novo diagnóstico recebido - HubLumi' }),
        signal: ctrl.signal,
      });
      clearTimeout(tid);
    } catch (_) {}

    incrementRateLimit();
    engine.clearStorage();
    if (successOverlay) successOverlay.style.display = 'flex';

  } catch (err) {
    console.error('Submission error:', err);
    alert('Erro no envio: ' + err.message);
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Enviar diagnóstico agora'; }
  }
}

// ─── Resume Banner ─────────────────────────────────────────────────────────────

function setupResumeBanner() {
  if (!resumeBanner) return;

  if (engine.isResuming()) {
    resumeBanner.style.display = 'flex';

    document.getElementById('btnResume')?.addEventListener('click', () => {
      resumeBanner.style.display = 'none';
      startWizard(false);
      if (wizardSection) wizardSection.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('btnRestart')?.addEventListener('click', () => {
      resumeBanner.style.display = 'none';
      startWizard(true);
    });
  }
}

function startWizard(fresh = true) {
  const introBox = document.getElementById('introBox');
  if (introBox) introBox.style.display = 'none';

  const group = engine.start(fresh);
  if (group) renderStep(group, 'forward');
}

// ─── Init ──────────────────────────────────────────────────────────────────────

function init() {
  setupResumeBanner();

  document.querySelectorAll('a[href="#briefing"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (wizardSection) wizardSection.scrollIntoView({ behavior: 'smooth' });

      if (!engine.isResuming()) {
        startWizard(true);
      }
    });
  });

  document.getElementById('closeSuccess')?.addEventListener('click', () => {
    if (successOverlay) successOverlay.style.display = 'none';
  });
}

// Executar após carregamento do DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
