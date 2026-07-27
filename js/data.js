// ============================================================
// PC FORGE - Component Database
// ============================================================

const COMPONENTS = {

  // ─── CPUs ───────────────────────────────────────────────
  cpu: [
    // INTEL LGA1700 (DDR4/DDR5)
    {
      id: 'i3-12100f', name: 'Intel Core i3-12100F', brand: 'Intel',
      socket: 'LGA1700', tier: 1, tdp: 58, ramTypes: ['DDR4'],
      price: 620, cores: 4, threads: 8, boostGHz: 4.3,
      perfScore: 38, integratedGpu: false,
      tag: 'Budget Gaming',
      why: 'Excelente custo-benefício para gaming leve. 4 cores eficientes e baixo consumo de energia, ideal para quem está começando.',
      socket_label: 'LGA1700', gen: 12
    },
    {
      id: 'i5-13400f', name: 'Intel Core i5-13400F', brand: 'Intel',
      socket: 'LGA1700', tier: 2, tdp: 65, ramTypes: ['DDR4', 'DDR5'],
      price: 950, cores: 10, threads: 16, boostGHz: 4.6,
      perfScore: 62, integratedGpu: false,
      tag: 'Mid-Range Gaming',
      why: 'Melhor CPU de médio porte para gaming em 2024. 10 cores com boa eficiência e excelente desempenho em jogos.',
      socket_label: 'LGA1700', gen: 13
    },
    {
      id: 'i7-13700k', name: 'Intel Core i7-13700K', brand: 'Intel',
      socket: 'LGA1700', tier: 3, tdp: 125, ramTypes: ['DDR4', 'DDR5'],
      price: 1850, cores: 16, threads: 24, boostGHz: 5.4,
      perfScore: 82, integratedGpu: true,
      tag: 'High-End Gaming',
      why: '16 núcleos com alta frequência, ideal para gaming pesado e streaming simultâneo.',
      socket_label: 'LGA1700', gen: 13
    },
    {
      id: 'i9-13900k', name: 'Intel Core i9-13900K', brand: 'Intel',
      socket: 'LGA1700', tier: 4, tdp: 125, ramTypes: ['DDR4', 'DDR5'],
      price: 3400, cores: 24, threads: 32, boostGHz: 5.8,
      perfScore: 97, integratedGpu: true,
      tag: 'Flagship',
      why: 'CPU flagship da Intel. Desempenho máximo para renderização, programação pesada e gaming profissional.',
      socket_label: 'LGA1700', gen: 13
    },
    // AMD AM4 (DDR4)
    {
      id: 'ryzen5-5600', name: 'AMD Ryzen 5 5600', brand: 'AMD',
      socket: 'AM4', tier: 1, tdp: 65, ramTypes: ['DDR4'],
      price: 700, cores: 6, threads: 12, boostGHz: 4.4,
      perfScore: 45, integratedGpu: false,
      tag: 'Budget Gaming',
      why: 'Excelente para gaming com 6 núcleos eficientes. Plataforma AM4 madura com ótimo custo-benefício.',
      socket_label: 'AM4', gen: 5
    },
    {
      id: 'ryzen5-5600x', name: 'AMD Ryzen 5 5600X', brand: 'AMD',
      socket: 'AM4', tier: 2, tdp: 65, ramTypes: ['DDR4'],
      price: 850, cores: 6, threads: 12, boostGHz: 4.6,
      perfScore: 55, integratedGpu: false,
      tag: 'Mid-Range',
      why: 'Versão melhorada do 5600, com frequências mais altas. Ótimo para gaming 1080p/1440p.',
      socket_label: 'AM4', gen: 5
    },
    // AMD AM5 (DDR5)
    {
      id: 'ryzen5-7600x', name: 'AMD Ryzen 5 7600X', brand: 'AMD',
      socket: 'AM5', tier: 2, tdp: 105, ramTypes: ['DDR5'],
      price: 1100, cores: 6, threads: 12, boostGHz: 5.3,
      perfScore: 65, integratedGpu: true,
      tag: 'Mid-Range AM5',
      why: 'CPU AM5 rápida para gaming. Plataforma nova com suporte DDR5 e PCIe 5.0.',
      socket_label: 'AM5', gen: 7
    },
    {
      id: 'ryzen7-7700x', name: 'AMD Ryzen 7 7700X', brand: 'AMD',
      socket: 'AM5', tier: 3, tdp: 105, ramTypes: ['DDR5'],
      price: 1650, cores: 8, threads: 16, boostGHz: 5.4,
      perfScore: 80, integratedGpu: true,
      tag: 'High-End AM5',
      why: '8 núcleos de alto desempenho na plataforma AM5. Excelente equilíbrio entre gaming e produtividade.',
      socket_label: 'AM5', gen: 7
    },
    {
      id: 'ryzen9-7950x', name: 'AMD Ryzen 9 7950X', brand: 'AMD',
      socket: 'AM5', tier: 4, tdp: 170, ramTypes: ['DDR5'],
      price: 3600, cores: 16, threads: 32, boostGHz: 5.7,
      perfScore: 99, integratedGpu: true,
      tag: 'Workstation',
      why: 'CPU de nível profissional. 16 núcleos ideais para renderização 3D, edição de vídeo e machine learning.',
      socket_label: 'AM5', gen: 7
    },
    // Office CPUs (with iGPU)
    {
      id: 'i3-12100', name: 'Intel Core i3-12100', brand: 'Intel',
      socket: 'LGA1700', tier: 1, tdp: 60, ramTypes: ['DDR4'],
      price: 720, cores: 4, threads: 8, boostGHz: 4.3,
      perfScore: 36, integratedGpu: true,
      tag: 'Office Budget',
      why: 'Processador eficiente para escritório com gráfico integrado Intel UHD 730. Não precisa de GPU dedicada.',
      socket_label: 'LGA1700', gen: 12
    },
    {
      id: 'i5-12400', name: 'Intel Core i5-12400', brand: 'Intel',
      socket: 'LGA1700', tier: 2, tdp: 65, ramTypes: ['DDR4'],
      price: 950, cores: 6, threads: 12, boostGHz: 4.4,
      perfScore: 52, integratedGpu: true,
      tag: 'Office Mid',
      why: '6 núcleos com gráfico integrado. Perfeito para multitarefa, edição leve e trabalhos do dia a dia.',
      socket_label: 'LGA1700', gen: 12
    },
    {
      id: 'i7-12700', name: 'Intel Core i7-12700', brand: 'Intel',
      socket: 'LGA1700', tier: 3, tdp: 65, ramTypes: ['DDR4'],
      price: 1700, cores: 12, threads: 20, boostGHz: 4.9,
      perfScore: 76, integratedGpu: true,
      tag: 'Office Power',
      why: '12 núcleos para trabalho pesado. Ideal para Power BI, Photoshop e programação profissional.',
      socket_label: 'LGA1700', gen: 12
    }
  ],

  // ─── GPUs ────────────────────────────────────────────────
  gpu: [
    {
      id: 'rtx-3060', name: 'NVIDIA GeForce RTX 3060 12GB', brand: 'NVIDIA',
      tier: 1, vram: 12, price: 1800, perfScore: 42,
      tdp: 170, tag: 'Budget Gaming',
      why: 'Ótima GPU entrada de gama. Suporta Ray Tracing e DLSS para gaming 1080p fluido.',
      games: { '1080p': 75, '1440p': 50, '4k': 28 }
    },
    {
      id: 'rx-6600', name: 'AMD Radeon RX 6600 8GB', brand: 'AMD',
      tier: 1, vram: 8, price: 1400, perfScore: 38,
      tdp: 132, tag: 'Budget Value',
      why: 'Excelente custo-benefício para 1080p. Eficiente e silenciosa, perfeita para quem não quer gastar muito.',
      games: { '1080p': 68, '1440p': 44, '4k': 22 }
    },
    {
      id: 'rtx-4060', name: 'NVIDIA GeForce RTX 4060 8GB', brand: 'NVIDIA',
      tier: 2, vram: 8, price: 2100, perfScore: 52,
      tdp: 115, tag: 'Mid-Range Efficient',
      why: 'Nova geração com baixo consumo. DLSS 3 e Frame Generation para gaming 1080p/1440p.',
      games: { '1080p': 88, '1440p': 62, '4k': 35 }
    },
    {
      id: 'rtx-4060ti', name: 'NVIDIA GeForce RTX 4060 Ti 8GB', brand: 'NVIDIA',
      tier: 2, vram: 8, price: 2500, perfScore: 60,
      tdp: 160, tag: 'Mid-Range',
      why: 'Excelente para 1440p. Eficiência energética superior e suporte a DLSS 3 com Frame Generation.',
      games: { '1080p': 105, '1440p': 75, '4k': 42 }
    },
    {
      id: 'rx-6700xt', name: 'AMD Radeon RX 6700 XT 12GB', brand: 'AMD',
      tier: 2, vram: 12, price: 2200, perfScore: 57,
      tdp: 230, tag: 'Mid-Range AMD',
      why: '12GB de VRAM para 1440p. Ótima para quem precisa de mais memória gráfica a preço justo.',
      games: { '1080p': 96, '1440p': 70, '4k': 38 }
    },
    {
      id: 'rtx-4070', name: 'NVIDIA GeForce RTX 4070 12GB', brand: 'NVIDIA',
      tier: 3, vram: 12, price: 3500, perfScore: 75,
      tdp: 200, tag: 'High-End',
      why: 'GPU premium para 1440p e 4K. Ideal para gaming pesado com Ray Tracing e máxima qualidade visual.',
      games: { '1080p': 140, '1440p': 100, '4k': 58 }
    },
    {
      id: 'rx-7900gre', name: 'AMD Radeon RX 7900 GRE 16GB', brand: 'AMD',
      tier: 3, vram: 16, price: 3200, perfScore: 72,
      tdp: 260, tag: 'High-End AMD',
      why: '16GB VRAM para gaming 4K e criação de conteúdo. Excelente custo-benefício na faixa premium.',
      games: { '1080p': 130, '1440p': 96, '4k': 54 }
    },
    {
      id: 'rtx-4070ti', name: 'NVIDIA GeForce RTX 4070 Ti 12GB', brand: 'NVIDIA',
      tier: 3, vram: 12, price: 4800, perfScore: 85,
      tdp: 285, tag: 'High-End Premium',
      why: 'Potência de RTX 4080 por preço menor. Excelente para 4K gaming e criação de conteúdo.',
      games: { '1080p': 180, '1440p': 128, '4k': 76 }
    },
    {
      id: 'rtx-4090', name: 'NVIDIA GeForce RTX 4090 24GB', brand: 'NVIDIA',
      tier: 4, vram: 24, price: 9500, perfScore: 100,
      tdp: 450, tag: 'Flagship',
      why: 'A GPU mais poderosa do mercado. 4K@144Hz com ray tracing máximo, ideal para profissionais e entusiastas.',
      games: { '1080p': 240, '1440p': 200, '4k': 130 }
    },
    {
      id: 'rx-7900xtx', name: 'AMD Radeon RX 7900 XTX 24GB', brand: 'AMD',
      tier: 4, vram: 24, price: 6800, perfScore: 93,
      tdp: 355, tag: 'Flagship AMD',
      why: '24GB VRAM para os cenários mais exigentes. Melhor custo-benefício entre as GPUs topo de linha.',
      games: { '1080p': 230, '1440p': 185, '4k': 115 }
    },
    {
      id: 'igpu', name: 'Gráfico Integrado (iGPU)', brand: 'Intel/AMD',
      tier: 0, vram: 0, price: 0, perfScore: 8,
      tdp: 0, tag: 'Integrated',
      why: 'Gráfico integrado no processador. Suficiente para escritório, apresentações e uso casual.',
      games: { '1080p': 20, '1440p': 10, '4k': 0 }
    }
  ],

  // ─── Motherboards ────────────────────────────────────────
  motherboard: [
    // AMD AM4 DDR4
    {
      id: 'b450m-prime', name: 'ASUS Prime B450M-A', brand: 'ASUS',
      socket: 'AM4', chipset: 'B450', formFactor: 'mATX',
      ramType: 'DDR4', ramSlots: 4, maxRamGB: 128,
      price: 420, tier: 1,
      why: 'Placa-mãe econômica AM4 com bom VRM para processadores Ryzen.',
      pciex16: 1, m2slots: 1, sataports: 4
    },
    {
      id: 'b550-tomahawk', name: 'MSI MAG B550 TOMAHAWK', brand: 'MSI',
      socket: 'AM4', chipset: 'B550', formFactor: 'ATX',
      ramType: 'DDR4', ramSlots: 4, maxRamGB: 128,
      price: 650, tier: 2,
      why: 'Placa robusta com PCIe 4.0, VRM excelente e bom overclocking para AM4.',
      pciex16: 1, m2slots: 2, sataports: 6
    },
    {
      id: 'x570-hero', name: 'ASUS ROG Crosshair VIII Hero', brand: 'ASUS',
      socket: 'AM4', chipset: 'X570', formFactor: 'ATX',
      ramType: 'DDR4', ramSlots: 4, maxRamGB: 128,
      price: 1200, tier: 3,
      why: 'Placa premium AM4 para overclock extremo. VRM robusto para Ryzen 9 sem limites.',
      pciex16: 2, m2slots: 3, sataports: 8
    },
    // AMD AM5 DDR5
    {
      id: 'b650-prime', name: 'ASUS Prime B650-Plus', brand: 'ASUS',
      socket: 'AM5', chipset: 'B650', formFactor: 'ATX',
      ramType: 'DDR5', ramSlots: 4, maxRamGB: 192,
      price: 780, tier: 2,
      why: 'Entrada acessível na plataforma AM5 com DDR5 e PCIe 5.0 para M.2.',
      pciex16: 1, m2slots: 2, sataports: 4
    },
    {
      id: 'x670e-ace', name: 'MSI MEG X670E ACE', brand: 'MSI',
      socket: 'AM5', chipset: 'X670E', formFactor: 'ATX',
      ramType: 'DDR5', ramSlots: 4, maxRamGB: 192,
      price: 1900, tier: 4,
      why: 'Placa-mãe flagship AM5. VRM de 20 fases para máximo overclock em Ryzen 9.',
      pciex16: 2, m2slots: 4, sataports: 6
    },
    // Intel LGA1700 DDR4
    {
      id: 'b660m-prime', name: 'ASUS Prime B660M-A DDR4', brand: 'ASUS',
      socket: 'LGA1700', chipset: 'B660', formFactor: 'mATX',
      ramType: 'DDR4', ramSlots: 4, maxRamGB: 128,
      price: 520, tier: 1,
      why: 'Placa micro-ATX econômica para Intel 12ª/13ª geração com DDR4. Ideal para PCs compactos.',
      pciex16: 1, m2slots: 2, sataports: 4
    },
    {
      id: 'b660-tomahawk', name: 'MSI MAG B660 TOMAHAWK WiFi', brand: 'MSI',
      socket: 'LGA1700', chipset: 'B660', formFactor: 'ATX',
      ramType: 'DDR4', ramSlots: 4, maxRamGB: 128,
      price: 720, tier: 2,
      why: 'Excelente placa para i5/i7 com WiFi integrado e bom VRM. Custo-benefício ótimo.',
      pciex16: 1, m2slots: 2, sataports: 6
    },
    {
      id: 'z690-tomahawk', name: 'MSI MAG Z690 TOMAHAWK WiFi DDR4', brand: 'MSI',
      socket: 'LGA1700', chipset: 'Z690', formFactor: 'ATX',
      ramType: 'DDR4', ramSlots: 4, maxRamGB: 128,
      price: 950, tier: 3,
      why: 'Chipset Z690 permite overclock total. Ideal para i7/i9 com máxima performance.',
      pciex16: 2, m2slots: 3, sataports: 6
    },
    {
      id: 'z790-rog', name: 'ASUS ROG Maximus Z790 Apex', brand: 'ASUS',
      socket: 'LGA1700', chipset: 'Z790', formFactor: 'ATX',
      ramType: 'DDR5', ramSlots: 2, maxRamGB: 96,
      price: 2400, tier: 4,
      why: 'Placa-mãe topo da linha Intel. VRM de 24 fases para i9-13900K em overclock extremo.',
      pciex16: 2, m2slots: 5, sataports: 4
    }
  ],

  // ─── RAM ─────────────────────────────────────────────────
  ram: [
    {
      id: 'ddr4-8gb', name: 'Corsair Vengeance 8GB DDR4 3200MHz', brand: 'Corsair',
      type: 'DDR4', capacityGB: 8, speedMHz: 3200, sticks: 2,
      price: 160, tier: 1,
      why: 'RAM básica suficiente para escritório e gaming leve. DDR4 estável e amplamente compatível.'
    },
    {
      id: 'ddr4-16gb', name: 'Kingston Fury Beast 16GB DDR4 3200MHz', brand: 'Kingston',
      type: 'DDR4', capacityGB: 16, speedMHz: 3200, sticks: 2,
      price: 250, tier: 2,
      why: '16GB é o padrão atual para gaming e multitarefa. Velocidade 3200MHz ideal para Ryzen AM4.'
    },
    {
      id: 'ddr4-32gb', name: 'G.Skill Trident Z 32GB DDR4 3600MHz', brand: 'G.Skill',
      type: 'DDR4', capacityGB: 32, speedMHz: 3600, sticks: 2,
      price: 480, tier: 3,
      why: '32GB para streaming, gravação, criação de conteúdo e jogos pesados sem engasgos.'
    },
    {
      id: 'ddr5-16gb', name: 'Corsair Vengeance DDR5 16GB 5200MHz', brand: 'Corsair',
      type: 'DDR5', capacityGB: 16, speedMHz: 5200, sticks: 2,
      price: 420, tier: 2,
      why: 'DDR5 de entrada para plataformas AM5 e Intel 12ª+. Velocidade e bandwidth superiores ao DDR4.'
    },
    {
      id: 'ddr5-32gb', name: 'G.Skill Trident Z5 32GB DDR5 6000MHz', brand: 'G.Skill',
      type: 'DDR5', capacityGB: 32, speedMHz: 6000, sticks: 2,
      price: 750, tier: 3,
      why: '32GB DDR5 6000MHz, configuração ideal para Ryzen 7000 e Intel 13ª geração com máxima performance.'
    },
    {
      id: 'ddr5-64gb', name: 'Corsair Dominator Platinum 64GB DDR5 6400MHz', brand: 'Corsair',
      type: 'DDR5', capacityGB: 64, speedMHz: 6400, sticks: 2,
      price: 1600, tier: 4,
      why: '64GB para workstation profissional. Edição de vídeo 4K, VMs múltiplas e renderização 3D.'
    }
  ],

  // ─── Storage ─────────────────────────────────────────────
  storage: [
    {
      id: 'ssd-500gb', name: 'Kingston A400 500GB SATA SSD', brand: 'Kingston',
      type: 'SSD SATA', capacityGB: 500, readMBs: 500, writeMBs: 450,
      price: 200, tier: 1,
      why: 'SSD econômico para boot rápido do sistema. 500GB suficiente para SO e programas essenciais.'
    },
    {
      id: 'nvme-1tb', name: 'Samsung 970 EVO Plus 1TB NVMe M.2', brand: 'Samsung',
      type: 'NVMe M.2', capacityGB: 1000, readMBs: 3500, writeMBs: 3300,
      price: 450, tier: 2,
      why: 'NVMe 7x mais rápido que SATA. 1TB para sistema, jogos e arquivos de trabalho com espaço confortável.'
    },
    {
      id: 'nvme-2tb', name: 'WD Black SN850X 2TB NVMe M.2', brand: 'Western Digital',
      type: 'NVMe M.2', capacityGB: 2000, readMBs: 7300, writeMBs: 6600,
      price: 820, tier: 3,
      why: '2TB ultrarrápido PCIe 4.0. Ideal para quem tem muitos jogos, vídeos e projetos criativos.'
    },
    {
      id: 'nvme-4tb', name: 'Samsung 990 Pro 4TB NVMe M.2', brand: 'Samsung',
      type: 'NVMe M.2', capacityGB: 4000, readMBs: 7450, writeMBs: 6900,
      price: 1900, tier: 4,
      why: '4TB para workstation profissional. Nunca fique sem espaço para projetos de vídeo e design.'
    },
    {
      id: 'hdd-2tb', name: 'Seagate Barracuda 2TB HDD', brand: 'Seagate',
      type: 'HDD', capacityGB: 2000, readMBs: 190, writeMBs: 190,
      price: 290, tier: 1,
      why: 'HD para armazenar grande volume de arquivos, vídeos e backups com baixo custo por GB.'
    },
    {
      id: 'combo-1tb-ssd-2tb-hdd', name: 'Combo: NVMe 1TB + HDD 2TB', brand: 'Samsung + Seagate',
      type: 'Combo', capacityGB: 3000, readMBs: 3500, writeMBs: 3300,
      price: 740, tier: 2,
      why: 'Melhor dos dois mundos: SSD rápido para SO/jogos e HD para massa de arquivos. Setup clássico e eficiente.'
    }
  ],

  // ─── PSU ─────────────────────────────────────────────────
  psu: [
    {
      id: 'psu-550w', name: 'Corsair CV550 550W 80+ Bronze', brand: 'Corsair',
      wattage: 550, rating: '80+ Bronze', modular: false,
      price: 360, tier: 1,
      why: 'Fonte confiável para PCs office e gaming leve sem GPU dedicada poderosa.'
    },
    {
      id: 'psu-650w', name: 'Corsair CX650M 650W 80+ Bronze', brand: 'Corsair',
      wattage: 650, rating: '80+ Bronze', modular: true,
      price: 440, tier: 1,
      why: '650W semismodular com boa eficiência. Suporta GPUs mid-range com margem de segurança.'
    },
    {
      id: 'psu-750w', name: 'Corsair RM750x 750W 80+ Gold', brand: 'Corsair',
      wattage: 750, rating: '80+ Gold', modular: true,
      price: 620, tier: 2,
      why: 'Fonte gold totalmente modular. Silenciosa, eficiente e com garantia de 10 anos.'
    },
    {
      id: 'psu-850w', name: 'Seasonic Focus GX-850 850W 80+ Gold', brand: 'Seasonic',
      wattage: 850, rating: '80+ Gold', modular: true,
      price: 780, tier: 3,
      why: '850W para sistemas high-end. Proteção completa contra sobrecargas e ruído mínimo.'
    },
    {
      id: 'psu-1000w', name: 'Corsair AX1000 1000W 80+ Titanium', brand: 'Corsair',
      wattage: 1000, rating: '80+ Titanium', modular: true,
      price: 1150, tier: 4,
      why: '1000W titanium para RTX 4090 e sistemas extremos. Eficiência máxima e proteções avançadas.'
    }
  ],

  // ─── Cases ───────────────────────────────────────────────
  case: [
    {
      id: 'case-matx', name: 'Cooler Master MasterBox Q300L', brand: 'Cooler Master',
      formFactor: 'mATX', type: 'Mid Tower Compact',
      price: 310, tier: 1,
      why: 'Gabinete compacto com bom airflow e painel lateral magnético. Ideal para builds econômicas.'
    },
    {
      id: 'case-4000d', name: 'Corsair 4000D Airflow', brand: 'Corsair',
      formFactor: 'ATX', type: 'Mid Tower',
      price: 520, tier: 2,
      why: 'Referência em airflow. Front panel perfurado maximiza resfriamento para gaming.'
    },
    {
      id: 'case-o11d', name: 'Lian Li PC-O11 Dynamic EVO', brand: 'Lian Li',
      formFactor: 'ATX', type: 'Mid-Full Tower',
      price: 720, tier: 3,
      why: 'Icônico gabinete com painel de vidro duplo. Espaço generoso para watercooling e múltiplas GPUs.'
    },
    {
      id: 'case-torrent', name: 'Fractal Design Torrent', brand: 'Fractal Design',
      formFactor: 'ATX', type: 'Full Tower',
      price: 980, tier: 4,
      why: 'Airflow excepcional com ventoinhas frontais de 180mm. O gabinete mais refrigerado do mercado.'
    }
  ],

  // ─── Cooling ─────────────────────────────────────────────
  cooling: [
    {
      id: 'stock', name: 'Cooler Stock (incluso)', brand: 'Intel/AMD',
      type: 'Air', tdpRating: 65,
      price: 0, tier: 0,
      why: 'Cooler incluído com o processador. Adequado para cargas normais sem overclock.'
    },
    {
      id: 'deepcool-ak400', name: 'DeepCool AK400', brand: 'DeepCool',
      type: 'Air', tdpRating: 120,
      price: 160, tier: 1,
      why: 'Melhor cooler de entrada do mercado. Silencioso, eficiente e fácil de instalar. Substituto ideal do stock cooler.'
    },
    {
      id: 'noctua-u12s', name: 'Noctua NH-U12S', brand: 'Noctua',
      type: 'Air', tdpRating: 150,
      price: 330, tier: 2,
      why: 'Noctua é referência em silêncio e durabilidade. O U12S é compacto e muito eficiente.'
    },
    {
      id: 'noctua-d15', name: 'Noctua NH-D15', brand: 'Noctua',
      type: 'Air', tdpRating: 250,
      price: 470, tier: 3,
      why: 'O melhor cooler air do mundo. Refrigera mesmo os CPUs mais potentes em silêncio absoluto.'
    },
    {
      id: 'aio-240', name: 'Corsair H100i Elite 240mm AIO', brand: 'Corsair',
      type: 'AIO Liquid', tdpRating: 200,
      price: 520, tier: 2,
      why: 'Water cooler compacto com excelente desempenho térmico. Visual gamer com RGB e software iCUE.'
    },
    {
      id: 'aio-360', name: 'NZXT Kraken Z73 360mm AIO', brand: 'NZXT',
      type: 'AIO Liquid', tdpRating: 300,
      price: 850, tier: 4,
      why: 'Water cooler de alto desempenho com display LCD. Resfria os CPUs mais poderosos com folga.'
    }
  ]
};

