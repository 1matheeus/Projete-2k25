// SerialConnection.js - Para conectar com dados reais do ESP32
import { useState, useEffect, useCallback } from 'react';

export const useSerialConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [sensorData, setSensorData] = useState([]);
  const [currentValue, setCurrentValue] = useState(0);
  const [port, setPort] = useState(null);

  // Verificar se o navegador suporta Web Serial API
  const isSerialSupported = 'serial' in navigator;

  // Conectar à porta serial
  const connect = useCallback(async () => {
    if (!isSerialSupported) {
      alert('Seu navegador não suporta Web Serial API. Use Chrome/Edge versão 89+');
      return;
    }

    try {
      // Solicitar porta serial
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 115200 });
      
      setPort(selectedPort);
      setIsConnected(true);
      
      console.log('Conectado à porta serial');
      
      // Iniciar leitura dos dados
      readSerialData(selectedPort);
      
    } catch (error) {
      console.error('Erro ao conectar:', error);
      alert('Erro ao conectar com o dispositivo');
    }
  }, [isSerialSupported]);

  // Ler dados da porta serial
  const readSerialData = async (serialPort) => {
    const reader = serialPort.readable.getReader();
    
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        // Converter bytes para string
        const text = new TextDecoder().decode(value);
        const lines = text.split('\n');
        
        lines.forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine) {
            try {
              const sensorValue = parseFloat(trimmedLine);
              if (!isNaN(sensorValue)) {
                updateSensorData(sensorValue);
              }
            } catch (error) {
              console.error('Erro ao processar dados:', error);
            }
          }
        });
      }
    } catch (error) {
      console.error('Erro na leitura serial:', error);
    } finally {
      reader.releaseLock();
    }
  };

  // Atualizar dados do sensor
  const updateSensorData = (value) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    
    setCurrentValue(value);
    
    setSensorData(prevData => {
      const newData = [...prevData, {
        time: timeStr,
        coletados: value,
        previsoes: value + (Math.random() * 10 - 5) // Simulação de previsão
      }];
      
      // Manter apenas os últimos 50 pontos
      return newData.slice(-50);
    });
  };

  // Desconectar
  const disconnect = useCallback(async () => {
    if (port) {
      try {
        await port.close();
        setPort(null);
        setIsConnected(false);
        console.log('Desconectado da porta serial');
      } catch (error) {
        console.error('Erro ao desconectar:', error);
      }
    }
  }, [port]);

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      if (port && isConnected) {
        disconnect();
      }
    };
  }, [port, isConnected, disconnect]);

  return {
    isSerialSupported,
    isConnected,
    sensorData,
    currentValue,
    connect,
    disconnect
  };
};

export default useSerialConnection;
