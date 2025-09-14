import { Data, Field, Mark, Encoding, Transform } from "./BaseGraphComponents.js";

export class ActivitiesCircleGraph {
  static get requirements() {
    return {
      inputs: {
        activities: true,
        agents: false,
        entities: false,
        image: false
      },
      parameters: {
        width: { type: "number", default: 800, label: "Largura do gráfico (px)" },
        height: { type: "number", default: 600, label: "Altura do gráfico (px)" }
      }
    };
  }

  constructor(
    title,
    mark,
    data,
    encoding,
    transform,
    width,
    height
  ) {
    this.title = title;
    this.mark = mark;
    this.data = data;
    this.encoding = encoding;
    this.transform = transform;
    this.width = width;
    this.height = height;
  }
}
