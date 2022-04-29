import { NgModule } from '@angular/core';
import { AddTestimonialsComponent } from './addTestimonials.component';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsRoutingModule } from './testimonialsRouting.module';
import { SharedImportsModule } from '../sharedImports/sharedImports.module';
import { TestimonialListComponent } from './testimonialList/testimonialList.component'; 
import { TestmonialItemComponent } from './testimonialList/testmonialItem/testmonialItem.component';
import { MatCardModule } from '@angular/material/card';
import { PipeModule } from 'src/pipes/pipe.module';
import { TestimonialListResolver } from './testimonialList/testimonialList.resolver';

@NgModule({
    imports: [SharedImportsModule, TestimonialsRoutingModule,MatCardModule,
        PipeModule],
    exports: [],
    declarations: [AddTestimonialsComponent,TestimonialListComponent,TestmonialItemComponent],
    providers: [TestimonialsService,TestimonialsService,TestimonialListResolver],
})
export class TestimonialsModule { }
