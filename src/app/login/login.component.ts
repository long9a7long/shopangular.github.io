import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: any = {};
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  logIn(form) {
    this.user.manhanvien = form.value.username;
    this.user.password = form.value.password;

    this.authService.logIn(this.user).subscribe(next => {}, error => {
      alert('Login Fail');
    }, () => {
      this.router.navigate(['/admin']);
    });
  }
}
