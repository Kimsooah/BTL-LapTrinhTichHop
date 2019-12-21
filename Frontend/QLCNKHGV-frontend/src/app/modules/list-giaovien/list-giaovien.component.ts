import { Component, OnInit } from '@angular/core';
import { GiaoVienService } from 'src/app/core/services/giaovien/giaovien.service';
import { VariablesConstant } from 'src/app/core/constants/variables.constant';
import { ActivatedRoute, Router, NavigationStart, RouterEvent } from '@angular/router';
import { MatDialog, PageEvent } from '@angular/material';
import { updatePageSizeConfig } from 'src/app/core/helper/app.helper';
import { PAGE_SIZE_CONFIG, LIST_GIAOVIEN } from 'src/app/core/enums/variables.enum';
import { GiaovienDialogComponent } from 'src/app/core/components/giaovien-dialog/giaovien-dialog.component';

@Component({
  selector: 'app-list-giaovien',
  templateUrl: './list-giaovien.component.html',
  styleUrls: ['./list-giaovien.component.scss']
})
export class ListGiaovienComponent implements OnInit {

  listGiaoVien: any[] = [];
  pageSize = VariablesConstant.PAGE_SIZE;
  pageNumber = VariablesConstant.PAGE_NUMBER;
  totalItems: number;
  pageSizeConfig: any;

  constructor(
    private giaoVienService: GiaoVienService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    // this.router.events.pipe(
    //   filter((event: RouterEvent) => event instanceof NavigationStart),
    //   tap(() => this.dialog.closeAll())
    // ).subscribe();
    
    updatePageSizeConfig();
   }

  ngOnInit() {
    this.pageSizeConfig = localStorage.getItem(PAGE_SIZE_CONFIG);
    this.pageSize = JSON.parse(this.pageSizeConfig)[LIST_GIAOVIEN];
    this.route.queryParams
      .subscribe((params) => {
        if (params.page_size) {
          this.pageSize = params.page_size;
        }
        if (params.page_number) {
          this.pageNumber = params.page_number;
        }
        this.getListGiaoVien();
      });
    
  }

  private getListGiaoVien() {
    this.giaoVienService.getAllGiaoVien(this.pageSize, this.pageNumber)
      .subscribe((res) => {
        this.listGiaoVien = res.items;
        this.totalItems = res.totals;
      });
  }

  addNewgiaovien(){
    const dialogRef = this.dialog.open(GiaovienDialogComponent, {
      width: '700px',
      data: {
        isCreate: true,
        isUpdate: false,
        isView: false
      },
      closeOnNavigation: true
    });
    // dialogRef.afterClosed()
    //   .subscribe((data) => {
    //     if (data !== undefined && data !== null) {
    //       if (data === true) {
    //         this.getListHoliday(this.pageSize, this.pageNumber);
    //       }
    //     }
    //   });
  }

  pageSizeChange($event: PageEvent) {
    updatePageSizeConfig(LIST_GIAOVIEN, $event.pageSize);
    return this.router.navigateByUrl(`/list-giaovien?page_number=${$event.pageIndex}&page_size=${$event.pageSize}`);
  }

}
