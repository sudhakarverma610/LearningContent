import { Injectable } from '@angular/core';
import { StoryService } from './story.service';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve
} from '@angular/router';

@Injectable()
export class StoryResolver implements Resolve<any> {
  constructor(private storyService: StoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.storyService.getStory(route.params['id']);
  }
}
