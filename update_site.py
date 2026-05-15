import re
import glob

def update_html(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    # 1. Update Navbar Logo
    # Find the navbar brand-clean <a> tag
    # Currently it contains <svg ...>
    navbar_pattern = r'(<a href="#home" class="brand brand-clean" aria-label="Lumi">).*?(</a>)'
    # We will replace the inner content with the img tag for white logo
    text = re.sub(navbar_pattern, r'\1\n      <img src="logo-white.svg" alt="Lumi Logo" style="height:42px; width:auto;">\n    \2', text, flags=re.DOTALL)
    
    # Also in subpages the link might be to "previewsite (1).html#home" but the class is the same.
    # Actually wait, in previewsite it's <a href="#home" class="brand brand-clean"...
    
    # 2. Update Footer Logo
    # Currently: <div class="footer-logo-new"><?xml ... <svg ...></div>
    footer_pattern = r'<div class="footer-logo-new">.*?</div>'
    text = re.sub(footer_pattern, r'<div class="footer-logo-new"><img src="logo-black.svg" alt="Lumi Logo" style="height:52px; width:auto;"></div>', text, flags=re.DOTALL)

    # 3. Update Copies (only in main page usually, but subpages might share footer copies)
    
    # Replace copies in Hero
    text = text.replace('AUTOMAÇÃO INTELIGENTE', 'INTELIGÊNCIA OPERACIONAL')
    text = text.replace('<h1>Automação Mágica para Seu Negócio</h1>', '<h1>Transformamos operações manuais em sistemas inteligentes</h1>')
    text = text.replace('<p class="lead">Operações sem fricção. Sistemas que rodam sozinhos.</p>', '<p class="lead">Automação, IA e tecnologia sob medida para empresas crescerem com mais eficiência, organização e escala.</p>')
    text = text.replace('<span>HubLumi Flow</span>', '<span>Sistemas Inteligentes</span>')
    text = text.replace('<h3>Do caos ao fluxo.</h3>', '<h3>Tecnologia que parece mágica.</h3>')
    text = text.replace('<p>Integramos sistemas, pessoas e processos para sua operação funcionar com mais inteligência.</p>', '<p>A Lumi cria tecnologia sob medida para empresas crescerem sem aumentar o caos operacional.</p>')
    text = text.replace('Descubra Nossas Soluções', 'Agendar Mapeamento Gratuito')

    # Float cards
    text = text.replace('Distribuição automática para o time certo.', 'Conversão e distribuição inteligente.')
    text = text.replace('Rotinas inteligentes', 'Operação centralizada')
    text = text.replace('Classificação, respostas e tarefas assistidas.', 'Eficiência em cada etapa do seu processo.')
    
    # Section "O Que Fazemos Rodar" -> "O Que A Lumi Resolve"
    text = text.replace('<h2>O Que Fazemos Rodar</h2>', '<h2>O Que A Lumi Resolve</h2>')
    text = text.replace('<p>Soluções construídas para eliminar tarefas manuais e deixar a operação mais leve, organizada e escalável.</p>', '<p>Soluções construídas para eliminar o retrabalho e transformar tarefas manuais em processos inteligentes.</p>')
    
    text = text.replace('<h3>Processos internos simplificados</h3>', '<h3>Redução de tarefas manuais</h3>')
    text = text.replace('<p>Fluxos inteligentes eliminando retrabalho e tarefas repetitivas.</p>', '<p>Crescimento estruturado com processos inteligentes, sem aumentar a equipe.</p>')
    
    text = text.replace('<h3>Integrações externas perfeitas</h3>', '<h3>Ecossistema Operacional</h3>')
    text = text.replace('<p>Conexões seguras entre ferramentas, APIs e plataformas.</p>', '<p>Suas ferramentas conectadas funcionando em perfeita harmonia.</p>')
    
    text = text.replace('<h3>Marketing no automático</h3>', '<h3>Crescimento escalável</h3>')
    text = text.replace('<p>Campanhas inteligentes e sistemas que convertem sem esforço manual.</p>', '<p>Infraestrutura digital pronta para multiplicar seus resultados.</p>')

    text = text.replace('Veja Soluções Completas', 'Conheça o Hub Lumi')

    # CTA Box
    text = text.replace('<h2>Sem Complicação, Só Resultados</h2>', '<h2>O complexo, simplificado.</h2>')
    text = text.replace('<p>Construímos automações customizadas para seu dia a dia fluir. Interno, externo ou marketing — entregamos o que realmente funciona.</p>', '<p>Menos operação manual. Mais inteligência. Criamos tecnologia sob medida para empresas crescerem com eficiência, organização e escala.</p>')
    
    # Solucoes Section
    text = text.replace('<p style="color:rgba(255,255,255,.66)">Somos HubLumi. Especialistas em automações que transformam caos em fluidez.</p>', '<p style="color:rgba(255,255,255,.66)">Hub de operações inteligentes. Transformamos complexidade operacional em crescimento estruturado.</p>')
    text = text.replace('<h3>Automação Interna</h3>', '<h3>Inteligência Operacional</h3>')
    text = text.replace('<p>Simplificamos operações com fluxos customizados. ERP, CRM, planilhas — tudo conectado e automático.</p>', '<p>Transformamos operações confusas em ecossistemas inteligentes, integrados e altamente eficientes.</p>')
    
    text = text.replace('<h3>Automação Externa</h3>', '<h3>Automação Inteligente</h3>')
    text = text.replace('<p>Integrações seguras com RD Station, Google Ads, APIs, Supabase e ferramentas externas.</p>', '<p>Reduza o atrito conectando plataformas e orquestrando fluxos com tecnologia invisivelmente poderosa.</p>')
    
    text = text.replace('<h3>Marketing Automatizado</h3>', '<h3>IA Aplicada ao Crescimento</h3>')
    text = text.replace('<p>Funis inteligentes, leads qualificados e campanhas que escalam sozinhas.</p>', '<p>Sistemas modernos e minimalistas que otimizam performance e aceleram sua expansão.</p>')

    # Contact form section
    text = text.replace('<h2>Fale com o nosso time</h2>', '<h2>Pronto para escalar?</h2>')
    text = text.replace('<p>Descreva seu desafio operacional ou de marketing. Automatizamos para você.</p>', '<p>A Lumi cria tecnologia sob medida para sua operação. Agende um mapeamento gratuito.</p>')

    # Footer
    text = text.replace('<p class="footer-description">\nAutomação inteligente que orquestra sua operação para máxima eficiência e harmonia total.\n</p>', '<p class="footer-description">\nTecnologia que parece mágica. Transformamos operações manuais em sistemas inteligentes.\n</p>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(text)


html_files = glob.glob('*.html')
for file in html_files:
    update_html(file)

print(f"Updated {len(html_files)} files.")
