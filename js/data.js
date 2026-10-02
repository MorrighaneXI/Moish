// ============================================================
// MOISH - THE FISHING GAME | DATA.JS
// All game data: fish, maps, characters, mutations, etc.
// ============================================================

const GAME_DATA = {

    // ── RARITY TIERS ──────────────────────────────────────────
    RARITIES: {
        common:       { name: 'Common',       color: '#9e9e9e', glow: 'none',                          coinMin: 5,    coinMax: 15,   xpMin: 5,   xpMax: 10,   weight: 40   },
        uncommon:     { name: 'Uncommon',      color: '#4caf50', glow: '0 0 8px #4caf50',               coinMin: 20,   coinMax: 40,   xpMin: 15,  xpMax: 25,   weight: 25   },
        rare:         { name: 'Rare',          color: '#2196f3', glow: '0 0 10px #2196f3',              coinMin: 50,   coinMax: 100,  xpMin: 30,  xpMax: 50,   weight: 15   },
        epic:         { name: 'Epic',          color: '#9c27b0', glow: '0 0 12px #9c27b0',              coinMin: 150,  coinMax: 300,  xpMin: 60,  xpMax: 100,  weight: 10   },
        legendary:    { name: 'Legendary',     color: '#ff9800', glow: '0 0 15px #ff9800',              coinMin: 400,  coinMax: 800,  xpMin: 120, xpMax: 200,  weight: 5    },
        mythic:       { name: 'Mythic',        color: '#f44336', glow: '0 0 18px #f44336',              coinMin: 1000, coinMax: 2000, xpMin: 250, xpMax: 400,  weight: 3    },
        transcendent: { name: 'Transcendent',  color: '#00e5ff', glow: '0 0 20px #00e5ff, 0 0 40px #00e5ff44', coinMin: 3000, coinMax: 5000, xpMin: 500, xpMax: 800,  weight: 1.5  },
        omega:        { name: 'Omega',         color: '#ff00ff', glow: '0 0 25px #ff00ff, 0 0 50px #ffff0044', coinMin: 8000, coinMax: 15000,xpMin: 1000,xpMax: 2000, weight: 0.5  }
    },

    // ── MUTATIONS ──────────────────────────────────────────────
    // 10% base chance any fish mutates. Within that 10%, these are relative weights.
    MUTATIONS: {
        normal: [
            { id: 'poison',    name: 'Racun',    nameEn: 'Poison',    color: '#00ff41', chance: 10, coinBonus: 0.5,   icon: '☠️', description: 'Berpendar hijau beracun' },
            { id: 'frost',     name: 'Dingin',    nameEn: 'Frost',     color: '#00bcd4', chance: 9,  coinBonus: 0.6,   icon: '❄️', description: 'Membeku dengan es' },
            { id: 'fire',      name: 'Api',       nameEn: 'Fire',      color: '#ff5722', chance: 8,  coinBonus: 0.7,   icon: '🔥', description: 'Menyala dengan api' },
            { id: 'electric',  name: 'Listrik',   nameEn: 'Electric',  color: '#ffeb3b', chance: 7,  coinBonus: 0.8,   icon: '⚡', description: 'Memancarkan listrik' },
            { id: 'earth',     name: 'Tanah',     nameEn: 'Earth',     color: '#795548', chance: 7,  coinBonus: 0.85,  icon: '🪨', description: 'Berselimut tanah' },
            { id: 'wind',      name: 'Angin',     nameEn: 'Wind',      color: '#e0e0e0', chance: 6,  coinBonus: 0.9,   icon: '🌪️', description: 'Dikelilingi angin' },
            { id: 'water',     name: 'Air',       nameEn: 'Water',     color: '#1565c0', chance: 6,  coinBonus: 0.95,  icon: '💧', description: 'Gelembung air misterius' },
            { id: 'light',     name: 'Cahaya',    nameEn: 'Light',     color: '#fff9c4', chance: 5,  coinBonus: 1.0,   icon: '✨', description: 'Bersinar terang' },
            { id: 'shadow',    name: 'Bayangan',  nameEn: 'Shadow',    color: '#212121', chance: 5,  coinBonus: 1.1,   icon: '🌑', description: 'Diselimuti kegelapan' },
            { id: 'crystal',   name: 'Kristal',   nameEn: 'Crystal',   color: '#e1bee7', chance: 4,  coinBonus: 1.2,   icon: '💎', description: 'Transparan berkilau' },
            { id: 'plasma',    name: 'Plasma',    nameEn: 'Plasma',    color: '#e91e63', chance: 3,  coinBonus: 1.5,   icon: '🩷', description: 'Diselimuti plasma pink' }
        ],
        special: [
            { id: 'void',      name: 'Void',      nameEn: 'Void',      color: '#1a0033', chance: 1,    coinBonus: 5.0,    icon: '🕳️', description: 'Portal void misterius', specialGlow: '0 0 30px #6a0dad, 0 0 60px #1a003388' },
            { id: 'galaxy',    name: 'Galaxy',    nameEn: 'Galaxy',    color: '#1a237e', chance: 0.5,  coinBonus: 15.0,   icon: '🌌', description: 'Galaksi berputar di tubuhnya', specialGlow: '0 0 30px #304ffe, 0 0 60px #7c4dff88' },
            { id: 'prismana',  name: 'Prismana',  nameEn: 'Prismana',  color: '#ff00ff', chance: 0.1,  coinBonus: 50.0,   icon: '🌈', description: 'Pelangi prismatik ajaib', specialGlow: '0 0 40px #ff00ff, 0 0 80px #00ffff88' },
            { id: 'godly',     name: 'Godly',     nameEn: 'Godly',     color: '#ffd700', chance: 0.01, coinBonus: 500.0,   icon: '👑', description: 'Aura dewa emas suci', specialGlow: '0 0 50px #ffd700, 0 0 100px #ff990088' }
        ]
    },

    // ── MAPS ──────────────────────────────────────────────────
    MAPS: [
        { id: 'sunny_beach',    name: 'Pantai Sunrise',     nameEn: 'Sunrise Beach',     levelReq: 1,  theme: 'tropical',  bgColor: '#87ceeb', waterColor: '#006994', description: 'Pantai tropis yang tenang untuk pemula' },
        { id: 'mystic_lake',    name: 'Danau Mistik',       nameEn: 'Mystic Lake',       levelReq: 10, theme: 'lake',      bgColor: '#4a6670', waterColor: '#2d4a3e', description: 'Danau berkabut penuh misteri' },
        { id: 'coral_bay',      name: 'Teluk Karang',       nameEn: 'Coral Bay',         levelReq: 15, theme: 'coral',     bgColor: '#00acc1', waterColor: '#00838f', description: 'Terumbu karang yang indah' },
        { id: 'deep_ocean',     name: 'Lautan Dalam',       nameEn: 'Deep Ocean',        levelReq: 20, theme: 'deep',      bgColor: '#1a237e', waterColor: '#0d1b4a', description: 'Kedalaman samudera yang gelap' },
        { id: 'ice_pole',       name: 'Kutub Es',           nameEn: 'Ice Pole',          levelReq: 25, theme: 'arctic',    bgColor: '#b3e5fc', waterColor: '#4fc3f7', description: 'Perairan es yang membeku' },
        { id: 'storm_ocean',    name: 'Samudera Badai',     nameEn: 'Storm Ocean',       levelReq: 30, theme: 'storm',     bgColor: '#37474f', waterColor: '#263238', description: 'Lautan yang dihantam badai' },
        { id: 'void_depths',    name: 'Kedalaman Void',     nameEn: 'Void Depths',       levelReq: 35, theme: 'void',      bgColor: '#0a0014', waterColor: '#0d001a', description: 'Dimensi tak dikenal yang berbahaya' },
        { id: 'prisma_dimension', name: 'Dimensi Prisma',   nameEn: 'Prisma Dimension',  levelReq: 40, theme: 'prisma',    bgColor: '#1a0033', waterColor: '#0d001a', description: 'Dimensi rahasia penuh warna prisma' }
    ],

    // ── FISH (105 + 15 bonus = 120 total across 8 maps) ─────
    FISH: [
        // ═══ MAP 1: Pantai Sunrise (15 fish) ═══
        { id: 'f001', name: 'Teri Perak',         nameEn: 'Silver Anchovy',       map: 0, rarity: 'common',       img: 'A', hue: 0,   desc: 'Ikan kecil yang berkelompok' },
        { id: 'f002', name: 'Tongkol',             nameEn: 'Little Tuna',          map: 0, rarity: 'common',       img: 'B', hue: 0,   desc: 'Ikan cepat dan lincah' },
        { id: 'f003', name: 'Bandeng',              nameEn: 'Milkfish',             map: 0, rarity: 'common',       img: 'C', hue: 0,   desc: 'Ikan tambak yang jinak' },
        { id: 'f004', name: 'Kembung',              nameEn: 'Indian Mackerel',      map: 0, rarity: 'common',       img: 'A', hue: 30,  desc: 'Ikan pasar yang populer' },
        { id: 'f005', name: 'Sarden',               nameEn: 'Sardine',              map: 0, rarity: 'common',       img: 'B', hue: 180, desc: 'Si kecil berminyak' },
        { id: 'f006', name: 'Kakap Merah',          nameEn: 'Red Snapper',          map: 0, rarity: 'uncommon',     img: 'C', hue: 330, desc: 'Ikan predator karang' },
        { id: 'f007', name: 'Bawal Putih',          nameEn: 'White Pomfret',        map: 0, rarity: 'uncommon',     img: 'A', hue: 200, desc: 'Ikan pipih berharga' },
        { id: 'f008', name: 'Tenggiri',             nameEn: 'Spanish Mackerel',     map: 0, rarity: 'uncommon',     img: 'B', hue: 60,  desc: 'Perenang cepat yang kuat' },
        { id: 'f009', name: 'Baronang',              nameEn: 'Rabbitfish',           map: 0, rarity: 'uncommon',     img: 'C', hue: 120, desc: 'Hati-hati, berduri beracun!' },
        { id: 'f010', name: 'Kuwe',                  nameEn: 'Giant Trevally',       map: 0, rarity: 'rare',        img: 'A', hue: 90,  desc: 'Predator pantai yang tangguh' },
        { id: 'f011', name: 'Ikan Terbang',         nameEn: 'Flying Fish',          map: 0, rarity: 'rare',        img: 'B', hue: 240, desc: 'Meluncur di atas ombak' },
        { id: 'f012', name: 'Napoleon Wrasse',       nameEn: 'Napoleon Wrasse',      map: 0, rarity: 'epic',        img: 'C', hue: 160, desc: 'Ikan karang raksasa' },
        { id: 'f013', name: 'Tuna Sirip Kuning',    nameEn: 'Yellowfin Tuna',       map: 0, rarity: 'epic',        img: 'A', hue: 50,  desc: 'Tuna berharga tinggi' },
        { id: 'f014', name: 'Ikan Pedang',           nameEn: 'Swordfish',            map: 0, rarity: 'legendary',   img: 'B', hue: 300, desc: 'Pemburu lautan dengan pedang' },
        { id: 'f015', name: 'Golden Marlin',         nameEn: 'Golden Marlin',        map: 0, rarity: 'mythic',      img: 'C', hue: 45,  desc: 'Marlin emas legendaris' },

        // ═══ MAP 2: Danau Mistik (15 fish) ═══
        { id: 'f016', name: 'Ikan Mas',             nameEn: 'Goldfish',             map: 1, rarity: 'common',       img: 'A', hue: 40,  desc: 'Ikan hias yang cantik' },
        { id: 'f017', name: 'Lele',                  nameEn: 'Catfish',              map: 1, rarity: 'common',       img: 'B', hue: 30,  desc: 'Ikan berkumis yang rakus' },
        { id: 'f018', name: 'Nila',                  nameEn: 'Tilapia',              map: 1, rarity: 'common',       img: 'C', hue: 160, desc: 'Ikan air tawar populer' },
        { id: 'f019', name: 'Gurame',                nameEn: 'Giant Gourami',        map: 1, rarity: 'common',       img: 'A', hue: 100, desc: 'Ikan besar air tawar' },
        { id: 'f020', name: 'Patin',                 nameEn: 'Pangasius',            map: 1, rarity: 'uncommon',     img: 'B', hue: 200, desc: 'Ikan sungai yang besar' },
        { id: 'f021', name: 'Gabus',                 nameEn: 'Snakehead',            map: 1, rarity: 'uncommon',     img: 'C', hue: 80,  desc: 'Predator air tawar ganas' },
        { id: 'f022', name: 'Belut Mistik',         nameEn: 'Mystic Eel',           map: 1, rarity: 'uncommon',     img: 'A', hue: 270, desc: 'Belut yang bercahaya di malam hari' },
        { id: 'f023', name: 'Arwana Perak',         nameEn: 'Silver Arowana',       map: 1, rarity: 'rare',        img: 'B', hue: 180, desc: 'Naga air yang anggun' },
        { id: 'f024', name: 'Piranha Hijau',        nameEn: 'Green Piranha',        map: 1, rarity: 'rare',        img: 'C', hue: 110, desc: 'Pemangsa berkelompok yang ganas' },
        { id: 'f025', name: 'Ikan Pelangi',         nameEn: 'Rainbow Fish',         map: 1, rarity: 'rare',        img: 'A', hue: 300, desc: 'Berkilau seperti pelangi' },
        { id: 'f026', name: 'Arapaima',              nameEn: 'Arapaima',             map: 1, rarity: 'epic',        img: 'B', hue: 140, desc: 'Raksasa air tawar Amazon' },
        { id: 'f027', name: 'Arwana Emas',          nameEn: 'Golden Arowana',       map: 1, rarity: 'epic',        img: 'C', hue: 45,  desc: 'Ikan naga emas yang mahal' },
        { id: 'f028', name: 'Koi Kaisar',           nameEn: 'Emperor Koi',          map: 1, rarity: 'legendary',   img: 'A', hue: 10,  desc: 'Koi legendaris dari istana' },
        { id: 'f029', name: 'Naga Danau',           nameEn: 'Lake Dragon',          map: 1, rarity: 'mythic',      img: 'B', hue: 260, desc: 'Makhluk mitos penghuni danau' },
        { id: 'f030', name: 'Spirit Danau',         nameEn: 'Lake Spirit',          map: 1, rarity: 'transcendent',img: 'C', hue: 190, desc: 'Roh penjaga danau mistik' },

        // ═══ MAP 3: Teluk Karang (15 fish) ═══
        { id: 'f031', name: 'Ikan Badut',           nameEn: 'Clownfish',            map: 2, rarity: 'common',       img: 'A', hue: 15,  desc: 'Nemo si ikan badut' },
        { id: 'f032', name: 'Ikan Kupu-Kupu',       nameEn: 'Butterflyfish',        map: 2, rarity: 'common',       img: 'B', hue: 50,  desc: 'Cantik bagai kupu-kupu' },
        { id: 'f033', name: 'Ikan Surgeonfish',     nameEn: 'Surgeonfish',          map: 2, rarity: 'common',       img: 'C', hue: 220, desc: 'Dory si ikan biru' },
        { id: 'f034', name: 'Ikan Angel',           nameEn: 'Angelfish',            map: 2, rarity: 'common',       img: 'A', hue: 280, desc: 'Malaikat terumbu karang' },
        { id: 'f035', name: 'Kuda Laut',            nameEn: 'Seahorse',             map: 2, rarity: 'uncommon',     img: 'B', hue: 130, desc: 'Penunggang arus yang unik' },
        { id: 'f036', name: 'Ikan Pari Karang',     nameEn: 'Reef Stingray',        map: 2, rarity: 'uncommon',     img: 'C', hue: 30,  desc: 'Pari yang menari di karang' },
        { id: 'f037', name: 'Ikan Scorpion',        nameEn: 'Scorpionfish',         map: 2, rarity: 'uncommon',     img: 'A', hue: 350, desc: 'Master penyamaran beracun' },
        { id: 'f038', name: 'Gurita Biru',          nameEn: 'Blue Octopus',         map: 2, rarity: 'rare',        img: 'B', hue: 240, desc: 'Gurita bercincin biru mematikan' },
        { id: 'f039', name: 'Lobster Karang',       nameEn: 'Coral Lobster',        map: 2, rarity: 'rare',        img: 'C', hue: 10,  desc: 'Lobster merah terumbu karang' },
        { id: 'f040', name: 'Ikan Singa',           nameEn: 'Lionfish',             map: 2, rarity: 'rare',        img: 'A', hue: 340, desc: 'Raja karang bersirip api' },
        { id: 'f041', name: 'Penyu Hijau',          nameEn: 'Green Turtle',         map: 2, rarity: 'epic',        img: 'B', hue: 150, desc: 'Penjelajah laut yang bijaksana' },
        { id: 'f042', name: 'Hiu Karang',           nameEn: 'Reef Shark',           map: 2, rarity: 'epic',        img: 'C', hue: 210, desc: 'Predator karang yang elegan' },
        { id: 'f043', name: 'Gurita Raksasa',       nameEn: 'Giant Octopus',        map: 2, rarity: 'legendary',   img: 'A', hue: 290, desc: 'Penguasa karang yang cerdas' },
        { id: 'f044', name: 'Manta Ray',             nameEn: 'Manta Ray',            map: 2, rarity: 'mythic',      img: 'B', hue: 200, desc: 'Sayap laut yang megah' },
        { id: 'f045', name: 'Naga Karang',          nameEn: 'Coral Dragon',         map: 2, rarity: 'transcendent',img: 'C', hue: 320, desc: 'Naga mistis terumbu karang' },

        // ═══ MAP 4: Lautan Dalam (15 fish) ═══
        { id: 'f046', name: 'Anglerfish',            nameEn: 'Anglerfish',           map: 3, rarity: 'common',       img: 'A', hue: 250, desc: 'Pemancing kedalaman' },
        { id: 'f047', name: 'Ikan Hatchet',         nameEn: 'Hatchetfish',          map: 3, rarity: 'common',       img: 'B', hue: 190, desc: 'Ikan kapak transparan' },
        { id: 'f048', name: 'Ikan Viper',           nameEn: 'Viperfish',            map: 3, rarity: 'common',       img: 'C', hue: 270, desc: 'Gigi tajam di kegelapan' },
        { id: 'f049', name: 'Cumi Kaca',            nameEn: 'Glass Squid',          map: 3, rarity: 'uncommon',     img: 'A', hue: 180, desc: 'Transparan bagai kaca' },
        { id: 'f050', name: 'Ubur-ubur Abyssal',    nameEn: 'Abyssal Jellyfish',    map: 3, rarity: 'uncommon',     img: 'B', hue: 300, desc: 'Ubur-ubur bioluminesensi' },
        { id: 'f051', name: 'Isopod Raksasa',       nameEn: 'Giant Isopod',         map: 3, rarity: 'uncommon',     img: 'C', hue: 30,  desc: 'Kutu raksasa laut dalam' },
        { id: 'f052', name: 'Hiu Goblin',           nameEn: 'Goblin Shark',         map: 3, rarity: 'rare',        img: 'A', hue: 340, desc: 'Hiu berparuh menyeramkan' },
        { id: 'f053', name: 'Oarfish',               nameEn: 'Oarfish',              map: 3, rarity: 'rare',        img: 'B', hue: 10,  desc: 'Si ular laut panjang' },
        { id: 'f054', name: 'Nautilus',               nameEn: 'Nautilus',             map: 3, rarity: 'rare',        img: 'C', hue: 40,  desc: 'Fosil hidup purba' },
        { id: 'f055', name: 'Cumi Raksasa',         nameEn: 'Giant Squid',          map: 3, rarity: 'epic',        img: 'A', hue: 310, desc: 'Kraken kedalaman' },
        { id: 'f056', name: 'Coelacanth',            nameEn: 'Coelacanth',           map: 3, rarity: 'epic',        img: 'B', hue: 160, desc: 'Ikan purba yang masih hidup' },
        { id: 'f057', name: 'Hiu Megamouth',        nameEn: 'Megamouth Shark',      map: 3, rarity: 'legendary',   img: 'C', hue: 210, desc: 'Hiu bermulut besar misterius' },
        { id: 'f058', name: 'Cumi Colossal',        nameEn: 'Colossal Squid',       map: 3, rarity: 'mythic',      img: 'A', hue: 280, desc: 'Penguasa kedalaman sejati' },
        { id: 'f059', name: 'Leviathan Muda',       nameEn: 'Young Leviathan',      map: 3, rarity: 'transcendent',img: 'B', hue: 330, desc: 'Anak monster legenda laut' },
        { id: 'f060', name: 'Abyssal Phantom',       nameEn: 'Abyssal Phantom',      map: 3, rarity: 'omega',       img: 'C', hue: 260, desc: 'Hantu kedalaman tak terlihat' },

        // ═══ MAP 5: Kutub Es (15 fish) ═══
        { id: 'f061', name: 'Ikan Kutub',           nameEn: 'Polar Cod',            map: 4, rarity: 'common',       img: 'A', hue: 195, desc: 'Ikan tahan beku' },
        { id: 'f062', name: 'Ikan Es',              nameEn: 'Icefish',              map: 4, rarity: 'common',       img: 'B', hue: 185, desc: 'Darah transparan anti beku' },
        { id: 'f063', name: 'Arctic Char',           nameEn: 'Arctic Char',          map: 4, rarity: 'common',       img: 'C', hue: 15,  desc: 'Salmon kutub yang tangguh' },
        { id: 'f064', name: 'Beluga Kecil',         nameEn: 'Small Beluga',         map: 4, rarity: 'uncommon',     img: 'A', hue: 180, desc: 'Paus putih muda' },
        { id: 'f065', name: 'Anjing Laut',          nameEn: 'Seal',                 map: 4, rarity: 'uncommon',     img: 'B', hue: 30,  desc: 'Perenang lincah kutub' },
        { id: 'f066', name: 'Penguin Penyelam',     nameEn: 'Diving Penguin',       map: 4, rarity: 'uncommon',     img: 'C', hue: 0,   desc: 'Penguin yang menyelam dalam' },
        { id: 'f067', name: 'Hiu Greenland',        nameEn: 'Greenland Shark',      map: 4, rarity: 'rare',        img: 'A', hue: 150, desc: 'Hiu berusia ratusan tahun' },
        { id: 'f068', name: 'Kepiting Salju',       nameEn: 'Snow Crab',            map: 4, rarity: 'rare',        img: 'B', hue: 10,  desc: 'Kepiting es berharga' },
        { id: 'f069', name: 'Walrus',                nameEn: 'Walrus',               map: 4, rarity: 'rare',        img: 'C', hue: 25,  desc: 'Si gading penjaga es' },
        { id: 'f070', name: 'Orca',                   nameEn: 'Orca',                 map: 4, rarity: 'epic',        img: 'A', hue: 0,   desc: 'Paus pembunuh yang cerdas' },
        { id: 'f071', name: 'Narwhal',                nameEn: 'Narwhal',              map: 4, rarity: 'epic',        img: 'B', hue: 200, desc: 'Unicorn laut bersayap es' },
        { id: 'f072', name: 'Paus Beluga',           nameEn: 'Beluga Whale',         map: 4, rarity: 'legendary',   img: 'C', hue: 180, desc: 'Kanari laut yang ramah' },
        { id: 'f073', name: 'Frost Serpent',          nameEn: 'Frost Serpent',         map: 4, rarity: 'mythic',      img: 'A', hue: 200, desc: 'Ular es raksasa mitologi' },
        { id: 'f074', name: 'Glacier Beast',          nameEn: 'Glacier Beast',         map: 4, rarity: 'transcendent',img: 'B', hue: 190, desc: 'Monster es kuno yang terbangun' },
        { id: 'f075', name: 'Aurora Whale',           nameEn: 'Aurora Whale',          map: 4, rarity: 'omega',       img: 'C', hue: 270, desc: 'Paus yang memancarkan aurora' },

        // ═══ MAP 6: Samudera Badai (15 fish) ═══
        { id: 'f076', name: 'Ikan Petir',           nameEn: 'Thunder Fish',         map: 5, rarity: 'common',       img: 'A', hue: 55,  desc: 'Ikan yang menyala saat petir' },
        { id: 'f077', name: 'Ikan Badai',           nameEn: 'Storm Fish',           map: 5, rarity: 'common',       img: 'B', hue: 210, desc: 'Lahir dari badai' },
        { id: 'f078', name: 'Hiu Banteng',          nameEn: 'Bull Shark',           map: 5, rarity: 'common',       img: 'C', hue: 30,  desc: 'Agresif dan tidak takut' },
        { id: 'f079', name: 'Barracuda',              nameEn: 'Barracuda',            map: 5, rarity: 'uncommon',     img: 'A', hue: 170, desc: 'Torpedo hidup bermata tajam' },
        { id: 'f080', name: 'Sailfish',               nameEn: 'Sailfish',             map: 5, rarity: 'uncommon',     img: 'B', hue: 240, desc: 'Ikan tercepat di samudera' },
        { id: 'f081', name: 'Wahoo',                  nameEn: 'Wahoo',                map: 5, rarity: 'uncommon',     img: 'C', hue: 160, desc: 'Sprinter laut bermata tajam' },
        { id: 'f082', name: 'Hiu Martil',           nameEn: 'Hammerhead',           map: 5, rarity: 'rare',        img: 'A', hue: 200, desc: 'Kepala palu sensor elektrik' },
        { id: 'f083', name: 'Marlin Biru',           nameEn: 'Blue Marlin',          map: 5, rarity: 'rare',        img: 'B', hue: 230, desc: 'Raja turnamen memancing' },
        { id: 'f084', name: 'Tuna Raksasa',         nameEn: 'Giant Tuna',           map: 5, rarity: 'rare',        img: 'C', hue: 195, desc: 'Tuna bluefin bernilai tinggi' },
        { id: 'f085', name: 'Hiu Putih',            nameEn: 'Great White Shark',    map: 5, rarity: 'epic',        img: 'A', hue: 210, desc: 'Predator puncak samudera' },
        { id: 'f086', name: 'Paus Biru',            nameEn: 'Blue Whale',           map: 5, rarity: 'epic',        img: 'B', hue: 215, desc: 'Makhluk terbesar di bumi' },
        { id: 'f087', name: 'Paus Sperma',          nameEn: 'Sperm Whale',          map: 5, rarity: 'legendary',   img: 'C', hue: 30,  desc: 'Penyelam terdalam pemburu cumi' },
        { id: 'f088', name: 'Kraken',                 nameEn: 'Kraken',               map: 5, rarity: 'mythic',      img: 'A', hue: 280, desc: 'Monster legenda penghancur kapal' },
        { id: 'f089', name: 'Tempest Dragon',        nameEn: 'Tempest Dragon',       map: 5, rarity: 'transcendent',img: 'B', hue: 250, desc: 'Naga badai penguasa ombak' },
        { id: 'f090', name: 'Storm Titan',            nameEn: 'Storm Titan',          map: 5, rarity: 'omega',       img: 'C', hue: 60,  desc: 'Titan yang mengendalikan badai' },

        // ═══ MAP 7: Kedalaman Void (15 fish) ═══
        { id: 'f091', name: 'Shadow Fish',            nameEn: 'Shadow Fish',          map: 6, rarity: 'common',       img: 'A', hue: 270, desc: 'Ikan bayangan tanpa wujud' },
        { id: 'f092', name: 'Void Minnow',           nameEn: 'Void Minnow',          map: 6, rarity: 'common',       img: 'B', hue: 280, desc: 'Ikan kecil dimensi void' },
        { id: 'f093', name: 'Dark Jellyfish',        nameEn: 'Dark Jellyfish',       map: 6, rarity: 'uncommon',     img: 'C', hue: 290, desc: 'Ubur-ubur kegelapan' },
        { id: 'f094', name: 'Phantom Ray',            nameEn: 'Phantom Ray',          map: 6, rarity: 'uncommon',     img: 'A', hue: 300, desc: 'Pari hantu transparan' },
        { id: 'f095', name: 'Void Crab',              nameEn: 'Void Crab',            map: 6, rarity: 'uncommon',     img: 'B', hue: 310, desc: 'Kepiting dari dimensi lain' },
        { id: 'f096', name: 'Nightmare Eel',          nameEn: 'Nightmare Eel',        map: 6, rarity: 'rare',        img: 'C', hue: 320, desc: 'Belut dari mimpi buruk' },
        { id: 'f097', name: 'Chaos Octopus',          nameEn: 'Chaos Octopus',        map: 6, rarity: 'rare',        img: 'A', hue: 330, desc: 'Gurita kacau tanpa aturan' },
        { id: 'f098', name: 'Dimensional Shark',      nameEn: 'Dimensional Shark',    map: 6, rarity: 'rare',        img: 'B', hue: 340, desc: 'Hiu lintas dimensi' },
        { id: 'f099', name: 'Void Serpent',           nameEn: 'Void Serpent',          map: 6, rarity: 'epic',        img: 'C', hue: 275, desc: 'Ular void yang membelah ruang' },
        { id: 'f100', name: 'Eldritch Horror',        nameEn: 'Eldritch Horror',      map: 6, rarity: 'epic',        img: 'A', hue: 285, desc: 'Makhluk tak terdefinisi' },
        { id: 'f101', name: 'Abyssal Leviathan',      nameEn: 'Abyssal Leviathan',    map: 6, rarity: 'legendary',   img: 'B', hue: 295, desc: 'Leviathan penguasa void' },
        { id: 'f102', name: 'Cosmic Whale',           nameEn: 'Cosmic Whale',         map: 6, rarity: 'legendary',   img: 'C', hue: 260, desc: 'Paus dari luar angkasa' },
        { id: 'f103', name: 'World Eater',             nameEn: 'World Eater',          map: 6, rarity: 'mythic',      img: 'A', hue: 0,   desc: 'Pemakan dunia yang tertidur' },
        { id: 'f104', name: 'Void Emperor',           nameEn: 'Void Emperor',         map: 6, rarity: 'transcendent',img: 'B', hue: 270, desc: 'Kaisar kekosongan absolut' },
        { id: 'f105', name: 'The Unknown',             nameEn: 'The Unknown',          map: 6, rarity: 'omega',       img: 'C', hue: 0,   desc: 'Tidak ada yang tahu apa ini...' },

        // ═══ MAP 8 (BONUS): Dimensi Prisma (15 fish) ═══
        { id: 'f106', name: 'Prisma Minnow',         nameEn: 'Prisma Minnow',       map: 7, rarity: 'uncommon',     img: 'A', hue: 0,   desc: 'Ikan kecil berwarna pelangi' },
        { id: 'f107', name: 'Crystal Shrimp',        nameEn: 'Crystal Shrimp',      map: 7, rarity: 'uncommon',     img: 'B', hue: 60,  desc: 'Udang kristal bening' },
        { id: 'f108', name: 'Neon Jellyfish',         nameEn: 'Neon Jellyfish',       map: 7, rarity: 'rare',        img: 'C', hue: 120, desc: 'Ubur-ubur neon berpendar' },
        { id: 'f109', name: 'Spectrum Eel',           nameEn: 'Spectrum Eel',         map: 7, rarity: 'rare',        img: 'A', hue: 180, desc: 'Belut spektrum cahaya' },
        { id: 'f110', name: 'Holographic Puffer',     nameEn: 'Holographic Puffer',   map: 7, rarity: 'rare',        img: 'B', hue: 240, desc: 'Buntal hologram 3D' },
        { id: 'f111', name: 'Dimensional Koi',        nameEn: 'Dimensional Koi',      map: 7, rarity: 'epic',        img: 'C', hue: 300, desc: 'Koi dari dimensi lain' },
        { id: 'f112', name: 'Quantum Fish',            nameEn: 'Quantum Fish',         map: 7, rarity: 'epic',        img: 'A', hue: 30,  desc: 'Ada dan tiada secara bersamaan' },
        { id: 'f113', name: 'Infinity Shark',          nameEn: 'Infinity Shark',       map: 7, rarity: 'epic',        img: 'B', hue: 90,  desc: 'Hiu tanpa awal dan akhir' },
        { id: 'f114', name: 'Nebula Octopus',          nameEn: 'Nebula Octopus',       map: 7, rarity: 'legendary',   img: 'C', hue: 150, desc: 'Gurita berwujud nebula' },
        { id: 'f115', name: 'Supernova Ray',           nameEn: 'Supernova Ray',        map: 7, rarity: 'legendary',   img: 'A', hue: 210, desc: 'Pari yang meledak bagai bintang' },
        { id: 'f116', name: 'Time Whale',              nameEn: 'Time Whale',           map: 7, rarity: 'mythic',      img: 'B', hue: 270, desc: 'Paus yang mengendalikan waktu' },
        { id: 'f117', name: 'Multiverse Serpent',      nameEn: 'Multiverse Serpent',   map: 7, rarity: 'mythic',      img: 'C', hue: 330, desc: 'Ular dari banyak semesta' },
        { id: 'f118', name: 'Omega Dragon',            nameEn: 'Omega Dragon',         map: 7, rarity: 'transcendent',img: 'A', hue: 45,  desc: 'Naga akhir dari segala dimensi' },
        { id: 'f119', name: 'The Creator',             nameEn: 'The Creator',          map: 7, rarity: 'omega',       img: 'B', hue: 0,   desc: 'Pencipta semua makhluk laut' },
        { id: 'f120', name: 'Moish',                    nameEn: 'Moish',                map: 7, rarity: 'omega',       img: 'C', hue: 0,   desc: 'Ikan legendaris yang melampaui segalanya' }
    ],

    // ── CHARACTERS ────────────────────────────────────────────
    CHARACTERS: [
        {
            id: 'fisher',   name: 'Nelayan',     nameEn: 'Fisher',
            img: null,  price: 0,
            skill: { name: 'Tanpa Skill', nameEn: 'No Skill', desc: 'Karakter dasar tanpa kemampuan khusus', type: 'none', value: 0 },
            upgrades: []
        },
        {
            id: 'chloe',    name: 'Chloe',       nameEn: 'Chloe',
            img: 'Chloe.png', price: 10000,
            skill: { name: 'Tetap Semangat', nameEn: 'Stay Strong', desc: 'Meningkatkan kapasitas stamina', type: 'stamina_bonus', value: 0.15 },
            upgrades: [
                { cost: 5000,  bonus: 0.05, desc: '+5% Stamina' },
                { cost: 10000, bonus: 0.05, desc: '+5% Stamina' },
                { cost: 20000, bonus: 0.05, desc: '+5% Stamina' },
                { cost: 40000, bonus: 0.10, desc: '+10% Stamina' }
            ]
        },
        {
            id: 'fiona',    name: 'Fiona',       nameEn: 'Fiona',
            img: 'Fiona.png', price: 15000,
            skill: { name: 'Bermutasilah!', nameEn: 'Mutate!', desc: 'Meningkatkan peluang mutasi ikan', type: 'mutation_bonus', value: 0.05 },
            upgrades: [
                { cost: 8000,  bonus: 0.02, desc: '+2% Mutasi' },
                { cost: 15000, bonus: 0.02, desc: '+2% Mutasi' },
                { cost: 25000, bonus: 0.03, desc: '+3% Mutasi' },
                { cost: 50000, bonus: 0.05, desc: '+5% Mutasi' }
            ]
        },
        {
            id: 'iris',     name: 'Iris',        nameEn: 'Iris',
            img: 'Iris.png', price: 12000,
            skill: { name: 'Super Levelling', nameEn: 'Super Levelling', desc: 'Meningkatkan EXP yang diperoleh', type: 'exp_bonus', value: 0.40 },
            upgrades: [
                { cost: 6000,  bonus: 0.10, desc: '+10% EXP' },
                { cost: 12000, bonus: 0.10, desc: '+10% EXP' },
                { cost: 24000, bonus: 0.15, desc: '+15% EXP' },
                { cost: 45000, bonus: 0.25, desc: '+25% EXP' }
            ]
        },
        {
            id: 'jacob',    name: 'Jacob',       nameEn: 'Jacob',
            img: 'Jacob.png', price: 18000,
            skill: { name: 'Strike!!', nameEn: 'Strike!!', desc: 'Meningkatkan peluang ikan langka', type: 'rare_bonus', value: 0.10 },
            upgrades: [
                { cost: 10000, bonus: 0.05, desc: '+5% Rare Chance' },
                { cost: 18000, bonus: 0.05, desc: '+5% Rare Chance' },
                { cost: 30000, bonus: 0.08, desc: '+8% Rare Chance' },
                { cost: 55000, bonus: 0.12, desc: '+12% Rare Chance' }
            ]
        },
        {
            id: 'jaune',    name: 'Jaune',       nameEn: 'Jaune',
            img: 'Jaune.png', price: 20000,
            skill: { name: 'Bomb!', nameEn: 'Bomb!', desc: 'Setiap 10x combo, lempar bom untuk 4 ikan', type: 'bomb', value: 10 },
            upgrades: [
                { cost: 12000, bonus: -1,   desc: '-1 Combo (9x)' },
                { cost: 22000, bonus: -1,   desc: '-1 Combo (8x)' },
                { cost: 35000, bonus: 2,    desc: '+2 Ikan Bonus (6)' },
                { cost: 60000, bonus: 3,    desc: '+3 Ikan Bonus (9)' }
            ]
        },
        {
            id: 'nono',     name: 'Nono',        nameEn: 'Nono',
            img: 'Nono.png', price: 8000,
            skill: { name: 'More Fish', nameEn: 'More Fish', desc: 'Extra kapasitas tas', type: 'bag_bonus', value: 5 },
            upgrades: [
                { cost: 4000,  bonus: 2, desc: '+2 Kapasitas' },
                { cost: 8000,  bonus: 2, desc: '+2 Kapasitas' },
                { cost: 15000, bonus: 3, desc: '+3 Kapasitas' },
                { cost: 30000, bonus: 5, desc: '+5 Kapasitas' }
            ]
        },
        {
            id: 'oliver',   name: 'Oliver',      nameEn: 'Oliver',
            img: 'Oliver.png', price: 14000,
            skill: { name: 'Lock-In', nameEn: 'Lock-In', desc: 'Setiap 5x ikan beruntun, pulihkan 5% Stamina', type: 'heal_streak', value: 5 },
            upgrades: [
                { cost: 7000,  bonus: -1,   desc: '-1 Streak (4x)' },
                { cost: 14000, bonus: 0.02, desc: '+2% Heal (7%)' },
                { cost: 25000, bonus: -1,   desc: '-1 Streak (3x)' },
                { cost: 45000, bonus: 0.03, desc: '+3% Heal (10%)' }
            ]
        },
        {
            id: 'sarah',    name: 'Sarah',       nameEn: 'Sarah',
            img: 'Sarah.png', price: 25000,
            skill: { name: 'Weather Control', nameEn: 'Weather Control', desc: 'Setiap 3 hari, pilih cuaca', type: 'weather_control', value: 3 },
            upgrades: [
                { cost: 15000, bonus: -1,   desc: 'Setiap 2 hari' },
                { cost: 25000, bonus: 0,    desc: '+Bonus cuaca' },
                { cost: 40000, bonus: -1,   desc: 'Setiap 1 hari' },
                { cost: 70000, bonus: 0,    desc: '+Mega Bonus cuaca' }
            ]
        },
        {
            id: 'william',  name: 'William',     nameEn: 'William',
            img: 'Wiliam.png', price: 16000,
            skill: { name: 'Be Rich', nameEn: 'Be Rich', desc: 'Meningkatkan koin yang diperoleh', type: 'coin_bonus', value: 0.40 },
            upgrades: [
                { cost: 8000,  bonus: 0.10, desc: '+10% Koin' },
                { cost: 16000, bonus: 0.10, desc: '+10% Koin' },
                { cost: 28000, bonus: 0.15, desc: '+15% Koin' },
                { cost: 50000, bonus: 0.25, desc: '+25% Koin' }
            ]
        }
    ],

    // ── UPGRADES (Alat & Stats) ───────────────────────────────
    UPGRADES: {
        rod: {
            name: 'Pancing', nameEn: 'Fishing Rod',
            icon: '🎣',
            desc: 'Meningkatkan kecepatan memancing',
            levels: [
                { cost: 0,     value: 1.0,  name: 'Pancing Kayu' },
                { cost: 500,   value: 1.15, name: 'Pancing Bambu' },
                { cost: 2000,  value: 1.3,  name: 'Pancing Besi' },
                { cost: 5000,  value: 1.5,  name: 'Pancing Karbon' },
                { cost: 12000, value: 1.75, name: 'Pancing Titanium' },
                { cost: 30000, value: 2.0,  name: 'Pancing Mithril' },
                { cost: 60000, value: 2.5,  name: 'Pancing Kosmik' },
                { cost: 120000,value: 3.0,  name: 'Pancing Dewa' }
            ]
        },
        stamina: {
            name: 'Stamina', nameEn: 'Stamina',
            icon: '💪',
            desc: 'Meningkatkan stamina maksimum',
            levels: [
                { cost: 0,     value: 100, name: 'Normal' },
                { cost: 800,   value: 120, name: 'Kuat' },
                { cost: 3000,  value: 145, name: 'Sangat Kuat' },
                { cost: 8000,  value: 175, name: 'Baja' },
                { cost: 18000, value: 210, name: 'Titanium' },
                { cost: 40000, value: 250, name: 'Legenda' }
            ]
        },
        luck: {
            name: 'Keberuntungan', nameEn: 'Luck',
            icon: '🍀',
            desc: 'Meningkatkan peluang ikan langka',
            levels: [
                { cost: 0,     value: 1.0,  name: 'Biasa' },
                { cost: 1000,  value: 1.1,  name: 'Beruntung' },
                { cost: 4000,  value: 1.25, name: 'Sangat Beruntung' },
                { cost: 10000, value: 1.4,  name: 'Super Lucky' },
                { cost: 25000, value: 1.6,  name: 'Ultra Lucky' },
                { cost: 55000, value: 1.85, name: 'Mega Lucky' },
                { cost: 100000,value: 2.2,  name: 'Godly Lucky' }
            ]
        },
        mutation_rate: {
            name: 'Peluang Mutasi', nameEn: 'Mutation Rate',
            icon: '🧬',
            desc: 'Meningkatkan peluang mutasi',
            levels: [
                { cost: 0,     value: 1.0,  name: 'Normal' },
                { cost: 1500,  value: 1.15, name: 'Sedikit Bermutasi' },
                { cost: 5000,  value: 1.35, name: 'Bermutasi' },
                { cost: 15000, value: 1.6,  name: 'Sangat Bermutasi' },
                { cost: 35000, value: 1.9,  name: 'Ultra Mutasi' },
                { cost: 80000, value: 2.5,  name: 'Mega Mutasi' }
            ]
        },
        coin_multiplier: {
            name: 'Pengganda Koin', nameEn: 'Coin Multiplier',
            icon: '💰',
            desc: 'Meningkatkan koin dari penjualan',
            levels: [
                { cost: 0,     value: 1.0,  name: 'Normal' },
                { cost: 1200,  value: 1.2,  name: 'Pedagang' },
                { cost: 4500,  value: 1.45, name: 'Saudagar' },
                { cost: 12000, value: 1.75, name: 'Juragan' },
                { cost: 28000, value: 2.1,  name: 'Sultan' },
                { cost: 65000, value: 2.5,  name: 'Raja Ikan' }
            ]
        },
        bag: {
            name: 'Kapasitas Tas', nameEn: 'Bag Capacity',
            icon: '🎒',
            desc: 'Jumlah ikan yang bisa dibawa',
            levels: [
                { cost: 0,     value: 10, name: 'Tas Kecil' },
                { cost: 600,   value: 15, name: 'Tas Sedang' },
                { cost: 2500,  value: 20, name: 'Tas Besar' },
                { cost: 7000,  value: 28, name: 'Ransel' },
                { cost: 15000, value: 38, name: 'Ransel Besar' },
                { cost: 35000, value: 50, name: 'Koper Ikan' }
            ]
        }
    },

    // ── WEATHER ────────────────────────────────────────────────
    WEATHER: [
        { id: 'sunny',    name: 'Cerah',    nameEn: 'Sunny',    icon: '☀️', rareBonus: 0,    mutationBonus: 0,    staminaDrain: 0,    weight: 35, particles: 'none' },
        { id: 'cloudy',   name: 'Mendung',  nameEn: 'Cloudy',   icon: '☁️', rareBonus: 0.10, mutationBonus: 0,    staminaDrain: 0,    weight: 25, particles: 'none' },
        { id: 'rain',     name: 'Hujan',    nameEn: 'Rain',     icon: '🌧️', rareBonus: 0.05, mutationBonus: 0.20, staminaDrain: 0,    weight: 20, particles: 'rain' },
        { id: 'storm',    name: 'Badai',    nameEn: 'Storm',    icon: '⛈️', rareBonus: 0.30, mutationBonus: 0.30, staminaDrain: -0.2, weight: 10, particles: 'storm' },
        { id: 'fog',      name: 'Berkabut', nameEn: 'Foggy',    icon: '🌫️', rareBonus: 0.15, mutationBonus: 0.10, staminaDrain: 0,    weight: 7,  particles: 'fog' },
        { id: 'snow',     name: 'Salju',    nameEn: 'Snow',     icon: '🌨️', rareBonus: 0.25, mutationBonus: 0.05, staminaDrain: -0.15,weight: 3,  particles: 'snow' }
    ],

    // ── ACHIEVEMENTS ──────────────────────────────────────────
    ACHIEVEMENTS: [
        { id: 'a01', name: 'Nelayan Pemula',       nameEn: 'Novice Fisher',       desc: 'Tangkap 10 ikan',                    condition: { type: 'total_catch', value: 10 },      reward: 100,    icon: '🎣' },
        { id: 'a02', name: 'Mulai Berpengalaman',  nameEn: 'Getting Experience',  desc: 'Tangkap 50 ikan',                    condition: { type: 'total_catch', value: 50 },      reward: 300,    icon: '🐟' },
        { id: 'a03', name: 'Nelayan Sejati',       nameEn: 'True Fisher',         desc: 'Tangkap 200 ikan',                   condition: { type: 'total_catch', value: 200 },     reward: 1000,   icon: '🏅' },
        { id: 'a04', name: 'Master Nelayan',       nameEn: 'Master Fisher',       desc: 'Tangkap 1000 ikan',                  condition: { type: 'total_catch', value: 1000 },    reward: 5000,   icon: '🏆' },
        { id: 'a05', name: 'Kolektor Pemula',      nameEn: 'Novice Collector',    desc: 'Kumpulkan 10 jenis ikan',            condition: { type: 'unique_fish', value: 10 },      reward: 200,    icon: '📖' },
        { id: 'a06', name: 'Kolektor Karang',      nameEn: 'Coral Collector',     desc: 'Kumpulkan 25 jenis ikan',            condition: { type: 'unique_fish', value: 25 },      reward: 500,    icon: '📚' },
        { id: 'a07', name: 'Ensiklopedia Ikan',    nameEn: 'Fish Encyclopedia',   desc: 'Kumpulkan 50 jenis ikan',            condition: { type: 'unique_fish', value: 50 },      reward: 2000,   icon: '📕' },
        { id: 'a08', name: 'Completionist',        nameEn: 'Completionist',       desc: 'Kumpulkan semua 120 jenis ikan',     condition: { type: 'unique_fish', value: 120 },     reward: 100000, icon: '👑' },
        { id: 'a09', name: 'Penjelajah',           nameEn: 'Explorer',            desc: 'Buka 3 map',                         condition: { type: 'maps_unlocked', value: 3 },     reward: 1000,   icon: '🗺️' },
        { id: 'a10', name: 'Petualang',            nameEn: 'Adventurer',          desc: 'Buka 5 map',                         condition: { type: 'maps_unlocked', value: 5 },     reward: 3000,   icon: '🧭' },
        { id: 'a11', name: 'Penjelajah Dunia',     nameEn: 'World Explorer',      desc: 'Buka semua map',                     condition: { type: 'maps_unlocked', value: 8 },     reward: 10000,  icon: '🌍' },
        { id: 'a12', name: 'Mutasi Pertama',       nameEn: 'First Mutation',      desc: 'Dapatkan ikan bermutasi',            condition: { type: 'mutations_found', value: 1 },   reward: 500,    icon: '🧬' },
        { id: 'a13', name: 'Kolektor Mutasi',      nameEn: 'Mutation Collector',  desc: 'Dapatkan 5 mutasi berbeda',          condition: { type: 'mutations_found', value: 5 },   reward: 2000,   icon: '🔬' },
        { id: 'a14', name: 'Master Mutasi',        nameEn: 'Mutation Master',     desc: 'Dapatkan 10 mutasi berbeda',         condition: { type: 'mutations_found', value: 10 },  reward: 5000,   icon: '⚗️' },
        { id: 'a15', name: 'Legenda Laut',         nameEn: 'Sea Legend',          desc: 'Tangkap ikan Legendary',             condition: { type: 'rarity_caught', value: 'legendary' }, reward: 3000, icon: '⭐' },
        { id: 'a16', name: 'Mitos Hidup',          nameEn: 'Living Myth',         desc: 'Tangkap ikan Mythic',                condition: { type: 'rarity_caught', value: 'mythic' },   reward: 5000, icon: '🌟' },
        { id: 'a17', name: 'Melampaui Batas',      nameEn: 'Transcended',         desc: 'Tangkap ikan Transcendent',          condition: { type: 'rarity_caught', value: 'transcendent' }, reward: 10000, icon: '💫' },
        { id: 'a18', name: 'Omega Hunter',         nameEn: 'Omega Hunter',        desc: 'Tangkap ikan Omega',                 condition: { type: 'rarity_caught', value: 'omega' },    reward: 25000, icon: '🔱' },
        { id: 'a19', name: 'Kaya Raya',            nameEn: 'Filthy Rich',         desc: 'Kumpulkan 100.000 koin',             condition: { type: 'total_coins_earned', value: 100000 }, reward: 10000, icon: '💰' },
        { id: 'a20', name: 'Sultan Laut',          nameEn: 'Sea Sultan',          desc: 'Kumpulkan 1.000.000 koin',           condition: { type: 'total_coins_earned', value: 1000000 }, reward: 50000, icon: '👑' },
        { id: 'a21', name: 'Level 20',             nameEn: 'Level 20',            desc: 'Capai level 20',                     condition: { type: 'level', value: 20 },            reward: 2000,   icon: '📈' },
        { id: 'a22', name: 'Level 40',             nameEn: 'Level 40',            desc: 'Capai level 40',                     condition: { type: 'level', value: 40 },            reward: 10000,  icon: '📊' },
        { id: 'a23', name: 'Godlike',              nameEn: 'Godlike',             desc: 'Dapatkan mutasi Godly',              condition: { type: 'specific_mutation', value: 'godly' },  reward: 50000, icon: '✝️' },
        { id: 'a24', name: 'Void Walker',          nameEn: 'Void Walker',         desc: 'Tangkap ikan di Kedalaman Void',     condition: { type: 'fish_from_map', value: 6 },     reward: 8000,   icon: '🕳️' },
        { id: 'a25', name: 'Penghuni Prisma',      nameEn: 'Prisma Dweller',      desc: 'Tangkap ikan di Dimensi Prisma',     condition: { type: 'fish_from_map', value: 7 },     reward: 15000,  icon: '🌈' }
    ],

    // ── LEVELING ──────────────────────────────────────────────
    LEVEL_XP: (function() {
        const table = [];
        for (let i = 0; i <= 60; i++) {
            // XP formula: base 50, increasing by 25 per level, compounding slightly
            table.push(Math.floor(50 + (i * 25) + (i * i * 2)));
        }
        return table;
    })(),

    // ── STORY TEXT ─────────────────────────────────────────────
    STORY: [
        { speaker: 'narrator', text: 'Di sebuah desa kecil di tepi lautan...', textEn: 'In a small village by the sea...' },
        { speaker: 'narrator', text: 'Hiduplah seorang nelayan yang sederhana.', textEn: 'There lived a humble fisherman.' },
        { speaker: 'narrator', text: 'Setiap hari, ia pergi melaut demi menghidupi keluarganya.', textEn: 'Every day, he went to sea to provide for his family.' },
        { speaker: 'fisher',   text: '"Aku harus menangkap ikan yang cukup hari ini..."', textEn: '"I must catch enough fish today..."' },
        { speaker: 'narrator', text: 'Namun hari ini terasa berbeda.', textEn: 'But today felt different.' },
        { speaker: 'narrator', text: 'Laut seolah memanggilnya... ke tempat yang lebih jauh.', textEn: 'The sea seemed to call him... to places far away.' },
        { speaker: 'fisher',   text: '"Aku merasakan sesuatu... ada yang berbeda di laut hari ini."', textEn: '"I feel something... the sea is different today."' },
        { speaker: 'narrator', text: 'Dengan keberanian di hatinya, sang nelayan mengangkat jangkarnya...', textEn: 'With courage in his heart, the fisherman raised his anchor...' },
        { speaker: 'narrator', text: 'Dan memulai petualangan yang akan mengubah hidupnya selamanya.', textEn: 'And began an adventure that would change his life forever.' },
        { speaker: 'narrator', text: '🎣 Selamat datang di MOISH! 🎣', textEn: '🎣 Welcome to MOISH! 🎣' }
    ],

    // ── GAME DEFAULTS ─────────────────────────────────────────
    DEFAULTS: {
        maxStamina: 100,
        baseBagCapacity: 10,
        dayDuration: 600,         // 10 minutes in seconds (600s)
        nightDuration: 600,       // 10 minutes in seconds
        fishingCooldown: 3,       // seconds between casts
        staminaPerCast: 3,        // stamina cost per cast
        staminaDrainRate: 0.05,   // passive stamina drain per second at night
        baseMutationChance: 0.10, // 10% chance any fish mutates
        comboTimeout: 5,          // seconds before combo resets
    }
};

