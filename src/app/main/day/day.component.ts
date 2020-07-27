import { Component, OnInit, Input } from '@angular/core';
import { DataServiceService } from '../../../shared/data-service.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
  @Input() dataDay: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
