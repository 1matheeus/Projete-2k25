import React, { useState, useEffect } from 'react';
import './SensorDashboard.css';

// Componente de ícone simples (substitui lucide-react)
const ActivityIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
  </svg>
);

const WifiIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
    <line x1="12" y1="20" x2="12.01" y2="20"></line>
  </svg>
);

const WifiOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="1" y1="1" x2="23" y2="23"></line>
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

// Header Component
const Header = () => {
  return (
    <div className="header">
      <div className="logo">
        <div className="logo-icon">
          <img 
            src={require('./Logo-removebg-preview.png')} 
            alt="Logo" 
            width="70" 
            height="90" 
            style={{ objectFit: 'contain' }}
          />
        </div>
        <span className="logo-text">AERIS</span>
      </div>
      
      <div className="user-area">
        <span className="user-text">{'{Usuário}'}</span>
        <div className="user-icon-container">
          <UserIcon />
        </div>
      </div>
    </div>
  );
};

// Gráfico simples usando SVG (substitui recharts)
const SimpleChart = ({ sensorData, currentValue }) => {
  const width = 650;
  const height = 380;
  const padding = 60;
  
  if (!sensorData || sensorData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Aguardando dados do sensor...</p>
      </div>
    );
  }

  // Valores fixos para simular o gráfico da imagem
  const chartData = [
    { x: 0, y: 410, label: '01/01' },
    { x: 1, y: 430, label: '02/01' },
    { x: 2, y: 430, label: '03/01' },
    { x: 3, y: 465, label: '04/01' },
    { x: 4, y: 445, label: '05/01' },
    { x: 5, y: 470, label: '06/01' }
  ];

  const maxValue = 500;
  const minValue = 350;
  const range = maxValue - minValue;

  // Linha sólida (Dados Coletados)
  const solidPoints = chartData.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (chartData.length - 1);
    const y = height - padding - ((d.y - minValue) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  // Linha pontilhada (Previsões) - continua após o último ponto
  const dashedPoints = chartData.slice(-2).concat([
    { x: 6, y: 445, label: 'Tempo (dias)' },
    { x: 7, y: 430, label: '' }
  ]).map((d, i, arr) => {
    const baseIndex = chartData.length - 2;
    const x = padding + ((baseIndex + i) * (width - 2 * padding)) / (chartData.length + 1);
    const y = height - padding - ((d.y - minValue) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2 className="chart-title">Sensor MQ7 - Dados de captação: Propano (C3H8)</h2>
        <div className="status-indicators-chart">
          <div className="status-item active">
            <div className="status-dot"></div>
            Status de ativação do sensor
          </div>
          <div className="status-item active">
            <div className="status-dot green"></div>
            Status conexão internet
          </div>
        </div>
      </div>

      <div className="chart-area">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines vertical */}
          {chartData.map((_, i) => {
            const x = padding + (i * (width - 2 * padding)) / (chartData.length - 1);
            return (
              <line 
                key={`v-${i}`}
                x1={x} 
                y1={padding} 
                x2={x} 
                y2={height - padding}
                stroke="#f0f0f0" 
                strokeWidth="1"
              />
            );
          })}
          
          {/* Grid lines horizontal */}
          {[350, 380, 410, 440, 470, 500].map((value, i) => {
            const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
            return (
              <line 
                key={`h-${i}`}
                x1={padding} 
                y1={y} 
                x2={width - padding} 
                y2={y}
                stroke="#f0f0f0" 
                strokeWidth="1"
              />
            );
          })}
          
          {/* Y axis */}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#666" strokeWidth="1"/>
          
          {/* X axis */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#666" strokeWidth="1"/>
          
          {/* Chart line solid (Dados Coletados) */}
          <polyline
            fill="none"
            stroke="#FF8C00"
            strokeWidth="2"
            points={solidPoints}
          />
          
          {/* Chart line dashed (Previsões) */}
          <polyline
            fill="none"
            stroke="#FF8C00"
            strokeWidth="2"
            strokeDasharray="5,5"
            points={dashedPoints}
          />
          
          {/* Data points */}
          {chartData.map((d, i) => {
            const x = padding + (i * (width - 2 * padding)) / (chartData.length - 1);
            const y = height - padding - ((d.y - minValue) / range) * (height - 2 * padding);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#FF8C00"
                stroke="white"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Y-axis labels */}
          <text x="40" y={height - padding + 5} fontSize="12" fill="#999" textAnchor="middle">350</text>
          <text x="40" y={height - padding - ((410 - minValue) / range) * (height - 2 * padding) + 5} fontSize="12" fill="#999" textAnchor="middle">410</text>
          <text x="40" y={height - padding - ((430 - minValue) / range) * (height - 2 * padding) + 5} fontSize="12" fill="#999" textAnchor="middle">430</text>
          <text x="40" y={height - padding - ((450 - minValue) / range) * (height - 2 * padding) + 5} fontSize="12" fill="#999" textAnchor="middle">450</text>
          <text x="40" y={height - padding - ((470 - minValue) / range) * (height - 2 * padding) + 5} fontSize="12" fill="#999" textAnchor="middle">470</text>
          
          {/* X-axis labels */}
          {chartData.map((d, i) => {
            const x = padding + (i * (width - 2 * padding)) / (chartData.length - 1);
            return (
              <text key={i} x={x} y={height - 25} fontSize="12" fill="#999" textAnchor="middle">
                {d.label}
              </text>
            );
          })}
          
          {/* Axis labels */}
          <text x={padding - 30} y={40} fontSize="14" fill="#666" transform={`rotate(-90, ${padding - 30}, 40)`} textAnchor="middle">PPM</text>
          <text x={width - 100} y={height - 10} fontSize="14" fill="#666" textAnchor="middle">Tempo (dias)</text>
        </svg>
        
        {/* Legend */}
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-line solid"></div>
            <span>Dados Coletados</span>
          </div>
          <div className="legend-item">
            <div className="legend-line dashed"></div>
            <span>Previsões</span>
          </div>
        </div>
      </div>
      
      <div className="reference-levels">
        <p><strong>Baixa:</strong> até 350 ppm (nível pré-industrial ou muito bem ventilado)</p>
        <p><strong>Média:</strong> entre 351 e 450 ppm (nível típico de ambientes urbanos ou internos)</p>
        <p><strong>Alta:</strong> acima de 450 ppm (pode indicar ventilação insuficiente ou acúmulo de emissões)</p>
      </div>
    </div>
  );
};

// Report Component
const ReportPanel = () => {
  return (
    <div className="report-container">
      <div className="report-section">
        <h3 className="report-title">Relatório:</h3>
        <p className="report-text">
          Nas últimas semanas, os dados coletados pelo sensor registraram uma{' '}
          <span className="highlight green">queda de 23%</span> na emissão de gases em
          comparação com a média das quatro semanas anteriores. Em relação ao início
          do mês, a redução foi ainda mais expressiva, chegando a{' '}
          <span className="highlight red">31%</span>, indicando uma possível melhora nas condições
          ambientais da região monitorada. Até a segunda semana do mês, os níveis de
          emissão haviam apresentado um aumento acumulado de{' '}
          <span className="highlight blue">15% em relação ao mês anterior</span>, o que havia gerado
          alerta para possíveis impactos na qualidade do ar.
        </p>
      </div>

      <div className="report-section">
        <h3 className="report-title">Previsões:</h3>
        <p className="report-text">
          Com base na tendência atual e nos dados históricos, a projeção para as
          próximas duas semanas indica uma{' '}
          <span className="highlight green">redução adicional entre 8% e 12%</span>, caso
          as condições se mantenham estáveis. Essa estimativa considera fatores como
          clima, tráfego e atividade industrial. A continuidade do monitoramento é
          essencial para confirmar essa trajetória de queda e permitir ações preventivas
          caso ocorra uma nova oscilação nos níveis de emissão.
        </p>
      </div>
    </div>
  );
};

const SensorDashboard = () => {
  const [sensorData, setSensorData] = useState([]);
  const [currentValue, setCurrentValue] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [isSensorActive, setIsSensorActive] = useState(true);

  // Simular dados do sensor
  useEffect(() => {
    const generateData = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      
      // Simula variação realística do sensor MQ7
      const baseValue = 420;
      const variation = Math.sin(Date.now() / 10000) * 30 + Math.random() * 20;
      const newValue = Math.round(baseValue + variation);
      
      setCurrentValue(newValue);
      
      setSensorData(prevData => {
        const newData = [...prevData, {
          time: timeStr,
          coletados: newValue,
          previsoes: newValue + Math.random() * 10 - 5
        }];
        
        // Mantém apenas os últimos 15 pontos
        return newData.slice(-15);
      });
    };

    generateData(); // Primeiro ponto
    const interval = setInterval(generateData, 3000); // Atualiza a cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  // Simular status de conexão
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setIsConnected(Math.random() > 0.1);
      setIsSensorActive(Math.random() > 0.05);
    }, 8000);

    return () => clearInterval(statusInterval);
  }, []);

  return (
    <div className="dashboard-container">
      <Header />

      <div className="main-content">
        <SimpleChart 
          sensorData={sensorData} 
          currentValue={currentValue} 
        />
        
        <ReportPanel />
      </div>
      
      <div className="footer">
        <button className="back-button">Voltar à plataforma</button>
      </div>
    </div>
  );
};

export default SensorDashboard;
