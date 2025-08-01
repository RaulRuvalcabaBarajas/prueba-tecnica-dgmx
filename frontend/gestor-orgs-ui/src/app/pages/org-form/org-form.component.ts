import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrgService, Organization } from '../../services/org.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-org-form',
  templateUrl: './org-form.component.html',
  styleUrls: ['./org-form.component.css'],
})
export class OrgFormComponent implements OnInit {
  @Input() orgId?: string;
  orgForm!: FormGroup;
  isEdit = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private orgService: OrgService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.orgForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.orgId = id;
        this.loadOrg(id);
      }
    });
  }

  loadOrg(id: string): void {
    this.loading = true;
    this.orgService.get(id).subscribe(
      (org) => {
        this.orgForm.patchValue({
          name: org.name,
          description: org.description,
        });
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  async onSubmit(): Promise<void> {
    if (this.orgForm.invalid) return;
    this.loading = true;
    const data = this.orgForm.value;
    if (this.isEdit && this.orgId) {
      this.orgService.update(this.orgId, data).subscribe(
        (res) => {
          this.snackBar.open('Organización actualizada', 'Cerrar', {
            duration: 3000,
          });
          this.router.navigate(['/orgs']);
        },
        (err) => {
          this.snackBar.open('Error al actualizar', 'Cerrar', {
            duration: 3000,
          });
          this.loading = false;
        }
      );
    } else {
      try {
        // Obtener el usuario actual para usar su ID como ownerId
        const currentUser = await this.authService.currentUser();
        const dataWithOwner = {
          ...data,
          ownerId: currentUser.userId || currentUser.username
        };

        this.orgService.create(dataWithOwner).subscribe(
          (res) => {
            this.snackBar.open('Organización creada', 'Cerrar', {
              duration: 3000,
            });
            this.router.navigate(['/orgs']);
          },
          (err) => {
            this.snackBar.open('Error al crear', 'Cerrar', { duration: 3000 });
            this.loading = false;
          }
        );
      } catch (error) {
        console.error('Error al obtener usuario actual:', error);
        this.snackBar.open('Error al obtener información del usuario', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    }
  }
}
