import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrgService, Organization } from '../../services/org.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-org-dialog',
  templateUrl: './delete-org.component.html',
  styleUrls: ['./delete-org.component.css'],
})
export class DeleteOrgDialogComponent {
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public org: Organization,
    private dialogRef: MatDialogRef<DeleteOrgDialogComponent>,
    private orgService: OrgService,
    private snackBar: MatSnackBar
  ) {}

  confirmDelete(): void {
    this.loading = true;
    this.orgService.delete(this.org.id).subscribe(
      () => {
        this.snackBar.open('Organización eliminada', 'Cerrar', {
          duration: 3000,
        });
        this.dialogRef.close('deleted');
      },
      (err) => {
        this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
