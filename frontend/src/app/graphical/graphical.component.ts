import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../services/data.service';
import { Operation, operationList, OperationIndex } from '../services/Operation';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpService } from '../services/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-graphical',
  templateUrl: './graphical.component.html',
  styleUrls: ['./graphical.component.scss']
})
export class GraphicalComponent implements OnInit {
  public depth = {
    "q_depth": 0,
    "q_gate_times": 0,
    "q_two_qubit": 0,
    "r_depth": 0,
    "r_gate_times": 0,
    "r_two_qubit": 0
  };

  public operationList: Operation[] = operationList;;
  public counts = [];

  // chart attributes
  public chartType: string = 'bar';
  public chartDatasets: Array<any> = [];

  public chartLabels: Array<any> = [];
  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];
  public chartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  constructor(public data: DataService, private http: HttpService, private _elementRef : ElementRef, private snackbar: MatSnackBar) {
  }

  ngOnInit(): void {

  }

  drop(event: CdkDragDrop<OperationIndex[]>) {
    if (event.previousContainer === event.container) {
      if ((event.container.id === "gateList") || event.previousIndex == event.currentIndex) {
        return;
      }
      let qubitIndex: number = parseInt(event.container.id);
      this.data.moveOperation(qubitIndex, event.previousIndex, event.currentIndex);

      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  async simulate() {
    this.showInformation()
    let object = {
      "circuit": this.data.getCircuit("internal")
    }
    let counts: string = await this.http.callBackend(object, "simulate")
    let countObject = JSON.parse(counts)
    // countObject = this.appendCounts(countObject)
    if (countObject) {
      this.counts.push(countObject);
      let chartData = [];
      let chartLabels = [];
      for (let key in countObject) {
        let value = countObject[key];

        if (!(key in this.chartLabels)) {
          chartLabels.push(key);
        }
        chartData.push(value)

      }
      this.chartDatasets = [{
        data: chartData,
        label: "Counts"
      }];
      this.chartLabels = chartLabels;

      // this.bottomDiv.nativeElement.scrollIntoView({ block: 'end',  behavior: 'smooth' });
    }
  }  

  showInformation() {
    this.snackbar.open("Request sent to backend. Results will be available shortly.");
  }

  async analyse() {
    this.showInformation();
    let object = {
      "circuit": this.data.getCircuit("internal")
    }
    let counts: string = await this.http.callBackend(object, "depth")
    let depthObject = JSON.parse(counts)
    if (depthObject) {
      console.log(this.depth)
      this.depth = depthObject;
      console.log(this.depth)
    }
  }

  tabClick(event: MatTabChangeEvent) {
    let index = event.index;
    if (index == 1) {
      this.simulate()
    } else if (index == 2) {
      this.analyse();
    }
  }
}
