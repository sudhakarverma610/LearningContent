import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogPost } from '../blog.model';
import { DomSanitizer } from '@angular/platform-browser';
import {Location} from '@angular/common';

@Component({
    selector: 'app-blog-post',
    templateUrl: 'post.component.html',
    styleUrls: ['post.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class BlogPostComponent implements OnInit {
    public post: BlogPost;
    public nextPost: BlogPost;
    public shareUrl = '';
    public innerhtml :any;
    constructor(private route: ActivatedRoute,
                private router: Router,
                private sanitizer: DomSanitizer,
                private  location: Location
                ) { }

    ngOnInit() {
        if (!this.route.snapshot.data.data.success) {
            this.router.navigate(["/blog"]);
        }
        this.InitData();
        this.route.params.subscribe(value => {
            this.InitData();
          });
    }
    back() {
        this.location.back();
    }
    InitData() {
        this.post = this.route.snapshot.data.data.blog;
        this.nextPost = this.route.snapshot.data.data.nextBlog;
        this.innerhtml = this.sanitizer.bypassSecurityTrustHtml(this.post.body);
        this.shareUrl = window.location.href;
    }
    getHtml() {
        return this.sanitizer.bypassSecurityTrustHtml(this.post.body);

    }
}
