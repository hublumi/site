export const TRACKS = {
  COMMON: 'common',
  MARKETING: 'marketing',
  OPERACOES: 'operacoes',
  DIGITAL: 'digital',
  TECH: 'tech',
};

// Helpers
const always = () => true;
const ifMarketing = (a) => a.gargalo_principal === 'marketing';
const ifOps = (a) => a.gargalo_principal === 'operacoes';
const ifDigital = (a) => a.gargalo_principal === 'digital';
const ifTech = (a) => a.gargalo_principal === 'tech';

export const FLOW_GROUPS = [
  // ─────────────────────────────────────────────────────────
  // GRUPO 01 — Informações gerais (sempre)
  // ─────────────────────────────────────────────────────────
  {
    id: 'identificacao',
    label: 'Identificação',
    helpText: 'Insira seu nome e e-mail para iniciar ou continuar de onde parou.',
    track: TRACKS.COMMON,
    dependsOn: always,
    fields: [
      { id: 'responsavel',    name: 'Responsável pelo briefing',type: 'text',  label: 'Seu nome',                 required: true },
      { id: 'email',          name: 'E-mail',                   type: 'email', label: 'E-mail',                   required: true },
    ],
  },
  {
    id: 'info_empresa',
    label: 'Informações da empresa',
    helpText: 'Conte-nos um pouco sobre a empresa e contatos.',
    track: TRACKS.COMMON,
    dependsOn: always,
    fields: [
      { id: 'empresa',        name: 'Nome da empresa',          type: 'text',  label: 'Nome da empresa',          required: true },
      { id: 'segmento',       name: 'Segmento de atuação',      type: 'text',  label: 'Segmento de atuação',      required: true },
      { id: 'cargo',          name: 'Cargo do responsável',     type: 'text',  label: 'Cargo/função',             required: true },
      { id: 'telefone',       name: 'Telefone/WhatsApp',        type: 'tel',   label: 'Telefone/WhatsApp',        required: true },
      { id: 'site',           name: 'Site da empresa',          type: 'text',  label: 'Site da empresa',          placeholder: 'www.empresa.com.br' },
      { id: 'instagram',      name: 'Instagram da empresa',     type: 'text',  label: 'Instagram',                placeholder: '@empresa' },
      { id: 'linkedin',       name: 'LinkedIn da empresa',      type: 'text',  label: 'LinkedIn' },
      { id: 'cidade',         name: 'Cidade e Estado',          type: 'text',  label: 'Cidade/Estado' },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // GRUPO 03 — Decisão central: qual é o maior gargalo?
  // ─────────────────────────────────────────────────────────
  {
    id: 'gargalo',
    label: 'Principal desafio',
    helpText: 'Selecione a área que representa o maior gargalo hoje. Isso define quais perguntas farão mais sentido para sua realidade.',
    track: TRACKS.COMMON,
    dependsOn: always,
    fields: [
      {
        id: 'gargalo_principal',
        name: 'Gargalo principal',
        type: 'radio-card',
        label: 'Qual é o maior gargalo da empresa hoje?',
        required: true,
        options: [
          { value: 'marketing',  label: 'Marketing e Vendas',            desc: 'Atrair clientes, converter leads, funil de vendas, CRM, tráfego pago.' },
          { value: 'operacoes',  label: 'Processos Internos',            desc: 'Tarefas manuais, retrabalho, comunicação interna, gargalos operacionais.' },
          { value: 'digital',    label: 'Presença Digital / Website',    desc: 'Site, landing pages, SEO, identidade visual, redes sociais.' },
          { value: 'tech',       label: 'IA, Automação e Sistemas',      desc: 'Automações, integrações de APIs, sistemas sob medida, IA aplicada.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // TRACK: MARKETING
  // ─────────────────────────────────────────────────────────
  {
    id: 'mkt_leads',
    label: 'Leads e aquisição',
    helpText: 'Mapeamos como os interessados chegam e como são trabalhados no funil.',
    track: TRACKS.MARKETING,
    dependsOn: ifMarketing,
    fields: [
      { id: 'origem_leads',       name: 'Origem dos leads',                         type: 'textarea', label: 'Como chegam novos leads hoje?',                              rows: 4 },
      { id: 'distribuicao_leads', name: 'Distribuição e acompanhamento dos leads',  type: 'textarea', label: 'Como os leads são respondidos, distribuídos e acompanhados?', rows: 4 },
      { id: 'crm',                name: 'CRM e controle comercial',                 type: 'textarea', label: 'Existe CRM ou controle comercial? Como funciona?',            rows: 4 },
      { id: 'followup',           name: 'Follow-up atual',                          type: 'textarea', label: 'O follow-up é manual ou automatizado?',                       rows: 3 },
    ],
  },
  {
    id: 'mkt_canais',
    label: 'Canais e campanhas',
    helpText: 'Analisamos os canais de marketing, campanhas e oportunidades de automação.',
    track: TRACKS.MARKETING,
    dependsOn: ifMarketing,
    fields: [
      { id: 'canais_mkt',   name: 'Canais de marketing utilizados',   type: 'textarea', label: 'Quais canais de marketing a empresa utiliza hoje?',                  rows: 3 },
      { id: 'trafego_pago', name: 'Tráfego pago',                     type: 'textarea', label: 'Vocês fazem tráfego pago? Onde e com qual objetivo?',                rows: 3 },
      { id: 'funil_mkt',    name: 'Funil de marketing',               type: 'textarea', label: 'Existe algum funil de captação, nutrição ou conversão de leads?',    rows: 4 },
      { id: 'metricas_mkt', name: 'Métricas de marketing e vendas',   type: 'textarea', label: 'Como acompanham métricas de marketing e vendas hoje?',               rows: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // TRACK: OPERAÇÕES
  // ─────────────────────────────────────────────────────────
  {
    id: 'ops_operacao',
    label: 'Operação do dia a dia',
    helpText: 'Queremos mapear como a empresa funciona no dia a dia e onde estão os gargalos.',
    track: TRACKS.OPERACOES,
    dependsOn: ifOps,
    fields: [
      { id: 'funcionamento_op', name: 'Funcionamento da operação atual',          type: 'textarea', label: 'Como funciona hoje a operação principal da empresa?',                    rows: 4 },
      { id: 'tarefas_tempo',    name: 'Tarefas que mais tomam tempo',             type: 'textarea', label: 'Quais tarefas mais tomam tempo da equipe?',                             rows: 4 },
      { id: 'proc_manuais',     name: 'Processos manuais',                        type: 'textarea', label: 'Quais processos ainda são feitos manualmente?',                         rows: 4 },
    ],
  },
  {
    id: 'ops_retrabalho',
    label: 'Retrabalho e dependências',
    helpText: 'Identificamos onde há perda de informação e dependência de pessoas específicas.',
    track: TRACKS.OPERACOES,
    dependsOn: ifOps,
    fields: [
      { id: 'retrabalho',  name: 'Retrabalho erros perda de informação',    type: 'textarea', label: 'Onde mais acontece retrabalho, erro ou perda de informação?',       rows: 4 },
      { id: 'dependencia', name: 'Dependência de pessoas específicas',      type: 'textarea', label: 'Existe algum processo que depende muito de uma pessoa específica?', rows: 4 },
      { id: 'atendimento', name: 'Atendimento atual',                       type: 'textarea', label: 'Como funciona hoje o atendimento (WhatsApp, e-mail, telefone)?',    rows: 4 },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // TRACK: PRESENÇA DIGITAL
  // ─────────────────────────────────────────────────────────
  {
    id: 'digital_presenca',
    label: 'Site e presença online',
    helpText: 'Analisamos o site, redes sociais e a identidade visual da empresa.',
    track: TRACKS.DIGITAL,
    dependsOn: ifDigital,
    fields: [
      { id: 'dificuldades_digital', name: 'Dificuldades presença digital', type: 'textarea', label: 'Quais dificuldades no site, Instagram ou presença digital?',     rows: 4 },
      { id: 'objetivo_site',        name: 'Objetivo do site',              type: 'textarea', label: 'Qual o principal objetivo do site? (vendas, institucional, leads?)', rows: 3 },
      { id: 'identidade_visual',    name: 'Identidade visual',             type: 'textarea', label: 'Existe manual de marca, logo ou identidade visual definida?',      rows: 3 },
    ],
  },
  {
    id: 'digital_conteudo',
    label: 'Conteúdo e estratégia',
    helpText: 'Entendemos como o conteúdo é produzido e qual é a estratégia atual.',
    track: TRACKS.DIGITAL,
    dependsOn: ifDigital,
    fields: [
      { id: 'conteudo_hoje',  name: 'Produção de conteúdo',      type: 'textarea', label: 'Quem produz o conteúdo hoje? Com qual frequência?',                rows: 3 },
      { id: 'resultado_mkt',  name: 'Resultado esperado digital', type: 'textarea', label: 'Qual resultado esperado com uma presença digital mais forte?',    rows: 4 },
      { id: 'canais_digital', name: 'Canais de marketing utilizados', type: 'textarea', label: 'Quais canais de marketing utiliza hoje?',                     rows: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // TRACK: IA, AUTOMAÇÃO E SISTEMAS
  // ─────────────────────────────────────────────────────────
  {
    id: 'tech_automacao',
    label: 'Automação e IA',
    helpText: 'Identificamos se a melhor solução é automação simples, integração ou IA.',
    track: TRACKS.TECH,
    dependsOn: ifTech,
    fields: [
      {
        id: 'interesses',
        name: 'Interesses',
        type: 'checkbox-group',
        label: 'O que você quer implementar?',
        options: [
          'Automatizar WhatsApp', 'Criar/organizar CRM', 'Dashboards',
          'IA para atendimento', 'IA para análise de dados', 'Sistema interno',
          'Integrações/API', 'Automação de marketing', 'Organização operacional',
        ],
      },
      { id: 'automacao_desejada', name: 'Principal automação desejada',    type: 'textarea', label: 'Se pudesse automatizar uma coisa hoje, qual seria?',                          rows: 3 },
      { id: 'ideias_sistema',     name: 'Ideias de sistema automação painel', type: 'textarea', label: 'Tem alguma ideia de sistema, painel ou automação que já imaginou?',        rows: 4 },
    ],
  },
  {
    id: 'tech_tentativas',
    label: 'Histórico técnico',
    helpText: 'Entendemos o que já foi tentado e o que está disponível para integrar.',
    track: TRACKS.TECH,
    dependsOn: ifTech,
    fields: [
      { id: 'tentativas_ant',  name: 'Tentativas anteriores de automação', type: 'textarea', label: 'Vocês já tentaram automatizar algo antes? O que aconteceu?',                 rows: 4 },
      { id: 'integ_existentes',name: 'Integrações atuais',                  type: 'textarea', label: 'Ferramentas que usam hoje conversam entre si? Existem integrações?',        rows: 3 },
      { id: 'apis_disponiveis',name: 'APIs disponíveis',                    type: 'textarea', label: 'Alguma ferramenta possui API ou possibilidade de integração?',               rows: 3 },
      { id: 'modelo_solucao',  name: 'Preferência modelo solução',          type: 'textarea', label: 'Preferem começar com pequenas automações ou um sistema mais centralizador?', rows: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // GRUPO: Ferramentas (sempre, depois dos tracks)
  // ─────────────────────────────────────────────────────────
  {
    id: 'ferramentas',
    label: 'Ferramentas utilizadas',
    helpText: 'Ajuda a entender se podemos usar integrações/APIs existentes ou criar algo novo.',
    track: TRACKS.COMMON,
    dependsOn: always,
    fields: [
      {
        id: 'ferramentas_lista',
        name: 'Ferramentas',
        type: 'checkbox-group',
        label: 'Quais ferramentas a empresa usa hoje?',
        options: [
          'WhatsApp Business', 'Google Sheets', 'Excel', 'Trello', 'Notion',
          'Monday', 'ClickUp', 'HubSpot', 'Pipedrive', 'RD Station',
          'Meta Ads', 'Google Ads', 'ERP', 'CRM', 'Sistema próprio',
        ],
      },
      { id: 'outras_ferramentas', name: 'Outras ferramentas utilizadas', type: 'textarea', label: 'Liste outras ferramentas não mencionadas acima', rows: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // GRUPO: Dados e indicadores (sempre)
  // ─────────────────────────────────────────────────────────
  {
    id: 'dados_indicadores',
    label: 'Dados e relatórios',
    helpText: 'Entendemos se os dados estão organizados e quais indicadores são úteis.',
    track: TRACKS.COMMON,
    dependsOn: always,
    fields: [
      { id: 'indicadores',      name: 'Indicadores acompanhados',               type: 'textarea', label: 'Quais indicadores a empresa acompanha hoje?',                                 rows: 3 },
      { id: 'dashboards',       name: 'Dashboards e relatórios',                type: 'textarea', label: 'Hoje existem dashboards, relatórios automáticos ou painéis de gestão?',        rows: 3 },
      { id: 'dados_espalhados', name: 'Dados espalhados',                       type: 'textarea', label: 'Os dados ficam espalhados em diferentes ferramentas, planilhas ou pessoas?',   rows: 3 },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // GRUPO: Prioridades e impacto (sempre)
  // ─────────────────────────────────────────────────────────
  {
    id: 'prioridades',
    label: 'Prioridades e impacto',
    helpText: 'Para estruturar uma proposta realista, entendemos urgência e impacto esperado.',
    track: TRACKS.COMMON,
    dependsOn: always,
    fields: [
      { id: 'problema_principal', name: 'Maior problema operacional',      type: 'textarea', label: 'Qual é o maior problema operacional hoje?',                              rows: 4 },
      { id: 'custo_perda',        name: 'Custo perda tempo oportunidade',  type: 'textarea', label: 'O que mais gera custo, perda de tempo ou perda de oportunidade?',       rows: 4 },
      {
        id: 'urgencia',
        name: 'Urgência',
        type: 'select',
        label: 'Urgência para resolver',
        options: ['Baixa, estamos explorando possibilidades', 'Média, queremos estruturar em breve', 'Alta, precisamos resolver logo', 'Muito alta, é prioridade da empresa'],
      },
      {
        id: 'investimento',
        name: 'Investimento esperado',
        type: 'select',
        label: 'Investimento esperado',
        options: ['Ainda não definido', 'Projeto pequeno/pontual', 'Projeto médio', 'Projeto robusto', 'Queremos avaliar possibilidades'],
      },
      { id: 'resultado_esperado', name: 'Resultado esperado', type: 'textarea', label: 'Qual resultado faria esse projeto valer a pena?', rows: 4 },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // GRUPO: Materiais adicionais (sempre)
  // ─────────────────────────────────────────────────────────
  {
    id: 'materiais',
    label: 'Materiais adicionais',
    helpText: 'Links, prints, documentos ou referências que ajudem na análise.',
    track: TRACKS.COMMON,
    dependsOn: always,
    fields: [
      {
        id: 'materiais_adicionais',
        name: 'Materiais adicionais',
        type: 'textarea',
        label: 'Links úteis e observações adicionais',
        placeholder: 'Links para pastas no Drive, Notion, sites, exemplos de sistemas, etc.',
        rows: 5,
      },
    ],
  },
];
