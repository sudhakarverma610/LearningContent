import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { AppService } from 'src/services/app.service';

@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrls: ['./sorting.component.scss'],
   animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortingComponent implements OnInit, OnDestroy {
  public Sorts = [
  ];
public selectedValue: any;

  constructor(private appService: AppService) { }
  @Input()
  selectedValueinput: any;
  @Output()
  sortSelectedValueChange = new EventEmitter();
  ngOnInit() {
    this.Sorts = [
      {
        text: 'Newest first',
        value: 1
      },
      {
        text: 'Price: highest first ',
        value: 2
      },
      {
        text: 'price: lower first',
        value: 3
      },
      {
        text: 'best sellers',
        value: 4
      },
      {
        text: 'let’s randomise that, i’m unique!',
        value: 5
      },
      {
        text: 'please choose for me',
        value: 6
      }
    ];
    if (this.selectedValueinput && this.selectedValueinput !== 0) {
      this.selectedValue = this.selectedValueinput;
    }
    this.appService.footerShow.next(false);
  }
  show() {
    this.appService.footerShow.next(true);
    this.sortSelectedValueChange.emit(this.selectedValue);
  }
  RadioButtonChangedEvent(event: any) {
    this.selectedValue = event.value;
    // this.sortSelectedValueChange.emit(event.value);
  }
  ngOnDestroy(): void {
    this.appService.footerShow.next(true);
  }

}
