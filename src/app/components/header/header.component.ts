import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';    
import { RouterModule } from '@angular/router';   

@Component({
  selector: 'app-header',
  standalone: true, // ensure this is set
  imports: [CommonModule, RouterModule], // Add RouterModule and CommonModule
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent { }

