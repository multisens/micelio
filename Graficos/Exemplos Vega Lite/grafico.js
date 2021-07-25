var vlSpec = {
  data: { 
    url: "https://vega.github.io/vega-lite/data/population.json"
  },
  transform: [
    {filter: "datum.year == 2000"},
    {calculate: "datum.sex == 2 ? 'Female' : 'Male'", as: "gender"}
  ],
  width: {step: 20},
  mark: "bar",
  encoding: {
    column: {
      field: "age",
      type: "ordinal",
      spacing: 10
    },
    y: {
      aggregate: "sum",
      field: "people",
      title: "population",
      axis: {
        grid: false
      }
    },
    x: {
      field: "gender",
      axis: {
        title: ""
      }
    },
    color: {
      field: "gender",
      scale: {
        range: ["#777666", "#E7D24F"]
      }
    }
  },
  config: {
    view: {
      stroke: "transparent"
    },
    axis: {
      domainWidth: 1
    }
  }
};

// Embed the visualization in the container with id `vis`
vegaEmbed('#vis', vlSpec);