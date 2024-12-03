import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { ProfileData } from '../../../interfaces/profile.interface';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  // Datos del perfil cargados desde el ProfileService
  profileData: ProfileData | null = null;

  mensajeGuardado: boolean = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    // Suscribirse para obtener el valor del perfil al ser emitido por el BehaviorSubject
    this.profileService.profileData$.subscribe((data) => {
      if (data) {
        this.profileData = data;
      }
    });
  }

  // Guardar los cambios en el perfil
  guardarCambios() {
    if (this.profileData) {
      this.profileService.saveProfile(this.profileData);
      this.mensajeGuardado = true;
      setTimeout(() => (this.mensajeGuardado = false), 3000);
    }
  }
}
