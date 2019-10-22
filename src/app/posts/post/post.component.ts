import { Component, OnInit, Input, NgZone } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators, AbstractControl 
} from "@angular/forms";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { PostService } from "src/app/shared/post.service";
import { Post } from "../../shared/models/post.model";
import { DatePipe } from "@angular/common";
import { AmazingTimePickerService } from "amazing-time-picker";
import {
  Router,
  ActivatedRoute,
} from "@angular/router";
import { map } from "rxjs/operators";
import { AuthService } from "../../auth/auth.service";
import { AngularFirestore } from '@angular/fire/firestore';
declare var $: any;
@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"],
  providers: [DatePipe]
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  imgUrl: String;
  label: String;
  title: String="";
  type: String;
  selectedImage: any;
  isSubmitted: boolean;
  selectedDate: string;
  selectedStartTime: string;
  selectedEndTime: string;
  selectedDeadLineTime: string;
  description: string;
  isSelectStartTime: boolean = false;
  isSelectEndTime: boolean = false;
  price: number;
  date = new Date();
  maxDate = new Date();
  minDate = new Date(this.date);
  error: any = { isError: false, errorMessage: "" };
  isValidDate: any;
  isEditable:boolean=true;
  valid: boolean = true;
  formTemplate = new FormGroup({
    title: new FormControl("",Validators.required),
    description: new FormControl("",Validators.required),
    imageUrl: new FormControl("", Validators.required),
    label: new FormControl("", Validators.required),
    type: new FormControl("", Validators.required),
    pickuptimestart: new FormControl(""),
    pickuptimeend: new FormControl(""),
    deadlinetime: new FormControl(""),
    price: new FormControl("" ,  Validators.compose([
      Validators.required,
      Validators.min(1),
      Validators.pattern('^[0-9]*$')]))
  });
  showLoadingIndicator = true;
  private selectedKey: string;
 // private isedited: boolean = false;
  private filledData: any;

  user: any;
  constructor(
    public authService: AuthService,
    public router: Router,
    private auth: AuthService,
    public ngZone: NgZone,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private atp: AmazingTimePickerService,
    private service: PostService,
    private datePipe: DatePipe,
    private db:AngularFirestore,
  ) {
    this.isEditable=true;
    this.selectedKey = this._route.snapshot.paramMap.get("key");
    //this.isedited = this._route.snapshot.paramMap.get("isedited") == "true";
  }

  ngOnInit() {

    const userrole = JSON.parse(localStorage.getItem("roles"));
    if (userrole.isCustomer) {
      this.router.navigate(["**"]);
    } else {
      this.user = JSON.parse(localStorage.getItem("user"));
      if (this.selectedKey) {
        this.isEditable=false;
        this.setForm(this.selectedKey);
        
      } else {
        this.resetForm();
        this.isEditable=true;
        this.selectedStartTime = this.datePipe.transform(this.date, "HH:mm");
        this.selectedEndTime = this.datePipe.transform(this.date, "HH:mm");
        this.selectedDeadLineTime = this.datePipe.transform(this.date, "HH:mm");
      }
      this.maxDate.setDate(this.date.getDate() + 7);
    }
  }
 
  openStartTime(ev: any) {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectedStartTime = time;
      this.isSelectStartTime = true;
    });
  }
  openEndTime(ev: any) {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectedEndTime = time;
      this.isSelectEndTime = true;
    });
  }
  openDeadLineTime(ev: any) {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectedDeadLineTime = time;
    });
  }
  setDate(date: string) {
    this.selectedDate = date ? date : "";
  }

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imgUrl = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      this.imgUrl = "../../../assets/post-img/image_placeholder.jpg";
      this.selectedImage = null;
    }
  }
  onSubmit(formValue) {

    this.isSubmitted = true;
    if(this.title){
    formValue["title"]=this.title;
     }
    this.valid = true;
    if (
      
      !this.validateDates(this.selectedStartTime, this.selectedEndTime) ||  !this.validateDeadLineDates(this.selectedDeadLineTime, this.selectedStartTime) 
    ) {
      this.valid = false;
    }
    if(this.selectedKey){
    this.formControls.title.setErrors(null);
    }
    if (this.formTemplate.valid && this.valid) {
      var filePath = `${formValue.key}/${this.selectedImage.name
        .split(".")
        .slice(0, -1)
        .join(".")}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage
        .upload(filePath, this.selectedImage)
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(url => {
              (formValue["userid"] = this.user.uid),
                (formValue["username"] = this.user.fullname),
                (formValue["dishsold"] = 0),
                (formValue["imageUrl"] = url);
              formValue["date"] = this.datePipe.transform(
                this.date,
                "dd/MM/yyyy"
              );
              formValue["pickuptimestart"] = this.selectedStartTime;
              formValue["pickuptimeend"] = this.selectedEndTime;
              formValue["deadlinetime"] = this.selectedDeadLineTime;

              if(this.selectedKey){
                this.db. collection("posts").doc(this.selectedKey).update({
                  imageUrl: formValue['imageUrl'],
                  date:formValue['date'],
                  deaalinetime:formValue["deadlinetime"],
                  label: formValue["label"],
                  type: formValue["type"],
                  pickuptimestart: formValue["pickuptimestart"],
                  pickuptimeend:formValue["pickuptimeend"],
                  description: formValue["description"],
                  price: formValue["price"]
                });
              }else{
              this.service.createPost(formValue);
              }
              this.resetForm();
             this.router.navigate(["dashboard"]);
            });
          })
        )
        .subscribe();
    }
  }
  get formControls() {
    return this.formTemplate["controls"];
  }
  setForm(key) {
    this.formTemplate.reset();
    this.service
      .getPost(key)
      .snapshotChanges()
      .pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.doc.id, ...c.payload.doc.data() }))
        )
      )
      .subscribe(result => {
        this.filledData = result;
         this.selectedStartTime = this.filledData["0"].pickuptimestart;
         this.selectedEndTime = this.filledData["0"].pickuptimeend;
         this.selectedDeadLineTime = this.filledData["0"].deadlinetime;
        this.imgUrl = this.filledData["0"].imageUrl;
        this.title = this.filledData["0"].title;
      });
    this.selectedImage = null;
    this.isSubmitted = false;
  }

  validateDeadLineDates(sDate: string, eDate: string) { 
    this.isValidDate = true;
    if (sDate == null || eDate == null) {
      this.error = {
        isError: true,
        errorMessage: "Start date and Deadline date are required."
      };

      this.isValidDate = false;
      alert(this.error.errorMessage);
    }
    if (sDate == eDate) {
      this.error = {
        isError: true,
        errorMessage: "Start date and Deadline date could not be same"
      };

      this.isValidDate = false;
      alert(this.error.errorMessage);
    }
    if (sDate != null && eDate != null && eDate < sDate) {
      this.error = {
        isError: true,
        errorMessage: "Start date should be greater then Deadline date."
      };
      this.isValidDate = false;
      alert(this.error.errorMessage);
    }

    return this.isValidDate;
  }
  validateDates(sDate: string, eDate: string) {
  
    this.isValidDate = true;

    if (sDate == null || eDate == null) {
      this.error = {
        isError: true,
        errorMessage: "Start date and end date are required."
      };

      this.isValidDate = false;
      alert(this.error.errorMessage);
    }
    if (sDate == eDate) {
      this.error = {
        isError: true,
        errorMessage: "Start date and end date could not be same"
      };

      this.isValidDate = false;
      alert(this.error.errorMessage);
    }
    if (sDate != null && eDate != null && eDate < sDate) {
      this.error = {
        isError: true,
        errorMessage: "End date should be greater then start date."
      };
      this.isValidDate = false;
      alert(this.error.errorMessage);
    }

    return this.isValidDate;
  }

  //reseting the form
  resetForm() {
    this.formTemplate.reset();
    this.imgUrl = "../../../assets/post-img/image_placeholder.jpg";
    this.selectedImage = null;
    this.isSubmitted = false;
  }
}
