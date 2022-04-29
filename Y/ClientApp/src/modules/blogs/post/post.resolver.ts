import { Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BlogPost } from '../blog.model';
import { BlogsService } from '../blogs.service';

export class BlogPostResolver implements Resolve<{ success: boolean, blog: BlogPost }> {
    /**
     *
     */
    constructor(private service: BlogsService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<{ success: boolean, blog: BlogPost,nextBlog: BlogPost }> | Promise<{ success: boolean, blog: BlogPost }> {
        return this.service.getBlogBySeName(route.params['sename']);
    }
}
