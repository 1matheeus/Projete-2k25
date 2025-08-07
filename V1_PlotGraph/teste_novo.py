import serial
import serial.tools.list_ports
import matplotlib.pyplot as plt
import time
import datetime
import statistics

# Configurações do matplotlib para melhor responsividade
plt.rcParams['figure.dpi'] = 100  # DPI padrão
plt.rcParams['savefig.dpi'] = 150  # DPI para salvar figuras
plt.rcParams['figure.autolayout'] = True  # Layout automático

# ========== CONFIGURAÇÕES PERSONALIZÁVEIS ==========
LARGURA_JANELA = 10  # Largura da janela em polegadas (padrão: 10)
ALTURA_JANELA = 6    # Altura da janela em polegadas (padrão: 6)
MAXIMIZAR_JANELA = False  # True para maximizar, False para tamanho normal
# ===================================================

def encontrar_porta_esp32():
    """Encontra automaticamente a porta do ESP32/Arduino"""
    ports = serial.tools.list_ports.comports()
    for port in ports:
        if "USB-SERIAL" in port.description or "CH340" in port.description:
            return port.device
    return None

def ler_multiplas_amostras(ser, num_amostras=5):
    """Lê múltiplas amostras e retorna a média para maior estabilidade"""
    amostras = []
    tentativas = 0
    max_tentativas = num_amostras * 3  # Máximo de tentativas
    
    print(f"📊 Coletando {num_amostras} amostras para calcular média...")
    
    while len(amostras) < num_amostras and tentativas < max_tentativas:
        if ser.in_waiting > 0:
            try:
                data = ser.readline().decode('utf-8').strip()
                if data:
                    valor = float(data)
                    amostras.append(valor)
                    print(f"  📈 Amostra {len(amostras)}: {valor:.2f}")
            except ValueError:
                pass  # Ignora valores inválidos
        else:
            time.sleep(0.1)
        tentativas += 1
    
    if amostras:
        # Calcula estatísticas
        media = statistics.mean(amostras)
        if len(amostras) > 1:
            desvio = statistics.stdev(amostras)
            
            # Remove outliers (valores que estão muito fora da média)
            amostras_filtradas = [x for x in amostras if abs(x - media) <= 2 * desvio]
            if amostras_filtradas:
                media_filtrada = statistics.mean(amostras_filtradas)
                print(f"  ✅ Média original: {media:.2f} | Média filtrada: {media_filtrada:.2f}")
                return media_filtrada
        
        print(f"  ✅ Média das amostras: {media:.2f}")
        return media
    else:
        print("  ⚠️ Nenhuma amostra válida coletada")
        return None

def aplicar_filtro_media_movel(valores, janela=3):
    """Aplica filtro de média móvel para suavizar o gráfico"""
    if len(valores) < janela:
        return valores[-1] if valores else 0
    
    return statistics.mean(valores[-janela:])

def main():
    print("🔍 Procurando ESP32/Arduino...")
    print(f"📏 Configuração da janela: {LARGURA_JANELA}x{ALTURA_JANELA} polegadas")
    print(f"🖥️  Maximizar janela: {'Sim' if MAXIMIZAR_JANELA else 'Não'}")
    print("💡 Para alterar o tamanho, modifique as variáveis no início do código\n")
    
    port = encontrar_porta_esp32()
    if not port:
        print("❌ ESP32/Arduino não encontrado!")
        print("📋 Portas disponíveis:")
        ports = serial.tools.list_ports.comports()
        for p in ports:
            print(f"  {p.device} - {p.description}")
        return
    
    print(f"✅ ESP32/Arduino encontrado na porta: {port}")
    
    try:
        # Conecta à porta serial
        ser = serial.Serial(port, 115200, timeout=1)
        print(f"🔗 Conectado à {port}")
        
        # Configura o gráfico
        plt.ion()  # Modo interativo
        
        # Define o tamanho da janela usando as configurações personalizáveis
        fig, ax = plt.subplots(figsize=(LARGURA_JANELA, ALTURA_JANELA))
        
        # Configura a janela
        mngr = fig.canvas.manager
        if hasattr(mngr, 'window'):
            try:
                # Para diferentes backends do matplotlib
                if MAXIMIZAR_JANELA:
                    if hasattr(mngr.window, 'state'):  # TkAgg
                        mngr.window.state('zoomed')  # Maximiza no Windows
                    elif hasattr(mngr.window, 'showMaximized'):  # Qt
                        mngr.window.showMaximized()
                else:
                    if hasattr(mngr.window, 'state'):  # TkAgg
                        mngr.window.state('normal')  # Janela normal
                    elif hasattr(mngr.window, 'showNormal'):  # Qt
                        mngr.window.showNormal()
                        
                # Posiciona a janela no centro da tela (se possível)
                if hasattr(mngr.window, 'wm_geometry'):  # TkAgg
                    mngr.window.wm_geometry("+100+50")  # x=100, y=50 pixels do canto
                        
            except Exception as e:
                print(f"⚠️ Aviso: Não foi possível configurar a janela: {e}")
        
        ax.set_title('Sensor em Tempo Real - Leitura Estabilizada (Atualização a cada 2 segundos)')
        ax.set_xlabel('Amostra')
        ax.set_ylabel('Valor do Sensor')
        ax.grid(True, alpha=0.3)
        
        # Ajusta o layout para melhor aproveitamento do espaço
        plt.tight_layout()
        
        x_data = []
        y_data_bruto = []  # Dados brutos
        y_data_filtrado = []  # Dados filtrados
        
        line_bruto, = ax.plot([], [], 'r-', linewidth=1, alpha=0.5, label='Dados Brutos')
        line_filtrado, = ax.plot([], [], 'b-', linewidth=3, label='Dados Filtrados (Média)')
        ax.legend()
        
        plt.show(block=False)
        
        print("\n🚀 Iniciando leitura dos dados...")
        print("📊 Pressione Ctrl+C para parar")
        print("🔧 Aplicando filtros para estabilizar as leituras\n")
        
        valores_historico = []  # Para média móvel
        i = 0
        
        while True:
            # Lê múltiplas amostras e calcula a média
            valor_medio = ler_multiplas_amostras(ser, num_amostras=5)
            
            if valor_medio is not None:
                # Armazena o valor bruto
                y_data_bruto.append(valor_medio)
                valores_historico.append(valor_medio)
                
                # Aplica filtro de média móvel
                valor_filtrado = aplicar_filtro_media_movel(valores_historico, janela=3)
                y_data_filtrado.append(valor_filtrado)
                
                x_data.append(i)
                
                # Atualiza ambas as linhas do gráfico
                line_bruto.set_data(x_data, y_data_bruto)
                line_filtrado.set_data(x_data, y_data_filtrado)
                
                # Ajusta os eixos
                ax.relim()
                ax.autoscale_view()
                
                # Mostra no terminal
                timestamp = datetime.datetime.now().strftime("%H:%M:%S")
                print(f"[{timestamp}] Amostra {i+1:03d}: Bruto={valor_medio:.2f} | Filtrado={valor_filtrado:.2f}")
                
                # Atualiza o gráfico
                plt.draw()
                plt.pause(0.1)
                
                i += 1
                
                # Espera 2 segundos
                print("⏳ Aguardando próxima leitura em 2 segundos...\n")
                time.sleep(2)
                
    except KeyboardInterrupt:
        print("\n⏹️ Programa interrompido pelo usuário")
    except Exception as e:
        print(f"❌ Erro: {e}")
    finally:
        if 'ser' in locals():
            ser.close()
        plt.ioff()
        print("🔚 Programa finalizado")

if __name__ == "__main__":
    main()
