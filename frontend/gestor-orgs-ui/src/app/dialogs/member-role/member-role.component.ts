import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MemberService, Member } from '../../services/member.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-member-role-dialog',
  templateUrl: './member-role.component.html',
  styleUrls: ['./member-role.component.css'],
})
export class MemberRoleDialogComponent {
  roles = ['Owner', 'Admin', 'Member'];
  selectedRole: string;
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { orgId: string; member: Member },
    private dialogRef: MatDialogRef<MemberRoleDialogComponent>,
    private memberService: MemberService,
    private snackBar: MatSnackBar
  ) {
    this.selectedRole = data.member.role;
  }

  changeRole(): void {
    this.loading = true;
    this.memberService
      .updateRole(this.data.orgId, this.data.member.id, this.selectedRole)
      .subscribe(
        () => {
          this.snackBar.open('Rol actualizado', 'Cerrar', { duration: 3000 });
          this.dialogRef.close('updated');
        },
        (err) => {
          this.snackBar.open('Error al actualizar rol', 'Cerrar', {
            duration: 3000,
          });
          this.loading = false;
        }
      );
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
