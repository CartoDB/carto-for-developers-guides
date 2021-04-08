// Base class for layers
export class Layer {

  id: string;
  visible: boolean = true;

  constructor() {}

  getLayer () {
    // Implement in child
    return {}
  }

  show () {
    this.visible = true;
    return { visible: true }
  }

  hide () {
    this.visible = false;
    return { visible: false }
  }
}
