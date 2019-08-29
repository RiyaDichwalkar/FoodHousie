import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Post} from './models/post.model'
@Injectable({
  providedIn: 'root'
})
export class PostService {

  private dbPath = '/imageDetails';
  // private dataCollection: AngularFirestoreCollection<any>;
  // imageDetailList:Observable<any[]>;
  // private _firebaseCollURL = "imageDetails";
  // private imagesCollection: AngularFirestoreCollection<any>;
  // items: Observable<any>;
  // private imageDoc: AngularFirestoreDocument<any>;
  // item: Observable<any>;

  // items$: Observable<Item[]>;


  postsRef: AngularFirestoreCollection<Post> = null;
  constructor(private db: AngularFirestore) { 
    this.postsRef = db.collection(this.dbPath);
  }
  createPost(post: Post): void {
    debugger;
    this.postsRef.add({...post});
  }
  updatePost(key: string, value: any): Promise<void> {
    return this.postsRef.doc(key).update(value);
  }
  deletePost(key: string): Promise<void> {
    return this.postsRef.doc(key).delete();
  }
  getPostsList(): AngularFirestoreCollection<Post> {
    return this.postsRef;
  }
  
  deleteAll() {
    this.postsRef.get().subscribe(
      querySnapshot => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      },
      error => {
        console.log('Error: ', error);
      });
  }

 

  // getImageDetailList(){
  //   debugger;
  //   this.dataCollection = this.firebase.collection('imageDetails').valueChanges();

    
  //  // this.imageDetailList= this.firebase.collection("imageDetails").valueChanges();
    
  //   // .get().subscribe(
  //   // (function(querySnapshot) {
  //   //   querySnapshot.forEach(function(doc) {
  //   //       // doc.data() is never undefined for query doc snapshots
  //   //       console.log("************");
  //   //       console.log(doc.id, " => ", doc.data());
  //   //   });
  // // }));
  //  console.log("^^^^^^^");
  //  console.log(this.imageDetailList);
  //  console.log("fffffffffffffff");
  // }
  
  // setData(data) {
  //   const id = this.firebase.createId();
  //   data["id"] = id;
  //   data["updatedAt"] = new Date(),
  //   data["createdAt"] = new Date(),
  //   data["delete_flag"] = "N"
  //   return 
  // }
  // insertImageDetails(imageDetails){
  //   debugger;
  //   const id = this.firebase.createId();
  //   this.firebase.collection(this._firebaseCollURL).doc(id).set(imageDetails);
  //   // collection("cities").doc("new-city-id").set(data);

  // }
}




 
 

 
 
 
 
 
  
 