// ─── Notebooks Database ──────────────────────────────────────
const NOTEBOOKS = [
  // Gamer Leve
  {
    id: 'nb-gamer-budget', name: 'Acer Nitro 5 AN515', category: 'gamer', tier: 1,
    cpu: 'AMD Ryzen 5 7535HS', gpu: 'NVIDIA RTX 4050 6GB', ram: '16GB DDR5',
    storage: 'SSD 512GB NVMe', display: '15.6" FHD 144Hz IPS',
    battery: '4h gaming / 6h uso normal', weight: '2.3kg',
    price: 5500, perfScore: 55,
    pros: ['Ótimo custo-benefício', 'Tela 144Hz suave', 'Fácil de upgradear RAM e SSD'],
    cons: ['Bateria curta em jogos', 'Plástico no corpo'],
    why: 'Melhor entrada no mundo gamer mobile. Roda a maioria dos jogos em alto ou médio com boa fluidez.',
    games: { '1080p_high': 55, '1080p_medium': 80 }
  },
  {
    id: 'nb-gamer-mid', name: 'ASUS ROG Strix G15', category: 'gamer', tier: 2,
    cpu: 'AMD Ryzen 7 7745HX', gpu: 'NVIDIA RTX 4070 8GB', ram: '16GB DDR5',
    storage: 'SSD 1TB NVMe', display: '15.6" FHD 165Hz IPS',
    battery: '3h gaming / 5h uso normal', weight: '2.3kg',
    price: 9500, perfScore: 72,
    pros: ['Alta performance', 'Tela rápida 165Hz', 'Boa refrigeração'],
    cons: ['Autonomia baixa em jogos', 'Preço elevado'],
    why: 'Alta performance para jogos pesados e streaming simultâneo. Plataforma madura da ASUS ROG.',
    games: { '1080p_high': 80, '1080p_ultra': 60 }
  },
  {
    id: 'nb-gamer-high', name: 'MSI Titan GT77 HX', category: 'gamer', tier: 3,
    cpu: 'Intel Core i9-13980HX', gpu: 'NVIDIA RTX 4090 16GB', ram: '32GB DDR5',
    storage: 'SSD 2TB NVMe', display: '17.3" FHD 360Hz IPS',
    battery: '2h gaming / 4h uso normal', weight: '3.3kg',
    price: 24000, perfScore: 95,
    pros: ['Máxima performance mobile', 'Tela 360Hz para eSports', 'Teclado mecânico'],
    cons: ['Extremamente pesado', 'Autonomia péssima', 'Preço altíssimo'],
    why: 'O notebook gamer mais poderoso do mercado. Para quem não aceita compromissos de performance.',
    games: { '1080p_ultra': 120, '1440p_high': 90 }
  },
  // Office
  {
    id: 'nb-office-budget', name: 'Lenovo IdeaPad 3', category: 'office', tier: 1,
    cpu: 'AMD Ryzen 5 7520U', gpu: 'AMD Radeon Graphics (iGPU)', ram: '8GB DDR5',
    storage: 'SSD 512GB NVMe', display: '15.6" FHD IPS Anti-Reflexo',
    battery: '8h uso normal', weight: '1.7kg',
    price: 3200, perfScore: 35,
    pros: ['Leve e portátil', 'Boa bateria', 'Tela anti-reflexo'],
    cons: ['RAM soldada limitada', 'Sem GPU dedicada'],
    why: 'Notebook econômico para tarefas do dia a dia: planilhas, e-mails, vídeo-conferência e navegação.',
    software: ['Word/Excel', 'Teams/Zoom', 'Chrome', 'PowerPoint']
  },
  {
    id: 'nb-office-mid', name: 'Dell Inspiron 15 5000', category: 'office', tier: 2,
    cpu: 'Intel Core i5-1335U', gpu: 'Intel Iris Xe (iGPU)', ram: '16GB DDR5',
    storage: 'SSD 512GB NVMe', display: '15.6" FHD IPS',
    battery: '9h uso normal', weight: '1.8kg',
    price: 4800, perfScore: 48,
    pros: ['Bateria excelente', 'Build quality premium', 'Suporte Dell confiável'],
    cons: ['SSD relativamente lento', 'Sem GPU dedicada'],
    why: 'Equilíbrio perfeito para profissionais. Bom para Power BI, Photoshop leve e multitarefa.',
    software: ['Office 365', 'Power BI', 'Photoshop leve', 'VS Code']
  },
  {
    id: 'nb-office-high', name: 'MacBook Pro 14" M3 Pro', category: 'office', tier: 3,
    cpu: 'Apple M3 Pro (11 cores)', gpu: 'Apple M3 Pro GPU (14 cores)', ram: '18GB Unified',
    storage: 'SSD 512GB', display: '14.2" Liquid Retina XDR 120Hz',
    battery: '17h uso normal', weight: '1.6kg',
    price: 17000, perfScore: 90,
    pros: ['Desempenho excepcional', 'Bateria incrível', 'Tela Liquid Retina XDR'],
    cons: ['Preço premium', 'Ecossistema fechado', 'Pouca RAM upgradável'],
    why: 'O melhor notebook para criação de conteúdo e desenvolvimento. Performance e eficiência sem paralelo.',
    software: ['Final Cut Pro', 'Logic Pro', 'Xcode', 'Adobe Creative Suite', 'Figma']
  },
  {
    id: 'nb-office-workstation', name: 'ASUS ProArt Studiobook Pro 16', category: 'office', tier: 4,
    cpu: 'Intel Core i9-13980HX', gpu: 'NVIDIA RTX 4070 8GB', ram: '32GB DDR5',
    storage: 'SSD 2TB NVMe', display: '16" OLED 3.2K 120Hz',
    battery: '6h uso normal', weight: '2.4kg',
    price: 22000, perfScore: 93,
    pros: ['Tela OLED profissional', 'Alta performance geral', 'Memória upgradável'],
    cons: ['Peso considerável', 'Preço alto', 'Autonomia média'],
    why: 'Workstation mobile para profissionais que precisam de renderização 3D, edição 4K e modelagem.',
    software: ['Premiere Pro', 'After Effects', '3ds Max', 'Blender', 'DaVinci Resolve']
  }
];

