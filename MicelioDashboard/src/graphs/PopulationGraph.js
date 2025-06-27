// PopulationGraph.js - com uso de classes base reutilizáveis
import { Field, Mark, Data, Encoding, Transform } from "./BaseGraphComponents.js";

export class PopulationGraph {
  static get requirements() {
    return {
      inputs: {
        activities: true,
        agents: true,
        entities: true,
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
    markType,
    interpolate,
    clip,
    dataValues,
    xField,
    yField,
    colorField,
    filterSelection,
    height,
    width
  ) {
    this.title = title;
    this.mark = new Mark(markType, null, null, interpolate, clip);
    this.data = new Data(dataValues, true);
    this.encoding = new Encoding(xField, yField, null, colorField);
    this.transform = filterSelection;
    this.height = height;
    this.width = width;
  }
}
