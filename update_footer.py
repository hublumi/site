import glob
import re

files = glob.glob('*.html')

for f_path in files:
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove the footer-bottom entirely
    footer_bottom_pattern = r'<div class="footer-bottom">\s*<span>© 2026 HubLumi.*?</span>\s*<span>Desenvolvido com.*?</span>\s*</div>'
    content = re.sub(footer_bottom_pattern, '', content, flags=re.DOTALL)

    # 2. Replace the "Conecte-se" links with the icons
    # The current HTML block looks like:
    # <div class="footer-links">
    # <a href="#">LinkedIn</a>
    # <a href="#">Instagram</a>
    # <a href="#">WhatsApp</a>
    # </div>
    # We will search for the specific links under Conecte-se.
    
    links_pattern = r'<div class="footer-links">\s*<a href="#">LinkedIn</a>\s*<a href="#">Instagram</a>\s*<a href="#">WhatsApp</a>\s*</div>'
    
    new_links = """<div class="footer-links" style="display:flex; gap:16px;">
<a href="#" aria-label="Instagram" style="color: #94a3b8; display: inline-flex; transition: 0.2s;" onmouseover="this.style.color='#09090b'" onmouseout="this.style.color='#94a3b8'">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
</a>
<a href="#" aria-label="LinkedIn" style="color: #94a3b8; display: inline-flex; transition: 0.2s;" onmouseover="this.style.color='#09090b'" onmouseout="this.style.color='#94a3b8'">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
</a>
</div>"""
    
    content = re.sub(links_pattern, new_links, content, flags=re.DOTALL)

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Updated {len(files)} files.")
