export default class Deps {
  static #handlers = new Map();

  static add(type, instance) {
    return this.#handlers.set(type, instance).get(type);
  }

  static get(type) {
    return this.#handlers.get(type) ?? this.add(type, new type());
  }
}
