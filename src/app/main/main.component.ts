import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../../shared/data-service.service';
import { NetworkServiceService } from '../../shared/network-service.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  infoDate: string = '';
  array: any = [];
  modalWindow = false;
  progress = 0;
  progressBar = false;

  constructor(private data: DataServiceService, private network: NetworkServiceService) { }

  ngOnInit(): void {
    this.data.stream$.subscribe(value => {
      this.array = []
      for (let i = 0; i < value.days; i++) {
        // то место, где необходимо узнавать у сервиса всё о текущем дне
        this.array[i] = {
          numberDay: i,
          style: this.data.getStatusDay(i + 1),
          toolTip: this.data.getToolTip(i + 1)
        };
      }
      this.infoDate = value.month;
    })
    this.data.changeData('');
    this.data.getWeekendDays();
    this.data.modal$.subscribe(value => this.modalWindow = value);
    this.network.stream$.subscribe(data => {
      this.progress = data
      this.progressBar = data < 100;
    });
  }

  clickDay(event): void {
    let el = event.target.closest('.dayDiv');
    if (el !== null) {
      this.data.selectedDay = +el.querySelector('label').innerHTML;
      this.data.modalWindow('open');
    }
  }

  prevMonth() {
    this.data.changeData('-');
  }

  nextMonth() {
    this.data.changeData('+');
  }

}
