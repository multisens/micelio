// BaseGraphComponents.js - Componentes reutilizáveis para gráficos Vega-Lite estilo .NET

export class Field {
    constructor(field, type, aggregate = null, scale = null, axis = null, bin = null, sort = null, title = null, legend = null, orient = null) {
        this.field = field;
        this.type = type;
        if (aggregate) this.aggregate = aggregate;
        if (scale) this.scale = scale;
        if (axis) this.axis = { ...axis };
        if (bin) this.bin = bin;
        if (sort) this.sort = sort;
        if (title !== null) this.title = title;
        if (legend !== null) this.legend = legend;

        if (orient) {
            if (!this.axis) this.axis = {};
            this.axis.orient = orient;
        }
    }
}

export class ValueField {
    constructor(value) {
        this.value = value;
    }
}

export class Mark {
    constructor(type, width = null, height = null, interpolate = null, clip = null) {
        this.type = type;
        if (width !== null) this.width = width;
        if (height !== null) this.height = height;
        if (interpolate !== null) this.interpolate = interpolate;
        if (clip !== null) this.clip = clip;
    }
}

export class Data {
    constructor(values) {
        this.values = values;
    }
}

export class Encoding {
    constructor(x = null, y = null, size = null, color = null, tooltip = null, url = null) {
        if (x) this.x = x;
        if (y) this.y = y;
        if (size) this.size = size;
        if (color) this.color = color;
        if (tooltip) this.tooltip = tooltip;
        if (url) this.url = url;
    }
}

export class Transform {
    constructor(selectionNames = []) {
        this.selectionNames = selectionNames;
    }
    toJSON() {
        return this.selectionNames.map(name => ({
            filter: { selection: name }
        }));
    }

    toObject() {
        return this.selectionNames.map(name => ({
            filter: { selection: name }
        }));

    }
}

export class Scale {
    constructor(scheme = null, domainMin = null, range = null) {
        if (scheme !== null) this.scheme = scheme;
        if (domainMin !== null) this.domainMin = domainMin;
        if (range !== null) this.range = range;
    }
}

export class Axis {
    constructor(grid = true, gridColor = "#FFFFFF") {
        this.grid = grid;
        this.gridColor = gridColor;
    }
}

export class Bin {
    constructor(maxbins) {
        this.maxbins = maxbins;
    }
}

export class Legend {
    constructor(orient, padding = null) {
        this.orient = orient;
        if (padding !== null) this.padding = padding;
    }
}

export class Autosize {
    constructor(type, contains) {
        this.type = type;
        this.contains = contains;
    }
}

export class Resolve {
    constructor(xScale, yScale) {
        this.scale = { x: xScale, y: yScale };
    }
}

export class NamedSelection {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }

    toObject() {
        return {
            [this.name]: {
                type: this.type
            }
        };
    }
}

export class IntervalSelection extends NamedSelection {
    constructor(name, encodings) {
        super(name, "interval");
        this.encodings = encodings;
    }

    toObject() {
        return {
            [this.name]: {
                type: this.type,
                encodings: this.encodings
            }
        };
    }
}

export class MultiSelection extends NamedSelection {
    constructor(name, fields) {
        super(name, "multi");
        this.fields = fields;
    }

    toObject() {
        return {
            [this.name]: {
                type: this.type,
                fields: this.fields
            }
        };
    }
}


export class Title {
    constructor(text) {
        this.text = text;
    }
}

export class Layer {
    constructor(data, mark, encoding, transform = null, title = null) {
        this.data = data;
        this.mark = mark;
        this.encoding = encoding;

        if (transform) {
            this.transform = typeof transform.toObject === "function"
                ? transform.toObject()
                : transform;
        }

        if (title) this.title = title;
    }
}
