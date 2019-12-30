import { Component, OnInit } from '@angular/core';
import { GiaoVienService } from 'src/app/core/services/giaovien/giaovien.service';
import { ActivatedRoute, Router, NavigationStart, RouterEvent } from '@angular/router';
import { MatDialog } from '@angular/material';
import { filter, tap } from 'rxjs/operators';
import { ThemtvDialogComponent } from 'src/app/core/components/themtv-dialog/themtv-dialog.component';
import { BaiBaoService } from 'src/app/core/services/baibao/baibao.service';

@Component({
  selector: 'app-baibao-detail',
  templateUrl: './baibao-detail.component.html',
  styleUrls: ['./baibao-detail.component.scss']
})
export class BaibaoDetailComponent implements OnInit {

  listGiaoVien: any[] = [];
  baiBao: any;
  id: number;

  constructor(
    private giaoVienService: GiaoVienService,
    private baiBaoService: BaiBaoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {

    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart),
      tap(() => this.dialog.closeAll())
    ).subscribe();
    
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe((params) => {
        if (params.id) {
          this.id = params.id;
        }
        this.getListGiaoVien();
      });
    
  }

  private getBaiBaoById(){
    this.baiBaoService.getBaiBaoById(this.id)
      .subscribe((res) => {
        this.baiBao = res;
      })
  }

  private getListGiaoVien() {
    this.giaoVienService.getGiaoVienByBaiBao(this.id)
      .subscribe((res) => {
        this.listGiaoVien = res.items;
      });
  }

  openDialog(action: string) {
    const dialogRef = this.dialog.open(ThemtvDialogComponent, {
      width: '600px',
      closeOnNavigation: true,
      data: {
        action,
        id : this.baiBao.Id
      }
    });
    dialogRef.afterClosed()
      .subscribe((data) => {
        if (data !== null && data !== undefined) {
          if (data === true) {
            this.getListGiaoVien();
          }
        }
      });
  }

  viewgiaovien(id: any) {
    this.router.navigateByUrl(`giaovien-detail?id=${id}`);
  }

}