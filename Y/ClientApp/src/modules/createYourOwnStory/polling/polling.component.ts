import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  AfterViewChecked,
  ApplicationRef,
  Inject,
  OnDestroy
} from '@angular/core';
import { Poll, PollingAnswer } from '../createYourOwnStory.interface';
import { AppService } from 'src/services/app.service';
import { CreateYourOwnStoryService } from '../createYourOwnStory.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-polling',
  templateUrl: './polling.component.html',
  styleUrls: ['./polling.component.scss']
})
export class PollingComponent implements AfterViewChecked,OnDestroy {
  // tslint:disable-next-line: variable-name
  private _poll: Poll;
  public tickExec = false;
  public notMobileTick = false;
  public mobileTick = false;
  public refreshIntervalId;
  // tslint:disable-next-line: variable-name
  public _statevalue: number;
  @Output()
  selectAnswerEvent = new EventEmitter();

  @Output()
  backButtonClickEvent = new EventEmitter();
  @Input()
  set poll(poll) {
    if (poll) {
      this._poll = poll;
      this.refreshIntervalId = setInterval(() => {
        this.appService.changeInValues.next('change');
      }, 50);
    }
  }
  @Input()
  set pollState(state: number){
    this._statevalue = state;
   }
  get pollState() {
    return this._statevalue;
  }
  @Input()
  public IsBlur = false;
  @Input()
  public progressValue;

  // tslint:disable-next-line: adjacent-overload-signatures
  get poll() {
    return this._poll;
  }
  @Input() public PreviousPoll: Poll;
  @Input() public NextPoll: Poll;

  constructor(
    private appService: AppService,
    private appRef: ApplicationRef,
    private createYourOwnStoryService: CreateYourOwnStoryService,
    @Inject(DOCUMENT) document: any
  ) {
    this.createYourOwnStoryService.storyStage.next(1);
    this.appService.footerShow.next(false);
    this.appService.changeInValues.subscribe(value => {
      if (value === 'change') {
        if (this.poll) {
          const btn = document.getElementById('polling_btn');
          if (btn && btn.offsetWidth > 0) {
            if (this.appService.notMobile && !this.mobileTick) {
              btn.style.margin = 'auto -' + btn.offsetWidth / 2 + 'px';
              this.mobileTick = true;
              this.appRef.tick();
            } else if (!this.notMobileTick) {
              btn.style.margin = '-19px auto';
              this.notMobileTick = true;
              this.appRef.tick();
            }
            this.tickExec = true;
          }
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.appService.footerShow.next(true);
  }

  ngAfterViewChecked() {
    if (this.tickExec) {
      clearInterval(this.refreshIntervalId);
      this.mobileTick = false;
      this.notMobileTick = false;
    }
  }

  selectAnswer(pollAnswer: PollingAnswer) {
    this.tickExec = false;
    this.mobileTick = false;
    this.notMobileTick = false;
    this.selectAnswerEvent.emit(pollAnswer);
  }
  BackButtonClicked() {
    this.backButtonClickEvent.emit(this.poll);
  }
}
