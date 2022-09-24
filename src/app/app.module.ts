import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HowToPlayComponent } from './pages/how-to-play/how-to-play.component';
import { FirstPlayerComponent } from './pages/first-player/first-player.component';

@NgModule({
  declarations: [
    AppComponent,
    HowToPlayComponent,
    FirstPlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
