import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from "../../auth/auth.service";
import { Router ,ActivatedRoute} from "@angular/router";
import { finalize } from "rxjs/operators";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from "@angular/fire/storage";
import { post } from 'selenium-webdriver/http';
@Component({
  selector: 'app-chef-profile',
  templateUrl: './chef-profile.component.html',
  styleUrls: ['./chef-profile.component.scss']
})
export class ChefProfileComponent implements OnInit {
    chefData:any;
    imgUrl: String;
    selectedImage: any;
    bio:string;
    postList: any;
    isImageSaved:boolean=false;
  constructor(public authService: AuthService,
    public router: Router,
    public _route:ActivatedRoute,
    public ngZone: NgZone,
    private db:AngularFirestore,
    private storage:AngularFireStorage) { }
    
  ngOnInit() {
    if(this.authService.isChef)
     { this.chefData=JSON.parse(localStorage.getItem("user"));
     this.imgUrl=this.chefData.photo;
     this.bio=this.chefData.bio;
     this.getTopDishes();
    }
     else{
        let id= this._route.snapshot.paramMap.get("key");
        this.db.collection('chef').doc(id).valueChanges().subscribe(result=>{this.chefData=result;
           console.log(this.chefData);
           console.log(this.chefData.fullname);
           this.imgUrl=this.chefData.photo;
           this.bio=this.chefData.bio;
           this.getTopDishes();
        })
     }
    
 
  }
  save(){
    this.db.collection('chef').doc(this.chefData.uid).update({
      bio:this.bio
    });
    window.alert("Bio Updated");
  }
  photoUpload(){
   if (this.selectedImage== null){
  window.alert("Please Select any new Image to upload");
   }else{
  var filePath = `chefs/`+`${this.selectedImage.name
    .split(".")
    .slice(0, -1)
    .join(".")}_${new Date().getTime()}`;
  const fileRef = this.storage.ref(filePath);
  this.storage.upload(filePath, this.selectedImage)
    .snapshotChanges()
    .pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {
          this.db.collection('chef').doc(this.chefData.uid).update({
            photo:url
          });
        });
        window.alert("Profile Photo Updated !!!");
      }
      )
    )
    .subscribe();
   }
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imgUrl = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      this.imgUrl = "../../../assets/post-img/image_placeholder.jpg";
      this.selectedImage = null;
    }
  }

  getTopDishes() {
    //console.log(chefsWithin1km.length);
    this.postList=[];
      this.db
        .collection("posts", ref =>
          ref.where("userid", "==", this.chefData.uid).orderBy('dishsold', 'desc').limit(3)
        ).valueChanges().subscribe(result=>{
          console.log("ppppppppppppppp");
          var a = result.length;
          if (a > 0) {
            this.postList = this.postList.concat(result);
            console.log(this.postList);
        }
      });
        
  }
}
