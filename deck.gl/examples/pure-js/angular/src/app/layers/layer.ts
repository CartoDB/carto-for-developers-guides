// Base class of a deck layer
import { ILayer } from "./ilayer";

export class Layer implements ILayer{

  // Should be static
  id: string;

  constructor() {
  }

  getLayer () {
    // Implement in child
    return {}
  }

  show () {
    return { visible: true }
  }

  hide () {
    return { visible: false }
  }

}
