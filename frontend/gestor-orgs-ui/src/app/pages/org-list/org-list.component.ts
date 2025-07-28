import { Component, OnInit, ViewChild } from '@angular/core';
import { OrgService, Organization } from '../../services/org.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { DeleteOrgDialogComponent } from '../../dialogs/delete-org/delete-org.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-org-list',
  templateUrl: './org-list.component.html',
  styleUrls: ['./org-list.component.css'],
})
export class OrgListComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'description',
    'ownerId',
    'createdAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<Organization>([]);
  searchKey = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orgService: OrgService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrgs();
  }

  loadOrgs(): void {
    this.orgService.list().subscribe((orgs) => {
      this.dataSource.data = orgs;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }

  clearFilter(): void {
    this.searchKey = '';
    this.applyFilter();
  }

  viewOrg(org: Organization): void {
    this.router.navigate(['/orgs', org.id]);
  }

  editOrg(org: Organization): void {
    this.router.navigate(['/orgs', org.id, 'edit']);
  }

  deleteOrg(org: Organization): void {
    const dialogRef = this.dialog.open(DeleteOrgDialogComponent, {
      width: '350px',
      data: org,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'deleted') {
        this.loadOrgs();
      }
    });
  }
}
