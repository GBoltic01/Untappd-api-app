var mainChart = document.getElementById("mainChart").getContext('2d');
    
Chart.defaults.global.defaultFontFamily = 'Helvetica';
Chart.defaults.global.defaultFontSize = 14;

var colorPalette = ['#d15e0e', '#f5751c', '#d6603a', '#2d4866', '#213651', '#17283c', '#797983']
var beerCount = [ipa, pale_ale, sour, belgian, lager, dark, other]

var beerChart = new Chart(mainChart, {
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
        responsive: false,
        title: {
            display: true,
            text: 'Beer styles',
            fontSize: 20
        },
        animation: {
            animateScale: false
        }
    }
});

var mymap = L.map('mapid').setView([latitude, longitude], 12);

L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
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
