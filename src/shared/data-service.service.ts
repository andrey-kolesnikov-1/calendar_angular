import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NetworkServiceService } from './network-service.service';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  days = [];
  currentDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  };
  selectedDay: number;
  mapNotes: Map<number, string> = new Map();
  mapWeekends: Map<any, any> = new Map();
  stream$: Subject<any> = new Subject<any>();
  modal$: Subject<any> = new Subject<any>();

  constructor(private network: NetworkServiceService) {
    if (localStorage.getItem('map_note')) {
      this.mapNotes = new Map(JSON.parse(localStorage.getItem('map_note')));
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getWeekendDays() {
    if (!localStorage.getItem('map_weekend')) {
      this.network.parseWeekend().then(data => {
        this.mapWeekends = data;
        this.saveMap('map_weekend', this.mapWeekends);
        this.changeData('');
      });
    } else {
      this.mapWeekends = new Map(JSON.parse(localStorage.getItem('map_weekend')));
      this.changeData('');
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  changeData(change: string) {
    if (change === '+') {
      this.currentDate.month += 1;
    } else if (change === '-') {
      this.currentDate.month -= 1;
    }
    this.getSelectedDaysAndMonth();
  }

  getSelectedDaysAndMonth() {
    const date = new Date(this.currentDate.year, this.currentDate.month, 0);
    const month = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    this.stream$.next({
      days: date.getDate(),
      month: `${month[date.getMonth()]} ${date.getFullYear()}`
    });
  }

  getStatusDay(day) {
    let style = {
      dayDiv: true,
      currentDay: false,
      currentNoteDay: false,
      noteDay: false,
      weekendDay: false
    }
    let keyDay = this.getFullDay(day);
    let thisDate = new Date();
    if (this.mapWeekends.has(keyDay)) { style.weekendDay = true; }

    if (this.currentDate.year === thisDate.getFullYear() && this.currentDate.month === thisDate.getMonth() + 1) {
      if (thisDate.getDate() === day) {
        style.currentDay = true;
        if (this.mapNotes.has(keyDay)) style.currentNoteDay = true;
      }
    }
    if (this.mapNotes.has(keyDay)) style.noteDay = true;
    return style;
  }

  modalWindow(action: string) {
    action === 'open' ? this.modal$.next(true) : this.modal$.next(false);
  }

  newNote(text: string) {
    this.mapNotes.set(this.getFullDay(this.selectedDay), text);
    this.saveMap('map_note', this.mapNotes);
    this.changeData('');
  }

  getFullDay(day: number): number {
    return (this.currentDate.year * 365) + (this.currentDate.month * 31) + day;
  }

  saveMap(key: string, map: Map<number, string>) { // Преобразовываем Map в массив, а затем в строку для хранения в локалбном хранилище
    localStorage.setItem(key, JSON.stringify([...map])); // сохраняем в памяти
  }

  getToolTip(day: number) {
    const toolTip = {
      status: false,
      text: ''
    }
    if (this.mapNotes.get(this.getFullDay(day))) {
      toolTip.status = true;
      toolTip.text = this.mapNotes.get(this.getFullDay(day));
    }
    return toolTip
  }

}
