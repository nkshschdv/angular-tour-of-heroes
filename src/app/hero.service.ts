import { Injectable } from '@angular/core';
import { Hero } from './hero';
// import { HEROES } from './mock-heroes';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable()
export class HeroService {

  private heroesUrl = 'api/heroes'; // URL to web api
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log(`fetched heroes`)),
        catchError(this.handleError('getHeroes', []))
      );
  }


  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  private handleError1() {
    return (error: any): Observable<any> => {
      this.log(`${''} failed: ${error.message}`);
      return of('error');
    };
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remmote logging infrastruction
      console.error(error);

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id =${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** PUT: update the hero on the server  */
  updateHero(hero: Hero): Observable<any> {
    this.handleError1();
    return this.http.put(this.heroesUrl, hero, httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<Hero>('updateHero'))
      );
  }

  addHero(hero: Hero ): Observable<Hero> {
    return this.http.post(this.heroesUrl, hero , httpOptions)
    .pipe(
      tap(( h: Hero) => this.log(`Added new Hero w/ id = ${h.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
  deleteHero(hero: Hero | number ): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, httpOptions)
    .pipe(
      tap(_ => this.log(`deleted hero id = ${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  SearchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array
      return of ([]);
    }
    return this.http.get<Hero[]>(`api/heroes/?name=${term}`)
    .pipe(
      tap(_ => this.log(`found heroes matching"${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
}
