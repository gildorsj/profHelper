// Paleta de cores e constantes visuais do ProfHelper.
// Baseada no protótipo do Figma (tema vermelho, texto branco).

export const colors = {
  // Vermelho principal (fundo das telas)
  primary: '#C62828',
  primaryDark: '#8E1B1B', // cabeçalho / barra de status
  primaryLight: '#E14B4B',

  // Superfícies claras (cards de título, modais, inputs de destaque)
  surface: '#FFFFFF',
  surfaceMuted: '#F3F3F3',

  // Texto sobre o vermelho
  onPrimary: '#FFFFFF',
  onPrimaryMuted: 'rgba(255,255,255,0.72)',

  // Texto sobre superfícies claras
  onSurface: '#2A2A2A',
  onSurfaceMuted: '#7A7A7A',

  // Elementos auxiliares
  divider: 'rgba(255,255,255,0.22)',
  badge: '#EBB0A6', // caixinha salmão da frequência (Lista de Alunos)
  badgeText: '#5A241C',

  // Estados
  success: '#2E7D32',
  warning: '#F9A825',
  danger: '#7F1010',

  // Inputs sobre o vermelho
  inputBg: 'rgba(255,255,255,0.12)',
  inputBorder: 'rgba(255,255,255,0.55)',
  placeholder: 'rgba(255,255,255,0.6)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};

export const typography = {
  title: 24,
  subtitle: 16,
  body: 16,
  small: 13,
};
