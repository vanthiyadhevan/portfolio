import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('typingText', { static: true }) typingTextRef: ElementRef | undefined;

  private phrases: string[] = ["DevOps Engineer","AWS Architect","Cloud Engineer","AI Engineer"];
  private currentPhraseIndex: number = 0;
  private currentPhrase: string = '';
  private isTyping: boolean = true;
  private typeSpeed: number = 50;
  private backSpeed: number = 25;
  private backDelay: number = 500;
  private loopAnimation: boolean = true; // Flag to control animation loop

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.typeNextPhrase();
  }

  private typeNextPhrase() {
    if (!this.loopAnimation && this.currentPhraseIndex >= this.phrases.length) {
      return; // Stop the animation if loopAnimation is false and all phrases have been typed
    }

    if (this.currentPhraseIndex >= this.phrases.length) {
      this.currentPhraseIndex = 0; // Reset to the beginning when all phrases have been typed
      this.currentPhrase = '';
    }

    const phrase = this.phrases[this.currentPhraseIndex];
    const charArray = phrase.split('');
    const intervalId = setInterval(() => {
      if (this.isTyping) {
        if (charArray.length > 0) {
          this.currentPhrase += charArray.shift();
          this.renderer.setProperty(this.typingTextRef!.nativeElement, 'innerText', this.currentPhrase);
        } else {
          this.isTyping = false;
          clearInterval(intervalId);
          setTimeout(() => {
            this.backspace();
          }, this.backDelay);
        }
      }
    }, this.typeSpeed);
  }

  private backspace() {
    const intervalId = setInterval(() => {
      if (!this.isTyping) {
        const phrase = this.phrases[this.currentPhraseIndex];
        if (this.currentPhrase === phrase) {
          this.isTyping = true;
          clearInterval(intervalId);
          setTimeout(() => {
            this.currentPhrase = '';
            this.renderer.setProperty(this.typingTextRef!.nativeElement, 'innerText', this.currentPhrase);
            this.currentPhraseIndex++;
            this.typeNextPhrase();
          }, this.backDelay);
        } else {
          this.currentPhrase = this.currentPhrase.slice(0, -1);
          this.renderer.setProperty(this.typingTextRef!.nativeElement, 'innerText', this.currentPhrase);
        }
      }
    }, this.backSpeed);
  }
}


// var typed = new Typed(".typing-text", {
//   strings: ["frontend development", "backend development", "web designing", "android development", "web development"],
//   loop: true,
//   typeSpeed: 50,
//   backSpeed: 25,
//   backDelay: 500,
// });