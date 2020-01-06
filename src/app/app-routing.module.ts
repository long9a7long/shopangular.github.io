import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { JwtModule } from '@auth0/angular-jwt';
const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then(mod => mod.LoginModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./admin/admin.module').then(mod => mod.AdminModule)
  },
  { path: '', redirectTo: 'admin', pathMatch: 'full' }
];
export function tokenGetter() {
  return localStorage.getItem('token');
}
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      enableTracing: false
    }),
    JwtModule.forRoot({
      config: {
         tokenGetter: tokenGetter,
         whitelistedDomains: ['localhost:8090', 'springbootapijava.herokuapp.com'],
         blacklistedRoutes: ['localhost:5000/api/auth']
      }
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
