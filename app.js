const state = { data: loadData(), current: null };

const fmt = (v) => (v||0).toLocaleString("pt-BR", {minimumFractionDigits:2, maximumFractionDigits:2});
const MESES_NOMES = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
const monthLabel = (key) => { const [y,m] = key.split("-"); return `${MESES_NOMES[parseInt(m,10)-1]} de ${y}`; };
const monthKeys = () => Object.keys(state.data).sort();

const SVG = {
  down:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 7 7 17"/><path d="M17 17H7V7"/></svg>`,
  up:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>`,
  shield:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/></svg>`,
  pulse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h4l2 8 4-16 2 8h6"/></svg>`,
  coin:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/></svg>`,
  zap:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 11-14h-7l1-6z"/></svg>`,
};

// ---------------- Core calculations ----------------
function totals(key){
  const m = state.data[key];
  const totReceitas = RECEITAS.reduce((s,c)=> s + (m.receitas[c]||0), 0);
  const totDespesas = DESPESAS.reduce((s,[c])=> s + (m.despesas[c]||0), 0);
  return { totReceitas, totDespesas, saldoMes: totReceitas - totDespesas };
}

function saldoAcumulado(key){
  const keys = monthKeys();
  let acc = 0;
  for (const k of keys){
    const t = totals(k);
    acc = (k === keys[0]) ? (state.data[k].saldoAnterior||0) + t.saldoMes : acc + t.saldoMes;
    if (k === key) return acc;
  }
  return acc;
}

function despesasPorGrupo(key){
  const m = state.data[key]; const out = {};
  GRUPOS_ORDEM.forEach(g => out[g] = 0);
  DESPESAS.forEach(([cat, grupo]) => out[grupo] += (m.despesas[cat]||0));
  return out;
}

function top5(key){
  const m = state.data[key];
  return DESPESAS.map(([cat]) => [cat, m.despesas[cat]||0])
    .filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1]).slice(0,5);
}

function trendPct(key, field){ // field: totReceitas | totDespesas
  const keys = monthKeys(); const i = keys.indexOf(key);
  if (i <= 0) return null;
  const cur = totals(key)[field], prev = totals(keys[i-1])[field];
  if (!prev) return null;
  return ((cur - prev) / prev) * 100;
}

// ---------------- Charts ----------------
let charts = {};
function destroy(id){ if (charts[id]) { charts[id].destroy(); delete charts[id]; } }

function renderFlowChart(){
  const keys = monthKeys();
  let acc = 0;
  const saldoSeries = keys.map((k,i) => {
    const t = totals(k);
    acc = (i===0 ? (state.data[k].saldoAnterior||0) : acc) + t.saldoMes;
    return acc;
  });
  destroy("flow");
  charts.flow = new Chart(document.getElementById("chartFlow"), {
    type: "line",
    data: { labels: keys.map(monthLabel), datasets: [
      { label:"Receitas", data: keys.map(k=>totals(k).totReceitas), borderColor:"#1F9E96", backgroundColor:"#1F9E96", pointRadius:4, tension:.25 },
      { label:"Despesas", data: keys.map(k=>totals(k).totDespesas), borderColor:"#E8823C", backgroundColor:"#E8823C", pointRadius:4, tension:.25 },
      { label:"Saldo", data: saldoSeries, borderColor:"#122A46", backgroundColor:"#122A46", pointRadius:4, tension:.25, borderWidth:2.5 },
    ]},
    options: { plugins:{ legend:{ display:false } },
      scales:{ x:{ grid:{ display:false }, ticks:{ font:{family:"Inter",size:11}, color:"#6B7688" } },
               y:{ grid:{ color:"#EEF1F5" }, ticks:{ font:{family:"Inter",size:10.5}, color:"#9AA4B4",
                    callback:(v)=> Math.abs(v)>=1000 ? (v/1000)+" mil" : v } } } }
  });
}

