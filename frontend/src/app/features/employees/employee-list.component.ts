import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { AuthService } from '../../core/services/auth.service';




@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  employees: any[] = [];
  designation = '';
  department = '';

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    console.log("LOADING EMPLOYEES... 🔥");

    this.employeeService.getAllEmployees().subscribe({
      next: (res: any) => {
        console.log("API RESPONSE:", res);

        if (res.success) {
          this.employees = res.data || [];
          console.log("EMPLOYEES ARRAY:", this.employees);
        } else {
          console.log("BACKEND ERROR:", res.message);
          alert(res.message);
        }
      },
      error: (err) => {
        console.error("API ERROR:", err);
      }
    });
  }

  search(): void {
    if (!this.designation && !this.department) {
      this.loadEmployees();
      return;
    }

    this.employeeService.searchEmployees({
      designation: this.designation || undefined,
      department: this.department || undefined
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.employees = res.data || [];
        } else {
          alert(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Search failed');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}