// ─── Build Presets ───────────────────────────────────────────
const BUILD_PRESETS = {
  // [deviceType][useType][intensity]
  desktop_gamer_light: {
    name: 'PC Gamer Leve',
    cpu: 'i5-13400f', gpu: 'rtx-3060', motherboard: 'b660-tomahawk',
    ram: 'ddr4-16gb', storage: 'nvme-1tb', psu: 'psu-650w',
    case: 'case-4000d', cooling: 'deepcool-ak400',
    perfLevel: 'Intermediário', targetRes: '1080p', targetFPS: 75
  },
  desktop_gamer_medium: {
    name: 'PC Gamer Médio',
    cpu: 'i5-13400f', gpu: 'rtx-4060ti', motherboard: 'z690-tomahawk',
    ram: 'ddr4-32gb', storage: 'nvme-1tb', psu: 'psu-750w',
    case: 'case-4000d', cooling: 'aio-240',
    perfLevel: 'Avançado', targetRes: '1440p', targetFPS: 90
  },
  desktop_gamer_heavy: {
    name: 'PC Gamer Pesado',
    cpu: 'i7-13700k', gpu: 'rtx-4070', motherboard: 'z790-rog',
    ram: 'ddr5-32gb', storage: 'nvme-2tb', psu: 'psu-850w',
    case: 'case-o11d', cooling: 'aio-360',
    perfLevel: 'Profissional', targetRes: '4K', targetFPS: 100
  },
  desktop_gamer_extreme: {
    name: 'PC Gamer Extremo',
    cpu: 'i9-13900k', gpu: 'rtx-4090', motherboard: 'z790-rog',
    ram: 'ddr5-32gb', storage: 'nvme-2tb', psu: 'psu-1000w',
    case: 'case-torrent', cooling: 'aio-360',
    perfLevel: 'Profissional', targetRes: '4K', targetFPS: 144
  },
  desktop_office_light: {
    name: 'PC de Escritório Básico',
    cpu: 'i3-12100', gpu: 'igpu', motherboard: 'b660m-prime',
    ram: 'ddr4-8gb', storage: 'ssd-500gb', psu: 'psu-550w',
    case: 'case-matx', cooling: 'stock',
    perfLevel: 'Básico', targetRes: '1080p', targetFPS: 0
  },
  desktop_office_medium: {
    name: 'PC de Escritório Produtivo',
    cpu: 'i5-12400', gpu: 'igpu', motherboard: 'b660-tomahawk',
    ram: 'ddr4-16gb', storage: 'nvme-1tb', psu: 'psu-650w',
    case: 'case-4000d', cooling: 'deepcool-ak400',
    perfLevel: 'Intermediário', targetRes: '1080p', targetFPS: 0
  },
  desktop_office_heavy: {
    name: 'PC de Trabalho Pesado',
    cpu: 'i7-12700', gpu: 'rtx-4060ti', motherboard: 'z690-tomahawk',
    ram: 'ddr4-32gb', storage: 'combo-1tb-ssd-2tb-hdd', psu: 'psu-850w',
    case: 'case-o11d', cooling: 'aio-240',
    perfLevel: 'Profissional', targetRes: '1440p', targetFPS: 0
  },
  desktop_office_extreme: {
    name: 'Workstation Profissional',
    cpu: 'ryzen9-7950x', gpu: 'rx-7900xtx', motherboard: 'x670e-ace',
    ram: 'ddr5-64gb', storage: 'nvme-4tb', psu: 'psu-1000w',
    case: 'case-torrent', cooling: 'aio-360',
    perfLevel: 'Profissional', targetRes: '4K', targetFPS: 0
  }
};

