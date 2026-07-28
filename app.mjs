import { requestI2CAccess, SHT30 } from "chirimen";

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

const i2cAccess = await requestI2CAccess();
const port = i2cAccess.ports.get(1);
const sht30 = new SHT30(port, 0x44);
await sht30.init();

while (true) {
  const { humidity, temperature } = await sht30.readData();
  console.log("Humidity: " + humidity.toFixed(2) + "%,Temperature: " + temperature.toFixed(2) + "℃");
  await sleep(500);
}
