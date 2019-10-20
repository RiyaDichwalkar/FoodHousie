import { Component, OnInit, NgZone } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { PostService } from "../../shared/post.service";
import * as _ from "lodash";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public postService: PostService,
    public router: Router,
    public ngZone: NgZone,
    private db: AngularFirestore
  ) {}
  chefList: any;
  postList: any;
  pastOrderList: any;
  postListForBook: any; //we have to add in this only if (date >= todays date) (for customer used for book button, and for chef active);
  postListForRequest: any; //here elements would be added only if postlist for book is empty.(for chef for request button, and for chef inactive)
  chefsWithin1km: any;
  isCustomer: boolean = false;
  isChef: boolean = false;
  latitude: number;
  longitude: number;
  flag: boolean = false;
  filterPostList: any;
  todayDate: string;
  filters = {};
  ngOnInit() {
    const userrole = JSON.parse(localStorage.getItem("roles"));
    if (userrole.isCustomer) {
      this.isCustomer = true;
    } else {
      this.isChef = true;
    }
    if (!this.flag) {
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          this.setPosition.bind(this)
        );
        this.flag = true;
      }
    }
    if (userrole.isCustomer) {
      this.getChefData();
    } else {
      this.getPostData([JSON.parse(localStorage.getItem("user")).uid]);
    }
  }
  //to apply filter from lodash
  private applyFilters() {
    this.filterPostList = _.filter(this.postList, _.conforms(this.filters));
  }

  removeFilter(property: string) {
    delete this.filters[property];
    this[property] = null;
    this.applyFilters();
  }
  filterExact(property: string, rule: any) {
    if (rule.localeCompare("all") == 0) {
      this.removeFilter(property);
    } else {
      this.filters[property] = val => val == rule;
    }
    this.applyFilters();
  }

  filterExact2(property: string, rule: any) {
    console.log(typeof rule);
    console.log(rule);
    if (rule.localeCompare("both") != 0) {
      this.filters[property] = val => val == rule;
    } else {
      this.removeFilter(property);
    }
    this.applyFilters();
  }

  filterDateMoreThan(property: string, rule: any) {
    console.log(this.todayDate);
    if (rule.localeCompare("today") === 0) {
      this.filters[property] = val => val == this.todayDate;
    } else {
      this.filters[property] = val => val !== this.todayDate;
    }
    this.applyFilters();
  }

  setPosition(position) {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
  }
  //get all chef
  getChefData() {
    // debugger;
    this.db
      .collection("chef")
      .valueChanges()
      .subscribe(posts => {
        this.chefList = posts;
        this.chefsWithin1km = [];
        this.chefList.forEach(doc => {
          var a = this.distance(
            doc.latitude,
            doc.longitude,
            this.latitude,
            this.longitude
          );
          //console.log(a);
          //you will get result only in college for customer, as our customer registered from college.now kept 100, in demo put 1.
          if (a < 100) {
            this.chefsWithin1km.push(doc.uid);
          }
        });
        console.log(this.chefsWithin1km);
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

  getPostData(chefsWithin1km: Array<any>) {
    //console.log(chefsWithin1km.length);
    this.postList = [];
    this.postListForBook = [];
    this.postListForRequest = [];
    let length = chefsWithin1km.length;
    //getting todays date for book and request array.
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var todayDate = yyyy + mm + dd;
    this.todayDate = dd + "/" + mm + "/" + yyyy;
    console.log(todayDate);

    //I assume date are from database in dd/mm/yyyy format.
    for (let index = 0; index < length; index++) {
      this.db
        .collection("posts", ref =>
          ref.where("userid", "==", chefsWithin1km[index])
        )
        .valueChanges()
        .subscribe(result => {
          var a = result.length;
          if (a > 0) {
            this.postList = this.postList.concat(result);
            console.log(this.postList[0].date);
            console.log(this.postList);
            let len = result.length;
            result.forEach((post: any) => {
              var date = post.date;
              var parts = date.split("/");
              //console.log(parts);
              var date = parts[2] + parts[1] + parts[0];
              if (date.localeCompare(todayDate) >= 0) {
                console.log(todayDate + " < orderdate is " + date);
                this.postListForBook.push(post);
              } else {
                this.postListForRequest.push(post);
                console.log(todayDate + " > orderdate is " + date);
              }
            });
            this.applyFilters();
          }
        });
    }
  }

  //now making two different arrays of past orders and pending orders

  onClick(key: any) {
    this.router.navigate(["cart", key]);
  }
}
