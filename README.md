# TSP_Colapstador_Esmeralda
Heurística para aproximação do resultado ótimo com margem de erro de ~3% para problemas TSP em tempo polinomial

# Colapsador TSP

O **Colapsador TSP** é um sistema experimental que utiliza ressonância harmônica e refinamento por heurísticas para resolver instâncias do problema do Caixeiro Viajante (TSP - Travelling Salesman Problem). A abordagem mistura conceitos da chamada *antimatemática* com otimizações conhecidas como o algoritmo 2-opt, buscando novos caminhos heurísticos que reduzam o custo computacional em problemas NP-difíceis.

## 🧪 Objetivo

Investigar se abordagens inspiradas em vibrações harmônicas e rotações geométricas podem sugerir caminhos promissores para heurísticas alternativas no TSP. O sistema foi testado inicialmente na instância **Tnm199.tsp**, com 199 cidades, gerando trajetos com custo estimado de:

**Custo estimado da melhor rota encontrada: 3.202.634,59**

> Embora ainda distante do ótimo conhecido, o sistema explora territórios não convencionais que podem ser refinados em futuras versões.

---

## ⚙️ Parâmetros Utilizados

- **A (amplitude angular):** `0.003`  
  Define a variação angular entre os vetores de ressonância.

- **S (suavização):** `0.1`  
  Controla o quanto as curvas harmônicas influenciam na ordenação dos pontos.

- **N (harmônicas):** `6`  
  Número de harmônicos utilizados na varredura angular para "colapsar" os pontos em torno de um centro gravitacional dinâmico.

---

## 📸 Imagens do Sistema

![Visualização da Rota](./imagens/rota_tnm199.png)

---

## 🧠 Algoritmo e Processo

1. **Leitura do arquivo .tsp** com as coordenadas das cidades.
2. **Centro geométrico** da instância é calculado.
3. **Ressonância harmônica angular:** cada cidade é projetada em harmônicos variando em torno do centro, criando uma nova ordem de visitação.
4. **Aplicação do algoritmo 2-opt** como refinamento final para minimizar cruzamentos e ajustar o caminho.
5. **Exibição gráfica e exportação CSV** com as coordenadas da rota final.

---

## 📥 Como Executar

1. Clone este repositório:
```bash
git clone https://github.com/seuusuario/colapsador-tsp.git
