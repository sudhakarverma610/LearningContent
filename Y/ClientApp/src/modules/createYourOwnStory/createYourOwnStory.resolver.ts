import { Injectable } from '@angular/core';

import {
  Resolve
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { CreateYourOwnStoryService } from './createYourOwnStory.service';
import { Poll } from './createYourOwnStory.interface';
@Injectable()
export class CreateYourStoryResolver implements Resolve<any> {
  constructor(
    private createStoryService: CreateYourOwnStoryService
  ) {}

  resolve(): Observable<[{ polls: Poll[]; }, { randomProductsList: string[]; profile: any; storyId: any; }]> {
    return this.createStoryService.GetStoryData();

   }
}
