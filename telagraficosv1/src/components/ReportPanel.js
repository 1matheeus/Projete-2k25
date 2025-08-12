import React from 'react';

const ReportPanel = () => {
  return (
    <div className="report-container">
      <div className="report-section">
        <h3 className="report-title">Relatório:</h3>
        <p className="report-text">
          Nas últimas semanas, os dados coletados pelo sensor registraram uma{' '}
          <span className="highlight red">queda de 23%</span> na emissão de gases em
          comparação com a média das quatro semanas anteriores. Em relação ao início
          do mês, a redução foi ainda mais expressiva, chegando a{' '}
          <span className="highlight green">31%</span>, indicando uma possível melhora nas condições
          ambientais da região monitorada. Até a segunda semana do mês, os níveis de
          emissão haviam apresentado um aumento acumulado de{' '}
          <span className="highlight orange">15% em relação ao mês anterior</span>, o que havia gerado
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

export default ReportPanel;
