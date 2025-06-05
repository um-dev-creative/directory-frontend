import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Button } from '@app/components/ui/buttons/button';
import { CardComponent } from '@app/components/ui/cards/card';
import { IconComponent } from '@app/components/ui';

@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterModule, Button, CardComponent, IconComponent],
  templateUrl: './about.html',
  styleUrl: './about.css',
  standalone: true
})
export class AboutComponent {
  public companyInfo = {
    name: 'Latin Hub',
    founded: '2025',
    mission: 'Descubre descuentos exclusivos, ofertas de negocios locales y recursos creados para ti. En LatinHub conectamos a la diáspora latinoamericana con oportunidades reales que fortalecen y hacen crecer a nuestra comunidad',
    vision: 'Ser la plataforma líder en conectar a la diáspora latinoamericana con oportunidades de negocio y crecimiento personal, impulsando un ecosistema de confianza y colaboración.',
    features: [
    {
      icon: 'heart',
      title: 'Comunidad primero',
      description: 'Creado por y para la diáspora latinoamericana'
    },
    {
      icon: 'bolt',
      title: 'Descuentos exclusivos',
      description: 'Accede a ofertas especiales de negocios locales'
    },
    {
      icon: 'map-pin',
      title: 'Enfoque local',
      description: 'Explora y apoya negocios latinos en tu zona'
    },
    {
      icon: 'users',
      title: 'Red en crecimiento',
      description: 'Conecta con miles de latinos que impulsan comunidad'
    }
  ],
    primary: {
      text: 'Únete a la Comunidad',
      link: '/auth',
      type: 'primary'
    },
    secondary: {
      text: 'Explorar Oportunidades',
      link: '/partner',
      type: 'secondary'
    },
  };

  public team = [
    {
      name: 'Luis Mata',
      position: 'Founder & CEO',
      description: 'Visionario emprendedor con experiencia en desarrollo tecnológico',
      image: '/assets/images/team/luis-mata.jpg'
    }
  ];

  public stats = [
    { number: '500+', label: 'Empresas Conectadas' },
    { number: '15', label: 'Países' },
    { number: '1000+', label: 'Oportunidades Creadas' },
    { number: '98%', label: 'Satisfacción del Cliente' }
  ];

  public getFounderInitials(): string {
    return this.team[0].name.split(' ').map(n => n.charAt(0)).join('');
  }
}
