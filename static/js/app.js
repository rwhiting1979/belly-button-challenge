function initializeDashboard() {
    var selector = d3.select("#selDataset");
  
    // Use D3 to fetch the data
    d3.json("samples.json").then(data => {
      data.names.forEach(sample => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample to build the initial plots
      const firstSample = data.names[0];
      buildCharts(firstSample, data);
      buildMetadata(firstSample, data);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    d3.json("samples.json").then(data => {
      buildCharts(newSample, data);
      buildMetadata(newSample, data);
    });
  }
  
  function buildMetadata(sample, data) {
    var metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");
  
    var metadata = data.metadata.filter(obj => obj.id == sample)[0];
    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  }
  
  function buildCharts(sample, data) {
    var samples = data.samples.filter(obj => obj.id == sample)[0];
  
    // Build a Bar Chart
    var barData = [{
      y: samples.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x: samples.sample_values.slice(0, 10).reverse(),
      text: samples.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];
  
    var barLayout = {
      margin: { t: 30, l: 150 }
    };
  
    Plotly.newPlot("bar", barData, barLayout);

    // Build Bubble Chart
  var bubbleData = [{
    x: samples.otu_ids,
    y: samples.sample_values,
    text: samples.otu_labels,
    mode: 'markers',
    marker: {
      size: samples.sample_values,
      color: samples.otu_ids,
      colorscale: 'Earth'
    }
  }];

  var bubbleLayout = {
    showlegend: false,
    height: 600,
    width: 1200
  };

  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
 }
  
  // Initialize the dashboard
  initializeDashboard();
