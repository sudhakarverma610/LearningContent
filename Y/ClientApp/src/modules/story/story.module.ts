import { NgModule } from '@angular/core';
import { StoryComponent } from './story.component';
import { StoryResolver } from './story.resolver';
import { StoryService } from './story.service';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { StoryRoutingModule } from './storyRouting.module';


@NgModule({
    imports: [SharedImportsModule, StoryRoutingModule],
    exports: [],
    declarations: [StoryComponent],
    providers: [StoryResolver, StoryService],
})
export class StoryModule { }
