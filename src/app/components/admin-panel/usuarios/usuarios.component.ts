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

  constructor(private http: HttpClient, private userService: UserService, private router: Router) {
    this.loadUsers(); // Carga los usuarios al inicializar
  }

  ngOnInit(): void {
    this.showUsers = true; // Asegúrate de que los usuarios se muestren al inicializar
    this.loadUsers();
  }

  // Método para cargar usuarios
  public loadUsers(): void {
    this.getUsers().subscribe(
      (response: { success: boolean; users: User[] }) => {
        if (response.success) {
          this.users = response.users;
          this.filteredUsers = this.users; // Inicializar filteredUsers con todos los usuarios
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
}
