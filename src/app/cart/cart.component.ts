import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../shared/models/post.model';
import { CartItem } from '../shared/models/cart';
import { PostService } from '../shared/post.service';
import { map } from 'rxjs/operators'
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
   private items:CartItem[]=[];
   private product_detail:Post;
   private total:number=0;
  constructor(
    private _route:ActivatedRoute,
    private postService:PostService
  ) { }

  ngOnInit() {
    debugger;
    var key=this._route.snapshot.paramMap.get('key');
    if(key){
      // this.postService.getPost(id).snapshotChanges().pipe(
      //   map(changes =>
      //     changes.map(c =>
      //       ({ key: c.payload.doc.id, ...c.payload.doc.data() })
      //     )
      //   )
      // )
      // .subscribe(result=>{
      //   console.log("OOO");
      //   console.log(result);
      // this.product_detail= result['0'];
      // console.log(this.product_detail);
      // debugger;
      // });

      this.postService.getPost(key).valueChanges().subscribe(result => {
       console.log(result);
          
      });
  
    }
  }
    //   var item:CartItem={
    //     product:this.product_detail,
    //     quantity:1
    //   };
    //   if(localStorage.getItem('cart')==null){
    //      let cart:any=[];
    //      cart.push(JSON.stringify(item));
    //      localStorage.setItem('cart',JSON.stringify(cart));
    //   }else {
    //     let cart:any=JSON.parse(localStorage.getItem('cart'));
    //     let index:number=-1;
    //     for(var i=0;i<cart.length;i++){
    //         let item:CartItem=JSON.parse(cart[i]);
    //         if(item.product.key==id){
    //           index=i;
    //           break;
    //         }
    //     }
    //     if(index==-1){
    //           cart.push(JSON.stringify(item));
    //           localStorage.setItem('cart',JSON.stringify(cart));
    //     }else{
    //       let item:CartItem=JSON.parse(cart[index]);
    //       item.quantity+=1;
    //       cart[index]=JSON.stringify(item);
    //       localStorage.setItem("cart",JSON.stringify(cart));
    //     }
    //   }
    //   this.loadCart();
    // }else{
    //   this.loadCart();
    // }
 // }



	// loadCart(): void {
	// 	this.total = 0;
	// 	this.items = [];
	// 	let cart = JSON.parse(localStorage.getItem('cart'));
	// 	for (var i = 0; i < cart.length; i++) {
	// 		let item = JSON.parse(cart[i]);
	// 		this.items.push({
	// 			product: item.product,
	// 			quantity: item.quantity
	// 		});
	// 		this.total += item.product.price * item.quantity;
	// 	}
	// }

	// remove(id: string): void {
	// 	let cart: any = JSON.parse(localStorage.getItem('cart'));
	// 	let index: number = -1;
	// 	for (var i = 0; i < cart.length; i++) {
	// 		let item: CartItem = JSON.parse(cart[i]);
	// 		if (item.product.key == id) {
	// 			cart.splice(i, 1);
	// 			break;
	// 		}
	// 	}
	// 	localStorage.setItem("cart", JSON.stringify(cart));
	// 	this.loadCart();
	// }


}