// ─── Games Benchmark ────────────────────────────────────────
const GAMES_BENCHMARK = {
  'rtx-3060':   { 'Fortnite': 120, 'CS2': 180, 'GTA V': 100, 'Minecraft': 200, 'Apex Legends': 130, 'Valorant': 280, 'Red Dead Redemption 2': 55, 'Cyberpunk 2077': 40, 'Elden Ring': 60 },
  'rx-6600':    { 'Fortnite': 105, 'CS2': 160, 'GTA V': 88, 'Minecraft': 180, 'Apex Legends': 115, 'Valorant': 250, 'Red Dead Redemption 2': 48, 'Cyberpunk 2077': 35, 'Elden Ring': 54 },
  'rtx-4060':   { 'Fortnite': 150, 'CS2': 210, 'GTA V': 120, 'Minecraft': 280, 'Apex Legends': 160, 'Valorant': 340, 'Red Dead Redemption 2': 68, 'Cyberpunk 2077': 52, 'Elden Ring': 78 },
  'rtx-4060ti': { 'Fortnite': 185, 'CS2': 260, 'GTA V': 145, 'Minecraft': 340, 'Apex Legends': 200, 'Valorant': 420, 'Red Dead Redemption 2': 82, 'Cyberpunk 2077': 65, 'Elden Ring': 95 },
  'rx-6700xt':  { 'Fortnite': 170, 'CS2': 240, 'GTA V': 132, 'Minecraft': 310, 'Apex Legends': 185, 'Valorant': 390, 'Red Dead Redemption 2': 75, 'Cyberpunk 2077': 60, 'Elden Ring': 88 },
  'rtx-4070':   { 'Fortnite': 230, 'CS2': 320, 'GTA V': 185, 'Minecraft': 450, 'Apex Legends': 260, 'Valorant': 550, 'Red Dead Redemption 2': 105, 'Cyberpunk 2077': 88, 'Elden Ring': 125 },
  'rx-7900gre': { 'Fortnite': 215, 'CS2': 295, 'GTA V': 175, 'Minecraft': 420, 'Apex Legends': 245, 'Valorant': 510, 'Red Dead Redemption 2': 98, 'Cyberpunk 2077': 82, 'Elden Ring': 115 },
  'rtx-4070ti': { 'Fortnite': 290, 'CS2': 400, 'GTA V': 230, 'Minecraft': 550, 'Apex Legends': 320, 'Valorant': 680, 'Red Dead Redemption 2': 135, 'Cyberpunk 2077': 110, 'Elden Ring': 155 },
  'rtx-4090':   { 'Fortnite': 400, 'CS2': 550, 'GTA V': 320, 'Minecraft': 700, 'Apex Legends': 430, 'Valorant': 900, 'Red Dead Redemption 2': 185, 'Cyberpunk 2077': 155, 'Elden Ring': 215 },
  'rx-7900xtx': { 'Fortnite': 370, 'CS2': 510, 'GTA V': 295, 'Minecraft': 640, 'Apex Legends': 400, 'Valorant': 820, 'Red Dead Redemption 2': 170, 'Cyberpunk 2077': 145, 'Elden Ring': 200 },
  'igpu':       { 'Fortnite': 25, 'CS2': 40, 'GTA V': 18, 'Minecraft': 60, 'Apex Legends': 28, 'Valorant': 80, 'Red Dead Redemption 2': 0, 'Cyberpunk 2077': 0, 'Elden Ring': 0 }
};

