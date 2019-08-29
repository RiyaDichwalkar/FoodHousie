import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAction } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { PostService } from 'src/app/shared/post.service';
import { Post } from '../../shared/models/post.model';
import { DatePipe } from '@angular/common';

declare var $: any;
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [DatePipe]
})
export class PostComponent implements OnInit {
  imgSrc: String;
  selectedImage:any;
  isSubmitted:boolean;
  
  date = new Date();
  maxDate=new Date();
  minDate = new Date(this.date);
  
  
  // minDate = new Date(2019,08,30);
  // maxDate =new Date(2019,10,15);
  
  //post: Post = new Post();
  
  formTemplate= new FormGroup({
    caption:new FormControl('',Validators.required),
    category: new FormControl(''),
    imageUrl:new FormControl('',Validators.required)
  });
  constructor(private storage : AngularFireStorage, private service :PostService,private datePipe: DatePipe) {
   
   }
  // // today =new Date();
  //  minDate = this.today;
  //  maxDate = this.today.setDate(this.today.getDate()+7);
  ngOnInit() {
    this.resetForm();
    this.maxDate.setDate(this.date.getDate()+7);
    console.log(this.date);
    console.log(this.minDate);
    console.log(this.maxDate);
   // debugger;
    // console.log((this.today.setDate(this.today.getDate()+7)));
  //   console.log(typeof(new Date(this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd'))));
  //   //console.log(this.date1);
  //   this.today= new Date(this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd'))
  //   console.log("hhhhhh");
  //   console.log(this.today);
  //   console.log(this.today.getDate());
  //  /// console.log(this.today.setDate(this.today +3));
   
  //   console.log("yyyy");
  //  // console.log(t);
  //   console.log("bbb");
  //   //date1.setDate(date1 + 2);
  //   //console.log(n);
  //   console.log("PPP");
  //   // console.log(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
  //   // console.log(this.datePipe.transform(this.date.getDate(), 'yyyy-MM-dd'));
  //   // this.date=new Date(this.date.setDate(this.date.getDate() + 1));;
    
    // console.log(this.datePipe.transform(this.date, 'yyyy-MM-dd'));
  }
  showPreview(event:any){
    if (event.target.files && event.target.files[0]){
      const reader= new FileReader();
      reader.onload=(e:any)=>this.imgSrc=e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage=event.target.files[0];
    }
    else{
      this.imgSrc="../../../assets/post-img/image_placeholder.jpg";
      this.selectedImage=null;
    }
  }
  onSubmit(formValue){
    //debugger;
    this.isSubmitted=true;
    //debugger;
    if(this.formTemplate.valid){
      debugger;
       var filePath =`${formValue.category}/${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`
      console.log(this.storage.ref(filePath));
       const fileRef =this.storage.ref(filePath);
      console.log("rrrrrrrr");
      console.log(this.storage.ref(filePath));
      console.log(fileRef);
       this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
        finalize(()=>{
          fileRef.getDownloadURL().subscribe((url)=>{
              formValue['imageUrl']=url;
              
              this.service.createPost(formValue);
              this.resetForm();
          });
        })
      ).subscribe();
    }
  }
  get formControls(){
    //debugger;
    return this.formTemplate['controls'];
  }
  resetForm(){
    this.formTemplate.reset();
    this.formTemplate.setValue({
      caption:'',
      imageUrl:'',
      category:'Animal'
    });
    this.imgSrc="../../../assets/post-img/image_placeholder.jpg";
    this.selectedImage=null;
    this.isSubmitted=false;
  }
}

