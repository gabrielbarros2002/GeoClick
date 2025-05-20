from bs4 import BeautifulSoup
from deep_translator import GoogleTranslator

# Caminho do arquivo original
input_svg = 'mapa.svg'
output_svg = 'mapa_traduzido.svg'

# Carrega o SVG
with open(input_svg, 'r', encoding='utf-8') as file:
    soup = BeautifulSoup(file, 'lxml-xml')  # usa parser lxml para XML/SVG

# Tradutor
translator = GoogleTranslator(source='en', target='pt')

# Armazena traduções para evitar repetir
cache = {}

# Itera sobre os elementos com atributo 'name'
for path in soup.find_all('path'):
    nome_en = path.get('name')
    if nome_en:
        nome_en = nome_en.strip()
        if nome_en not in cache:
            try:
                nome_pt = translator.translate(nome_en)
            except Exception:
                nome_pt = nome_en  # fallback
            cache[nome_en] = nome_pt
        else:
            nome_pt = cache[nome_en]

        # Atualiza o atributo 'name' no SVG
        path['name'] = nome_pt

# Salva o novo SVG
with open(output_svg, 'w', encoding='utf-8') as out:
    out.write(str(soup))

print(f"SVG traduzido salvo em: {output_svg}")
