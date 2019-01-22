import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

export interface Options {
  heading?: string;
  parent?: Parent;
  removeFooter?: boolean;
}

export interface Parent {
  title: Array<string>;
  link: Array<string>;
}

@Component({
  selector: 'app-my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.css']
})
export class MyNavComponent implements OnInit, OnDestroy {
  public _router: any;
  public parent: Parent;
  public heading: string;
  routeOptions: Options;
    
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // event du/des changements de routes
    this._router = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Scroll to top on view load
        document.querySelector('.main-content').scrollTop = 0;
        this.runOnRouteChange();
      });

    this.runOnRouteChange();
  }

  ngOnDestroy() {
    this._router.unsubscribe();
  }

  /**
   * Event sur le changement de route
   */
  runOnRouteChange(): void {
    // récupération des data en fonction du routing et des valeurs 
    // dans le fichier de routing du composant en question
    this.route.children.forEach((route: ActivatedRoute) => {
      let activeRoute: ActivatedRoute = route;

      while (activeRoute.firstChild) {
        activeRoute = activeRoute.firstChild;
      }

      this.routeOptions = activeRoute.snapshot.data;
    });

    if (this.routeOptions && this.routeOptions.hasOwnProperty('heading')) {
      // init du header text
      this.heading = this.routeOptions.heading;
      // init a null du/des parent si il y en a (permetant la RAZ l'ancien objet)
      this.parent = null;
      // Si notre route a bien la propriété "Parent"
      if (this.routeOptions.hasOwnProperty('parent')) {
        // alors on remplie notre objet Parent
        this.parent = {
          link: this.routeOptions.parent.link,
          title: this.routeOptions.parent.title
        };
      }
    }
  }
}
