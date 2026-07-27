# ⚙️ PC Forge

Assistente inteligente de montagem de PCs e notebooks. Ajuda qualquer pessoa — do iniciante ao expert — a montar o setup ideal com explicações simples, verificação de compatibilidade automática e simulação de desempenho.

---

## Como usar

### Opção 1 — Abrir direto no navegador

Basta abrir o arquivo `index.html` no navegador:

```
Clique duas vezes em index.html
```

> Algumas funcionalidades (como fontes do Google) precisam de conexão com a internet.

---

### Opção 2 — Servidor local (recomendado)

**Com Python (já instalado):**

```bash
# Na pasta do projeto:
python -m http.server 3000
```

Depois acesse: [http://localhost:3000](http://localhost:3000)

---

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 🎯 Wizard guiado | 4 passos simples: dispositivo → uso → intensidade → nível |
| 🧠 Montagem automática | Seleciona os melhores componentes compatíveis automaticamente |
| 🔍 Explicações | Por que cada peça foi escolhida, em linguagem acessível |
| 🔁 Alternativas | Opção mais barata e mais potente para cada componente |
| 🧩 Compatibilidade | Verificação automática de socket, RAM, PSU e refrigeração |
| 📊 Desempenho | FPS estimado por jogo e softwares suportados |
| 💰 Custo | Preço total e distribuição por componente |
| 🖥️ Preview visual | Visualização do PC montado com RGB animado |
| ⚙️ Modo avançado | Seleção manual peça a peça com alertas em tempo real |
| 📄 Exportar PDF | Baixa a configuração completa, preços, justificativas, compatibilidade e desempenho |
| 🔗 Compartilhar | Gera link para compartilhar o build |
| 💻 Notebooks | Recomendação de notebooks por categoria e intensidade de uso |

---

## Fluxo de uso

```
Início
  │
  ├── [Começar Montagem] ──► Wizard (4 passos)
  │                              │
  │                    Desktop ──┤──► Build automático gerado
  │                              │         │
  │                    Notebook ─┘    • Ver componentes
  │                                   • Alternativas
  │                                   • Compatibilidade
  │                                   • FPS / Performance
  │                                   • Custo
  │                                   • Baixar PDF / Compartilhar
  │
  └── [Modo Avançado] ──► Seleção manual
                               │
                          Alertas em tempo real
                          Total atualizado ao vivo
```

---

## Estrutura do projeto

```
pc-forge/
├── index.html          # Estrutura HTML + navbar
├── css/
│   └── style.css       # Tema dark gamer (variáveis CSS, responsivo)
├── js/
│   ├── data.js         # Banco de componentes (CPU, GPU, RAM, etc.)
│   ├── builder.js      # Motor de build, compatibilidade, performance
│   └── app.js          # Controlador da aplicação e renderização da UI
└── README.md
```

---

## Banco de dados de componentes

- **CPUs:** Intel Core i3/i5/i7/i9 (12ª/13ª gen) · AMD Ryzen 5/7/9 (AM4/AM5)
- **GPUs:** NVIDIA RTX 3060 → 4090 · AMD RX 6600 → 7900 XTX
- **Placas-mãe:** ASUS · MSI · Chipsets B450/B550/B660/Z690/Z790/B650/X670E
- **RAM:** DDR4 8–32GB · DDR5 16–64GB · Corsair · Kingston · G.Skill
- **Armazenamento:** Samsung · WD · Seagate · SATA / NVMe M.2
- **Fontes:** Corsair · Seasonic · 550W–1000W · 80+ Bronze/Gold/Titanium
- **Gabinetes:** Cooler Master · Corsair · Lian Li · Fractal Design
- **Refrigeração:** Stock · DeepCool · Noctua · Corsair · NZXT (AIO 240/360mm)
- **Notebooks:** 6 modelos recomendados (Acer, ASUS ROG, MSI, Lenovo, Dell, Apple, ASUS ProArt)

---

## Atalhos

| Tecla | Ação |
|---|---|
| `Ctrl + B` | Iniciar novo build |

---

## Tecnologias

- HTML5 · CSS3 · JavaScript (ES2020+)
- Sem build step; a exportação usa jsPDF 4.2.1 carregado sob demanda
- Funciona 100% no navegador
- Sem conta, login ou armazenamento de builds do usuário
- `localStorage` usado apenas para o cache técnico das estimativas de preço
