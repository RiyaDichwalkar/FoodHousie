import { Component, OnInit, NgZone } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFirestoreCollection } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { PostService} from '../../shared/post.service';
import { Post} from '../../shared/models/post.model';
import * as _ from "lodash";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  chefRef: AngularFirestoreCollection<any> = null;
  postRefCollection:AngularFirestoreCollection<Post>=null;
  //isChef:boolean=false;
  constructor(
    public authService: AuthService,
    public postService:PostService,
    public router: Router,
    public ngZone: NgZone,
    private db: AngularFirestore
  ) {
    this.chefRef = db.collection("/chef");
    this.postRefCollection=db.collection("/posts");
  }
  //all chefs
  chefList: any;
  postList:any;
  rowIndexArray:any;
  chefsWithin1km: any;
  private dbPath = "/chef";
  isCustomer:boolean=false;
  isChef:boolean=false;
  latitude: number;
  longitude: number;
  flag:boolean=false;
  ngOnInit() { 
    //getting the role of the user
    const userrole=JSON.parse(localStorage.getItem("roles"));
    if(userrole.isCustomer){
        this.isCustomer=true;
    }
    else{
      this.isChef=true;
    }
    if(!this.flag ){
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        this.setPosition.bind(this)
      );
      this.flag=true;
    }
    
  }
  if(userrole.isCustomer){
    this.getChefData();
}else{
  this.getPostData([JSON.parse(localStorage.getItem("user")).uid]);
}
    
  }
  setPosition(position) {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
  }
  //get all chef
  getChefData() {
    this.chefRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
      ).subscribe(posts => {
        this.chefList = posts;
        this.chefsWithin1km = [];
        this.chefList.forEach(doc => {
          if (
            this.distance(
              doc.latitude,
              doc.longitude,
              this.latitude,
              this.longitude
            ) < 100
          ) {
            this.chefsWithin1km.push(doc.uid);   
          }

        });
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
    chefsWithin1km.forEach((chefUid)=>{
    this.db.collection('posts', ref => ref.where('userid', '==',chefUid)).valueChanges()
    .subscribe(result => {
      console.log(result);
      if(result.length!=0){
               this.postList=result;
               this.rowIndexArray=Array.from(Array(Math.ceil((this.postList.length)/3)).keys());
      }
    });

    });
  }


  onClick(key:any){
    this.router.navigate(['recipe',key]);
 }
}
