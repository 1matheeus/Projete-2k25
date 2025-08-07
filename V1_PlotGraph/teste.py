import serial
import serial.tools.list_ports
import matplotlib.pyplot as plt
from matplotlib.widgets import Button
import time
import datetime

def listar_portas_disponiveis():
    """Lista todas as portas COM disponíveis"""
    print("=== Portas COM Disponíveis ===")
    ports = serial.tools.list_ports.comports()
    if not ports:
        print("Nenhuma porta COM encontrada!")
        return []
    
    for i, port in enumerate(ports):
        print(f"{i+1}. {port.device} - {port.description}")
    return [port.device for port in ports]

def testar_porta(port, baudrate=115200):
    """Testa se uma porta pode ser aberta"""
    print(f"\nTestando porta {port}...")
    try:
        ser = serial.Serial(port, baudrate, timeout=1)
        print(f"✅ Porta {port} aberta com sucesso!")
        ser.close()
        return True
    except serial.SerialException as e:
        print(f"❌ Erro ao abrir porta {port}: {e}")
        return False
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
        return False

class SerialPlotter:
    def __init__(self, port, baudrate=115200):
        try:
            self.ser = serial.Serial(port, baudrate)
            print(f"Conectado com sucesso à porta {port}")
        except serial.SerialException as e:
            print(f"Erro ao conectar à porta {port}: {e}")
            raise
        self.running = True
        
        self.fig, self.ax = plt.subplots()
        plt.subplots_adjust(bottom=0.2)
        
        # Configurações do gráfico
        self.ax.set_title('Leitura do Sensor em Tempo Real')
        self.ax.set_xlabel('Amostra')
        self.ax.set_ylabel('Valor do Sensor')
        self.ax.grid(True, alpha=0.3)
        
        self.x_data = []
        self.y_data = []
        self.line, = self.ax.plot([], [], 'b-', linewidth=2, label='Sensor')
        
        ax_button = plt.axes([0.8, 0.05, 0.1, 0.075])
        self.button = Button(ax_button, 'Parar')
        self.button.on_clicked(self.stop)
        
    def stop(self, event):
        print("Plotagem parada pelo botão")
        self.running = False
        
    def update_plot(self):
        i = 0
        print("\n🔄 Iniciando leitura dos dados do sensor...")
        print("📊 Valores serão atualizados a cada 5 segundos")
        print("⏹️  Use Ctrl+C ou clique no botão 'Parar' para finalizar\n")
        
        while self.running:
            try:
                # Verifica se há dados disponíveis na porta serial
                if self.ser.in_waiting > 0:
                    line = self.ser.readline().decode('utf-8').strip()
                    print(f"📥 Dados recebidos: '{line}'")  # Debug
                    
                    if line:  # Se a linha não está vazia
                        valor = float(line)
                        
                        # Adiciona dados ao gráfico
                        self.x_data.append(i)
                        self.y_data.append(valor)
                        self.line.set_data(self.x_data, self.y_data)
                        self.ax.relim()
                        self.ax.autoscale_view()
                        
                        # Mostra o valor no terminal com timestamp
                        timestamp = datetime.datetime.now().strftime("%H:%M:%S")
                        print(f"[{timestamp}] Amostra {i+1:03d}: {valor:.2f}")
                        
                        # Atualiza o gráfico
                        plt.draw()
                        plt.pause(0.1)
                        i += 1
                        
                        # Espera 5 segundos antes da próxima leitura
                        time.sleep(5.0)
                else:
                    # Se não há dados, espera um pouco e tenta novamente
                    print("⏳ Aguardando dados do sensor...")
                    plt.pause(0.5)
                    
            except ValueError as e:
                print(f"⚠️  Erro ao converter valor '{line}': {e}")
                plt.pause(0.1)
            except Exception as e:
                print(f"⚠️  Erro na leitura: {e}")
                plt.pause(0.1)
                
        self.ser.close()
        print("Fim da plotagem")
        
    def show(self):
        plt.show()

if __name__ == '__main__':
    # Primeiro, lista todas as portas disponíveis
    portas_disponiveis = listar_portas_disponiveis()
    
    if not portas_disponiveis:
        print("❌ Nenhuma porta COM encontrada. Verifique se o dispositivo está conectado.")
        exit(1)
    
    # Testa cada porta disponível
    print("\n=== Testando Portas ===")
    portas_funcionais = []
    for porta in portas_disponiveis:
        if testar_porta(porta):
            portas_funcionais.append(porta)
    
    if not portas_funcionais:
        print("\n❌ Nenhuma porta pode ser aberta. Possíveis causas:")
        print("   - Dispositivo já está sendo usado por outro programa")
        print("   - Feche o Arduino IDE, PuTTY ou outros programas seriais")
        print("   - Desconecte e reconecte o dispositivo USB")
        exit(1)
    
    # Para ESP32/Arduino, prefere portas USB-SERIAL
    port = None
    for porta in portas_funcionais:
        if "USB-SERIAL" in str(porta) or "CH340" in str(porta):
            port = porta
            break
    
    # Se não encontrar porta USB-SERIAL, usa a primeira funcional
    if not port:
        port = portas_funcionais[0]
    
    print(f"\n✅ Usando porta: {port}")
    
    try:
        plotter = SerialPlotter(port)
        
        # Mostra o gráfico primeiro
        plt.ion()  # Ativa modo interativo
        plt.show(block=False)
        
        # Depois inicia a leitura dos dados
        plotter.update_plot()
        
        # Mantém o gráfico aberto
        plt.ioff()  # Desativa modo interativo
        plt.show()
        
    except KeyboardInterrupt:
        print("\n⏹️ Programa interrompido pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro durante execução: {e}")
