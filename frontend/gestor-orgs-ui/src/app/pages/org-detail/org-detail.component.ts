import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrgService, Organization } from '../../services/org.service';
import { MemberService, Member } from '../../services/member.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberComponent } from '../add-member/add-member.component';
import { MemberRoleDialogComponent } from '../../dialogs/member-role/member-role.component';
import { RemoveMemberDialogComponent } from '../../dialogs/remove-member/remove-member.component';

@Component({
  selector: 'app-org-detail',
  templateUrl: './org-detail.component.html',
  styleUrls: ['./org-detail.component.css'],
})
export class OrgDetailComponent implements OnInit {
  orgId!: string;
  org?: Organization;
  members: Member[] = [];

  constructor(
    private route: ActivatedRoute,
    private orgService: OrgService,
    private memberService: MemberService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.orgId = params.get('id')!;
      this.loadOrg();
      this.loadMembers();
    });
  }

  loadOrg(): void {
    this.orgService.get(this.orgId).subscribe((org) => {
      this.org = org;
    });
  }

  loadMembers(): void {
    this.memberService.list(this.orgId).subscribe((members) => {
      this.members = members;
    });
  }

  addMember(): void {
    const dialogRef = this.dialog.open(AddMemberComponent, {
      width: '350px',
      data: { organizationId: this.orgId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'added') {
        this.loadMembers();
      }
    });
  }

  changeRole(member: Member): void {
    const dialogRef = this.dialog.open(MemberRoleDialogComponent, {
      width: '350px',
      data: { orgId: this.orgId, member },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'updated') {
        this.loadMembers();
      }
    });
  }

  removeMember(member: Member): void {
    const dialogRef = this.dialog.open(RemoveMemberDialogComponent, {
      width: '350px',
      data: { orgId: this.orgId, member },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'removed') {
        this.loadMembers();
      }
    });
  }
}
