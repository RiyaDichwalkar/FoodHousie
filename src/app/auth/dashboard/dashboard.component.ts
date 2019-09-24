import { Component, OnInit, NgZone } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFirestoreCollection } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { PostService} from '../../shared/post.service';
import { Post} from '../../shared/models/post.model';
import { post } from 'selenium-webdriver/http';
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public postService:PostService,
    public router: Router,
    public ngZone: NgZone,
    private db: AngularFirestore
  ) {
    this.chefRefCollection = db.collection("/chef");
    this.postRefCollection=db.collection("/posts");
  }
  //all chefs
  chefList: any;
  postList:any;
  rowIndexArray:any;
  chefsWithin1km: any;
  private dbPath = "/chef";
  chefRefCollection: AngularFirestoreCollection<any> = null;
  postRefCollection:AngularFirestoreCollection<Post>=null;
  latitude: number;
  longitude: number;
  flag:boolean=false;
  ngOnInit() {
    if(!this.flag){
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        this.setPosition.bind(this)
      );
      this.flag=true;
    }
  }
    this.getChefData();
  }
  setPosition(position) {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    //console.log(this.longitude, this.latitude);
  }
  //get all chef
  getChefData() {
    this.chefRefCollection
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.doc.id, ...c.payload.doc.data() }))
        )
      )
      .subscribe(posts => {
        this.chefList = posts;
        this.chefsWithin1km = [];
       // debugger;
        posts.forEach(doc => {
          //console.log(doc.latitude, doc.longitude);
          if (
            this.distance(
              doc.latitude,
              doc.longitude,
              this.latitude,
              this.longitude
            ) < 1
          ) {
           // debugger;
            console.log(doc.fullname, doc.latitude, doc.longitude);
            this.chefsWithin1km.push(doc.uid);
        
          }
        });
        // console.log(this.chefsWithin1km);
        this.getPostData(this.chefsWithin1km);
      });

  }
  //now to take all chefs and calculate distance between customer
  distance(lat1, lon1, lat2, lon2) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344;
      return dist;
    }
  }

  getPostData(chefsWithin1km:Array<any> ) {
    //debugger;
    chefsWithin1km.forEach((chefUid)=>{
    this.db.collection('/posts', ref => ref.where('userid', '==',chefUid)).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(result => {
      console.log(result);
      if(result.length!=0){
               this.postList=result;
               console.log(result);
               
               this.rowIndexArray=Array.from(Array(Math.ceil((this.postList.length)/3)).keys());
      }
    });

    });
  }


  onClick(key:any){
    this.router.navigate(['recipe',key]);
 }
}