// ── I18N (Internationalization) ───────────────────────────────
const I18N = {
    id: {
        // Main Menu
        startGame: 'Mulai Game', continueGame: 'Lanjutkan', loadGame: 'Muat Game',
        settings: 'Pengaturan', quit: 'Keluar', theGame: 'The Fishing Game',
        // Settings
        display: 'Tampilan', language: 'Bahasa', audio: 'Audio',
        fullscreen: 'Layar Penuh', windowed: 'Berjendela', customSize: 'Ukuran Kustom',
        master: 'Master', music: 'Musik', sfx: 'Efek Suara',
        back: 'Kembali', save: 'Simpan', apply: 'Terapkan',
        // Gameplay
        day: 'Hari', castLine: 'Lempar Pancing', goHome: 'Kembali ke Rumah',
        morning: 'Pagi', afternoon: 'Siang', evening: 'Sore', night: 'Malam',
        stamina: 'Stamina', level: 'Level', coins: 'Koin', exp: 'EXP',
        bag: 'Tas', fishCaught: 'Ikan Tertangkap!', fishEscaped: 'Ikan Lolos!',
        combo: 'Combo', weather: 'Cuaca',
        // Home
        sleep: 'Tidur', storeFish: 'Simpan Ikan', sellFish: 'Jual Ikan',
        upgrade: 'Upgrade', aquarium: 'Akuarium', achievements: 'Penghargaan',
        changeCharacter: 'Ganti Karakter', shop: 'Toko',
        // Fish Info
        rarity: 'Kelangkaan', mutation: 'Mutasi', value: 'Nilai',
        normal: 'Normal', mutated: 'Bermutasi',
        // Story
        skipStory: 'Lewati Cerita', skipIn: 'Lewati dalam',
        // Misc
        confirm: 'Konfirmasi', cancel: 'Batal', yes: 'Ya', no: 'Tidak',
        selectAll: 'Pilih Semua', deselectAll: 'Hapus Semua',
        noSaveFound: 'Tidak ada save ditemukan',
        newDay: 'Hari Baru Dimulai!', goodMorning: 'Selamat Pagi!',
        youAreTired: 'Kamu lelah! Kembalilah ke rumah.',
        bagFull: 'Tas penuh! Jual atau simpan ikan dulu.',
        mapLocked: 'Map terkunci! Level',  required: 'dibutuhkan.',
        totalSell: 'Total Penjualan', sold: 'Terjual',
        locked: 'Terkunci', unlocked: 'Terbuka', owned: 'Dimiliki',
        buy: 'Beli', price: 'Harga', maxLevel: 'Level Maks',
        selected: 'Terpilih', select: 'Pilih', equipped: 'Dipakai',
        equip: 'Pakai', notEnoughCoins: 'Koin tidak cukup!',
        skill: 'Skill', upgradeChar: 'Upgrade Karakter',
        currentLevel: 'Level Saat Ini', nextUpgrade: 'Upgrade Selanjutnya',
        maxUpgrade: 'Upgrade Maksimal', cost: 'Biaya',
        map: 'Map', selectMap: 'Pilih Map',
        chooseWeather: 'Pilih Cuaca Hari Ini',
        catchLog: 'Log Tangkapan', emptyBag: 'Tas Kosong',
        storeSuccess: 'Ikan berhasil disimpan ke akuarium!',
        sellSuccess: 'Ikan berhasil dijual!',
        sleepConfirm: 'Tidur dan mulai hari baru?',
        achievement: 'Penghargaan Baru!', unlockAchievement: 'Penghargaan terbuka!',
        collection: 'Koleksi', discovered: 'Ditemukan', total: 'Total',
        bombActivated: 'BOOM! Bom dilempar!', bombFish: 'ikan dari ledakan!',
        healActivated: 'Stamina dipulihkan!',
        loading: 'Memuat...', saving: 'Menyimpan...',
        savedGames: 'Game Tersimpan', saveSlot: 'Slot', deleteSave: 'Hapus',
        saveGame: 'Simpan Game', autoSave: 'Auto Save',
        controls: 'Kontrol', gameSpeed: 'Kecepatan Game',
    },
    en: {
        startGame: 'Start Game', continueGame: 'Continue', loadGame: 'Load Game',
        settings: 'Settings', quit: 'Quit', theGame: 'The Fishing Game',
        display: 'Display', language: 'Language', audio: 'Audio',
        fullscreen: 'Fullscreen', windowed: 'Windowed', customSize: 'Custom Size',
        master: 'Master', music: 'Music', sfx: 'Sound Effects',
        back: 'Back', save: 'Save', apply: 'Apply',
        day: 'Day', castLine: 'Cast Line', goHome: 'Go Home',
        morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', night: 'Night',
        stamina: 'Stamina', level: 'Level', coins: 'Coins', exp: 'EXP',
        bag: 'Bag', fishCaught: 'Fish Caught!', fishEscaped: 'Fish Escaped!',
        combo: 'Combo', weather: 'Weather',
        sleep: 'Sleep', storeFish: 'Store Fish', sellFish: 'Sell Fish',
        upgrade: 'Upgrade', aquarium: 'Aquarium', achievements: 'Achievements',
        changeCharacter: 'Change Character', shop: 'Shop',
        rarity: 'Rarity', mutation: 'Mutation', value: 'Value',
        normal: 'Normal', mutated: 'Mutated',
        skipStory: 'Skip Story', skipIn: 'Skip in',
        confirm: 'Confirm', cancel: 'Cancel', yes: 'Yes', no: 'No',
        selectAll: 'Select All', deselectAll: 'Deselect All',
        noSaveFound: 'No save found',
        newDay: 'New Day Begins!', goodMorning: 'Good Morning!',
        youAreTired: 'You are tired! Go home and rest.',
        bagFull: 'Bag is full! Sell or store fish first.',
        mapLocked: 'Map locked! Level', required: 'required.',
        totalSell: 'Total Sale', sold: 'Sold',
        locked: 'Locked', unlocked: 'Unlocked', owned: 'Owned',
        buy: 'Buy', price: 'Price', maxLevel: 'Max Level',
        selected: 'Selected', select: 'Select', equipped: 'Equipped',
        equip: 'Equip', notEnoughCoins: 'Not enough coins!',
        skill: 'Skill', upgradeChar: 'Upgrade Character',
        currentLevel: 'Current Level', nextUpgrade: 'Next Upgrade',
        maxUpgrade: 'Max Upgrade', cost: 'Cost',
        map: 'Map', selectMap: 'Select Map',
        chooseWeather: 'Choose Weather Today',
        catchLog: 'Catch Log', emptyBag: 'Empty Bag',
        storeSuccess: 'Fish stored in aquarium!',
        sellSuccess: 'Fish sold successfully!',
        sleepConfirm: 'Sleep and start a new day?',
        achievement: 'New Achievement!', unlockAchievement: 'Achievement Unlocked!',
        collection: 'Collection', discovered: 'Discovered', total: 'Total',
        bombActivated: 'BOOM! Bomb thrown!', bombFish: 'fish from explosion!',
        healActivated: 'Stamina restored!',
        loading: 'Loading...', saving: 'Saving...',
        savedGames: 'Saved Games', saveSlot: 'Slot', deleteSave: 'Delete',
        saveGame: 'Save Game', autoSave: 'Auto Save',
        controls: 'Controls', gameSpeed: 'Game Speed',
    },
    zh: { startGame: '开始游戏', continueGame: '继续', loadGame: '加载游戏', settings: '设置', quit: '退出', theGame: '钓鱼游戏', back: '返回', day: '天', castLine: '抛竿', goHome: '回家', stamina: '体力', level: '等级', coins: '金币', exp: '经验', bag: '背包', fishCaught: '钓到鱼了！', fishEscaped: '鱼跑了！', sleep: '睡觉', storeFish: '存鱼', sellFish: '卖鱼', upgrade: '升级', shop: '商店', rarity: '稀有度', mutation: '变异', skipStory: '跳过故事', confirm: '确认', cancel: '取消', display: '显示', language: '语言', audio: '音频', weather: '天气', combo: 'Combo', achievements: '成就', aquarium: '水族馆', changeCharacter: '换角色' },
    ja: { startGame: 'ゲーム開始', continueGame: '続ける', loadGame: 'ロード', settings: '設定', quit: '終了', theGame: 'フィッシングゲーム', back: '戻る', day: '日目', castLine: '釣り糸を投げる', goHome: '家に帰る', stamina: 'スタミナ', level: 'レベル', coins: 'コイン', exp: '経験値', bag: 'バッグ', fishCaught: '魚を捕まえた！', fishEscaped: '魚が逃げた！', sleep: '寝る', storeFish: '魚を保存', sellFish: '魚を売る', upgrade: 'アップグレード', shop: 'ショップ', rarity: 'レア度', mutation: '変異', skipStory: 'スキップ', confirm: '確認', cancel: 'キャンセル', display: '表示', language: '言語', audio: 'オーディオ', weather: '天気', combo: 'コンボ', achievements: '実績', aquarium: '水族館', changeCharacter: 'キャラ変更' },
    ko: { startGame: '게임 시작', continueGame: '계속', loadGame: '불러오기', settings: '설정', quit: '종료', theGame: '낚시 게임', back: '뒤로', day: '일', castLine: '낚시 던지기', goHome: '집으로', stamina: '체력', level: '레벨', coins: '코인', exp: '경험치', bag: '가방', fishCaught: '물고기 잡았다!', fishEscaped: '물고기가 도망갔다!', sleep: '잠자기', storeFish: '물고기 저장', sellFish: '물고기 판매', upgrade: '업그레이드', shop: '상점', rarity: '등급', mutation: '변이', skipStory: '건너뛰기', confirm: '확인', cancel: '취소', display: '디스플레이', language: '언어', audio: '오디오', weather: '날씨', combo: '콤보', achievements: '업적', aquarium: '수족관', changeCharacter: '캐릭터 변경' },
    th: { startGame: 'เริ่มเกม', continueGame: 'ดำเนินต่อ', loadGame: 'โหลดเกม', settings: 'ตั้งค่า', quit: 'ออก', theGame: 'เกมตกปลา', back: 'กลับ', day: 'วัน', castLine: 'เหวี่ยงเบ็ด', goHome: 'กลับบ้าน', stamina: 'พลังงาน', level: 'เลเวล', coins: 'เหรียญ', exp: 'ค่าประสบการณ์', bag: 'กระเป๋า', fishCaught: 'จับปลาได้!', fishEscaped: 'ปลาหนีไป!', sleep: 'นอน', sellFish: 'ขายปลา', upgrade: 'อัพเกรด', shop: 'ร้านค้า', skipStory: 'ข้ามเรื่อง', confirm: 'ยืนยัน', cancel: 'ยกเลิก' },
    ru: { startGame: 'Начать Игру', continueGame: 'Продолжить', loadGame: 'Загрузить', settings: 'Настройки', quit: 'Выход', theGame: 'Игра в Рыбалку', back: 'Назад', day: 'День', castLine: 'Забросить', goHome: 'Домой', stamina: 'Стамина', level: 'Уровень', coins: 'Монеты', exp: 'Опыт', bag: 'Сумка', fishCaught: 'Рыба поймана!', fishEscaped: 'Рыба сбежала!', sleep: 'Спать', sellFish: 'Продать Рыбу', upgrade: 'Улучшить', shop: 'Магазин', skipStory: 'Пропустить', confirm: 'Подтвердить', cancel: 'Отмена' },
    es: { startGame: 'Iniciar Juego', continueGame: 'Continuar', loadGame: 'Cargar Juego', settings: 'Ajustes', quit: 'Salir', theGame: 'El Juego de Pesca', back: 'Atrás', day: 'Día', castLine: 'Lanzar Sedal', goHome: 'Ir a Casa', stamina: 'Energía', level: 'Nivel', coins: 'Monedas', exp: 'EXP', bag: 'Bolsa', fishCaught: '¡Pez atrapado!', fishEscaped: '¡El pez escapó!', sleep: 'Dormir', storeFish: 'Guardar Pez', sellFish: 'Vender Pez', upgrade: 'Mejorar', shop: 'Tienda', rarity: 'Rareza', mutation: 'Mutación', skipStory: 'Saltar', confirm: 'Confirmar', cancel: 'Cancelar', display: 'Pantalla', language: 'Idioma', audio: 'Audio', weather: 'Clima', combo: 'Combo', achievements: 'Logros', aquarium: 'Acuario', changeCharacter: 'Cambiar Personaje' },
    fr: { startGame: 'Commencer', continueGame: 'Continuer', loadGame: 'Charger', settings: 'Paramètres', quit: 'Quitter', theGame: 'Le Jeu de Pêche', back: 'Retour', day: 'Jour', castLine: 'Lancer la ligne', goHome: 'Rentrer', stamina: 'Énergie', level: 'Niveau', coins: 'Pièces', exp: 'EXP', bag: 'Sac', fishCaught: 'Poisson attrapé !', fishEscaped: 'Le poisson s\'est échappé !', sleep: 'Dormir', storeFish: 'Garder le poisson', sellFish: 'Vendre le poisson', upgrade: 'Améliorer', shop: 'Boutique', rarity: 'Rareté', mutation: 'Mutation', skipStory: 'Passer', confirm: 'Confirmer', cancel: 'Annuler', display: 'Affichage', language: 'Langue', audio: 'Audio', weather: 'Météo', combo: 'Combo', achievements: 'Succès', aquarium: 'Aquarium', changeCharacter: 'Changer de personnage' },
    de: { startGame: 'Spiel Starten', continueGame: 'Fortsetzen', loadGame: 'Laden', settings: 'Einstellungen', quit: 'Beenden', theGame: 'Das Angelspiel', back: 'Zurück', day: 'Tag', castLine: 'Auswerfen', goHome: 'Nach Hause', stamina: 'Ausdauer', level: 'Level', coins: 'Münzen', exp: 'EXP', bag: 'Tasche', fishCaught: 'Fisch gefangen!', fishEscaped: 'Fisch entkommen!', sleep: 'Schlafen', storeFish: 'Fisch lagern', sellFish: 'Fisch verkaufen', upgrade: 'Aufwerten', shop: 'Laden', rarity: 'Seltenheit', mutation: 'Mutation', skipStory: 'Überspringen', confirm: 'Bestätigen', cancel: 'Abbrechen', display: 'Anzeige', language: 'Sprache', audio: 'Audio', weather: 'Wetter', combo: 'Combo', achievements: 'Erfolge', aquarium: 'Aquarium', changeCharacter: 'Charakter wechseln' }
};
