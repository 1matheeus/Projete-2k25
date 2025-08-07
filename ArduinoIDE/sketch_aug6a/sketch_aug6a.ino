const int mq2Pin = 34; // D34 = GPIO34
unsigned long ultimoEnvio = 0;
const unsigned long intervalo = 5000; // 5 segundos

void setup() {
  Serial.begin(115200);
  delay(1000);
}

void loop() {
  unsigned long agora = millis();
  
  if (agora - ultimoEnvio >= intervalo) {
    int valorGas = analogRead(mq2Pin);
    Serial.println(valorGas); // Envia só o valor
    ultimoEnvio = agora;
  }
}
