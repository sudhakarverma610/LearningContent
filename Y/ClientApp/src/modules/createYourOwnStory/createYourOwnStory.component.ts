import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateYourOwnStoryService } from './createYourOwnStory.service';
import { MetaService } from '../../services/meta.service';
import { Poll, PollingAnswer } from './createYourOwnStory.interface';
import { AppService } from 'src/services/app.service';
import { AuthService } from 'src/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TellMeYBeginDialogComponent } from './tell-me-y-begin-dialog/tell-me-y-begin-dialog.component';
import { noop } from 'rxjs';

@Component({
  selector: 'app-createyourownstory',
  templateUrl: './createYourOwnStory.component.html',
  styleUrls: ['./createYourOwnStory.component.scss'],
  providers: [MetaService]
})
export class CreateYourOwnStoryComponent implements OnInit, OnDestroy {
  public storyStage = 1;
  public pollStage = 0;
  public polls: Poll[];
  public intro = true;
  public isopendialog = true;
  public showViewResult = false;
  public IsBlur = false;
  constructor(
    private createYourOwnStoryService: CreateYourOwnStoryService,
    private appService: AppService,
    private authService: AuthService,
    private metaService: MetaService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.appService.footerShow.next(true);
  }

  ngOnInit() {
    // this.appService.loader.next(true);
    this.metaService.setMeta();
    const storyData: [ { polls: Poll[]; },
                      { randomProductsList: string[]; profile: any; storyId: any; }
    ] = this.route.snapshot.data.story;
    const story = storyData[1];
    const polldata = storyData[0];
    // const story: {randomProductsList: string[], profile: any, storyId: any} = this.route.snapshot.data.story;
    let isOpenInBackMode = false;
    if (this.createYourOwnStoryService.GetResult()) {
      this.router.navigate(['tellmey', 'result']);
      isOpenInBackMode = true;
    }
    if (story.randomProductsList.length  > 0) {
      this.showViewResult = true;
    }
    this.createYourOwnStoryService.storyStage.subscribe(value => {
      if (value) {
        this.storyStage = value;
      }
    });
    this.polls = storyData[0].polls;
    this.appService.footerShow.next(false);
    if (!isOpenInBackMode) {
      (this.intro && this.storyStage === 1 && !this.showViewResult) ? this.openDialog(1) : this.openDialog(1, true);
    }
        // this.createYourOwnStoryService.pollsSubject.subscribe((value: boolean) => {
    //   if (value) {
    //     this.pollStage = 0;
    //     this.polls = this.createYourOwnStoryService.polls;
    //     if (this.intro && this.storyStage === 1 && !this.showViewResult) {
    //        this.appService.footerShow.next(false);
    //        this.openDialog(1);
    //      } else {
    //        this.appService.footerShow.next(false);
    //        this.openDialog(1, true);
    //      }
    //     // this.appService.loader.next(false);
    //   }

    // });
  }

  openDialog(idcurrent, tryagian: boolean =  false): void {
    const dialogRef = this.dialog.open(TellMeYBeginDialogComponent, {
      width: '300px',
      data: { id : idcurrent, tryAgain : tryagian }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed'+result);
      this.intro = false;
      this.IsBlur = false;
      if (result === -1) {
        this.TryAgain(false);
      } else if (result === -2) {// show last Result
        this.showViewResult = false;
        this.createYourOwnStoryService.storyStage.next(2);
        this.appService.footerShow.next(true);
        this.router.navigate(['tellmey', 'result']);
      } else if (result === 2) {
        this.appService.footerShow.next(true);
        this.showViewResult = false;
        this.viewResult();
      }
    });
  }
  scrollTop() {
    window.scrollTo(0, 0);
  }

  selectAnswer(answer: PollingAnswer) {
    this.createYourOwnStoryService.postAnswer(answer);
    if (this.pollStage < this.polls.length) {
      this.pollStage++;
    }
    if (this.pollStage === this.polls.length) {
     // this.viewResult();
     this.pollStage = this.pollStage - 1;
     this.IsBlur = true;
     this.openDialog(2);
    }
  }
  backToPollAnswer(polleventData) {
    if (this.pollStage > 0) {
      this.pollStage--;
    }
  }
  viewResult() {
    this.showViewResult = false;
    this.createYourOwnStoryService.storyStage.next(2);
    this.router.navigate(['tellmey', 'result']);
    // this.authService.loginStatusSubject.subscribe(value => {
    //   if (value) {
    //     this.createYourOwnStoryService.storyStage.next(2);
    //     this.router.navigate(['tellmey', 'result']);
    //   } else {
    //     this.router.navigate(['/tellmey/result'], {
    //       queryParams: { returnUrl: '/tellmey/result' }
    //     });
    //   }
    // });
  }
  TryAgain(isopendialog: boolean = true) {
    this.showViewResult = false;
    this.createYourOwnStoryService.SetResult(null);
    this.createYourOwnStoryService.storyStage.next(1);
    this.createYourOwnStoryService.deleteResponse().subscribe(noop);
    this.createYourOwnStoryService.resultProducts = null;
    this.intro = true;
    this.storyStage = 1;
    this.pollStage = 0;
    if (isopendialog) {
    this.openDialog(1);
    }
    this.polls = this.createYourOwnStoryService.polls;
    this.appService.loader.next(false);
  }
  share() {}
}
