import { Component, OnInit, Input} from '@angular/core';
import { PostService } from 'src/app/shared/post.service';
import { Post } from '../../shared/models/post.model';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
@Input() post: Post;
imageList:any;
rowIndexArray:any;
isedited:boolean=false;
//posts: any;
  constructor(private service:PostService,private _router:Router) { }

  ngOnInit() {
    this.getPostsList();
  }
  onClick(key:any){
     this.isedited=true;
     this._router.navigate(['posts/upload',key,this.isedited]);
  }
  getPostsList() {
    this.service.getPostsList().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(posts => {
      this.imageList = posts;
      this.rowIndexArray=Array.from(Array(Math.ceil((this.imageList.length+1)/3)).keys());
    });
  }
  deletePosts() {
    this.service.deleteAll();
  }
  // updateActive(isActive: boolean) {
  //   this.service
  //     .updatePost(this.post.key, { active: isActive })
  //     .catch(err => console.log(err));
  // }
 
  deletePost() {
    this.service
      .deletePost(this.imageList.key)
      .catch(err => console.log(err));
  }
}
