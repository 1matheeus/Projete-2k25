# 📁 Estrutura do Projeto - Dashboard Sensor MQ7

## 📂 Organização dos Arquivos

```
src/
├── components/           # Componentes React reutilizáveis
│   ├── Header.js        # Cabeçalho com logo e status
│   ├── SensorChart.js   # Gráfico do sensor
│   └── ReportPanel.js   # Painel de relatórios
│
├── config/              # Configurações do sistema
│   └── config.js        # Configurações centralizadas
│
├── hooks/               # Custom hooks React
│   └── useSerialConnection.js  # Hook para conexão serial
│
├── utils/               # Funções utilitárias
│   └── utils.js         # Helpers e formatadores
│
├── App.css              # Estilos globais da aplicação
├── App.js               # Componente principal
├── SensorDashboard.css  # Estilos específicos do dashboard
├── SensorDashboard.js   # Componente principal do dashboard
└── index.js             # Ponto de entrada da aplicação
```

## 🧩 Componentes

### 📊 **SensorDashboard.js**
- Componente principal que orquestra todo o dashboard
- Gerencia o estado dos dados do sensor
- Importa e utiliza os sub-componentes

### 🎯 **Header.js**
- Logo da aplicação (AERIS)
- Indicadores de status (sensor ativo, conexão internet)
- Design responsivo

### 📈 **SensorChart.js**
- Gráfico de linha em tempo real
- Exibe dados coletados e previsões
- Legenda com níveis de referência
- Valor atual destacado

### 📝 **ReportPanel.js**
- Relatório textual das análises
- Previsões e tendências
- Highlights coloridos para dados importantes

## 🎨 Estilos CSS

### **App.css**
```css
/* Estilos globais, reset, scrollbar personalizada */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI'...; }
```

### **SensorDashboard.css**
```css
/* Estilos específicos do dashboard */
.dashboard-container { /* Layout principal */ }
.header { /* Cabeçalho */ }
.chart-container { /* Container do gráfico */ }
.report-container { /* Container do relatório */ }
/* + responsividade e animações */
```

## ⚙️ Configurações

### **config.js**
```javascript
export const DASHBOARD_CONFIG = {
  SENSOR: {
    UPDATE_INTERVAL: 2000,  // 2 segundos
    MAX_DATA_POINTS: 20,    // Máx pontos no gráfico
    // ...
  },
  CHART: { /* configurações do gráfico */ },
  LEVELS: { /* níveis de referência */ }
};
```

## 🔧 Utilitários

### **utils.js**
```javascript
// Funções auxiliares
formatSensorValue(value)     // "420 ppm"
getSensorLevel(value)        // { level: 'MEDIUM', color: '#FF9800' }
generateSensorData()         // Simula dados
calculateStats(data)         // Estatísticas
exportToCSV(data, filename)  // Exporta dados
```

## 🔌 Hooks Personalizados

### **useSerialConnection.js**
```javascript
const {
  isConnected,
  sensorData,
  currentValue,
  connect,
  disconnect
} = useSerialConnection();
```

## 📱 Responsividade

### **Breakpoints:**
- **Desktop**: `> 1024px` - Layout 2 colunas
- **Tablet**: `768px - 1024px` - Layout 1 coluna
- **Mobile**: `< 768px` - Elementos empilhados

### **Grid Layout:**
```css
.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;  /* Desktop */
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;     /* Mobile */
  }
}
```

## 🎯 Vantagens da Separação

### ✅ **Manutenibilidade**
- Cada componente tem responsabilidade única
- Fácil localização de bugs
- Alterações isoladas

### ✅ **Reutilização**
- Componentes podem ser usados em outras telas
- CSS separado evita conflitos
- Configurações centralizadas

### ✅ **Performance**
- Carregamento modular
- Re-renderização otimizada
- Bundle splitting automático

### ✅ **Desenvolvimento**
- Trabalho em equipe facilitado
- Testes unitários específicos
- Hot reload mais eficiente

## 🚀 Como Personalizar

### **Mudar cores:**
Edite `SensorDashboard.css`:
```css
.dashboard-container {
  background: linear-gradient(135deg, #SUA_COR 0%, #OUTRA_COR 100%);
}
```

### **Alterar intervalos:**
Edite `config.js`:
```javascript
SENSOR: {
  UPDATE_INTERVAL: 5000, // 5 segundos
}
```

### **Adicionar componente:**
1. Crie arquivo em `components/`
2. Importe no `SensorDashboard.js`
3. Use no JSX

---

**Estrutura modular = Código limpo e escalável** 🏗️
