import { Component, OnInit, Input } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.css']
})
export class ArticlesListComponent implements OnInit {
  article: Article = {
    title: '',
    description: '',
    published: false
  };
  articles?: Article[];
  currentArticle: Article = {};
  currentIndex = -1;
  title = '';
  message = '';
  submitted = false;

  constructor(private articleService: ArticleService, private route: ActivatedRoute,
    private router: Router) { }
  
  ngOnInit(): void {
    this.retrieveArticles();
  }
  retrieveArticles(): void {
    this.articleService.getAll()
      .subscribe({
        next: (data) => {
          this.articles = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }
  refreshList(): void {
    this.retrieveArticles();
    this.currentArticle = {};
    this.currentIndex = -1;
  }
  setActiveArticle(article: Article, index: number): void {
    this.currentArticle = article;
    this.currentIndex = index;
  }
  removeAllArticles(): void {
    if(confirm("Are you sure you want to delete all articles")) {
      this.articleService.deleteAll()
        .subscribe({
          next: (res) => {
            console.log(res);
            this.refreshList();
          },
          error: (e) => console.error(e)
        });
    }
  }
  searchTitle(): void {
    this.currentArticle = {};
    this.currentIndex = -1;
    this.articleService.findByTitle(this.title)
      .subscribe({
        next: (data) => {
          this.articles = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }
  
  getArticle(id: string): void {
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
    const data = {
      title: this.currentArticle.title,
      description: this.currentArticle.description,
      published: status
    };
    this.message = '';
    this.articleService.update(this.currentIndex, data)
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
    this.articleService.update(this.currentIndex, this.currentArticle)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message ? res.message : 'This article was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }
  deleteArticle(): void {
    this.articleService.delete(this.currentIndex)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/articles']);
        },
        error: (e) => console.error(e)
      });
  }

  saveArticle(): void {
    const data = {
      title: this.article.title,
      description: this.article.description,
      published: this.article.published
    };
    this.articleService.create(data)
      .subscribe({
        next: (res:any) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => console.error(e)
      });
  }
  newArticle(): void {
    this.submitted = false;
    this.article = {
      title: '',
      description: '',
      published: false
    };
  }
}
