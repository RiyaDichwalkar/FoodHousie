import { Component, OnInit } from '@angular/core';
import { ProductapiService } from '../productapi.service';
import { ActivatedRoute, Router } from '@angular/router';
class ImageSnippet {
  // pending: boolean = false;
    //status: string = 'init';
  
    constructor(public src: string, public file: File) {}
  }
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {


  products:any = [];
  constructor(public rest:ProductapiService, private route: ActivatedRoute, private router: Router) { }
  imageFile:ImageSnippet;
  ngOnInit() {
    this.getProducts();
  }
  getProducts() {
    this.products = [];
    this.rest.getProducts().subscribe((data: {}) => {
     // console.log("&&&&&&&&&&&&&&&");
      //console.log(data);
      //console.log("@@@@@@@@@@@@@@@@@@@");
      this.products = data;
     // debugger;
      
      console.log(this.products);
    });
  }

  add() {
    this.router.navigate(['/product-add']);
  }

  delete(id) {
    this.rest.deleteProduct(id)
      .subscribe(res => {
          this.getProducts();
        }, (err) => {
          console.log(err);
        }
      );
  }
}

