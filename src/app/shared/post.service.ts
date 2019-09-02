import { Injectable } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post} from './models/post.model'
@Injectable({
  providedIn: 'root'
})
export class PostService {
  result:any;
  private dbPath = '/imageDetails';
  // private dataCollection: AngularFirestoreCollection<any>;
  // imageDetailList:Observable<any[]>;
  // private _firebaseCollURL = "imageDetails";
  // private imagesCollection: AngularFirestoreCollection<any>;
  // items: Observable<any>;
  // private imageDoc: AngularFirestoreDocument<any>;
  // item: Observable<any>;

  // items$: Observable<Item[]>;

  docRef: AngularFirestoreCollection<Post> = null;
  postsRef: AngularFirestoreCollection<Post> = null;
  constructor(private db: AngularFirestore) { 
    this.postsRef = db.collection(this.dbPath);
  }
  createPost(post: Post): void {
    debugger;
    console.log(post);
    var idBefore =  this.db.createId();
    console.log("id before");
    console.log(idBefore);
    post.key=idBefore;
    console.log("ooooooo");
    console.log(post);
    this.postsRef.add({...post});
  }
  updatePost(key: string, value: any): Promise<void> {
    return this.postsRef.doc(key).update(value);
  }
  deletePost(key: string): Promise<void> {
    return this.postsRef.doc(key).delete();
  }
  
  receivePost(key:string):AngularFirestoreCollection<Post>{
    console.log(

      "bbbbbbbbbbbbbbbbbbbb"
    );
   console.log( this.db.collection("imageDetails").doc("wBqDSakT6jsupEBwHAXh"));
return ;
// docRef.get().map(function(doc) {
//     if (doc.exists) {
//         console.log("Document data:", doc.data());
//     } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//     }
// }).catch(function(error) {
//     console.log("Error getting document:", error);
// });
// return th.docRef;
  }
  getPost(key:string):AngularFirestoreCollection<Post>{
    // console.log("mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
    // console.log(key);
    // key="td"
    debugger;
    this.result= this.db.collection('/imageDetails', ref => ref.where('key', '==', key));
    console.log("RRRRRRRRRRRRRR");
    console.log(this.result);

    return this.result;
    // debugger;
    // const productsDocuments = this.db.doc<Post>('imageDetails/' + key);
    // productsDocuments.snapshotChanges()
    //     .pipe(
    //       map(changes => {
    //         const data = changes.payload.data();
    //         const id = changes.payload.id;
    //         console.log("YYYYYYYYYYYY");
    //         console.log(data);
    //         console.log("mmmAAAAAAAAAA");
    //         console.log(id);
    //         return { id, ...data };
    //       }))
    //       return;
    }
 // }
  // getPost(key:string):AngularFirestoreCollection<Post>{
  //   debugger;
  //  return this.postsRef.doc(key).ref.get().then(function (doc) {
  //   if (doc.exists) {
  //     console.log(doc.data());
  //   } else {
  //     console.log("There is no document!");
  //   }
  // }).catch(function (error) {
  //   console.log("There was an error getting your document:", error);
  // });
   //.ref.get().then(function(doc) {
  //     if (doc.exists) {
  //         console.log("Document data:", doc.data());
  //     } else {
  //         // doc.data() will be undefined in this case
  //         console.log("No such document!");
  //     }
  // }).catch(function(error) {
  //     console.log("Error getting document:", error);
  // });
  //}
  getPostsList(): AngularFirestoreCollection<Post> {
    console.log("ttttttttttttttttttt");
    console.log(this.postsRef);
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




 
 

 
 
 
 
 
  
 