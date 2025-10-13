const cache = {};

export default class Symbol {
  constructor(name = Symbol.random()) {
    this.name = name;

    if (cache[name]) {
      this.img = cache[name].cloneNode();
    } else {
      this.img = new Image();
      this.img.src = Symbol.config.images.path ? `${Symbol.config.images.path}/${name}.svg` : require(`../assets/symbols/${name}.svg`);

      cache[name] = this.img;
    }
  }

  static preload() {
    Symbol.symbols.forEach((symbol) => new Symbol(symbol));
  }

  static get symbols() {
    return [
      "minty",
      "musk",
      "saylor",
      "trump",
      "pepe",
      "chad",
      "bogdanoff",
      "wojak",
      "trezor",
    ];
  }

  // Config object for weighted random selection
  static config = null;

  // Set the config for weighted random selection
  static setConfig(config) {
    this.config = config;
  }

  // Get a random symbol, using weights if config is available
  static random() {
    // If we have a config with weights, use weighted random
    if (this.config) {
      return this.config.getWeightedRandomSymbol();
    }

    // Otherwise fall back to uniform random selection
    return this.symbols[Math.floor(Math.random() * this.symbols.length)];
  }
}
