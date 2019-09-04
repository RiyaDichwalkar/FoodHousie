import { Component, OnInit ,Input,NgZone} from '@angular/core';
import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
import { AngularFireAction } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { PostService } from 'src/app/shared/post.service';
import { Post } from '../../shared/models/post.model';
import { DatePipe } from '@angular/common';
import {AmazingTimePickerService } from 'amazing-time-picker';
import { Router,ActivatedRoute, NavigationStart, Event, NavigationEnd} from '@angular/router';
import { map } from 'rxjs/operators';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { AuthService } from "../../auth/auth.service";
declare var $: any;
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [DatePipe]
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  imgUrl: String;
  isLinear = false;
  selectedImage:any;
  isSubmitted:boolean;
  selectedDate:string;
  selectedTime:string;
  date = new Date();
  maxDate=new Date();
  minDate = new Date(this.date);
 
  
  // minDate = new Date(2019,08,30);
  // maxDate =new Date(2019,10,15);
  
  //post: Post = new Post();
  // firstFormGroup: FormGroup;
  // secondFormGroup: FormGroup;

  formTemplate= new FormGroup({
    caption:new FormControl('',Validators.required),
    category: new FormControl(''),
    imageUrl:new FormControl('',Validators.required),
    date: new FormControl('',),
     starttime:new FormControl(''),
    // endtime:new FormControl('',Validators.required)
  });
  showLoadingIndicator=true;
  private selectedKey:string;
  private isedited:boolean=false;
  private filledData:any;
  constructor(public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
   private _route: ActivatedRoute,private _formBuilder: FormBuilder,private storage : AngularFireStorage,private atp:AmazingTimePickerService, private service :PostService,private datePipe: DatePipe) {
   // debugger;
    // this._router.events.subscribe((routerEvent:Event)=>{
    //     if(routerEvent instanceof NavigationStart){
    //       this.showLoadingIndicator=true;
    //     //  debugger;
    //     }
    //     if(routerEvent instanceof NavigationEnd){
    //       this.showLoadingIndicator=false;
    //      // debugger;
    //     }
    // });
    debugger
    this.selectedKey=this._route.snapshot.paramMap.get('key');
    this.isedited=(this._route.snapshot.paramMap.get('isedited')=="true");
    console.log(this.selectedKey);
    console.log("&&&&&&7");
    console.log(this.isedited);

   }
  // // today =new Date();
  //  minDate = this.today;
  //  maxDate = this.today.setDate(this.today.getDate()+7);
  ngOnInit() {
    if(this.isedited)
    {this.setForm(this.selectedKey);
      
    }
    else{
      this.resetForm();
      
      console.log(this.date);
      console.log(this.minDate);
      console.log(this.maxDate);
    this.selectedTime=this.datePipe.transform(this.date, 'HH:mm')
    }
    this.maxDate.setDate(this.date.getDate()+7);
    // this.firstFormGroup = this._formBuilder.group({
    //   firstCtrl: ['', Validators.required]
    // });
    // this.secondFormGroup = this._formBuilder.group({
    //   secondCtrl: ['', Validators.required]
    // });
   
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

  open(ev: any){
  //  debugger;
    const amazingTimePicker=this.atp.open();
    //debugger;
    amazingTimePicker.afterClose().subscribe(time=>{
      console.log(time);
      this.selectedTime=time;
    
    });
  }
  setDate(date: string) {
    this.selectedDate = date ? date : '';
  }
  setTime(time: string) {
    this.selectedTime = time? time: '';
    console.log("&&&&&&&&&&");
    console.log(this.selectedTime);
  }

  showPreview(event:any){
    if (event.target.files && event.target.files[0]){
      const reader= new FileReader();
      reader.onload=(e:any)=>this.imgUrl=e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage=event.target.files[0];
    }
    else{
      this.imgUrl="../../../assets/post-img/image_placeholder.jpg";
      this.selectedImage=null;
    }
  }
  onSubmit(formValue){
    //debugger;
    
    this.isSubmitted=true;
   // debugger;
    if(this.formTemplate.valid){
    //  debugger;
      
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
              formValue['date']=this.datePipe.transform(this.date, 'MM/dd/yyyy')
              formValue['starttime']=this.selectedTime;
             // formvalue['key']=
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
  setForm(key){
    debugger;
    this.formTemplate.reset();
    console.log("OKKKKK");
    console.log(key);
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    this.service.getPost(key).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(result => {
     console.log("aaaaaaaaa");
     console.log(typeof(result));
     this.filledData=result ;
     debugger;
     console.log(this.filledData);
     console.log("datata");
     
     console.log(this.filledData['0'].caption);
     var category=this.filledData['0'].category;
     this.selectedTime=this.filledData['0'].starttime;
     this.imgUrl=this.filledData['0'].imageUrl;
     //this.filledData['0'].startime;
    debugger;
  this.date=new Date( this.filledData['0'].date);
     console.log("zzzzz");
     this.formTemplate.setValue({
      caption:this.filledData['0'].caption,
      imageUrl:'',
      category:this.filledData['0'].category,
      date:'',
      starttime:'',
      //endtime:''
    });
     
      // imageUrl:this.filledData['0'].imageUrl,
      // category:this.filledData['0'].category,
     // date:this.filledData['0'].date,
      
     // starttime:this.filledData['0'].starttime,
   // });

    });

    // var category=this.filledData['0'].category;
    // console.log("zzzzz");
    // debugger;
    // console.log(typeof(category));
    // console.log(category);
    // this.formTemplate.setValue({
    //   caption:'',
    //   imageUrl:'',
    //   category:category,
    //   date:'',
    //   starttime:'',
    // });
   // this.imgUrl="../../../assets/post-img/image_placeholder.jpg";
  // debugger;
  // this.selectedTime='19:30';
   //this.filledData['0'].startime;
  // debugger;
//this.date=new Date("09/09/2019");
//this.filledData['0'].date;
//debugger;

    this.selectedImage=null;
    this.isSubmitted=false;
  }

  resetForm(){
    this.formTemplate.reset();
    this.formTemplate.setValue({
      caption:'',
      imageUrl:'',
      category:'Animal',
      date:'',
      starttime:'',
      //endtime:''
    });
    this.imgUrl="../../../assets/post-img/image_placeholder.jpg";
    this.selectedImage=null;
    this.isSubmitted=false;
  }
}

