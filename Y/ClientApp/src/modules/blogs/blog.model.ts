export interface BlogPost {
    blog_id: number;
    language_id: number;
    include_in_sitemap: boolean;
    title: string;
    body: any;
    body_overview: string;
    pictureUrl: string;
    allow_comments: boolean;
    tags: string;
    start_date: Date;
    end_date: Date;
    meta_keywords: string;
    meta_description: string;
    meta_title: string;
    limited_to_stores: boolean;
    created_at: Date;
    se_name: string;
}
export interface BlogPostResponse {
    post: BlogPost[];
    TotalPages: number;
    count: number;

}
