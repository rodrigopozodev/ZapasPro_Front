import { Component } from '@angular/core';
import { User } from '../../../interfaces/user.interface';
import { UserService } from '../../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  private apiUrlUsers = 'http://localhost:3000/api/users';

  users: User[] = [];
  paginatedUsers: User[] = [];
  currentUser: User | null = null;
  showUsers: boolean = true; // Mostrar usuarios por defecto
  username: string = '';
  searchBy: string = ''; // 'username' o 'email'
  filteredUsers: User[] = [];
  isEditing = false; // Variable para controlar la visibilidad del formulario de edición
  currentPage: number = 1;
  totalPages: number = 1;
  email: string = '';
  password: string = '';
  role: string = 'client';
  showRegisterForm: boolean = false;
  searchTerm: string = '';
  roleFilter: string = ''; // 'admin', 'client' o ''
  itemsPerPage: number = 20; // Items por página

   // Errores de validación
   usernameError: string = '';
   emailError: string = '';
   passwordError: string = '';
   
   // Estado de validación de campos
   usernameValid: boolean = false;
   emailValid: boolean = false;
   passwordValid: boolean = false;

   roleError: string = '';
   roleValid: boolean = true;  // El rol es obligatorio, pero no se valida de la misma manera que el nombre o el correo
 

  constructor(private http: HttpClient, private userService: UserService, private router: Router) {
    this.loadUsers(); // Carga los usuarios al inicializar
  }

  ngOnInit(): void {
    this.showUsers = true; // Asegúrate de que los usuarios se muestren al inicializar
    this.loadUsers();
  }

   public loadUsers(): void {
    this.getUsers().subscribe(
      (response: { success: boolean; users: User[] }) => {
        if (response.success) {
          this.users = response.users;
          this.filteredUsers = this.users;
          this.updatePagination();
        } else {
          console.error('Error al obtener usuarios');
        }
      },
      (error: any) => {
        console.error('Error en la solicitud de usuarios:', error);
      }
    );
  }

  public getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrlUsers);
  }

  public editUser(user: User): void {
    this.isEditing = true;
    this.currentUser = { ...user };
    this.showRegisterForm = false; // Cierra el formulario de registro si se abre el de edición
  }

  public updateUser(): void {
    if (this.validateEditForm()) {
      if (this.currentUser) {
        this.http.put(`${this.apiUrlUsers}/${this.currentUser.id}`, this.currentUser).subscribe(
          (response) => {
            console.log('Usuario actualizado:', response);
            this.loadUsers();
            this.currentUser = null;
            this.isEditing = false; // Cierra el formulario de edición
          },
          (error: any) => {
            console.error('Error al actualizar el usuario:', error);
          }
        );
      }
    } else {
      alert('Por favor, corrija los errores en el formulario antes de enviar.');
    }
  }


  public deleteUser(id: number | undefined): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.http.delete(`${this.apiUrlUsers}/${id}`).subscribe(
        (response: any) => {
          alert(response.message);
          this.loadUsers();
          this.currentUser = null;
          this.isEditing = false; // Cierra el formulario de edición
        },
        (error: any) => {
          alert('Error al eliminar el usuario');
        }
      );
    }
  }

  public cancelEdit(): void {
    this.currentUser = null;
    this.isEditing = false;
  }

  public updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  public goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  register() {
    this.userService.register(this.username, this.email, this.password, this.role).subscribe(
      response => {
        alert('Usuario registrado con éxito');
        this.loadUsers();
        this.showRegisterForm = false; // Cerrar el formulario
        this.clearForm(); // Limpiar los campos del formulario
      },
      error => {
        alert('Error al registrar el usuario');
      }
    );
  }

  private clearForm() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.role = 'client'; // Reiniciar rol al valor por defecto
  }

  private resetRegisterForm() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.role = 'client'; // Resetea el rol a 'client'
  }

  filterUsers() {
    let filtered = this.users;

    // Filtrar por nombre de usuario o email
    if (this.searchTerm) {
      filtered = filtered.filter(user =>
        this.searchBy === 'username'
          ? user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
          : user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtrar por rol
    if (this.roleFilter) {
      filtered = filtered.filter(user => user.role === this.roleFilter);
    }

    this.filteredUsers = filtered;
    this.updatePagination(); // Actualiza la paginación después de filtrar
  }

  toggleRegisterForm() {
    if (this.showRegisterForm) {
      this.showRegisterForm = false; // Si ya está abierto, ciérralo
    } else {
      this.showRegisterForm = true;
      this.isEditing = false; // Cierra el formulario de edición al abrir el de registro
      this.clearForm(); // Limpiar el formulario al abrir
    }
  }

  cancelRegister() {
    this.showRegisterForm = false;
    this.clearForm(); // Limpiar el formulario al cancelar
  }

   // Validaciones de campos
   validateForm(): boolean {
    // Resetea los errores previos
    this.usernameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.usernameValid = false;
    this.emailValid = false;
    this.passwordValid = false;

    let valid = true;

    // Validación del nombre de usuario
    if (!this.username) {
      this.usernameError = 'Por favor, ingrese un nombre de usuario.';
      valid = false;
    } else if (/\s/.test(this.username)) {
      this.usernameError = 'El nombre de usuario no debe contener espacios.';
      valid = false;
    } else if (!/^[A-Z]/.test(this.username)) {
      this.usernameError = 'El nombre de usuario debe comenzar con una letra mayúscula.';
      valid = false;
    } else if (!/^[A-Za-z]+$/.test(this.username)) {
      this.usernameError = 'El nombre de usuario solo debe contener letras sin números ni signos.';
      valid = false;
    } else {
      this.usernameValid = true;
    }

    // Validación del correo electrónico
    if (!this.email) {
      this.emailError = 'Por favor, rellene este campo.';
      valid = false;
    } else if (/[A-Z]/.test(this.email)) {
      this.emailError = 'El correo electrónico no debe contener mayúsculas.';
      valid = false;
    } else if (!this.email.includes('@') || !this.email.includes('.')) {
      this.emailError = 'El correo electrónico debe contener al menos un "@" y un "."';
      valid = false;
    } else {
      this.emailValid = true;
    }

    // Validación de la contraseña
    if (!this.password) {
      this.passwordError = 'Por favor, rellene este campo.';
      valid = false;
    } else if (this.password.length < 8) {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres.';
      valid = false;
    } else if (!/[0-9]/.test(this.password)) {
      this.passwordError = 'La contraseña debe incluir al menos un número.';
      valid = false;
    } else if (!/[A-Z]/.test(this.password)) {
      this.passwordError = 'La contraseña debe incluir al menos una letra mayúscula.';
      valid = false;
    } else {
      this.passwordValid = true;
    }

    return valid;
  }

   // Método para validar el formulario de edición
   validateEditForm(): boolean {
    // Resetea los errores previos
    this.usernameError = '';
    this.emailError = '';
    this.roleError = '';
    this.usernameValid = false;
    this.emailValid = false;
    this.roleValid = true;  // No necesita validación adicional para rol

    let valid = true;

    // Validación del nombre de usuario
    if (!this.currentUser?.username) {
      this.usernameError = 'Por favor, ingrese un nombre de usuario.';
      valid = false;
    } else if (/\s/.test(this.currentUser.username)) {
      this.usernameError = 'El nombre de usuario no debe contener espacios.';
      valid = false;
    } else if (!/^[A-Z]/.test(this.currentUser.username)) {
      this.usernameError = 'El nombre de usuario debe comenzar con una letra mayúscula.';
      valid = false;
    } else if (!/^[A-Za-z]+$/.test(this.currentUser.username)) {
      this.usernameError = 'El nombre de usuario solo debe contener letras sin números ni signos.';
      valid = false;
    } else {
      this.usernameValid = true;
    }

    // Validación del correo electrónico
    if (!this.currentUser?.email) {
      this.emailError = 'Por favor, ingrese un correo electrónico.';
      valid = false;
    } else if (/[A-Z]/.test(this.currentUser.email)) {
      this.emailError = 'El correo electrónico no debe contener mayúsculas.';
      valid = false;
    } else if (!this.currentUser.email.includes('@') || !this.currentUser.email.includes('.')) {
      this.emailError = 'El correo electrónico debe contener al menos un "@" y un "."';
      valid = false;
    } else {
      this.emailValid = true;
    }

    // Validación del rol (solo opcional si quieres agregar validaciones adicionales para el rol)
    if (!this.currentUser?.role) {
      this.roleError = 'Por favor, seleccione un rol.';
      valid = false;
    }

    return valid;
  }
}
