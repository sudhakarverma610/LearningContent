import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BlogsService } from '../blogs.service';

export class BlogListingResolver implements Resolve<any> {

    /**
     *
     */
    constructor(private service: BlogsService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
        return this.service.getBlogPosts(1, 5 );
    }
}
