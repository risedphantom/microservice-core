class Utils {
  static hrtimeToMs(hr) {
    return Math.ceil(hr[0] * 1e3 + hr[1] / 1e6);
  }
}


module.exports = Utils;
