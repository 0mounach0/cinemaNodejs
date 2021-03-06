import { Component, OnInit, Inject } from '@angular/core';
import { StorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { App } from 'src/app/models/app/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  app: App = new App();

  constructor(
    @Inject(SESSION_STORAGE) private storage: StorageService,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
  }


  get appStore() {
    return this.storage.get('app');
  }

  logout() {
    let promise = new Promise((resolve, reject) => {

      this.authService.logout()
      .subscribe((response: any) => {

        resolve(response);

        this.app.error = true; 
        this.app.email = null; 
        this.app.status = 'NOT AUTHORIZED';
        this.app.username = '*** NONE ***'; 
        this.app.role = null;
        
        this.storage.set("app", this.app);
        this.router.navigate(['/home']);

      } ,
      err => {
        reject(err);

        this.app.error = true; 
        this.app.email = null; 
        this.app.status = 'NOT AUTHORIZED';
        this.app.username = '*** NONE ***'; 
        this.app.role = null;
        
        this.storage.set("app", this.app);
        this.router.navigate(['/home']);
      }
    );
  });
  
  return promise;
  }

}
