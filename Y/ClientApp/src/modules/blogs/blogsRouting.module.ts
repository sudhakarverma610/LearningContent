import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogsComponent } from './blogs.component';
import { BlogListingComponent } from './listing/blogListing.component';
import { BlogListingResolver } from './listing/blogListing.resolver';
import { BlogPostComponent } from './post/post.component';
import { BlogPostResolver } from './post/post.resolver';

const routes: Routes = [
  {
    path: '',
    component: BlogsComponent,
    children: [
      {
        path: "posts",
        component: BlogListingComponent,
        resolve: { data: BlogListingResolver }
      },
      {
        path: ":sename",
        component: BlogPostComponent,
        resolve: { data: BlogPostResolver }
      },
      { path: '', redirectTo: 'posts', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule {}
