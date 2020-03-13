import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fluid-gradient-div',
  templateUrl: './fluid-gradient-div.component.html',
  styleUrls: ['./fluid-gradient-div.component.css']
})
export class FluidGradientDivComponent implements OnInit {

  @Input() style: string;

  constructor() { }

  ngOnInit(): void {
  }

}
