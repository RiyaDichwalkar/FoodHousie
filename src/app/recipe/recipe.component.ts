import { Component, OnInit,NgZone} from '@angular/core';
import { PostService } from 'src/app/shared/post.service';
import { map } from 'rxjs/operators';
import { ResourceLoader } from '@angular/compiler';
import { Router,ActivatedRoute, NavigationStart, Event, NavigationEnd} from '@angular/router';
@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
  private selectedKey:string;
  recipeData: any;
  constructor(public router: Router,public ngZone: NgZone,private _route: ActivatedRoute,private postService:PostService) { }

  ngOnInit() {
    this.selectedKey=this._route.snapshot.paramMap.get('key');
    this.getDetails(this.selectedKey);
  }

  getDetails(key){
      this.postService.getPost(key).snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(result => {
       this.recipeData=result['0'];
      });
  }
  onClick(key:any){
    this.router.navigate(['cart',key]);
  }
}
