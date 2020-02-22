import { Component, OnInit, Input } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  titlePrefix = 'Raul';
  titleSufix = 'Schnelzer';
  @Input() fontColor: string;

  constructor() {
  }

  private switchTitle(): (value: number) => void {
    return () => {
      if (this.titlePrefix === 'Raul') {
        this.titlePrefix = 'Reliable';
        this.titleSufix = 'Software';
      } else {
        this.titlePrefix = 'Raul';
        this.titleSufix = 'Schnelzer';
      }
    };
  }

  ngOnInit(): void {
    interval(30000).subscribe(this.switchTitle());
  }

}
