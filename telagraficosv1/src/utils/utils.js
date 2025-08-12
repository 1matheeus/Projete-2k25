// utils.js - Funções utilitárias

import { DASHBOARD_CONFIG } from '../config/config';

/**
 * Formata o valor do sensor com unidade
 * @param {number} value - Valor do sensor
 * @returns {string} - Valor formatado
 */
export const formatSensorValue = (value) => {
  return `${Math.round(value)} ppm`;
};

/**
 * Determina o nível do sensor baseado no valor
 * @param {number} value - Valor do sensor
 * @returns {object} - Objeto com informações do nível
 */
export const getSensorLevel = (value) => {
  const { LEVELS } = DASHBOARD_CONFIG;
  
  if (value <= LEVELS.LOW.MAX) {
    return {
      level: 'LOW',
      color: LEVELS.LOW.COLOR,
      label: LEVELS.LOW.LABEL,
      description: 'nível pré-industrial ou muito bem ventilado'
    };
  } else if (value <= LEVELS.MEDIUM.MAX) {
    return {
      level: 'MEDIUM',
      color: LEVELS.MEDIUM.COLOR,
      label: LEVELS.MEDIUM.LABEL,
      description: 'nível típico de ambientes urbanos ou internos'
    };
  } else {
    return {
      level: 'HIGH',
      color: LEVELS.HIGH.COLOR,
      label: LEVELS.HIGH.LABEL,
      description: 'pode indicar ventilação insuficiente ou acúmulo de emissões'
    };
  }
};

/**
 * Gera dados simulados do sensor
 * @returns {number} - Valor simulado do sensor
 */
export const generateSensorData = () => {
  const { SENSOR } = DASHBOARD_CONFIG;
  const variation = Math.sin(Date.now() / 10000) * SENSOR.VARIATION_RANGE + Math.random() * 20;
  return Math.round(SENSOR.BASE_VALUE + variation);
};

/**
 * Formata hora para exibição
 * @param {Date} date - Data a ser formatada
 * @returns {string} - Hora formatada
 */
export const formatTime = (date = new Date()) => {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Calcula estatísticas dos dados
 * @param {Array} data - Array de dados
 * @returns {object} - Estatísticas calculadas
 */
export const calculateStats = (data) => {
  if (!data || data.length === 0) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      latest: 0,
      trend: 'stable'
    };
  }

  const values = data.map(d => d.coletados);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
  const latest = values[values.length - 1];
  
  // Calcula tendência (últimos 5 pontos vs 5 anteriores)
  let trend = 'stable';
  if (data.length >= 10) {
    const recent = values.slice(-5);
    const previous = values.slice(-10, -5);
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const previousAvg = previous.reduce((sum, val) => sum + val, 0) / previous.length;
    
    const change = ((recentAvg - previousAvg) / previousAvg) * 100;
    if (change > 2) trend = 'rising';
    else if (change < -2) trend = 'falling';
  }

  return {
    min: Math.round(min),
    max: Math.round(max),
    avg: Math.round(avg),
    latest: Math.round(latest),
    trend
  };
};

/**
 * Valida se um valor é um número válido do sensor
 * @param {any} value - Valor a ser validado
 * @returns {boolean} - true se válido
 */
export const isValidSensorValue = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0 && num <= 1000; // Faixa válida: 0-1000 ppm
};

/**
 * Debounce function para otimizar performance
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} - Função com debounce
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Exporta dados para CSV
 * @param {Array} data - Dados a serem exportados
 * @param {string} filename - Nome do arquivo
 */
export const exportToCSV = (data, filename = 'sensor_data.csv') => {
  const headers = ['Horário', 'Valor Coletado (ppm)', 'Previsão (ppm)'];
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      row.time,
      row.coletados,
      row.previsoes
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
