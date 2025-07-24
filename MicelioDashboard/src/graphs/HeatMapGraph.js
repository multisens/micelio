import { Field, ValueField, Mark, Data, Encoding, Transform, Autosize, Resolve, Layer } from "./BaseGraphComponents.js";

export class HeatMapGraph {
    static get requirements() {
        return {
            inputs: {
                activities: true,
                agents: false,
                entities: false,
                image: true
            },
            parameters: {
                circleBins: { type: "number", default: 20, label: "Quantidade de bins (horizontal/vertical)" }
            }
        };
    }
    constructor(
        width,
        height,
        autosizeType,
        autosizeContains,
        imageUrl,
        imageWidth,
        imageHeight,
        imageX,
        imageY,
        imageUrlField,
        activityData,
        positionXField,
        positionYField,
        colorField,
        tooltipFields,
        filterSelection,
        xScaleShared,
        yScaleShared
    ) {
        this.width = width;
        this.height = height;
        this.autosize = new Autosize(autosizeType, autosizeContains);

        const layer1 = new Layer(
            new Data([{ [imageUrlField]: imageUrl }]),
            new Mark("image", imageWidth, imageHeight),
            new Encoding(
                new ValueField(imageX),
                new ValueField(imageY),
                null,
                null,
                null,
                new Field(imageUrlField)
            )
        );

        const layer2 = new Layer(
            new Data(activityData),
            new Mark("rect", null, null, null, true),
            new Encoding(
                new Field(
                    positionXField.field,
                    positionXField.type,
                    positionXField.aggregate,
                    positionXField.scale,
                    positionXField.axis,
                    positionXField.bin,
                    positionXField.sort,
                    positionXField.title,
                    positionXField.legend
                ),
                new Field(
                    positionYField.field,
                    positionYField.type,
                    positionYField.aggregate,
                    positionYField.scale,
                    positionYField.axis,
                    positionYField.bin,
                    positionYField.sort,
                    positionYField.title,
                    positionYField.legend
                ),
                null,
                colorField, // <-- usa diretamente o objeto corretamente instanciado
                tooltipFields
            ),
            this.transform = filterSelection,
            "Heat Map"
        );

        this.layer = [layer1, layer2];
        this.resolve = new Resolve(xScaleShared, yScaleShared);
    }
}
