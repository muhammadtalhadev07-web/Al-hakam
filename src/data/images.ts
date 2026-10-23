// ============================================================
// Image helpers — every Unsplash ID below was checked to resolve.
// ============================================================

export function unsplash(id: string, width = 1200, quality = 75): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`;
}

export const IMAGES = {
  heroCar: unsplash('1563720360172-67b8f3dce741', 2000),
  heroRoad: unsplash('1568605117036-5fe5e7bab0b7', 2000),
  silhouette: unsplash('1485291571150-772bcfc10da5', 2000),
  driving: unsplash('1449965408869-eaa3f722e40d', 1600),
  roadTrip: unsplash('1469854523086-cc02fe5d8800', 1600),
  mountains: unsplash('1506905925346-21bda4d32df4', 2000),
  valley: unsplash('1464822759023-fed622ff2c3b', 1600),
  lake: unsplash('1501785888041-af3ef285b470', 1600),
  highlands: unsplash('1470071459604-3b5ec3a7fe05', 1600),
  hillStation: unsplash('1597074866923-dc0589150358', 1600),
  lahore: unsplash('1622546758596-f1f06ba11f58', 1600),
  trek: unsplash('1589553416260-f586c8f1514f', 1600),
  nightPeaks: unsplash('1519681393784-d120267933ba', 1600),
  coach: unsplash('1544620347-c4fd4a3d5957', 1600),
  fallbackCar: unsplash('1619767886558-efdc259cde1a', 1200),
} as const;

const OPTIMIZABLE_HOSTS = [/^images\.unsplash\.com$/, /\.supabase\.co$/];

/**
 * next/image only optimises hosts listed in next.config `remotePatterns`.
 * Admin-entered URLs can be from anywhere, so render those unoptimised
 * instead of crashing the page.
 */
export function canOptimize(src: string): boolean {
  try {
    const { hostname } = new URL(src);
    return OPTIMIZABLE_HOSTS.some((re) => re.test(hostname));
  } catch {
    return src.startsWith('/');
  }
}
