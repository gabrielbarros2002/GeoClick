from bs4 import BeautifulSoup
import csv

# Caminho para seu arquivo HTML
input_html = 'index.html'
output_csv = 'paises_niveis.csv'

# Carrega o HTML
with open(input_html, 'r', encoding='utf-8') as file:
    soup = BeautifulSoup(file, 'lxml')  # HTML normal com tags SVG dentro

# Encontra o elemento <svg>
svg = soup.find('svg')
if not svg:
    print("❌ Nenhum elemento <svg> encontrado no HTML.")
    exit()

# Coleta os nomes dos países (valores do atributo name)
nomes_paises = set()
for path in svg.find_all('path'):
    nome = path.get('name')
    if nome:
        nomes_paises.add(nome.strip())

# Salva no CSV
with open(output_csv, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile, delimiter=';')
    writer.writerow(['pais', 'nivel'])  # Cabeçalho
    for nome in sorted(nomes_paises):
        writer.writerow([nome, 3])  # Default: nível 3

print(f"✅ CSV gerado com {len(nomes_paises)} países: {output_csv}")
