/**
 * players.js – Dữ liệu cầu thủ và hệ thống random card theo rarity
 *
 * Rarity tiers: common | rare | epic | legendary
 */
export const players = [
  { name: "Messi", rarity: "legendary", rating: 95, image: "https://www.sportico.com/wp-content/uploads/2025/07/Messi-Suspension.png?w=1280&h=720&crop=1" },
  { name: "Ronaldo", rarity: "legendary", rating: 94, image: "https://pos.nvncdn.com/3c8244-211061/art/artCT/20241002_bSV3mZVJ.jpg" },
  { name: "Mbappe", rarity: "epic", rating: 91, image: "https://image.discovery.indazn.com/ca/v2/ca/image?id=2ab58873-c0c3-4ba8-a034-b17ed81c18e3&quality=70" },
  { name: "Haaland", rarity: "epic", rating: 90, image: "https://play-lh.googleusercontent.com/ginPTleHzqVmcG0saIb2jZgrYsyskJhR4yFieuEBfPrE9bhntvOpHGkh8Q76DDLJj3c" },
  { name: "De Bruyne", rarity: "rare", rating: 89, image: "https://wallpapers4screen.com/Uploads/1-5-2025/74826/thumb2-kevin-de-bruyne-4k-purple-neon-lights-belgium-national-football-team-belgian-footballers.jpg" },
  { name: "Neymar", rarity: "rare", rating: 88, image: "https://cdn.wallpapersafari.com/38/2/eXvct2.jpg" },
  { name: "Salah", rarity: "rare", rating: 87, image: "https://wallpapers.com/images/hd/liverpool-4k-salah-holding-trophy-2sn3sxtcrhl5ih05.jpg" },
  { name: "Modric", rarity: "common", rating: 85, image: "https://wallpaperaccess.com/full/7638791.jpg" },
  { name: "Benzema", rarity: "common", rating: 84, image: "https://wallpapercave.com/wp/wp12619922.jpg" },
  { name: "Son", rarity: "common", rating: 83, image: "https://wallpapers4screen.com/Uploads/13-5-2025/76409/thumb2-son-heung-min-4k-blue-neon-lights-tottenham-hotspur-premier-league.jpg" },
  { name: "Lamine Yamal", rarity: "epic", rating: 88, image: "https://wallpapers4screen.com/Uploads/13-6-2025/80114/thumb2-4k-lamine-yamal-personal-celebration-red-abstract-background-spain-national-football-team.jpg" },
  { name: "Bellingham", rarity: "legendary", rating: 93, image: "https://i.dailymail.co.uk/1s/2023/06/15/12/72169517-12198413-image-m-25_1686829831644.jpg" },
  { name: "Vinicius Jr", rarity: "epic", rating: 91, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6k56gXSJMglZZ-J-35BfKZfbuFK-Os5CUCg&s" },
  { name: "Harry Kane", rarity: "epic", rating: 90, image: "https://wallpapers4screen.com/Uploads/22-11-2024/63993/thumb2-harry-kane-4k-red-neon-lights-bayern-munich-fc-bundesliga.jpg" },
  { name: "Rodri", rarity: "epic", rating: 90, image: "https://wallpapercave.com/wp/wp7845502.png" },
  { name: "Foden", rarity: "epic", rating: 89, image: "https://e0.pxfuel.com/wallpapers/893/784/desktop-wallpaper-phil-foden-2021-english-footballers-manchester-city-fc-premier-league-phil-walter-foden-blue-neon-lights-soccer-phil-foden-man-city-phil-foden-manchester-city.jpg" },
  { name: "Saka", rarity: "epic", rating: 89, image: "https://wallpapercave.com/wp/wp7355149.jpg" },
  { name: "Lewandowski", rarity: "epic", rating: 89, image: "https://wallpapers4screen.com/Uploads/9-1-2025/64891/thumb2-robert-lewandowski-4k-blue-neon-lights-fc-barcelona-la-liga.jpg" },
  { name: "Van Dijk", rarity: "epic", rating: 90, image: "https://wallpaper.forfun.com/fetch/5c/5ca8a38aefb2f38f0f873ab5123077d9.jpeg" },
  { name: "Odegaard", rarity: "rare", rating: 88, image: "" },
  { name: "Musiala", rarity: "rare", rating: 88, image: "" },
  { name: "Wirtz", rarity: "rare", rating: 88, image: "" },
  { name: "Griezmann", rarity: "rare", rating: 88, image: "" },
  { name: "Lautaro", rarity: "rare", rating: 88, image: "" },
  { name: "Alisson", rarity: "rare", rating: 89, image: "" },
  { name: "Courtois", rarity: "rare", rating: 89, image: "" },
  { name: "Leao", rarity: "rare", rating: 87, image: "" },
  { name: "Palmer", rarity: "rare", rating: 87, image: "" },
  { name: "Pedri", rarity: "rare", rating: 86, image: "" },
  { name: "Gavi", rarity: "rare", rating: 85, image: "" },
  { name: "Mac Allister", rarity: "common", rating: 84, image: "" },
];


/**
 * Tỉ lệ drop theo rarity (tổng = 100)
 * legendary: 5% | epic: 15% | rare: 30% | common: 50%
 */
const RARITY_WEIGHTS = [
  { rarity: "legendary", weight: 5 },
  { rarity: "epic", weight: 15 },
  { rarity: "rare", weight: 30 },
  { rarity: "common", weight: 50 },
];

/**
 * getRandomCard – Random 1 card theo tỉ lệ rarity
 * Bước 1: Roll số ngẫu nhiên 1–100 để xác định rarity
 * Bước 2: Lọc danh sách players theo rarity đó
 * Bước 3: Random 1 player trong nhóm
 *
 * @param {Array} playerList – Danh sách players (mặc định dùng export `players`)
 * @returns {{ name, rarity, rating }}
 */
export function getRandomCard(playerList = players) {
  // Bước 1: chọn rarity theo trọng số tích lũy
  const roll = Math.random() * 100; // 0 → 100
  let cumulative = 0;
  let selectedRarity = "common";

  for (const { rarity, weight } of RARITY_WEIGHTS) {
    cumulative += weight;
    if (roll < cumulative) {
      selectedRarity = rarity;
      break;
    }
  }

  // Bước 2: lọc players có rarity trùng khớp
  const pool = playerList.filter((p) => p.rarity === selectedRarity);

  // Fallback nếu pool trống (không nên xảy ra với data mặc định)
  if (pool.length === 0) return playerList[0];

  // Bước 3: chọn ngẫu nhiên 1 player trong pool
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Config màu sắc & label theo rarity – dùng chung cho PlayerCard & Collection
 */
export const RARITY_CONFIG = {
  legendary: {
    label: "Huyền Thoại",
    bgClass: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    textClass: "text-yellow-900",
    badgeBg: "bg-yellow-900/20",
    border: "border-yellow-400",
    glow: "shadow-yellow-300",
    emoji: "👑",
  },
  epic: {
    label: "Sử Thi",
    bgClass: "bg-gradient-to-br from-purple-500 to-purple-700",
    textClass: "text-white",
    badgeBg: "bg-white/20",
    border: "border-purple-400",
    glow: "shadow-purple-300",
    emoji: "⚡",
  },
  rare: {
    label: "Hiếm",
    bgClass: "bg-gradient-to-br from-blue-400 to-blue-600",
    textClass: "text-white",
    badgeBg: "bg-white/20",
    border: "border-blue-300",
    glow: "shadow-blue-200",
    emoji: "💎",
  },
  common: {
    label: "Phổ Thông",
    bgClass: "bg-gradient-to-br from-gray-200 to-gray-400",
    textClass: "text-gray-800",
    badgeBg: "bg-gray-800/10",
    border: "border-gray-300",
    glow: "shadow-gray-200",
    emoji: "⚽",
  },
};

/**
 * Thứ tự sắp xếp rarity (cao → thấp) cho Collection
 */
export const RARITY_ORDER = ["legendary", "epic", "rare", "common"];
