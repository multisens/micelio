import { Field, Mark, Data, Encoding, Selection } from "./BaseGraphComponents.js";

export class TimelineGraph {
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
    titleText,
    markType,
    dataValues,
    xField,
    yField,
    colorField,
    selections,
    height,
    width
  ) {
    this.title = titleText;
    this.mark = new Mark(markType);
    this.data = new Data(dataValues);
    this.encoding = new Encoding(xField, yField, null, colorField);
    this.selection = selections;
    this.height = height;
    this.width = width;
  }
}
