import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArrayName, Validators, EmailValidator } from '@angular/forms';
import { NoNoServices } from './nono.services';
import { Observable } from 'rxjs';
import { reject } from 'q';
import { resolve } from 'url';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  proStatus = ['Stable', 'Critical', 'Finished'];
  forbidenProjectNamesArray;
  formStatus = 'Invalid!';
  projectForm: FormGroup;


  constructor(private nonoService: NoNoServices) {}

  onSendProjectStatus() {
    console.log(this.projectForm);
    if (this.formStatus !== 'Invalid!') {
      console.log('Project Name:' + this.projectForm.get('projectName').value);
      console.log('Project Email:' + this.projectForm.get('Email').value);
      console.log('Project Status:' + this.projectForm.get('proStatus').value);
    } else {
      console.log('Form is invalid! Can\'t log it out!');
    }
  }

  ngOnInit() {
    this.forbidenProjectNamesArray = this.nonoService.getForbidenNames();
    this.projectForm = new FormGroup({
      'projectName': new FormControl('I.T.S Project', [Validators.required, this.forbidenNamesValidator.bind(this)]),
      'Email': new FormControl(null, [Validators.required, Validators.email], this.forbidenEmails),
      'proStatus': new FormControl('Stable'),
    });
    this.projectForm.statusChanges.subscribe((valid) => {
      if (valid !== 'INVALID' ) {
        this.formStatus = 'Valid!';
      } else {
        this.formStatus = 'Invalid!';
      }
    });
  }

  forbidenNamesValidator(control: FormControl): {[s: string]: boolean} {
    if (this.forbidenProjectNamesArray.indexOf(control.value) !== -1) {
      return {'nameIsForbiden': true};
    }
    return null;
  }

  forbidenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any> ((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'emailIsForbiden': true});
        } else {
          resolve(null);
        }
      }, 2500);
    });
    return promise;
  }
}
