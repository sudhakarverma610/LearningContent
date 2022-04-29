import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APIResolver } from '../app.resolver';
import { BaseComponent } from './base.component';
import { NavbarComponent } from 'src/modules/navbar/navbar.component';
import { NavResolver } from 'src/modules/navbar/navbar.resolver';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    resolve: { token: APIResolver },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/home/home.module').then(
            m => m.HomeModule
          )
      },
      {
        path: '',
        component: NavbarComponent,
        outlet: 'navbar',
        resolve: { categories: NavResolver }
      },
      {
        path: 'mobile-input',
        loadChildren: () =>
          import('../../modules/mobileInput/modileInput.module').then(
            m => m.MobileInputModule
          )
      },
      {
        path: 'lookbook',
        loadChildren: () =>
          import('../../modules/lookbook/lookbook.module').then(
            m => m.LookbookModule
          )
      },
      {
        path: 'addtestimony',
        loadChildren: () =>
          import('../../modules/testimonials/testimonials.module').then(
            m => m.TestimonialsModule
          )
      },
      {
        path: 'tellmey',
        loadChildren: () =>
          import('../../modules/createYourOwnStory/createYourOwnStory.module').then(
            m => m.CreateYourOwnStoryModule
          )
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('../../modules/blogs/blogs.module').then(
            m => m.BlogsModule
          )
      },
      {
        path: 'story',
        loadChildren: () =>
          import('../../modules/story/story.module').then(
            m => m.StoryModule
          )
      },
      {
        path: 'account',
        loadChildren: () =>
          import('../../modules/account/account.module').then(
            m => m.AccountModule
          )
      },
      {
        path: 'info/create-your-own-set',
        loadChildren: () =>
          import('../../modules/configurator/configurator.module').then(
            m => m.ConfiguratorModule
          )
      },
      {
        path: 'info',
        loadChildren: () =>
          import('../../modules/info/info.module').then(m => m.InfoModule)
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('../../modules/auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'signup', redirectTo: 'auth/signup', pathMatch: 'full'
      },
      {
        path: 'login', redirectTo: 'auth/login', pathMatch: 'full'
      },
      {
        path: 'Cutomer/Login', redirectTo: 'auth/Cutomer/Login', pathMatch: 'full'
      },
      {
        path: 'otpInput', redirectTo: 'auth/otpInput', pathMatch: 'full'
      },
      {
        path: 'passwordrecovery/confirm', redirectTo: 'auth/passwordrecovery/confirm', pathMatch: 'full'
      },
      {
        path: 'curator', redirectTo: 'home/curator', pathMatch: 'full'
      },
      {
        path: 'create-your-own-set', redirectTo: 'info/create-your-own-set', pathMatch: 'full'
      },
      {
        path: 'your-set',
        loadChildren: () =>
          import('../../modules/configurator/configurator.module').then(
            m => m.ConfiguratorModule
          )
      },
      {
        path: 'chain-of-charms',
        loadChildren: () =>
          import('../../modules/communityChain/communityChain.module').then(
            m => m.CommunityChainModule
          )
      },
      {
        path: 'gift-voucher',
        loadChildren: () =>
          import('../../modules/giftcards/giftcard.module').then(
            m => m.GiftcardModule
          )
      },
      {
        path: '',
        loadChildren: () =>
          import('../../modules/cart/cart.module').then(m => m.CartModule),
        data: { preload: true }
      },
      {
        path: 'search',
        loadChildren: () =>
          import('../../modules/search/search.module').then(
            m => m.SearchModule
          ),
        data: { preload: true }
      },
      {
        path: 'category',
        loadChildren: () =>
          import('../../modules/productListing/productListing.module').then(
            m => m.ProductListingModule
          ),
        // loadChildren: () =>
        // import('../../modules/product/product.module').then(
        //   m => m.ProductModule
        // ),
        data: { preload: true }
      },
      {
        path: 'product',
        loadChildren: () =>
          import('../../modules/productDetails/productDetails.module').then(
            m => m.ProductDetailsModule
          ),
        // loadChildren: () =>
        //   import('../../modules/product/product.module').then(
        //     m => m.ProductModule
        //   ),
        data: { preload: true }
      },
      {
        path: '',
        loadChildren: () =>
          import('../../modules/product/product.module').then(
            m => m.ProductModule
          ),
        data: { preload: true }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
