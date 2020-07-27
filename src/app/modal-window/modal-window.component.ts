import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataServiceService } from '../../shared/data-service.service';

@Component({
  selector: 'app-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.css']
})
export class ModalWindowComponent implements OnInit {

  text: string;
  fullDay: number;
  errorNote: boolean = false
  @ViewChild('m_ta', { static: true }) textAreaRef: ElementRef

  constructor(private data: DataServiceService) { }

  ngOnInit(): void {
    this.fullDay = this.data.getFullDay(this.data.selectedDay);
    if (this.data.mapNotes.has(this.fullDay)) {
      this.text = this.data.mapNotes.get(this.fullDay);
    }
    this.textAreaRef.nativeElement.focus();
  }

  delete() {
    if (this.data.mapNotes.has(this.fullDay)) {
      this.data.mapNotes.delete(this.fullDay);
      this.data.saveMap('map_note', this.data.mapNotes);
      this.data.changeData('');
    }
    this.data.modalWindow('close');
  }

  cansel() {
    this.data.modalWindow('close');
  }

  apply() {
    if (this.text === undefined || this.text.trim() === '') {
      this.text = '';
      this.errorNote = true;
      setTimeout(() => {
        this.errorNote = false;
        this.textAreaRef.nativeElement.focus();
      }, 2000);
      return;
    }
    this.data.newNote(this.text);
    this.data.modalWindow('close');
  }
}
