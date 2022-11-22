import {
  Directive,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
  OnInit,
  ElementRef,
} from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { switchMap, map} from 'rxjs';
@Directive({
  selector: '[swiper]',
})
export class SwiperDirective implements OnInit, OnDestroy {
  posIni: { x: number; y: number };
  swiper: number = 70;
  scrollBarHeight: number = 0;
  subscription: Subscription;
  avoidScroll:Subscription=fromEvent(this.elementRef.nativeElement,'touchmove').subscribe((e:any)=>{
    e.preventDefault();e.stopPropagation();return false;
  });

  @Input('swiper') set _swipper(value: any) {
    if (value) this.swiper = +value;
  }
  @Output() swiperDone: EventEmitter<any> = new EventEmitter<any>();
  constructor(private elementRef: ElementRef) {}
  ngOnInit() {
    this.subscription = merge(
      fromEvent(this.elementRef.nativeElement, 'mousedown'),
      fromEvent(this.elementRef.nativeElement, 'touchstart').pipe(
        map((event: any) => event.changedTouches[0]),
      )
    )
      .pipe(
        switchMap((touchIni: any) => {
          return merge(
            fromEvent(this.elementRef.nativeElement, 'mouseup'),
            fromEvent(this.elementRef.nativeElement, 'touchend').pipe(
              map((event: any) => event.changedTouches[0])
            )
          ).pipe(
            map((touchEnd: any) => {
              const incX = touchEnd.pageX - touchIni.pageX;
              const incY = touchEnd.pageY - touchIni.pageY;
              return {
                right: incX > this.swiper,
                left: incX < -this.swiper,
                down: incY > this.swiper,
                up: incY < -this.swiper,
              };
            })
          );
        })
      )
      .subscribe((res: any) => {
        this.swiperDone.emit(res);
      });
  }
  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
    this.avoidScroll && this.avoidScroll.unsubscribe();
  }
}
