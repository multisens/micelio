// PopulationGraph.js - com uso de classes base reutilizáveis
import { Field, Mark, Data, Encoding, Transform } from "./BaseGraphComponents.js";

export class PopulationGraph {
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
        width
    ) {
        this.title = title;
        this.mark = new Mark(markType, null, null, interpolate, clip);
        this.data = new Data(dataValues, true);
        this.encoding = new Encoding(xField, yField, null, colorField);
        this.transform = filterSelection;
        this.width = width;
    }
}
