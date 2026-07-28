// AS7341 driver for CHIRIMEN
// Based from https://github.com/adafruit/Adafruit_AS7341
// Programmed by Rion Kawashima

const AS7341_WHOAMI = 0x92;
const AS7341_CHIP_ID = 0x09;
const AS7341_ENABLE = 0x80;
const AS7341_ATIME = 0x81;
const AS7341_ASTEP_L = 0xCA;
const AS7341_ASTEP_H = 0xCB;
const AS7341_CFG1 = 0xAA;  // ゲイン設定
const AS7341_GAIN_256X = 9;

class AS7341 {
  constructor(i2cPort, slaveAddress) {
    this.i2cPort = i2cPort;
    this.i2cSlave = null;
    this.slaveAddress = slaveAddress;
  }
  async init() {
    try {
      this.i2cSlave = await this.i2cPort.open(this.slaveAddress);

      // ① ID確認：正しいチップと会話できているかチェック
      const id = await this.i2cSlave.read8(AS7341_WHOAMI);
      if ((id >> 2) !== AS7341_CHIP_ID) {
        throw new Error("AS7341 not found. id=0x" + id.toString(16));
      }

      // ② 電源ON：ENABLEレジスタのbit0(PON)を立てる
      let enable = await this.i2cSlave.read8(AS7341_ENABLE);
      enable |= 0x01;
      await this.i2cSlave.write8(AS7341_ENABLE, enable);
      await this.wait(10);

      // ③ 測定条件のデフォルト設定
      await this.setATIME(100);
      await this.setASTEP(999);
      await this.setGain(AS7341_GAIN_256X);
    } catch (e) {
      console.error("AS7341.init() error : " + e);
      return null;
    }
    return this;
  }
  async wait(ms) {
    return new Promise((resolve) => { setTimeout(() => { resolve(); }, ms); });
  }
  async setATIME(value) {
    await this.i2cSlave.write8(AS7341_ATIME, value);
  }
  async setASTEP(value) {
    await this.i2cSlave.write8(AS7341_ASTEP_L, value & 0xFF);
    await this.i2cSlave.write8(AS7341_ASTEP_H, (value >> 8) & 0xFF);
  }
  async setGain(value) {
    await this.i2cSlave.write8(AS7341_CFG1, value);
  }
}
export default AS7341;