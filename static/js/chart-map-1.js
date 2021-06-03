const colorPalette = ['#d15e0e', '#f5751c', '#d6603a', '#2d4866', '#213651', '#17283c', '#797983']
var beerDict = JSON.parse(beer_dictionary)
var beerCount = [
                 beerDict.ipa_count, 
                 beerDict.pale_ale_count, 
                 beerDict.sour_count, 
                 beerDict.belgian_count, 
                 beerDict.lager_count, 
                 beerDict.dark_count, 
                 beerDict.other_all
                ]

// CREATE MAIN CHART

var mainChart
function createMainChart() {
    if ($("#back-arrow")) {
        $("#back-arrow").remove();
    };
    var canvas = document.getElementById("mainChart").getContext('2d');
    mainChart = new Chart(canvas, {
        type:'doughnut',
        data: {
            labels: ['IPA', 'Pale Ale', 'Sour', 'Belgian', 'Lager', 'Stout/Porter', 'Other'],
            datasets: [{
                data: beerCount,
                backgroundColor: colorPalette,
                borderWidth: 2,
                borderColor: 'white',
                hoverBorderWidth: 6,
                hoverBorderColor: 'white'
            }]
        },
        options: {
            cutoutPercentage: 85,
            legend: false,
            legendCallback: function(mainChart) {
                var ul = document.createElement('ul');
                var itemColor =  mainChart.data.datasets[0].backgroundColor; 
                var dataValue = mainChart.data.datasets[0].data; 
                mainChart.data.labels.forEach(function(label, index){
                    ul.innerHTML += `
                    <li>
                        <div style='background-color: ${itemColor[index]}'></div><p class="legend-item">${label}</p>
                    </li>`
                });
                return ul.outerHTML;
            },
            responsive: true,
            onClick: secondChart
        }
    });
    legend.innerHTML = mainChart.generateLegend(); 
}
createMainChart();


// FUNCTION TO GENERATE SECOND CHART ON CLICK 

function secondChart(e){
    var activePoints = mainChart.getElementsAtEvent(e);
    var selectedIndex = activePoints[0]._index;
    var clickEvent = (this.data.labels[selectedIndex]);
        
    var jsonTest = JSON.parse(beer_styles_dictionary);

    mainChart.destroy();

    var span = document.createElement('span')
    span.className = "back-arrow"
    span.innerHTML = '<i id="back-arrow" class="fas fa-arrow-left"></i>'
    document.getElementById("parent").appendChild(span)

    span.addEventListener("click", function() {
        secondChart.destroy();
        createMainChart();
    });


    // FUNCTION TO DISPLAY APPROPRIATE SUBSTYLE CHART ON CLICK

    var values 
    var keys

    function substyleData(){
        switch(clickEvent) {
            case "IPA": {
                [values, keys] = [Object.values(jsonTest.ipa_substyles), Object.keys(jsonTest.ipa_substyles)];
                break;
            };
            case "Pale Ale": {
                [values, keys] = [Object.values(jsonTest.pale_ale_substyles), Object.keys(jsonTest.pale_ale_substyles)];
                break;
            };
            case "Sour": {
                [values, keys] = [Object.values(jsonTest.sour_substyles), Object.keys(jsonTest.sour_substyles)];
                break;
            };
            case "Belgian": {
                [values, keys] = [Object.values(jsonTest.belgian_substyles), Object.keys(jsonTest.belgian_substyles)];
                break;
            };
            case "Lager": {
                [values, keys] = [Object.values(jsonTest.lager_substyles), Object.keys(jsonTest.lager_substyles)];
                break;
            };
            case "Stout/Porter": {
                [values, keys] = [Object.values(jsonTest.dark_substyles), Object.keys(jsonTest.dark_substyles)];
                break;
            };
            case "Other": {
                [values, keys] = [Object.values(jsonTest.other_substyles), Object.keys(jsonTest.other_substyles)];
                break;
            };
        };
    };
    substyleData() 

    var secondCanvas = document.getElementById("mainChart").getContext('2d');

    const colorScheme = [
    "#d15e0e", "#A0AEC1", "#213651", "#f5751c", "#FF9900", 
    "#627894", "#2d4866", "#FA6121", "#d6603a", "#FFB739", 
    "#DBE8F9", "#466289", "#17283c"
    ]
    
    var secondChart = new Chart(secondCanvas, {
        type:'doughnut',
        data: {
            labels: keys,
            datasets: [{
                label: 'Beer style',
                data: values,
                backgroundColor: colorScheme,
                borderWidth: 2,
                borderColor: 'white',
                hoverBorderWidth: 6,
                hoverBorderColor: 'white'
            }]
        },
        options: {
            legend: false,
            cutoutPercentage: 85,
            responsive: true,
            legendCallback: function(secondChart) {
                var ul = document.createElement('ul');
                var itemColor =  secondChart.data.datasets[0].backgroundColor; 
                secondChart.data.labels.forEach(function(label, index){
                    console.log(label)
                    var label = label.replace("IPA - ", "")
                    ul.innerHTML += `
                    <li>
                        <div style='background-color: ${itemColor[index]}'></div><p class="legend-item">${label}</p>
                    </li>`
                });
                return ul.outerHTML;
            }
        }
    });
    legend.innerHTML = secondChart.generateLegend(); 
};

// LOAD BREWERY LOGO

//var img = document.createElement('img')
//img.src = beer_image
//document.getElementById('image').appendChild(img)

//  MAP

var mymap = L.map('mapid').setView([latitude, longitude], 12);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(mymap)

L.marker([latitude, longitude], {
    icon: L.AwesomeMarkers.icon({
        icon: 'beer',
        prefix: 'fa', 
        markerColor: 'red'
    })
}).addTo(mymap)