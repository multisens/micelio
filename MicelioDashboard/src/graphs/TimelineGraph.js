import { Field, Mark, Data, Encoding, Selection } from "./BaseGraphComponents.js";

export class TimelineGraph {
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
    this.selection = selections; // já formatado
    this.height = height;
    this.width = width;
  }
}
