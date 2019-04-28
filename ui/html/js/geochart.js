'use strict';
/* eslint no-unused-vars: "off" */
/* eslint no-undef: "off" */

// Launch google GeoCharts API call and map drawing
function controller() {
	if (control === 0) {
		document.getElementById('init_div').classList.remove('hide');
		if (notCountries > 0) {
			console.log(
				'Could not count ' +
					notCountries +
					' peers as they have no country assigned'
			);
		}
		google.charts.load('current', {
			packages: ['geochart'],
			mapsApiKey: mapsApiKey
		});
		google.charts.setOnLoadCallback(drawRegionsMap);
	}
}
// Draw map
function drawRegionsMap() {
	const data = google.visualization.arrayToDataTable(response);
	const options = {
		displayMode: 'auto',
		datalessRegionColor: '#ffffff',
		backgroundColor: '#B7C9E8',
		height: 750,
		keepAspectRatio: true,
		colorAxis: { minValue: 0, colors: ['#c4fce4', '#80c15d'] },
		legend: 'none'
	};
	const chart = new google.visualization.GeoChart(
		document.getElementById('regions_div')
	);
	chart.draw(data, options);
}
