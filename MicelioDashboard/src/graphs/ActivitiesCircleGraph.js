import { Data, Field, Mark, Encoding, Transform } from "./BaseGraphComponents.js";

export class ActivitiesCircleGraph {
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
