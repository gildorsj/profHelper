// Paleta de cores e constantes visuais do PropHelfer.
// Tema vermelho (identidade do Figma), refinado com profundidade e hierarquia.

export const colors = {
  // Vermelho de marca (fundo das telas) + variações de profundidade
  primary: '#C1272D',
  primaryDark: '#A81F26', // barra superior (app bar)
  primaryDeep: '#7E1519', // barra de status / sombras profundas
  primaryLight: '#E14B4B',

  // Superfícies translúcidas sobre o vermelho (cards do conteúdo)
  card: 'rgba(255,255,255,0.10)',
  cardStrong: 'rgba(255,255,255,0.16)',
  cardBorder: 'rgba(255,255,255,0.16)',

  // Superfícies claras (cartões de título brancos, chips claros)
  surface: '#FFFFFF',
  surfaceMuted: '#F4F4F4',

  // Texto sobre o vermelho
  onPrimary: '#FFFFFF',
  onPrimaryMuted: 'rgba(255,255,255,0.80)',
  onPrimaryFaint: 'rgba(255,255,255,0.55)',

  // Texto sobre superfícies claras
  onSurface: '#2A1614',
  onSurfaceMuted: '#8A8A8A',

  // Divisórias
  divider: 'rgba(255,255,255,0.14)',

  // Chip salmão original (mantido por compatibilidade)
  badge: '#F2C4BC',
  badgeText: '#7E1519',

  // Cores semânticas
  success: '#2F9E44',
  warning: '#E8930C',
  danger: '#E03131',
  dangerDeep: '#8E1519',

  // Frequência (usadas em texto/ícone sobre chip claro)
  freqAlta: '#2F9E44', // >= 75%
  freqMedia: '#E8930C', // 60% a 74%
  freqBaixa: '#E03131', // < 60%

  // Inputs (fundo levemente escurecido para o texto branco contrastar)
  inputBg: 'rgba(0,0,0,0.16)',
  inputBorder: 'rgba(255,255,255,0.28)',
  inputBorderFocus: '#FFFFFF',
  placeholder: 'rgba(255,255,255,0.55)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
};

export const typography = {
  hero: 30,
  title: 23,
  subtitle: 17,
  body: 16,
  small: 13,
  tiny: 11,
};

// Sombras/elevação reutilizáveis (iOS: shadow*, Android: elevation).
export const shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 10,
  },
};

// Cor semântica da frequência (verde = boa, âmbar = atenção, vermelho = crítica).
export function corFrequencia(pct) {
  if (pct >= 75) return colors.freqAlta;
  if (pct >= 60) return colors.freqMedia;
  return colors.freqBaixa;
}

// Rótulo curto correspondente à faixa de frequência.
export function rotuloFrequencia(pct) {
  if (pct >= 75) return 'Boa';
  if (pct >= 60) return 'Atenção';
  return 'Crítica';
}
