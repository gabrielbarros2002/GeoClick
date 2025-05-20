from bs4 import BeautifulSoup
import csv

# Arquivos de entrada/saída
html_path = 'index.html'
csv_path = 'paises_niveis.csv'
saida_html = 'index_atualizado.html'

# Lê os níveis do CSV
niveis_por_pais = {}
with open(csv_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile, delimiter=',')
    for row in reader:
        pais = row['pais'].strip()
        nivel = row['nivel'].strip()
        niveis_por_pais[pais] = nivel

# Lê o HTML
with open(html_path, 'r', encoding='utf-8') as file:
    soup = BeautifulSoup(file, 'lxml')  # HTML com SVG

# Encontra o SVG
svg = soup.find('svg')
if not svg:
    print("❌ Nenhum elemento <svg> encontrado no HTML.")
    exit()

# Atualiza os paths com o nível
atualizados = 0
for path in svg.find_all('path'):
    nome = path.get('name')
    if nome:
        nome = nome.strip()
        nivel = niveis_por_pais.get(nome)
        if nivel:
            path['nivel'] = nivel
            atualizados += 1

# Salva o novo HTML
with open(saida_html, 'w', encoding='utf-8') as out:
    out.write(str(soup))

print(f"✅ Níveis adicionados em {atualizados} países.")
print(f"📄 Arquivo atualizado salvo como: {saida_html}")
