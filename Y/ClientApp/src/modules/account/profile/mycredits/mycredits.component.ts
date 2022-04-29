import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProfileService, RewardHistory } from '../profile.service';
import { Router } from '@angular/router';
import { ChainOfCharm } from './chainOfCharm.model';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-mycredits',
  templateUrl: './mycredits.component.html',
  styleUrls: ['./mycredits.component.scss']
})
export class MyCreditsComponent implements OnDestroy, OnInit {
  public myChainOfCharm: ChainOfCharm = {
    parent: undefined,
    children: []
  };
  public myRewardpoints: { points: number };
  public myRewardpointDetails: { history: RewardHistory[] };

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.profileService.getChainOfCharm().subscribe(value => {
      this.myChainOfCharm = value;
    });
    this.profileService.getRewardPoints().subscribe(value => {
      this.myRewardpoints = value;
    });
    this.profileService.getRewardPointDetails().subscribe(value => {
      const temp = value.history;
      temp.splice(10, value.history.length - 10);
      this.myRewardpointDetails = {
        history: temp
      };
    });
  }

  ngOnDestroy() {}
}
