import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MemberService, Member } from '../../services/member.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-remove-member-dialog',
  templateUrl: './remove-member.component.html',
  styleUrls: ['./remove-member.component.css'],
})
export class RemoveMemberDialogComponent {
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { orgId: string; member: Member },
    private dialogRef: MatDialogRef<RemoveMemberDialogComponent>,
    private memberService: MemberService,
    private snackBar: MatSnackBar
  ) {}

  confirmRemove(): void {
    this.loading = true;
    this.memberService.remove(this.data.orgId, this.data.member.id).subscribe(
      () => {
        this.snackBar.open('Miembro eliminado', 'Cerrar', { duration: 3000 });
        this.dialogRef.close('removed');
      },
      (err) => {
        this.snackBar.open('Error al eliminar miembro', 'Cerrar', {
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