// ─── Software Compatibility ──────────────────────────────────
const SOFTWARE_COMPAT = {
  basic:        ['Navegadores Web', 'Microsoft Office', 'E-mail', 'Videoconferência (Teams/Zoom)', 'YouTube/Streaming'],
  intermediate: ['Adobe Photoshop (básico)', 'DaVinci Resolve (1080p)', 'Power BI', 'Programação (VS Code)', 'Edição de Planilhas Complexas'],
  advanced:     ['Adobe Premiere Pro', 'After Effects', 'Blender (render rápido)', 'Solidworks', 'Machine Learning (TensorFlow)'],
  professional: ['Renderização 3D profissional', 'Edição 4K/8K', 'VMs Múltiplas', 'Treinamento de IA', 'CAD Avançado (AutoCAD, Revit)']
};

// ─── Helper Functions ────────────────────────────────────────
function getComponentById(type, id) {
  if (
    typeof type !== 'string' ||
    typeof id !== 'string' ||
    !Object.prototype.hasOwnProperty.call(COMPONENTS, type) ||
    id.length > 64 ||
    !/^[a-z0-9-]+$/i.test(id)
  ) {
    return undefined;
  }
  return COMPONENTS[type].find(component => component.id === id);
}

function getAlternatives(type, currentId, socket = null) {
  const current = getComponentById(type, currentId);
  if (!current) return { cheaper: null, powerful: null };
  let pool = COMPONENTS[type].filter(c => c.id !== currentId);
  if (socket && (type === 'cpu' || type === 'motherboard')) {
    pool = pool.filter(c => c.socket === socket);
  }
  const cheaper = pool
    .filter(c => c.price < current.price && c.tier >= current.tier - 1)
    .sort((a, b) => b.price - a.price)[0] || null;
  const powerful = pool
    .filter(c => c.price > current.price && c.tier <= current.tier + 1)
    .sort((a, b) => a.price - b.price)[0] || null;
  return { cheaper, powerful };
}

