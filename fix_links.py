import glob

files = glob.glob('*.html')

for f_path in files:
    if f_path == 'index.html':
        continue
        
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace relative anchor links with absolute paths to index.html
    new_content = content.replace('href="#home"', 'href="index.html"')
    new_content = new_content.replace('href="#solucoes"', 'href="index.html#solucoes"')
    new_content = new_content.replace('href="#contato"', 'href="index.html#contato"')

    if new_content != content:
        with open(f_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Fixed links in {f_path}')
