import serial
import serial.tools.list_ports
import time

print("=== Teste de Leitura Serial ===")

# Lista portas disponíveis
ports = serial.tools.list_ports.comports()
print("Portas encontradas:")
for port in ports:
    print(f"  {port.device} - {port.description}")

# Tenta conectar à primeira porta disponível (ou especifica uma)
if ports:
    # Prefere porta COM3 se disponível
    port_to_use = None
    for port in ports:
        if "COM3" in port.device or "USB-SERIAL" in port.description:
            port_to_use = port.device
            break
    
    if not port_to_use:
        port_to_use = ports[0].device
    
    print(f"\nTentando conectar à {port_to_use}...")
    
    try:
        ser = serial.Serial(port_to_use, 115200, timeout=1)
        print(f"✅ Conectado à {port_to_use}")
        
        print("\n📡 Aguardando dados por 10 segundos...")
        start_time = time.time()
        
        while time.time() - start_time < 10:
            if ser.in_waiting > 0:
                data = ser.readline().decode('utf-8').strip()
                print(f"📥 Recebido: '{data}'")
            else:
                print("⏳ Nenhum dado disponível...")
                time.sleep(1)
        
        ser.close()
        print("\n✅ Teste concluído!")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
else:
    print("❌ Nenhuma porta serial encontrada!")
