import { Component, OnInit, Input } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  @Input() viewMode = false;
  @Input() currentArticle: Article = {
    title: '',
    description: '',
    published: false
  };
  
  message = '';
  constructor( private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    if (!this.viewMode) {
      
      this.message = '';
      this.getArticle(this.route.snapshot.params['id']);
    }
  }
  getArticle(id: string): void {
    console.log(id)
    this.articleService.get(id)
      .subscribe({
        next: (data) => {
          this.currentArticle = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }
  updatePublished(status: boolean): void {
    this.currentArticle.id = this.route.snapshot.params['id']
    const data = {
      title: this.currentArticle.title,
      description: this.currentArticle.description,
      published: status
    };
    this.message = '';
    this.articleService.update(this.currentArticle.id, data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.currentArticle.published = status;
          this.message = res.message ? res.message : 'The status was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }
  updateArticle(): void {
    this.message = '';
    this.currentArticle.id = this.route.snapshot.params['id']
    console.log(this.currentArticle.id)
    this.articleService.update(this.currentArticle.id, this.currentArticle)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message ? res.message : 'This article was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }
  deleteArticle(): void {
    if(confirm("Are you sure you want to delete " + this.currentArticle.title)) {
      this.articleService.delete(this.currentArticle.id)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.router.navigate(['/articles']);
          },
          error: (e) => console.error(e)
        });
    }
  }
  

}
