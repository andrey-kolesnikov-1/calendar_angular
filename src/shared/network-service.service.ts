import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkServiceService {

  stream$: Subject<any> = new Subject();

  constructor(private http: HttpClient) { }

 // заполняем массив месяцами с отмечанными выходными днями
  // выборка годов +- 5 лет от текущей даты
  async parseWeekend() {
    const mapWeekend = new Map(); // список выходных дней
    const gistYear = 1;
    const tempData = {
      year: new Date().getFullYear() - gistYear,
      month: new Date().getMonth() + 1
    };

    for (let i = 1; i <= 24 * gistYear; i++) {
      let selectDate = new Date(tempData.year, tempData.month, 0);
      await this.weekend(selectDate).then((data) => {
        data.forEach((day, index) => {
          let fullDay = selectDate.getFullYear() * 365 + (selectDate.getMonth() + 1) * 31 + index;
          day == 1 ? mapWeekend.set(fullDay, day) : null
        })
      });
      tempData.month += 1;
      this.stream$.next((100 * i) / (24 * gistYear));
    }
    return mapWeekend;
  }

  async weekend(date: Date) {
    const arr = [];
    for (let i = 1; i <= date.getDate(); i++) {
      let url = `https://isdayoff.ru/${date.getFullYear()}${this.converterDateToStr(date.getMonth() + 1)}${this.converterDateToStr(i)}?cc=ua`;
      await this.statusDay(url).then((data) => {
        arr[i] = data;
      });
    }
    return arr;
  }

  statusDay(url) {
    return new Promise((resolve) => {
      this.http.get(url).subscribe(data => resolve(data))
    });
  }

  converterDateToStr(date) {
    return ('' + date).length < 2 ? '0' + date : '' + date;
  }

}
