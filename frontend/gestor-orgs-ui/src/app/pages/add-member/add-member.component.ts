import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css'],
})
export class AddMemberComponent implements OnInit {
  organizationId!: string;
  memberForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private memberService: MemberService
  ) {
    this.memberForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['member', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.organizationId = this.route.snapshot.paramMap.get('id') || '';
  }

  onSubmit(): void {
    if (this.memberForm.invalid) return;
    
    this.loading = true;
    const email = this.memberForm.value.email;

    this.memberService.add(this.organizationId, email).subscribe({
      next: () => {
        this.snackBar.open('Invitación enviada exitosamente', 'Cerrar', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/org-detail', this.organizationId]);
      },
      error: (err: any) => {
        this.snackBar.open('Error al enviar invitación', 'Cerrar', { 
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/org-detail', this.organizationId]);
  }
}
