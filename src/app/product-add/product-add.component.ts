import { Component, OnInit , Input } from '@angular/core';
import { ProductapiService } from '../productapi.service';
import { ActivatedRoute, Router } from '@angular/router';

import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';


class ImageSnippet {
 pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}



const URL = 'http://localhost:3000/products';
@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
  @Input() productData = { prod_name:'', prod_desc: '', prod_price: 0 ,prod_image:''};
  constructor(public rest:ProductapiService, private route: ActivatedRoute, private router: Router) { }
  
  //public uploader: FileUploader = new FileUploader({url: URL, itemAlias: 'prod_image'});

  ngOnInit() {
  }
  selectedFile:ImageSnippet;
  
  processFile(imageInput:any){
    //debugger;
    const imagefile: File = imageInput.files[0];
    const reader = new FileReader();

    reader.onload=(e:any) => {
//debugger;
      this.selectedFile = new ImageSnippet(e.target.result, imagefile);
      this.productData.prod_image=e.target.result;
    };
    
    reader.readAsDataURL(imagefile);
  }
  addProduct() {
  //  debugger;
   // this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    //this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
  //      console.log('ImageUpload:uploaded:', item, status, response);
  //      alert('File uploaded successfully');
  // }
  
    this.rest.addProduct(this.productData).subscribe((result) => {
     // console.log("reached here **********");
      //console.log(this.productData);
      //console.log("Resulr");
      //console.log(result);
      //console.log("mmd");
      //console.log(result.createdProduct.prod_name);
      //console.log(result._id);
      this.router.navigate(['/product-details/'+result.createdProduct._id]);
    }, (err) => {
      console.log(err);
    });
  }


}


