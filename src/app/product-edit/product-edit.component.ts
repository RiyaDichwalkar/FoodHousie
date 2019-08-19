import { Component, OnInit , Input} from '@angular/core';
import { ProductapiService } from '../productapi.service';
import { ActivatedRoute, Router } from '@angular/router';



class ImageSnippet {
  pending: boolean = false;
   status: string = 'init';
 
   constructor(public src: string, public file: File) {}
 }

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  @Input() productData:any = { prod_name: '', prod_desc: '', prod_price:0 ,prod_image:''};
  constructor(public rest:ProductapiService, private route: ActivatedRoute, private router: Router) { }
  ImgFile:ImageSnippet;
  isSelected:boolean;
  ngOnInit() {
    
    this.rest.getProduct(this.route.snapshot.params['id']).subscribe((data: {}) => {
      debugger;
      console.log(data);
      this.productData = data;
      console.log('yyyyy');
      console.log(this.productData);
      this.ImgFile=this.productData.product.prod_image;
      this.isSelected=false;
    });
  }
 selectedFile:ImageSnippet;

  processFile(imageInput:any){
    //debugger;
    const imagefile: File = imageInput.files[0];
    const reader = new FileReader();

    reader.onload=(e:any) => {
//debugger;
      this.selectedFile = new ImageSnippet(e.target.result, imagefile);
      this.productData.product.prod_image=e.target.result;
      this.isSelected=true;
    };
    
    reader.readAsDataURL(imagefile);
  }
  updateProduct() {

   // console.log('VVVVVVVVVVVVVVV');
    //console.log(this.productData);
    //console.log('hhhhhhhhhh');
    //console.log(this.route.snapshot.params);
    debugger;

    this.rest.updateProduct(this.route.snapshot.params['id'], this.productData).subscribe((result) => {
      //console.log("result");
     // console.log(result);
      this.router.navigate(['/product-details/'+result.id]);
    }, (err) => {
      console.log(err);
    });
  }
  

}

