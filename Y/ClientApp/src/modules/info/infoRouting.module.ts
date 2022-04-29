import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfoComponent } from './info.component';
import { ContentComponent } from './content/content.component';
import { ContactComponent } from './contact/contact.component';
import { InfoResolver } from './info.resolver';
import { AboutComponent } from './about/about.component';
// import { AboutResolver } from './about/about.resolver';
import { LandingComponent } from './landing/landing.component';
import { ReviewResolver } from './review/review.resolver';
import { ReviewComponent } from './review/review.component';
import { ForgeryComponent } from './forgery/forgery.component';

const routes: Routes = [
  {
    path: '',
    component: InfoComponent,
    children: [
      {
        path: 'about',
        component: AboutComponent,
       // resolve: { data: AboutResolver }
      },
      {
        path: 'review',
        component: ReviewComponent,
        resolve: { data: ReviewResolver }
      },
      {
        path: 'create-your-own-set',
        redirectTo: '/your-set'
      },
      {
        path: 'return',
        component: ContentComponent,
        resolve: { data: InfoResolver }
      },
      {
        path: 'forgery',
        component: ContentComponent,
        resolve: { data: InfoResolver }
      }
      ,
      {
        path: 'forgery1',
        component: ForgeryComponent,
        resolve: { data: InfoResolver }
      },
      {
        path: 'faq',
        component: ContentComponent,
        resolve: { data: InfoResolver }
      },
      {
        path: 'care',
        component: ContentComponent,
        resolve: { data: InfoResolver }
      },
      {
        path: 'sizeguide',
        component: ContentComponent,
        resolve: { data: InfoResolver }
      },
      {
        path: 'terms',
        component: ContentComponent,
        resolve: { data: InfoResolver }
      },
      {
        path: 'privacy',
        component: ContentComponent,
        resolve: { data: InfoResolver }
      },
      {
        path: 'shipping',
        component: ContentComponent,
        resolve: { data: InfoResolver }
      },
      {
        path: 'terms-gift-voucher',
        component: ContentComponent,
        resolve: { data: InfoResolver }
      },
      {
        path: 'preorder-terms',
        component: ContentComponent,
        resolve: { data: InfoResolver }
      },
      { path: 'contactUs', component: ContactComponent },
      { path: '', redirectTo: 'productInformation', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule {}
