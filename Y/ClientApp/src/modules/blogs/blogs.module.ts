import { NgModule } from '@angular/core';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CssFlexLayoutModule } from 'angular-css-flex-layout';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BlogsComponent } from './blogs.component';
import { BlogListingComponent } from './listing/blogListing.component';
import { BlogPostComponent } from './post/post.component';
import { BlogsService } from './blogs.service';
import { BlogListingResolver } from './listing/blogListing.resolver';
import { BlogPostResolver } from './post/post.resolver';
import { BlogsRoutingModule } from './blogsRouting.module';

@NgModule({
  declarations: [
      BlogsComponent,
      BlogListingComponent,
      BlogPostComponent
  ],
  imports: [
    SharedImportsModule,
    CommonModule,
    SharedModule,
    InfiniteScrollModule,
    CssFlexLayoutModule,
    BlogsRoutingModule
  ],
  providers: [BlogsService, BlogListingResolver, BlogPostResolver]
})
export class BlogsModule {}
