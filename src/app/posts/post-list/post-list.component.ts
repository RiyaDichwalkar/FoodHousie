import { Component, OnInit, Input} from '@angular/core';
import { PostService } from 'src/app/shared/post.service';
import { Post } from '../../shared/models/post.model';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
@Input() post: Post;
imageList:any;
rowIndexArray:any;
//posts: any;
  constructor(private service:PostService) { }

  ngOnInit() {
    // this.service.imageDetailList.snapshotChanges().subscribe(
    //   list=>{
    //     this.imageList=list.map(item=>{return item.payload.val();});
    //     this.rowIndexArray=Array.from(Array(Math.ceil((this.imageList.length+1)/3)).keys());
    //   }
    // );
    this.getPostsList();
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
