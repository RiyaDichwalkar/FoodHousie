import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { NewUser } from "../newuser.model";
@Injectable({
  providedIn: "root"
})
export class RegisterService {
  formData: NewUser;
  constructor(private firestore: AngularFirestore) {}
}
