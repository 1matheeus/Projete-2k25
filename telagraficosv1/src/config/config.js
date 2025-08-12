// config.js - Configurações do Dashboard

export const DASHBOARD_CONFIG = {
  // Configurações do sensor
  SENSOR: {
    UPDATE_INTERVAL: 2000, // Intervalo de atualização em ms (2 segundos)
    MAX_DATA_POINTS: 20,    // Máximo de pontos no gráfico
    BASE_VALUE: 420,        // Valor base do sensor em ppm
    VARIATION_RANGE: 30,    // Variação máxima do sinal
  },

  // Configurações do gráfico
  CHART: {
    HEIGHT: 300,
    Y_AXIS_MIN: 350,
    Y_AXIS_MAX: 500,
    COLORS: {
      COLLECTED_DATA: '#ff6b35',
      PREDICTIONS: '#ffa500',
      GRID: '#e0e0e0'
    }
  },

  // Níveis de referência
  LEVELS: {
    LOW: {
      MAX: 350,
      COLOR: '#4CAF50',
      LABEL: 'Baixa'
    },
    MEDIUM: {
      MIN: 351,
      MAX: 450,
      COLOR: '#FF9800',
      LABEL: 'Média'
    },
    HIGH: {
      MIN: 451,
      COLOR: '#f44336',
      LABEL: 'Alta'
    }
  },

  // Configurações de conectividade
  CONNECTION: {
    SERIAL_BAUD_RATE: 115200,
    CONNECTION_CHECK_INTERVAL: 5000, // 5 segundos
    AUTO_RECONNECT: true
  },

  // Configurações visuais
  UI: {
    ANIMATION_DURATION: 300,
    BORDER_RADIUS: 15,
    SHADOW: '0 4px 20px rgba(0,0,0,0.1)',
    GRADIENT: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
};

export default DASHBOARD_CONFIG;
