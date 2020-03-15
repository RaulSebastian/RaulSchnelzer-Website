import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css']
})
export class SectionComponent implements OnInit, AfterViewInit {

  @Input() sectionId: string;
  @Input() sectionTitle: string;
  @Input() link: string;
  @Input() lazyLoading: boolean;
  @Input() contentOverflow = 'hidden';

  @ViewChild('content', { static: false }) content: ElementRef;

  loaded = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (this.lazyLoading) {
      const sectionObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.loadContent(entry.target);
            sectionObserver.unobserve(entry.target);
          }
        }
      });
      sectionObserver.observe(this.content.nativeElement);
    } else {
      this.loadContent(this.content.nativeElement);
    }
  }


  private loadContent(element: Element) {
    this.loaded = true;
    element.classList.remove('hidden');
    element.classList.add('appear');
  }
}
