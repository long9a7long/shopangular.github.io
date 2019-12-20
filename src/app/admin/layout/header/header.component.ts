import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from '../../../_models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  logOut() {
    this.authService.logOut();
  }
}
