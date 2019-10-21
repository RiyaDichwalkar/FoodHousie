import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
  providers: [DatePipe]
})
export class CartComponent implements OnInit {
  //private items: CartItem[] = [];
  constructor(
    private _route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore
  ) {}
  recipeData: any;
  quantity: number = 1;
  note: String;
  chefDetail: any;
  total: number = 0;
  todaysdate: string;
  ngOnInit() {
    var key = this._route.snapshot.paramMap.get("key");
    console.log(key);
    if (key) {
      this.db
        .collection("posts", ref => ref.where("key", "==", key))
        .valueChanges()
        .subscribe(result => {
          console.log(result);
          this.recipeData = result["0"];
          this.db
            .collection("chef", ref =>
              ref.where("uid", "==", result["0"].userid)
            )
            .valueChanges()
            .subscribe(chef => {
              this.chefDetail = chef["0"];
              console.log(chef);
            });
        });
    }
  }
  OrderSubmit() {
    console.log("*******");
    var calculatedPrice: number = this.quantity * +this.recipeData.price;
    var id = this.db.createId();
    this.db
      .collection("order")
      .doc(id)
      .set({
        ordid: id,
        item: this.recipeData.title,
        recipeid: this.recipeData.key,
        quantity: this.quantity,
        price: calculatedPrice,
        chefid: this.recipeData.userid,
        orderstatus: "pending",
        date: new Date(),
        pickupdate: this.recipeData.date,
        customerid: JSON.parse(localStorage.getItem("user")).uid,
        customername: JSON.parse(localStorage.getItem("user")).fullname,
        note: this.note
      });
    this.router.navigate(["dashboard"]);
  }
}
