import os

source_file = "previewsite (1).html"

with open(source_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

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
    "contato.html": {
        "title": "Fale Conosco",
        "subtitle": "Estamos prontos para transformar sua operação",
        "content": """
        <div class="contact-grid" style="margin-top: 20px;">
          <div class="contact-panel">
            <h2>Pronto para escalar?</h2>
            <p>Seja para tirar dúvidas ou agendar seu mapeamento gratuito, nossa equipe está a postos.</p>
            <br>
            <p><strong>Email:</strong> contato@hublumi.com<br>
            <strong>Telefone:</strong> (11) 99999-9999</p>
          </div>
          <div>
            <form onsubmit="event.preventDefault(); alert('Mensagem enviada com sucesso!');">
              <div class="field">
                <label>Seu Nome</label>
                <input type="text" placeholder="Como podemos te chamar?">
              </div>
              <div class="field">
                <label>Email Corporativo</label>
                <input type="email" placeholder="seu@email.com">
              </div>
              <div class="field">
                <label>Mensagem</label>
                <textarea placeholder="Conte-nos um pouco sobre seu desafio..."></textarea>
              </div>
              <button type="submit" class="btn btn-dark" style="width:100%; border:none; cursor:pointer;">Enviar Mensagem</button>
            </form>
          </div>
        </div>
        """
    },
    "login.html": {
        "title": "Acessar Sessão",
        "subtitle": "Entre na sua conta HubLumi",
        "content": """
        <div style="max-width: 480px; margin: 0 auto; background: white; padding: 40px; border-radius: 30px; border: 1px solid rgba(0,0,0,.06);">
            <form onsubmit="event.preventDefault(); alert('Login efetuado com sucesso!');">
              <div class="field">
                <label>Email</label>
                <input type="email" placeholder="seu@email.com">
              </div>
              <div class="field">
                <label>Senha</label>
                <input type="password" placeholder="••••••••">
              </div>
              <button type="submit" class="btn btn-dark" style="width:100%; border:none; cursor:pointer; margin-top: 10px;">Entrar</button>
            </form>
            <p style="text-align: center; margin-top: 20px; font-size: 14px; color: #666;">Esqueceu sua senha? <a href="#" style="color: #611cfc; font-weight: bold; text-decoration: none;">Recuperar acesso</a></p>
        </div>
        """
    }
}

for filename, data in pages.items():
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
      <div class="container" style="max-width: 1000px; margin: 0 auto; padding: 40px 0;">
        {data['content']}
      </div>
    </section>
    """
    custom_header = header.replace("<title>HubLumi</title>", f"<title>{data['title']} - HubLumi</title>")
    
    with open(filename, "w", encoding="utf-8") as f:
        f.write(custom_header + page_content + footer)

print("Generated contato.html and login.html")

