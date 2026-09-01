// Estrutura fixa de categorias — igual ao relatório original em papel.
// Alterar aqui reflete automaticamente no formulário de edição e nos totais.

const RECEITAS = ["DÍZIMOS", "OFERTAS", "OFERTA DE MISSÃO", "OFERTA PARA CONSTRUÇÃO"];

const DESPESAS = [
  ["PREBENDAS", "Pessoal e Encargos"],
  ["AJUDA DE CUSTO", "Pessoal e Encargos"],
  ["ALUGUEL", "Imóvel e Estrutura"],
  ["COMBUSTÍVEL", "Veículos"],
  ["CONTAS DA CEMIG", "Imóvel e Estrutura"],
  ["CONTAS DA COPASA", "Imóvel e Estrutura"],
  ["CONTAS TELEFONES / INTERNET", "Imóvel e Estrutura"],
  ["EQUIPAMENTOS DE SOM", "Administrativo"],
  ["MEDICAMENTOS/CONSULTAS", "Social e Missões"],
  ["LANCHES/REFEIÇÕES", "Social e Missões"],
  ["CONSTRUÇÃO/TEMPLO", "Imóvel e Estrutura"],
  ["MANUTENÇÃO DE VEICULOS", "Veículos"],
  ["MANUTENÇÃO DE ESCRITORIO", "Administrativo"],
  ["MANUTENÇÃO DE CONGREGAÇÃO", "Imóvel e Estrutura"],
  ["INSS /FGTS/PREVIDÊNCIA PRIVADA", "Pessoal e Encargos"],
  ["MATERIAL PARA LIMPEZA", "Administrativo"],
  ["MATERIAL PARA SANTA CEIA", "Administrativo"],
  ["ZELADORIA", "Pessoal e Encargos"],
  ["ESTACIONAMENTO/PEDAGIO", "Veículos"],
  ["VIAGEM / HOSPEDAGEM", "Administrativo"],
  ["CONDUÇÃO/ONIBUS/TAXI", "Administrativo"],
  ["CONTABILIDADE/ASSOCIAÇÃO/JURIDICO", "Administrativo"],
  ["UMADECOM-COMADEMG-CGADB-DEMIDEP/ESCOLA BIBLICA", "Social e Missões"],
  ["SISTEMA DE SEGURANÇA", "Imóvel e Estrutura"],
  ["TAXAS DIVERSAS (IMPOSTOS E TAXAS)", "Administrativo"],
  ["PRESENTE DE ANIVERSÁRIO", "Eventos e Diversos"],
  ["MOVEIS E UTENSILIOS", "Administrativo"],
  ["CONFRATERNIZAÇÃO", "Eventos e Diversos"],
  ["MULTA DE TRANSITO", "Eventos e Diversos"],
  ["DONATIVOS", "Social e Missões"],
  ["ORNAMENTAÇÃO", "Eventos e Diversos"],
  ["FAIXA DIVULGAÇÃO", "Eventos e Diversos"],
  ["FINANCIAMENTO DE IMOVEIS", "Imóvel e Estrutura"],
  ["FINANCIAMENTO DE VEICULOS", "Veículos"],
  ["DESPESAS ADMINISTRATIVAS COM A SECRETARIA", "Administrativo"],
  ["VALOR TRANSFERIDO PARA BH", "Eventos e Diversos"],
  ["SEGURO VEICULO", "Veículos"],
  ["PROJETO MISSIONARIO", "Social e Missões"],
  ["FRETE/CARRETOS", "Administrativo"],
  ["PREMIO ANUAL", "Eventos e Diversos"],
  ["DOAÇOES APAHAR", "Social e Missões"],
  ["OFERTA PARA PREGADOR", "Social e Missões"],
  ["CONSÓRCIO", "Administrativo"],
  ["FINANCIAMENTO DE ENERGIA SOLAR", "Imóvel e Estrutura"],
];

const GRUPOS_ORDEM = ["Pessoal e Encargos", "Imóvel e Estrutura", "Veículos", "Administrativo", "Social e Missões", "Eventos e Diversos"];

// Dados de partida — Janeiro/2026, extraídos do relatório original.
const SEED_DATA = {
  "2026-01": {
    saldoAnterior: 3197.93,
    receitas: { "DÍZIMOS": 107849.49, "OFERTAS": 14146.47 },
    despesas: {
      "PREBENDAS": 17169.17, "AJUDA DE CUSTO": 8296, "COMBUSTÍVEL": 8879.16,
      "CONTAS DA CEMIG": 4853.79, "CONTAS DA COPASA": 2055.02, "CONTAS TELEFONES / INTERNET": 1386.36,
      "EQUIPAMENTOS DE SOM": 2000, "MEDICAMENTOS/CONSULTAS": 2665.23, "LANCHES/REFEIÇÕES": 438.22,
      "MANUTENÇÃO DE VEICULOS": 360, "MANUTENÇÃO DE ESCRITORIO": 346.05,
      "INSS /FGTS/PREVIDÊNCIA PRIVADA": 5757.02, "MATERIAL PARA LIMPEZA": 738.61,
      "MATERIAL PARA SANTA CEIA": 110.97, "ZELADORIA": 4097, "VIAGEM / HOSPEDAGEM": 365,
      "CONDUÇÃO/ONIBUS/TAXI": 550, "CONTABILIDADE/ASSOCIAÇÃO/JURIDICO": 1655,
      "TAXAS DIVERSAS (IMPOSTOS E TAXAS)": 4609.33, "MOVEIS E UTENSILIOS": 1267,
      "DONATIVOS": 1345, "FINANCIAMENTO DE IMOVEIS": 1762.72,
      "DESPESAS ADMINISTRATIVAS COM A SECRETARIA": 1868, "SEGURO VEICULO": 228.16,
      "PROJETO MISSIONARIO": 1400, "FRETE/CARRETOS": 1300,
    }
  }
};

function loadData(){
  const raw = localStorage.getItem("livroCaixaData");
  if (raw) { try { return JSON.parse(raw); } catch(e) { /* fallthrough */ } }
  return JSON.parse(JSON.stringify(SEED_DATA));
}

function saveData(data){
  localStorage.setItem("livroCaixaData", JSON.stringify(data));
}
