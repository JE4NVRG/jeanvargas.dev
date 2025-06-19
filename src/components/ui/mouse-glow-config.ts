// ====================================
// CONFIGURAÇÕES DO EFEITO MOUSE GLOW
// ====================================
// Este arquivo controla o efeito de brilho que segue o cursor do mouse
// Para personalizar:
// 1. enabled: true/false para ativar/desativar o efeito
// 2. showOnMobile: true/false para mostrar em dispositivos móveis
// 3. showOnLightMode: true/false para mostrar no modo claro
// 4. opacity: controla a intensidade geral (0-1)
// 5. colors.base: RGB do brilho [R, G, B] (ex: [255, 255, 255] = branco)

export interface MouseGlowConfig {
  // Configurações gerais
  enabled: boolean;
  showOnMobile: boolean;
  showOnLightMode: boolean;
  zIndex: number;
  opacity: number;

  // Efeito principal
  primaryEffect: {
    size: number;
    blur: number;
    opacity: [number, number];
    scale: [number, number];
    duration: number;
    mixBlendMode: string;
  };

  // Efeito secundário
  secondaryEffect: {
    size: number;
    blur: number;
    opacity: [number, number];
    scale: [number, number];
    duration: number;
    mixBlendMode: string;
  };

  // Centro pulsante
  centerEffect: {
    size: number;
    blur: number;
    opacity: [number, number];
    scale: [number, number];
    duration: number;
    pulseDuration: number;
    mixBlendMode: string;
  };

  // Halo externo
  haloEffect: {
    size: number;
    blur: number;
    opacity: [number, number];
    scale: [number, number];
    duration: number;
    mixBlendMode: string;
  };

  // Partículas
  particles: {
    enabled: boolean;
    count: number;
    sizes: number[];
    opacities: number[];
    offsets: Array<[number, number]>;
    durations: number[];
    delays: number[];
    scales: [number, number];
  };

  // Cores
  colors: {
    base: [number, number, number]; // RGB
    opacity: [number, number]; // min, max
  };

  // Movimento
  movement: {
    detectionDelay: number;
    scaleOnMove: boolean;
    smoothTransition: boolean;
  };
}

// Configuração padrão otimizada
export const defaultMouseGlowConfig: MouseGlowConfig = {
  // Configurações gerais
  enabled: true,
  showOnMobile: false, // hidden sm:block
  showOnLightMode: false, // dark:block
  zIndex: 50,
  opacity: 1,

  // Efeito principal
  primaryEffect: {
    size: 384, // w-96 h-96
    blur: 20,
    opacity: [0.12, 0.08],
    scale: [1, 1.05],
    duration: 300,
    mixBlendMode: "screen",
  },

  // Efeito secundário
  secondaryEffect: {
    size: 320, // w-80 h-80
    blur: 16,
    opacity: [0.15, 0.05],
    scale: [1, 1.08],
    duration: 300,
    mixBlendMode: "overlay",
  },

  // Centro pulsante
  centerEffect: {
    size: 128, // w-32 h-32
    blur: 8,
    opacity: [0.25, 0.1],
    scale: [1, 1.1],
    duration: 200,
    pulseDuration: 2000,
    mixBlendMode: "screen",
  },

  // Halo externo
  haloEffect: {
    size: 600,
    blur: 30,
    opacity: [0.04, 0.02],
    scale: [1, 1.02],
    duration: 500,
    mixBlendMode: "soft-light",
  },

  // Partículas
  particles: {
    enabled: true,
    count: 4,
    sizes: [8, 6, 4, 6], // w-2, w-1.5, w-1, w-1.5
    opacities: [0.2, 0.15, 0.25, 0.1],
    offsets: [
      [-30, -20],
      [25, -35],
      [40, 15],
      [-45, 30],
    ],
    durations: [500, 700, 400, 600],
    delays: [0, 0.3, 0.6, 0.9],
    scales: [0.6, 1.4], // min, max when moving
  },

  // Cores (branco para blend modes)
  colors: {
    base: [255, 255, 255],
    opacity: [0.02, 0.25],
  },

  // Movimento
  movement: {
    detectionDelay: 100,
    scaleOnMove: true,
    smoothTransition: true,
  },
};

// Configurações alternativas

export const subtleMouseGlowConfig: MouseGlowConfig = {
  ...defaultMouseGlowConfig,
  opacity: 0.6,
  primaryEffect: {
    ...defaultMouseGlowConfig.primaryEffect,
    opacity: [0.08, 0.04],
    scale: [1, 1.02],
  },
  secondaryEffect: {
    ...defaultMouseGlowConfig.secondaryEffect,
    opacity: [0.1, 0.03],
    scale: [1, 1.04],
  },
  centerEffect: {
    ...defaultMouseGlowConfig.centerEffect,
    opacity: [0.15, 0.06],
    scale: [1, 1.05],
  },
  particles: {
    ...defaultMouseGlowConfig.particles,
    enabled: false,
  },
};

export const intenseMouseGlowConfig: MouseGlowConfig = {
  ...defaultMouseGlowConfig,
  opacity: 1.2,
  primaryEffect: {
    ...defaultMouseGlowConfig.primaryEffect,
    opacity: [0.18, 0.12],
    scale: [1, 1.08],
    size: 450,
  },
  secondaryEffect: {
    ...defaultMouseGlowConfig.secondaryEffect,
    opacity: [0.2, 0.08],
    scale: [1, 1.12],
    size: 380,
  },
  centerEffect: {
    ...defaultMouseGlowConfig.centerEffect,
    opacity: [0.35, 0.15],
    scale: [1, 1.15],
    size: 150,
  },
  particles: {
    ...defaultMouseGlowConfig.particles,
    count: 6,
    scales: [0.4, 1.6],
  },
};
