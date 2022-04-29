import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogsService } from '../blogs.service';
import { BlogPost, BlogPostResponse } from '../blog.model';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
    selector: 'app-blog-listing',
    templateUrl: 'blogListing.component.html',
    styleUrls: ['blogListing.component.scss']
})

export class BlogListingComponent implements OnInit {
    public blogList: BlogPost[] = [];
    public blogPostResponse: BlogPostResponse;
    public total = 0;
    public currentPage = 1;
    public scrollDistance = 2;
    public infiniteScroll: InfiniteScrollDirective;
    @ViewChild(InfiniteScrollDirective, { static: false })
    set appScroll(directive: InfiniteScrollDirective) {
      this.infiniteScroll = directive;
    }

    constructor(private route: ActivatedRoute, private service: BlogsService) { }

    ngOnInit() {
        this.blogPostResponse = this.route.snapshot.data.data as BlogPostResponse;
        this.blogList = this.blogPostResponse.post;
       // this.total = this.route.snapshot.data.data[1].count;
    }

    onScrollDown() {
        if (this.currentPage < this.blogPostResponse.TotalPages) {
            this.currentPage++;
            this.service.getBlogPosts(this.currentPage, 5)
            .subscribe( res => {
               this.blogList = [...this.blogList, ...res.post];
              });
        // if (this.total > this.currentPage * 6) {
        //     this.currentPage = this.currentPage + 1;
        //     this.service.getAllBlogs(this.currentPage, null).then((result: { blogs: BlogPost[] }) => {
        //         this.blogList = [...this.blogList, ...result.blogs];
        //     });
        // }
        }
    }
}
