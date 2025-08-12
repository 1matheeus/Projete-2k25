import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const SensorChart = ({ sensorData, currentValue }) => {
  return (
    <div className="chart-container">
      <h2 className="chart-title">
        <Activity />
        Sensor MQ7 - Dados de captação: Propano (C3H8)
      </h2>
      
      <div className="current-value">
        <Activity />
        Valor Atual: {currentValue} ppm
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sensorData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[350, 500]} />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="coletados" 
            stroke="#ff6b35" 
            strokeWidth={2}
            name="Dados Coletados"
            dot={{ fill: '#ff6b35', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="previsoes" 
            stroke="#ffa500" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Previsões"
            dot={{ fill: '#ffa500', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="legend-container">
        <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Níveis de Referência:</div>
        <div className="legend-item">
          <div className="legend-color green"></div>
          Baixa: até 350 ppm (nível pré-industrial ou muito bem ventilado)
        </div>
        <div className="legend-item">
          <div className="legend-color orange"></div>
          Média: entre 351 e 450 ppm (nível típico de ambientes urbanos ou internos)
        </div>
        <div className="legend-item">
          <div className="legend-color red"></div>
          Alta: acima de 450 ppm (pode indicar ventilação insuficiente ou acúmulo de emissões)
        </div>
      </div>
    </div>
  );
};

export default SensorChart;
