import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Post } from "../shared/models/post.model";
import { CartItem } from "../shared/models/cart";
import { PostService } from "../shared/post.service";
import { AngularFirestore, DocumentReference } from "@angular/fire/firestore";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"]
})
export class CartComponent implements OnInit {
  //private items: CartItem[] = [];
  constructor(
    private _route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private db: AngularFirestore
  ) {}
  recipeData: any;
  quantity: number = 1;
  note: String;
  chefDetail: any;
  total: number = 0;
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
            .subscribe(chef => (this.chefDetail = chef));
        });
    }
  }
  OrderSubmit() {
    console.log("*******");
    // const ref = this.db.collection("order").doc();
    // console.log(ref);
    // ref.set({ id: ref.id });
    var calculatedPrice: number = this.quantity * +this.recipeData.price;
    var id = this.db.createId();
    this.db
      .collection("order")
      .doc(id)
      .set({
        ordid: id,
        item: this.recipeData.title,
        quantity: this.quantity,
        price: calculatedPrice,
        chefid: this.recipeData.userid,
        orderstatus: "pending",
        date: new Date(),
        customerid: JSON.parse(localStorage.getItem("user")).uid,
        note: this.note
      });
    this.router.navigate(["dashboard"]);
  }
}
