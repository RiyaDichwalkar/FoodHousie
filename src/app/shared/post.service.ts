import { Injectable } from "@angular/core";
import {
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "./models/post.model";
@Injectable({
  providedIn: "root"
})
export class PostService {
  result: any;
  private dbPath = "/posts";
  postsRef: AngularFirestoreCollection<Post> = null;
  constructor(private db: AngularFirestore) {
    this.postsRef = db.collection(this.dbPath);
  }
  createPost(post: Post): void {
    var idBefore = this.db.createId();
    post.key = idBefore;
   // this.postsRef.add({ ...post });
    this.postsRef.doc(idBefore).set(post);
  }

  // updatePost(key: string, value: any): Promise<void> {
  //   return this.postsRef.doc(key).update(value);
  // }
  deletePost(key: string): Promise<void> {
    return this.postsRef.doc(key).delete();
  }

  getPost(key: string): AngularFirestoreCollection<Post> {
    console.log("yyyyyyyyyyyy");
    //debugger;
    this.result = this.db.collection("/posts", ref =>
      ref.where("key", "==", key)
    );
    return this.result;
  }

 
  getPostsList(): AngularFirestoreCollection<Post> {
    return this.postsRef;
  }

  deleteAll() {
    this.postsRef.get().subscribe(
      querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.delete();
        });
      },
      error => {
        console.log("Error: ", error);
      }
    );
  }
}
