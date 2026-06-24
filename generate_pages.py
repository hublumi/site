import os

source_file = "previewsite (1).html"

with open(source_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find the header end and footer start
header_end_idx = 0
for i, line in enumerate(lines):
    if '<section class="hero" id="home">' in line:
        header_end_idx = i
        break

footer_start_idx = 0
for i, line in enumerate(lines):
    if '<footer>' in line:
        footer_start_idx = i
        break

header = "".join(lines[:header_end_idx])
footer = "".join(lines[footer_start_idx:])

pages = {
    "lumi-hub.html": {
        "title": "Lumi Hub",
        "subtitle": "Conheça o coração da nossa automação",
        "content": "<p>O Lumi Hub é a central onde todas as suas automações ganham vida. Conecte suas ferramentas favoritas e deixe a inteligência artificial trabalhar por você.</p><p>Em breve, mais detalhes sobre todas as integrações disponíveis.</p>"
    },
    "blog.html": {
        "title": "Blog & Conteúdo",
        "subtitle": "Artigos, dicas e novidades",
        "content": "<p>Fique por dentro das últimas tendências em automação, inteligência artificial e produtividade.</p><div class='cards' style='margin-top:40px;'><div class='card light'><h3>Novo Artigo</h3><p>Como a IA pode salvar 10 horas da sua semana.</p></div><div class='card light'><h3>Estudo de Caso</h3><p>Aumentando vendas em 300% com fluxos inteligentes.</p></div><div class='card light'><h3>Guia Prático</h3><p>Primeiros passos no HubLumi.</p></div></div>"
    },
    "mapeamento.html": {
        "title": "Mapeamento Gratuito",
        "subtitle": "Descubra o potencial do seu negócio",
        "content": """
    <!-- Progress Bar -->
    <div class="progress-wrap" id="progressWrap" style="display:none;">
      <div class="progress-shell">
        <div class="progress-bar" id="progressBar"></div>
      </div>
      <div class="progress-text" id="progressText">Etapa 1</div>
    </div>

    <!-- Wizard Section -->
    <main class="form-section" id="briefing" style="background: white; color: #09090b; min-height: 40vh; padding: 60px 0;">
      <div class="container" style="max-width: 800px; margin: 0 auto;">
        <div class="intro-box" id="introBox">
          <h2>Diagnóstico para novas soluções</h2>
          <p style="margin-bottom: 20px; line-height: 1.6;">Este briefing ajuda a HubLumi a entender a realidade atual da empresa, mapear gargalos e estruturar caminhos de automação, integração, IA ou sistemas sob medida. Leva menos de 5 minutos.</p>
          <a href="#briefing" class="btn btn-primary" id="btnStartIntro" style="background:#611cfc; color:white;">Iniciar Diagnóstico</a>
        </div>

        <div class="resume-banner" id="resumeBanner" style="display:none;">
          <div class="resume-banner__content">
            <div>
              <strong>Você tem um diagnóstico em andamento.</strong>
              <p>Deseja continuar de onde parou?</p>
            </div>
          </div>
          <div class="resume-banner__actions">
            <button class="wz-btn wz-btn--primary" id="btnResume">Continuar</button>
            <button class="wz-btn wz-btn--ghost" id="btnRestart">Recomeçar</button>
          </div>
        </div>

        <div id="wizardMount"></div>
        <div id="reviewMount" style="display:none;"></div>
      </div>
    </main>
"""
    },
    "termos-de-uso.html": {
        "title": "Termos de Uso",
        "subtitle": "Regras e condições de utilização da plataforma",
        "content": "<h2>1. Aceitação</h2><p>Ao usar o HubLumi, você concorda com nossos termos. O uso da plataforma é restrito a maiores de 18 anos ou empresas legalmente constituídas.</p><br><h2>2. Licença de Uso</h2><p>Concedemos uma licença limitada, não exclusiva e intransferível para uso da nossa tecnologia.</p>"
    },
    "privacidade.html": {
        "title": "Política de Privacidade",
        "subtitle": "Como protegemos os seus dados",
        "content": "<h2>Coleta de Dados</h2><p>Coletamos apenas as informações necessárias para o funcionamento adequado das automações e para a comunicação com você.</p><br><h2>Uso das Informações</h2><p>Seus dados jamais serão vendidos a terceiros. Eles são processados com os mais altos padrões de segurança.</p>"
    },
    "cookies.html": {
        "title": "Política de Cookies",
        "subtitle": "Como utilizamos cookies para melhorar sua experiência",
        "content": "<p>Utilizamos cookies essenciais para o funcionamento do site e cookies analíticos para entender como você interage com nossa plataforma.</p><p>Você pode gerenciar suas preferências nas configurações do seu navegador.</p>"
    },
    "consentimento.html": {
        "title": "Termo de Consentimento",
        "subtitle": "Seu controle sobre suas informações",
        "content": "<p>Para o tratamento de dados pessoais de acordo com a LGPD, solicitamos o seu consentimento explícito em diferentes etapas do uso da plataforma.</p><p>Você tem o direito de revogar este consentimento a qualquer momento.</p>"
    }
}

for filename, data in pages.items():
    if filename == "mapeamento.html":
        page_content = data['content']
    else:
        page_content = f"""
    <section class="hero" style="min-height: 40vh; padding: 180px 0 60px;">
      <div class="container">
        <div class="section-head" style="max-width: 800px; text-align: left;">
          <h1 style="font-size: clamp(36px, 5vw, 62px) !important; margin-bottom: 20px;">{data['title']}</h1>
          <p class="lead" style="color: rgba(255,255,255,0.7); font-size: 20px;">{data['subtitle']}</p>
        </div>
      </div>
    </section>
    <section class="section" style="background: white; color: #09090b; min-height: 40vh;">
      <div class="container" style="max-width: 800px; margin: 0 auto; padding: 40px 0; line-height: 1.6; font-size: 18px;">
        {data['content']}
      </div>
    </section>
    """
    
    # Optional: adjust the <title> tag in the header for each page
    custom_header = header.replace("<title>HubLumi</title>", f"<title>{data['title']} - HubLumi</title>")
    
    if filename == "mapeamento.html":
        custom_header = custom_header.replace("</head>", '<link rel="stylesheet" href="assets/css/main.css">\n</head>')
        custom_footer = footer.replace("</body>", '<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n<script type="module" src="assets/js/briefing.js"></script>\n</body>')
    else:
        custom_footer = footer
        
    with open(filename, "w", encoding="utf-8") as f:
        f.write(custom_header + page_content + custom_footer)

print(f"Successfully generated {len(pages)} pages.")

