import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Travel } from 'src/app/models/travel.model';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
	selector: 'app-travels',
	templateUrl: 'travels.component.html',
	styleUrls: ['travels.component.sass'],
})
export class TravelsComponent implements OnInit, OnDestroy, AfterViewInit {
	isCollapsed = true;
	visitedColor = am4core.color('#E14ECA');
	bucketColor = am4core.color('#E1C94E');
	travels: Travel[] = [
		{
			id: 'IT',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'FR',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'ES',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'DE',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'PL',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'GB',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'GR',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'HU',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'HR',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'RS',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'SI',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'CH',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'AD',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'AT',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'QA',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'EG',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'ID',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		{
			id: 'SG',
			fill: this.visitedColor,
			description: '',
			dateStart: new Date(),
			dateEnd: new Date(),
		},
		// here I insert my bucket list
		{
			id: 'IS',
			fill: this.bucketColor,
			description: '',
			dateStart: new Date(),
			dateEnd: null,
		},
	];
	last_update = new Date();
	total_visited = this.travels.filter(travel => travel.dateEnd).length;
	percentage_visited = Math.round((10000 * this.total_visited) / 256) / 100;
	constructor() {}

	ngOnInit() {
		var body = document.getElementsByTagName('body')[0];
		body.classList.add('profile-page');
	}

	ngAfterViewInit() {
		this.renderMap();
	}

	renderMap() {
		/* Chart code */
		// Themes begin
		am4core.useTheme(am4themes_animated);
		// Themes end

		/* Create map instance */
		let chart = am4core.create('chartdiv', am4maps.MapChart);

		/* Set map definition */
		chart.geodata = am4geodata_worldLow;

		/* Set projection */
		chart.projection = new am4maps.projections.Miller();

		/* Create map polygon series */
		let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

		/* Make map load polygon (like country names) data from GeoJSON */
		polygonSeries.useGeodata = true;

		/* Configure series */
		let polygonTemplate = polygonSeries.mapPolygons.template;
		polygonTemplate.applyOnClones = true;
		polygonTemplate.togglable = true;
		polygonTemplate.tooltipText = '{name}';
		polygonTemplate.nonScalingStroke = true;
		polygonTemplate.strokeOpacity = 0.5;
		polygonTemplate.fill = chart.colors.getIndex(0);
		let lastSelected;
		polygonTemplate.events.on('hit', function (ev) {
			if (lastSelected) {
				// This line serves multiple purposes:
				// 1. Clicking a country twice actually de-activates, the line below
				//    de-activates it in advance, so the toggle then re-activates, making it
				//    appear as if it was never de-activated to begin with.
				// 2. Previously activated countries should be de-activated.
				lastSelected.isActive = false;
			}
			ev.target.series.chart.zoomToMapObject(ev.target);
			if (lastSelected !== ev.target) {
				lastSelected = ev.target;
			}
		});

		/* Create selected and hover states and set alternative fill color */
		let ss = polygonTemplate.states.create('active');
		ss.properties.fill = chart.colors.getIndex(2);

		let hs = polygonTemplate.states.create('hover');
		hs.properties.fill = chart.colors.getIndex(4);

		// Hide Antarctica
		polygonSeries.exclude = ['AQ'];

		// Zoom control
		chart.zoomControl = new am4maps.ZoomControl();

		let homeButton = new am4core.Button();
		homeButton.events.on('hit', function () {
			chart.goHome();
		});

		homeButton.icon = new am4core.Sprite();
		homeButton.padding(7, 5, 7, 5);
		homeButton.width = 30;
		homeButton.icon.path =
			'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
		homeButton.marginBottom = 10;
		homeButton.parent = chart.zoomControl;
		homeButton.insertBefore(chart.zoomControl.plusButton);

		// Here I insert my travels
		polygonSeries.data = this.travels;
		polygonTemplate.propertyFields.fill = 'fill';
		polygonTemplate.fill = am4core.color('#1d8cf8');
		// polygonTemplate.tooltipText = '{name}: {dateStart} - {dateEnd}';

		chart.legend = new am4maps.Legend();
		chart.legend.position = 'right';
		chart.legend.align = 'right';
	}

	ngOnDestroy() {
		var body = document.getElementsByTagName('body')[0];
		body.classList.remove('profile-page');
	}
}