// ─── Dynamic Pricing System ──────────────────────────────────
// Preços base são ajustados ±4% a cada hora simulando variações
// reais de mercado (dólar, estoque, promoções).

const PriceEngine = (() => {
  const STORAGE_KEY = 'pcforge_prices';
  const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 hora

  // Semente baseada na hora atual → mesma hora = mesmos preços
  function seededRandom(seed) {
    const x = Math.sin(seed + 1) * 43758.5453123;
    return x - Math.floor(x);
  }

  function getHourSeed() {
    const now = new Date();
    return now.getFullYear() * 1000000 +
           (now.getMonth() + 1) * 10000 +
           now.getDate() * 100 +
           now.getHours();
  }

  function generatePrices() {
    const seed = getHourSeed();
    const prices = {};
    let idx = 0;

    ['cpu','gpu','motherboard','ram','storage','psu','case','cooling'].forEach(type => {
      prices[type] = {};
      COMPONENTS[type].forEach(comp => {
        if (comp.price === 0) { prices[type][comp.id] = 0; return; }
        const r = seededRandom(seed + idx++);
        const variation = 1 + (r - 0.5) * 0.08; // ±4%
        prices[type][comp.id] = Math.round(comp.price * variation / 10) * 10;
      });
    });

    const updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ prices, updatedAt, seed }));
    return { prices, updatedAt };
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved) return generatePrices();
      const age = Date.now() - new Date(saved.updatedAt).getTime();
      if (age > UPDATE_INTERVAL_MS || saved.seed !== getHourSeed()) {
        return generatePrices();
      }
      return saved;
    } catch { return generatePrices(); }
  }

  function applyToComponents() {
    const { prices, updatedAt } = load();
    ['cpu','gpu','motherboard','ram','storage','psu','case','cooling'].forEach(type => {
      COMPONENTS[type].forEach(comp => {
        if (prices[type] && prices[type][comp.id] !== undefined) {
          comp._basePrice = comp._basePrice || comp.price;
          comp.price = prices[type][comp.id];
        }
      });
    });
    return new Date(updatedAt);
  }

  function getLastUpdated() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return saved ? new Date(saved.updatedAt) : new Date();
    } catch { return new Date(); }
  }

  function forceRefresh() {
    localStorage.removeItem(STORAGE_KEY);
    return applyToComponents();
  }

  return { applyToComponents, getLastUpdated, forceRefresh };
})();
