import {
  Component,
  VERSION,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';

import { timer, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  direction = 'Angular ' + VERSION.major;
  position = { x: 0, y: 0 };
  increment = { x: 0, y: 0 };
  vel = 7;
  sub: Subscription | null = null;
  @ViewChild('movil', { static: false }) movil!: ElementRef;
  @ViewChild('wrapper', { static: false }) wrapper!: ElementRef;
  swiperDone({
    left,
    right,
    up,
    down,
  }: {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
  }) {
    this.direction = '';
    if (left) this.direction = 'left';
    if (right) this.direction = 'right';
    if (up) this.direction += ' up';
    if (down) this.direction += ' down';
    if (!this.direction) this.direction = 'no move';

    this.increment = {
      x: left ? -1 : right ? 1 : 0,
      y: up ? -1 : down ? 1 : 0,
    };
    const max = {
      x:
        this.wrapper.nativeElement.getBoundingClientRect().width -
        this.movil.nativeElement.getBoundingClientRect().width,
      y:
        this.wrapper.nativeElement.getBoundingClientRect().height -
        this.movil.nativeElement.getBoundingClientRect().height,
    };
    this.sub && this.sub.unsubscribe();
    this.sub = timer(0, 50)
      .pipe(take(50))
      .subscribe((_) => {
        const x = this.position.x + this.increment.x * this.vel;
        const y = this.position.y + this.increment.y * this.vel;
        if (x < 0 || x > max.x) this.increment.x = -this.increment.x;
        if (y < 0 || y > max.y) this.increment.y = -this.increment.y;

        this.position.x += this.increment.x * this.vel;
        this.position.y += this.increment.y * this.vel;
      });
  }
  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
