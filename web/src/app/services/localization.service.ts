import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { languages, LangType } from '../constants/languages';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  private currentlang = new BehaviorSubject<{
    dir: string;
    lang: string;
  }>(languages.en);
  public lang = this.currentlang.asObservable().pipe(distinctUntilChanged());

  constructor(private translate: TranslateService) {}

  initTranslation() {
    const lang = this.getLanguageFromStorage();
    this.setLanguage(lang);
  }

  setLanguage(lang: LangType) {
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
    this.currentlang.next(languages[lang]);
    localStorage.setItem('lang', lang);
  }

  changeLanguage(lang: LangType) {
    const storedLang = this.getLanguageFromStorage();
    if (storedLang !== lang) {
      this.setLanguage(lang);
    }
  }

  getTranslatedWrods(words: string) {
    return this.translate.instant(words);
  }

  getLanguageFromStorage(): LangType {
    return (localStorage.getItem('lang') as LangType) || 'en';
  }
}
