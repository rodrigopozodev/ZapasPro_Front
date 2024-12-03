import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { ProfileData } from '../interfaces/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileDataSubject = new BehaviorSubject<ProfileData | null>(null);
  public profileData$ = this.profileDataSubject.asObservable();

  constructor(private userService: UserService) {
    this.loadProfile();
  }

  // Cargar los datos del perfil desde localStorage usando el correo del usuario
  private loadProfile(): void {
    const user = this.userService.getStoredUser();  // Obtener el usuario actual

    if (user) {
      // Utilizamos el correo del usuario como clave única para almacenar y recuperar el perfil
      const storedProfile = localStorage.getItem(`profile_${user.email}`);
      
      if (storedProfile) {
        // Si existe un perfil almacenado, cargarlo
        try {
          this.profileDataSubject.next(JSON.parse(storedProfile));
        } catch (error) {
          console.error('Error al parsear el perfil desde localStorage', error);
          this.profileDataSubject.next(this.getDefaultProfile());
        }
      } else {
        // Si no existe un perfil en localStorage, usar perfil por defecto
        this.profileDataSubject.next(this.getDefaultProfile());
      }
    } else {
      // Si no hay usuario logueado, usar perfil por defecto
      this.profileDataSubject.next(this.getDefaultProfile());
    }
  }

  private getDefaultProfile(): ProfileData {
    return {
      nombre: '',
      apellidos: '',
      preferenciaCompra: 'Todas',
      email: '',
      contrasena: '',
      telefono: '',
      cumpleanos: { mes: 'Mes', dia: 'Día', ano: '' },
      direccionEnvio: { calle: '', puerta: '', ciudad: '', codigoPostal: '' }
    };
  }

  saveProfile(profileData: ProfileData): void {
    const user = this.userService.getStoredUser();

    if (user) {
      try {
        // Guardamos el perfil utilizando el email como clave única
        localStorage.setItem(`profile_${user.email}`, JSON.stringify(profileData));
        this.profileDataSubject.next(profileData);  // Actualizamos el perfil en el BehaviorSubject
      } catch (error) {
        console.error('Error al guardar el perfil en localStorage', error);
      }
    }
  }

  // Limpiar el perfil cuando el usuario cierre sesión
  clearProfile(): void {
    const user = this.userService.getStoredUser();

    if (user) {
      try {
        // Eliminamos el perfil de localStorage
        localStorage.removeItem(`profile_${user.email}`);
        this.profileDataSubject.next(this.getDefaultProfile());  // Restablecemos el perfil a los valores por defecto
      } catch (error) {
        console.error('Error al limpiar el perfil de localStorage', error);
      }
    }
  }
}
