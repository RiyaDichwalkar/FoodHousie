import { Component, OnInit, Input, NgZone } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import { AngularFireAction } from "@angular/fire/database";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { PostService } from "src/app/shared/post.service";
import { Post } from "../../shared/models/post.model";
import { DatePipe } from "@angular/common";
import { AmazingTimePickerService } from "amazing-time-picker";
import {
  Router,
  ActivatedRoute,
  NavigationStart,
  Event,
  NavigationEnd
} from "@angular/router";
import { map } from "rxjs/operators";
import { throwMatDialogContentAlreadyAttachedError } from "@angular/material";
import { AuthService } from "../../auth/auth.service";
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
  title: String;
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
  valid: boolean = true;
  formTemplate = new FormGroup({
    title: new FormControl(""),
    description: new FormControl(""),
    imageUrl: new FormControl("", Validators.required),
    label: new FormControl(""),
    type: new FormControl(""),
    pickuptimestart: new FormControl(""),
    pickuptimeend: new FormControl(""),
    deadlinetime: new FormControl(""),
    price: new FormControl("")
  });
  showLoadingIndicator = true;
  private selectedKey: string;
  private isedited: boolean = false;
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
    private datePipe: DatePipe
  ) {
    this.selectedKey = this._route.snapshot.paramMap.get("key");
    this.isedited = this._route.snapshot.paramMap.get("isedited") == "true";
  }

  ngOnInit() {
    const userrole = JSON.parse(localStorage.getItem("roles"));
    if (userrole.isCustomer) {
      this.router.navigate(["**"]);
    } else {
      this.user = JSON.parse(localStorage.getItem("user"));
      if (this.isedited) {
        this.setForm(this.selectedKey);
      } else {
        this.resetForm();
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
      if (this.isSelectEndTime) {
        this.isValidDate = this.validateDates(
          this.selectedStartTime,
          this.selectedEndTime
        );
      }
    });
  }
  openEndTime(ev: any) {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectedEndTime = time;
      this.isSelectEndTime = true;
      if (this.isSelectStartTime) {
        this.isValidDate = this.validateDates(
          this.selectedStartTime,
          this.selectedEndTime
        );
      }
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
    this.valid = true;
    if (
      !this.validateDates(this.selectedDeadLineTime, this.selectedStartTime)
    ) {
      this.valid = false;
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
                "MM/dd/yyyy"
              );
              formValue["pickuptimestart"] = this.selectedStartTime;
              formValue["pickuptimeend"] = this.selectedEndTime;
              formValue["deadlinetime"] = this.selectedDeadLineTime;
              this.service.createPost(formValue);
              this.resetForm();
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
        this.description = this.filledData["0"].description;
        (this.title = this.filledData["0"].title),
          (this.label = this.filledData["0"].label),
          (this.type = this.type["0"].type),
          (this.date = new Date(this.filledData["0"].date));
        this.price = this.filledData["0"].price;
      });
    this.selectedImage = null;
    this.isSubmitted = false;
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

    if (sDate != null && eDate != null && eDate < sDate) {
      this.error = {
        isError: true,
        errorMessage: "End date should be grater then start date."
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