function renderSegmentCharts(){
  const k = state.current, m = state.data[k];
  const rLabels = RECEITAS.filter(c => (m.receitas[c]||0) > 0);
  destroy("receitas");
  charts.receitas = new Chart(document.getElementById("chartReceitas"), {
    type: "doughnut",
    data: { labels: rLabels, datasets: [{ data: rLabels.map(c => m.receitas[c]), backgroundColor:["#1F9E96","#E8823C","#122A46","#C98A3E"], borderWidth:0 }] },
    options: { cutout:"62%", plugins:{ legend:{ position:"bottom", labels:{ font:{family:"Inter",size:11}, boxWidth:9, usePointStyle:true } } } }
  });

  const grupos = despesasPorGrupo(k);
  const gEntries = GRUPOS_ORDEM.filter(g => grupos[g] > 0);
  ["grupos","grupos2"].forEach(id => {
    const canvas = document.getElementById(id === "grupos" ? "chartGrupos" : "chartGrupos2");
    if (!canvas) return;
    destroy(id);
    charts[id] = new Chart(canvas, {
      type: "bar",
      data: { labels: gEntries, datasets: [{ data: gEntries.map(g=>grupos[g]), backgroundColor:"#122A46", borderRadius:5, maxBarThickness:22 }] },
      options: { indexAxis:"y", plugins:{ legend:{ display:false } },
        scales:{ x:{ grid:{ color:"#EEF1F5" }, ticks:{ font:{family:"Inter",size:10}, color:"#9AA4B4" } },
                 y:{ grid:{ display:false }, ticks:{ font:{family:"Inter",size:11}, color:"#16202C" } } } }
    });
  });
}

// ---------------- Page: Visão geral ----------------
function trendTag(pct){
  if (pct === null) return `<span class="tag flat">Único período</span>`;
  const up = pct >= 0;
  return `<span class="tag ${up?'up':'down'}">${up?'↗':'↘'} ${Math.abs(pct).toFixed(1)}%</span>`;
}

function renderPeriodBar(){
  const sel = document.getElementById("periodSelect");
  sel.innerHTML = "";
  monthKeys().forEach(k => {
    const opt = document.createElement("option");
    opt.value = k; opt.textContent = monthLabel(k).replace(/^./, c=>c.toUpperCase());
    if (k === state.current) opt.selected = true;
    sel.appendChild(opt);
  });
  document.getElementById("periodLabel").textContent = monthLabel(state.current).replace(/^./, c=>c.toUpperCase());
  const lancados = RECEITAS.concat(DESPESAS.map(d=>d[0])).length;
  document.getElementById("periodHint").textContent = `${lancados} categorias no período`;
}

function renderKPIs(){
  const k = state.current, t = totals(k), acc = saldoAcumulado(k);
  const margem = t.totReceitas ? (t.saldoMes / t.totReceitas * 100) : 0;
  const rTrend = trendPct(k, "totReceitas"), dTrend = trendPct(k, "totDespesas");
  const saudavel = margem >= 30 ? "Saudável" : margem >= 10 ? "Estável" : "Atenção";

  const cards = [
    { label:"RECEITAS", icon:"down", color:"teal", value:t.totReceitas, sub:"Entradas no período", tag:trendTag(rTrend) },
    { label:"DESPESAS", icon:"up", color:"orange", value:t.totDespesas, sub:"Saídas no período", tag:trendTag(dTrend===null?null:-dTrend) },
    { label:"SALDO OPERACIONAL", icon:"shield", color:"navy", value:t.saldoMes, sub:`Receitas menos despesas`, tag:`<span class="tag ${margem>=10?'up':'down'}">${saudavel}</span>` },
    { label:"MARGEM FINANCEIRA", icon:"pulse", color:"green", value:null, valueText: margem.toFixed(1)+"%", sub:"Eficiência do caixa" },
    { label:"SALDO FINAL", icon:"coin", color:"gold", value:acc, sub:"Com saldo anterior" },
  ];

  document.getElementById("kpiRow").innerHTML = cards.map(c => `
    <div class="kpi-card">
      <div class="kpi-top"><span class="kpi-label">${c.label}</span><span class="kpi-icon ${c.color}">${SVG[c.icon]}</span></div>
      <div class="kpi-value">${c.valueText ? c.valueText : "R$ "+fmt(c.value)}</div>
      <div class="kpi-sub">${c.sub} ${c.tag||""}</div>
    </div>`).join("");

  // insight
  const grupos = despesasPorGrupo(k);
  let maiorGrupo = GRUPOS_ORDEM[0], maiorVal = 0;
  GRUPOS_ORDEM.forEach(g => { if (grupos[g] > maiorVal) { maiorVal = grupos[g]; maiorGrupo = g; } });
  const pctGrupo = t.totDespesas ? (maiorVal / t.totDespesas * 100) : 0;
  document.getElementById("insightCard").innerHTML = `
    <span class="insight-ic">${SVG.zap}</span>
    <div class="insight-body">
      <strong>Leitura rápida</strong>
      <p>O maior peso da despesa está em <b>${maiorGrupo}</b>, representando ${pctGrupo.toFixed(1)}% do total.</p>
    </div>
    <div class="insight-value">R$ ${fmt(maiorVal)}</div>`;
}

