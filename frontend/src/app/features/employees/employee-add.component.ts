
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { UploadService } from '../../core/services/upload.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-add.component.html'
})
export class EmployeeAddComponent {
  private fb = inject(FormBuilder);
  private employeeService = inject(EmployeeService);
  private uploadService = inject(UploadService);
  private router = inject(Router);

  selectedFile: File | null = null;
  uploading = false;

  employeeForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    gender: ['Other', Validators.required],
    designation: ['', Validators.required],
    salary: [1000, [Validators.required, Validators.min(1000)]],
    date_of_joining: ['', Validators.required],
    department: ['', Validators.required],
    employee_photo: ['']
  });

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    this.selectedFile = file;
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    if (this.selectedFile) {
      this.uploading = true;

      this.uploadService.uploadPhoto(this.selectedFile).subscribe({
        next: (uploadRes: any) => {
          this.uploading = false;

          this.employeeForm.patchValue({
            employee_photo: uploadRes.url || ''
          });

          this.saveEmployee();
        },
        error: (err) => {
          this.uploading = false;
          console.error(err);
          alert('Photo upload failed');
        }
      });
    } else {
      this.saveEmployee();
    }
  }

  private saveEmployee(): void {
    const formValue = this.employeeForm.value;

    const input = {
      first_name: formValue.first_name!,
      last_name: formValue.last_name!,
      email: formValue.email!,
      gender: formValue.gender!,
      designation: formValue.designation!,
      salary: Number(formValue.salary),
      date_of_joining: formValue.date_of_joining!,
      department: formValue.department!,
      employee_photo: formValue.employee_photo || ''
    };

    this.employeeService.addEmployee(input).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Employee added successfully');
          this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/employees']);
        });
        } else {
          alert(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        alert('Add employee failed');
      }
    });
  }
}