﻿

import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, Chart } from 'chart.js';
import { Observable } from 'rxjs';
import { Color, Label } from 'ng2-charts';
import * as _ from 'lodash';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({
    selector: 'app-graph-plot',
    templateUrl: './graph-plot.component.html',
    styleUrls: ['./graph-plot.component.css']
})

export class GraphPlotComponent {

    user: User;
    labels = [];
    amount;
    decision;
    chart;
    ChartDataSets;
    lineChartData;
    lineChartLabels = [];
    lineChartOptions;
    ChartOptions;
    lineChartColors;
    lineChartLegend = false;
    lineChartType;
    lineChartPlugins;
    resultJSON;
    acceptAmountValues = [];
    rejectAmountValues = [];
    errorAmountValues = [];
    acceptDateValues = [];
    rejectDateValues = [];
    errorDateValues = [];
    acceptData = [];
    rejectData = [];
    errorData = [];
    acceptDate = [];
    acceptLabel = [];
    startDate;
    endDate;
    sortNumbersofArray;
    ngbDropdown


    EducationLists: string[] = ["PostGraduate", "Graduate", "XIIth", "SSC", "BelowSSC"];
    selectedEducationList: string = "Graduate";

    ChangeEducationList(newEducationList: string) {
        this.selectedEducationList = newEducationList;
        console.log(this.selectedEducationList)
        this.makeFetchCall()

    }

    ngOnInit() {
        this.makeFetchCall()
    }

    public daterange: any = {};

    public options: any = {
        locale: { format: 'YYYY-MM-DD' },
        alwaysShowCalendars: false,

    };

    public selectedDate(value: any, datepicker?: any) {
        datepicker.start = value.start;
        datepicker.end = value.end;

        this.daterange.start = value.start;
        this.daterange.end = value.end;
        this.daterange.label = value.label;
        this.startDate = new Date(this.daterange.start._d)
        this.startDate = this.startDate.getFullYear() + '-' + ('0' + (this.startDate.getMonth() + 1)) + '-' + + this.startDate.getDate();
        this.endDate = new Date(this.daterange.end._d)
        this.endDate = this.endDate.getFullYear() + '-' + ('0' + (this.endDate.getMonth() + 1)) + '-' + + this.endDate.getDate()
        console.log(this.startDate);
        console.log(this.endDate);

    }


    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }


    getObservableFromFetch(url) {
        return Observable.create(observer => {
            fetch(url)
                .then(res => {
                    return res.json();
                })
                .then(body => {
                    observer.next(body);
                    observer.complete();
                })
                .catch(err => observer.error(err));
        })
    };



    async makeFetchCall() {
        let observable = this.getObservableFromFetch('https://spreadsheets.google.com/feeds/list/15yIwfhRTXZ6WT4wwEYnTvdrSwkvdXG12Y3hW2IEuo68/1/public/full?alt=json')
        observable.subscribe(v => {
            console.log(v);

            this.resultJSON = v.feed.entry.map(function (e) {
                return e.content.$t.replace(/ /g, '').split(",").reduce((obj, item) => {
                    let [key, value] = item.split(":");
                    obj[key] = value;
                    return obj;
                }, {});
            })

            this.labels = [];
            this.acceptAmountValues = [];
            this.rejectAmountValues = [];
            this.errorAmountValues = [];

            this.resultJSON = this.resultJSON
                .filter(elem => elem.education == this.selectedEducationList)
                .map(elem => {
                    elem.date = elem.date.substring(0, elem.date.length - 1)
                    elem.amount = parseInt(elem.amount)
                    return elem
                })
                .reduce((acc, curr) => {
                    for (const elem of acc) {
                        if (elem.date == curr.date && elem.education == curr.education && elem.decision == curr.decision) {
                            elem.amount += curr.amount;
                            return acc;
                        }
                    }
                    acc.push(curr);
                    return acc;
                }, [])
                .sort(function (dateValue1, dateValue2) {
                    var finalDates1 = dateValue1.date.split('/').reverse().join(),
                        finalDates2 = dateValue2.date.split('/').reverse().join();
                    return finalDates1 < finalDates2 ? -1 : (finalDates1 > finalDates2 ? 1 : 0);
                });

            this.resultJSON.forEach(element => {
                if (this.labels[this.labels.length - 1] != element.date) {
                    this.labels.push(element.date);
                    this.acceptAmountValues.push(0);
                    this.rejectAmountValues.push(0);
                    this.errorAmountValues.push(0);
                }
                if (element.decision == 'ACCEPT') {
                    this.acceptAmountValues[this.acceptAmountValues.length - 1] = element.amount;
                }
                if (element.decision == 'REJECT') {
                    this.rejectAmountValues[this.rejectAmountValues.length - 1] = element.amount;
                }
                if (element.decision == 'ERR') {
                    this.errorAmountValues[this.errorAmountValues.length - 1] = element.amount;
                }
            });
            this.chartGenerator()
        });
    }

    chartGenerator() {
        this.lineChartData = this.ChartDataSets = [
            { data: this.acceptAmountValues, label: 'Accept' },
            { data: this.rejectAmountValues, label: 'Reject' },
            { data: this.errorAmountValues, label: 'Error' }

        ];

        this.lineChartLabels = this.labels

        this.lineChartOptions = this.ChartOptions = {
            responsive: true,
            scales: {
                xAxes: [{
                    display: true
                }],
                yAxes: [{
                    display: true
                }],
            }
        };

        this.lineChartColors = [

            {
                backgroundColor: 'rgba(77,83,96,0.2)',
                borderColor: 'rgba(77,83,96,1)',
            },
            {
                backgroundColor: 'rgba(255,0,0,0.3)',
                borderColor: 'red',
            }
        ];

        this.lineChartLegend = true;
        this.lineChartType = 'line';
        this.lineChartPlugins = [];


    }
    chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
        console.log(event, active);
    }

    chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
        console.log(event, active);
    }


}