function renderOverview(){
  renderPeriodBar();
  renderKPIs();
  renderFlowChart();
  renderSegmentCharts();
}

// ---------------- Page: Lançamentos ----------------
function renderLancamentos(){
  const k = state.current, m = state.data[k];
  document.getElementById("lancMonthLabel").textContent = monthLabel(k).replace(/^./, c=>c.toUpperCase());
  const tbody = document.getElementById("lancTableBody");
  tbody.innerHTML = "";

  const groupRow = (label) => { const tr = document.createElement("tr"); tr.className="group-row"; tr.innerHTML = `<td colspan="2">${label}</td>`; tbody.appendChild(tr); };
  const itemRow = (label, value, onInput) => {
    const tr = document.createElement("tr");
    const tdLabel = document.createElement("td"); tdLabel.textContent = label;
    const tdVal = document.createElement("td"); tdVal.className = "num";
    const input = document.createElement("input");
    input.type = "number"; input.step = "0.01"; input.value = value || "";
    input.addEventListener("input", () => { onInput(parseFloat(input.value)||0); saveData(state.data); renderAll(); });
    tdVal.appendChild(input);
    tr.appendChild(tdLabel); tr.appendChild(tdVal);
    tbody.appendChild(tr);
  };

  groupRow("Saldo do mês anterior");
  itemRow("Saldo anterior", m.saldoAnterior, v => m.saldoAnterior = v);
  groupRow("Receitas");
  RECEITAS.forEach(c => itemRow(c, m.receitas[c], v => m.receitas[c] = v));
  GRUPOS_ORDEM.forEach(grupo => {
    groupRow(grupo);
    DESPESAS.filter(([,g]) => g === grupo).forEach(([c]) => itemRow(c, m.despesas[c], v => m.despesas[c] = v));
  });
}

// ---------------- Page: Relatórios ----------------
function renderRelatorios(){
  const k = state.current;
  document.getElementById("top5List").innerHTML = top5(k).map(([cat,val],i) => `
    <li><span class="cat"><span class="rank">${i+1}</span>${cat}</span><span class="val">R$ ${fmt(val)}</span></li>`).join("")
    || `<li>Nenhuma despesa lançada neste período.</li>`;

  const tbody = document.getElementById("resumoTableBody");
  tbody.innerHTML = "";
  let acc = 0;
  monthKeys().forEach((kk,i) => {
    const t = totals(kk);
    acc = (i===0 ? (state.data[kk].saldoAnterior||0) : acc) + t.saldoMes;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${monthLabel(kk).replace(/^./, c=>c.toUpperCase())}</td>
      <td class="num">R$ ${fmt(t.totReceitas)}</td><td class="num">R$ ${fmt(t.totDespesas)}</td>
      <td class="num">R$ ${fmt(t.saldoMes)}</td><td class="num">R$ ${fmt(acc)}</td>`;
    tbody.appendChild(tr);
  });
}

// ---------------- Page: Configurações ----------------
function renderConfig(){
  const tbody = document.getElementById("configMonthsBody");
  tbody.innerHTML = "";
  monthKeys().forEach(k => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${monthLabel(k).replace(/^./, c=>c.toUpperCase())}</td>
      <td class="num">R$ ${fmt(state.data[k].saldoAnterior)}</td>
      <td class="num"><button class="link-btn danger" data-remove="${k}">Remover</button></td>`;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.remove;
      if (monthKeys().length <= 1) { alert("É preciso manter pelo menos um mês."); return; }
      if (!confirm(`Remover ${monthLabel(key)}? Esta ação não pode ser desfeita.`)) return;
      delete state.data[key];
      if (state.current === key) state.current = monthKeys().slice(-1)[0];
      saveData(state.data); renderAll();
    });
  });
}

