import { requestI2CAccess } from "chirimen";
import AS7341 from "./as7341.js";

const I2CADDR_AS7341 = 0x39;

const i2cAccess = await requestI2CAccess();
const i2cPort = i2cAccess.ports.get(1);
const as7341 = new AS7341(i2cPort, I2CADDR_AS7341);

await as7341.init();

setInterval(async () => {
  let data = await as7341.read();
  console.log(data);
}, 1000);