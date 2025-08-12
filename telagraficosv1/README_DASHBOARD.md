# Dashboard do Sensor MQ7 - AERIS

Este é um dashboard em React para monitoramento em tempo real do sensor MQ7 (detecção de propano).

## 🚀 Como executar

### 1. Instalar dependências
```bash
npm install recharts styled-components lucide-react
```

### 2. Executar o projeto
```bash
npm start
```

## 📱 Funcionalidades

- ✅ **Gráfico em tempo real** - Visualização dos dados do sensor
- ✅ **Status de conexão** - Indicadores visuais de conectividade
- ✅ **Relatórios automáticos** - Análise das tendências
- ✅ **Design responsivo** - Funciona em mobile e desktop
- ✅ **Dados simulados** - Para demonstração
- ✅ **Conexão serial real** - Para ESP32 (via Web Serial API)

## 🔌 Conectar com ESP32 Real

### Opção 1: Web Serial API (Recomendada)
1. Use Chrome/Edge versão 89+
2. Descomente as linhas no `SensorDashboard.js` para usar `useSerialConnection`
3. Conecte o ESP32 via USB
4. Clique em "Conectar" no dashboard

### Opção 2: WebSocket/HTTP
- Configure o ESP32 para enviar dados via WiFi
- Modifique o código para fazer requisições HTTP

## 🎨 Personalização

### Cores e Estilo
- Modifique as cores em `SensorDashboard.js` nos styled-components
- Ajuste o gradiente de fundo alterando as cores em `background: linear-gradient(...)`

### Dados do Sensor
- Para usar dados reais, substitua a simulação em `useEffect` por chamadas para sua API
- Configure a URL do seu backend/ESP32

### Intervalos de Atualização
- Modifique o valor em `setInterval(generateData, 2000)` para mudar a frequência

## 📊 Estrutura dos Dados

```javascript
{
  time: "14:30:25",      // Horário da leitura
  coletados: 420,        // Valor do sensor em ppm
  previsoes: 425         // Valor previsto
}
```

## 🛠️ Tecnologias Utilizadas

- **React** - Framework principal
- **Recharts** - Biblioteca de gráficos
- **Styled Components** - Estilização
- **Lucide React** - Ícones
- **Web Serial API** - Comunicação com ESP32

## 📱 Layout Responsivo

O dashboard se adapta automaticamente a diferentes tamanhos de tela:
- **Desktop**: Layout em 2 colunas (gráfico + relatório)
- **Mobile**: Layout em 1 coluna (empilhado)

## 🔧 Configurações do Sensor

### Níveis de Referência (PPM):
- **Verde (Baixo)**: até 350 ppm
- **Amarelo (Médio)**: 351-450 ppm  
- **Vermelho (Alto)**: acima de 450 ppm

## 🚨 Troubleshooting

### "Seu navegador não suporta Web Serial API"
- Use Chrome ou Edge versão 89+
- Habilite flags experimentais se necessário

### Dados não aparecem
- Verifique se o ESP32 está enviando dados seriais
- Confirme a taxa de baud (115200)
- Veja o console do navegador para erros

### Gráfico não carrega
- Verifique se as dependências foram instaladas
- Execute `npm install` novamente

## 📝 Próximas Funcionalidades

- [ ] Exportar dados para CSV
- [ ] Alertas por email/SMS
- [ ] Histórico de dados persistente
- [ ] Configurações personalizáveis
- [ ] Múltiplos sensores
- [ ] Dashboard administrativo

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido para o projeto ETE 2025** 🎓
