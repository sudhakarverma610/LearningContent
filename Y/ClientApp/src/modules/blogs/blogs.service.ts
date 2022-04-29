import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost, BlogPostResponse } from './blog.model';

export class BlogsService {


    constructor(private http: HttpClient) { }
    getBlogPosts(page: number, limit= 12): Observable<BlogPostResponse> {
        return this.http.get<BlogPostResponse>(`/api/BlogPost?pageNumber=${page}&limit=${limit}`);
    }
    // getAllBlogs(page: number, title: string): Promise<{ blogs: BlogPost[] }> {
    //     return this.http.get<{ blogs: BlogPost[] }>(`/api/getAllBlogs?page=${page}&title=${title}`).toPromise();
    // }

    // getAllBlogsCount(): Promise<{ count: number }> {
    //     return this.http.get<{ count: number }>(`/api/getAllBlogsCount`).toPromise();
    // }

    getBlogBySeName(seName: string): Promise<{ success: boolean, blog: BlogPost, nextBlog: BlogPost }> {
        return this.http.get<{ success: boolean, blog: BlogPost, nextBlog: BlogPost }>(`/api/getBlogBySeName?seName=${seName}`).toPromise();
    }
}
