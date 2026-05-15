import glob

compact_footer_css = """
/* Compact Footer Overrides */
footer { padding: 24px 0 16px !important; }
.footer-box { padding: 24px 32px !important; border-radius: 24px !important; }
.footer-title { margin-bottom: 14px !important; font-size: 12px !important; }
.footer-links a { margin-bottom: 8px !important; font-size: 14.5px !important; }
.footer-description { font-size: 14px !important; line-height: 1.4 !important; }
.footer-logo-new { margin-bottom: 12px !important; }
.footer-logo-new img { height: 40px !important; }
.footer-grid { gap: 16px !important; }
</style>
"""

files = glob.glob('*.html')

for f_path in files:
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if "/* Compact Footer Overrides */" not in content:
        # replace the last </style> with our new css
        content = content.replace("</style>", compact_footer_css)
        with open(f_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {f_path}')
