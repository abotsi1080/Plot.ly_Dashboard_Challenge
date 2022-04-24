// Creating a function for changes in the dropdown menu
function optionChanged(selectedID) {

    // Reading the json file for the data
    d3.json("samples.json").then((data) => {

        d3.select("#selDataset").html("");

        // Select the metadata array and for each item 
        // Then append the item ID and add the ID to the dropdown menu
        data.metadata.forEach(item => {

            d3.select("#selDataset").append('option').attr('value', item.id).text(item.id);
        });

        // Passing the selected value
        d3.select("#selDataset").node().value = selectedID;

        // Filtering the  Metadata for the selected ID from the dropdown menu
        const idMetadata = data.metadata.filter(item => (item.id == selectedID));

        const panelDisplay = d3.select("#sample-metadata");
        panelDisplay.html("");

        Object.entries(idMetadata[0]).forEach(item => {

            panelDisplay.append("p").text(`${item[0]}: ${item[1]}`)
        });

        //-----------------------------------//
        // GETTING STARTED ON THE BAR CHART //
        //----------------------------------//

        // Filtering the sample array data for the selected ID
        const idSample = data.samples.filter(item => parseInt(item.id) == selectedID);

        // Slicing the top 10 sample values
        var sampleValue = idSample[0].sample_values.slice(0, 10);
        sampleValue = sampleValue.reverse();
        var otuID = idSample[0].otu_ids.slice(0, 10);
        otuID = otuID.reverse();
        var otuLabels = idSample[0].otu_labels
        otuLabels = otuLabels.reverse();

        // Setting the Y axis for the bar chart
        const yAxis = otuID.map(item => 'OTU' + " " + item);

        // Defining the layout and trace object
        const trace = {
                y: yAxis,
                x: sampleValue,
                type: 'bar',
                orientation: "h",
                text: otuLabels,
                marker: {
                    color: 'rgb(184, 134, 11)',
                    line: {
                        width: 3,
                        color: 'rgb(184, 134, 11)'
                    }
                }
            },
            layout = {
                title: 'Top 10 Operational Taxonomic Units (OTU)/Individual',
                xaxis: { title: 'Number of Samples Collected' },
                yaxis: { title: 'OTU ID' }
            };

        // Plotting the bar chart using Plotly
        Plotly.newPlot('bar', [trace], layout, { responsive: true });

        //--------------------------------------//
        // GETTING STARTED ON THE BUBBLE CHART //
        //--------------------------------------//
        // Removing the Sample value and otuID from individual
        var sampleValue1 = idSample[0].sample_values;
        var otuID1 = idSample[0].otu_ids;

        // Defining the layout and trace object
        const trace1 = {
                x: otuID1,
                y: sampleValue1,
                mode: 'markers',
                marker: {
                    color: otuID1,
                    size: sampleValue1
                }
            },

            layout1 = {
                title: '<b>Bubble Chart For Each Sample</b>',
                xaxis: { title: 'OTU ID' },
                yaxis: { title: 'Number of Samples Collected' },
                showlegend: false,
                height: 800,
                width: 1800
            };

        // Plotting the bubble chart using Plotly
        Plotly.newPlot('bubble', [trace1], layout1);

        //------------------------------------------//
        // BONUS: GETTING STARTED ON THE GAUGE CHART
        //------------------------------------------//

        // Setting the variables for the Gauge Chart 
        // To plot the weekly washing frequency 
        const guageDisplay = d3.select("#gauge");
        guageDisplay.html("");
        const washFreq = idMetadata[0].wfreq;

        const guageData = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: washFreq,
            title: { text: "<b>Belly Button Washing Frequency </b><br> (Scrubs Per Week)" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 9] },
                bar: { color: "#f2e9e4" },
                steps: [
                    { range: [0, 1], color: "#F0D4C4" },
                    { range: [1, 2], color: "#D7BCAD" },
                    { range: [2, 3], color: "#B59D8F" },
                    { range: [3, 4], color: "#988071" },
                    { range: [4, 5], color: "#806758" },
                    { range: [5, 6], color: "#6E442B" },
                    { range: [6, 7], color: "#66381C" },
                    { range: [7, 8], color: "#612D0F" },
                    { range: [8, 9], color: "#522003" }

                ],
                threshold: {
                    value: washFreq
                }
            }
        }];
        const gaugeLayout = {
            width: 600,
            height: 400,
            margin: { t: 0, b: 0 },
        };

        // Plotting the guage chart using Plotly
        Plotly.newPlot('gauge', guageData, gaugeLayout);

    });
}

// Setting the initial test to start at ID 940
optionChanged(940);

// Function change when a different value from dropdown menu is selected
d3.select("#selDataset").on('change', () => {
    optionChanged(d3.event.target.value);

});