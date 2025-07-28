import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
// Aquí deberías importar el servicio de miembros

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css'],
})
export class AddMemberComponent {
  @Input() organizationId!: string;
  addMemberForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddMemberComponent>,
    private snackBar: MatSnackBar
  ) // private memberService: MemberService
  {
    this.addMemberForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.addMemberForm.invalid) return;
    this.loading = true;
    // Lógica para invitar miembro (llamar a memberService.addMember)
    // Ejemplo:
    // this.memberService.addMember({ organizationId: this.organizationId, email: this.addMemberForm.value.email })
    //   .subscribe(() => {
    //     this.snackBar.open('Invitación enviada', 'Cerrar', { duration: 3000 });
    //     this.dialogRef.close('added');
    //   }, err => {
    //     this.snackBar.open('Error al invitar', 'Cerrar', { duration: 3000 });
    //     this.loading = false;
    //   });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
