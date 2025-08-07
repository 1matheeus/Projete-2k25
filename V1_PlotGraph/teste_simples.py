import serial.tools.list_ports

print("=== Teste Simples ===")

# Lista portas disponíveis
ports = serial.tools.list_ports.comports()
print("Portas encontradas:")
for port in ports:
    print(f"  {port.device} - {port.description}")

print("\nTeste concluído!")