// ---------------- Global render ----------------
function renderAll(){
  renderOverview();
  renderLancamentos();
  renderRelatorios();
  renderConfig();
}

// ---------------- Navigation ----------------
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("page-" + btn.dataset.page).classList.add("active");
  });
});

document.getElementById("periodSelect").addEventListener("change", (e) => { state.current = e.target.value; renderAll(); });
document.getElementById("btnPrint").addEventListener("click", () => window.print());
document.getElementById("btnExportCSV").addEventListener("click", () => {
  const k = state.current, m = state.data[k];
  let rows = [["Mês","Tipo","Categoria","Grupo","Valor"]];
  RECEITAS.forEach(c => rows.push([k,"Receita",c,"Dízimos e Ofertas", m.receitas[c]||0]));
  DESPESAS.forEach(([c,g]) => rows.push([k,"Despesa",c,g, m.despesas[c]||0]));
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(";")).join("\n");
  const blob = new Blob(["\ufeff"+csv], { type:"text/csv;charset=utf-8;" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `relatorio-${k}.csv`; a.click();
});

// ---------------- New month modal ----------------
function openNewMonth(){ document.getElementById("overlay").classList.add("show"); }
document.getElementById("btnNewMonthTop").addEventListener("click", openNewMonth);
document.getElementById("btnCancelNew").addEventListener("click", () => document.getElementById("overlay").classList.remove("show"));
document.getElementById("btnConfirmNew").addEventListener("click", () => {
  const val = document.getElementById("newMonthInput").value;
  if (!val) return;
  if (!state.data[val]) {
    const keys = monthKeys();
    const autoSaldo = keys.length ? saldoAcumulado(keys[keys.length-1]) : 0;
    const saldoAnt = document.getElementById("newMonthSaldoAnterior").value !== ""
      ? parseFloat(document.getElementById("newMonthSaldoAnterior").value) : autoSaldo;
    state.data[val] = { saldoAnterior: saldoAnt, receitas:{}, despesas:{} };
  }
  saveData(state.data);
  state.current = val;
  document.getElementById("overlay").classList.remove("show");
  renderAll();
});

// ---------------- Backup / restore (Configurações) ----------------
document.getElementById("btnBackupExport").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type:"application/json" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "backup-financeiro.json"; a.click();
});
document.getElementById("btnBackupImport").addEventListener("click", () => document.getElementById("fileImport").click());
document.getElementById("fileImport").addEventListener("change", (e) => {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      state.data = parsed; state.current = monthKeys().slice(-1)[0];
      saveData(state.data); renderAll();
    } catch(err){ alert("Arquivo inválido."); }
  };
  reader.readAsText(file);
});
document.getElementById("btnRestoreSeed").addEventListener("click", () => {
  if (!confirm("Isso substitui todos os dados atuais pelos dados de exemplo (Janeiro/2026). Continuar?")) return;
  state.data = JSON.parse(JSON.stringify(SEED_DATA));
  state.current = monthKeys().slice(-1)[0];
  saveData(state.data); renderAll();
});

// ---------------- Init ----------------
state.current = monthKeys().slice(-1)[0];
renderAll();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("sw.js").catch(() => {}); });
}
