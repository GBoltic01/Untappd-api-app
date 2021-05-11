// CREATE MAIN CHART

var mainChart = document.getElementById("mainChart").getContext('2d');
    
Chart.defaults.global.defaultFontFamily = 'Helvetica';
Chart.defaults.global.defaultFontSize = 14;

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

var mainChart = new Chart(mainChart, {
    type:'doughnut',
    data: {
        labels: ['IPA', 'Pale Ale', 'Sour', 'Belgian', 'Lager', 'Stout/Porter', 'Other'],
        datasets: [{
            label: 'Beer style',
            data: beerCount,
            backgroundColor: colorPalette,
            borderWidth: 2,
            borderColor: 'white',
            hoverBorderWidth: 6,
            hoverBorderColor: 'white'
        }]
    },
    options: {
        legend: {
            display: true
        },
        responsive: true,
        title: {
            display: true,
            text: 'Beer styles',
            fontSize: 20
        },
        onClick: secondChart
    }
});

// FUNCTION TO GENERATE SECOND CHART ON CLICK 

function secondChart(e){
    var activePoints = mainChart.getElementsAtEvent(e);
    var selectedIndex = activePoints[0]._index;
    var clickEvent = (this.data.labels[selectedIndex])
    // if (this is already moved) {skip animation} else do the rest 

    if ($("#moveable").hasClass("col-md-6 offset-3")) {
        $("#moveable").animate({right: "25%"}, 1000);
    }; 
    
        
    var jsonTest = JSON.parse(beer_styles_dictionary)

    //  Set timeot to wait the animation to finish. When the animation is done, 
    //  create new div and canvas where the second chart will sit.

    setTimeout(function() {
        var moveable = document.getElementById('moveable')
        moveable.className = "col-md-6"
        moveable.style = ""
    
        var div = document.createElement('div');
        div.id = 'parent1'
        div.className = "col-md-6"
        document.getElementById('parent').appendChild(div)
    
        var canvas = document.createElement('canvas');
        canvas.id = "secondChart";
        canvas.style = "padding-top: 20px";
        document.getElementById('parent1').appendChild(canvas);

        // Create second chart 
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

        var secondChart = document.getElementById("secondChart").getContext('2d');

        const colorScheme = [
          "#d15e0e", "#A0AEC1", "#213651", "#f5751c", "#FF9900", 
          "#627894", "#2d4866", "#FA6121", "#d6603a", "#FFB739", 
          "#DBE8F9", "#466289", "#17283c"
        ]
        
        var secondChart = new Chart(secondChart, {
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
                legend: {
                    display: true
                },
                responsive: true,
                title: {
                    display: true,
                    text: 'Substyles',
                    fontSize: 20
                },
            }
        });
    
    }, 1300)
}


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