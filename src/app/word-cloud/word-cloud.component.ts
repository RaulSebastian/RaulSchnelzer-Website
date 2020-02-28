import { Component, ViewChild, AfterViewInit, Input } from '@angular/core';
import { WordCloudSetup } from '../services/wordCloudSetup';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-word-cloud',
  template: `<canvas [id]="id" [class]="class" #wordContainer></canvas>`,
  styleUrls: ['./word-cloud.component.css']
})

export class WordCloudComponent implements AfterViewInit {
  id: Guid;
  @Input() class: string;
  @ViewChild('wordContainer', { static: false }) wordContainer: HTMLCanvasElement;

  constructor() {
    this.id = Guid.create();
  }

  private words = [
    ['Agile', 8],
    ['Scrum', 7],
    ['Kanban', 5],
    ['Extreme Programming', 4],
    ['Pair Programming', 5],
    ['RAD', 5],
    ['TDD', 6],
    ['BDD', 7],
    ['Iterative Development', 3],
    ['Requirements Engeneering', 4]
  ];

  ngAfterViewInit(): void {
    WordCloudSetup.provide(this.wordContainer, this.words);
  }
}
