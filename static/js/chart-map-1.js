// CREATE MAIN CHART

var mainChart = document.getElementById("mainChart").getContext('2d');
    
Chart.defaults.global.defaultFontFamily = 'Helvetica';
Chart.defaults.global.defaultFontSize = 14;

var colorPalette = ['#d15e0e', '#f5751c', '#d6603a', '#2d4866', '#213651', '#17283c', '#797983']
var beerCount = [ipa, pale_ale, sour, belgian, lager, dark, other]

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
    // alert(this.data.labels[selectedIndex]);

    $("#moveable").animate({right: "25%"}, 1000)
    console.log(ipa_sub)
    console.log(Object.values(beer_styles_dictionary)) // test

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
        canvas.style = "padding-top: 20px"
        document.getElementById('parent1').appendChild(canvas);

        var secondChart = document.getElementById("secondChart").getContext('2d');
        var colorPalette = ['#d15e0e', '#f5751c', '#d6603a', '#2d4866', '#213651', '#17283c', '#797983']
        var beerCount = [ipa, pale_ale, sour, belgian, lager, dark, other]
        
        var secondChart = new Chart(secondChart, {
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