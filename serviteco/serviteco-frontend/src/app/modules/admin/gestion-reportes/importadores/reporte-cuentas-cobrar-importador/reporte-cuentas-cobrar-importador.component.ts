import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { BehaviorSubject, filter, fromEvent, Observable, Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BuscadorMarcasImportadorComponent } from '../../../buscadores/buscador-marcas-importador/buscador-marcas-importador.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Marca } from '../../../gestion-marcas/marcas';
import { BuscadorImportadorasComponent } from '../../../buscadores/buscador-importador/buscador-importador.component';
import { Importador } from '../../../gestion-importadores/importadores';
import { GestionReporteService } from '../../gestion-reportes.service';
import Swal from 'sweetalert2';
import { GestionReportesService } from 'app/shared/gestion-reportes.service';
import { AuthService } from 'app/core/auth/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { Paginator } from '../../../paginator';

@Component({
    selector: 'reporte-cuentas-cobrar-importador',
    templateUrl: './reporte-cuentas-cobrar-importador.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReporteCuentasCobrarImportadorComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // Paginator
    dataPaginator$: Observable<any>;
    dataCount: number = 0;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    data: any;
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    tableColumns: string[] = ['importador', 'ticket', 'cliente', 'descripcion', 'valor', 'fecha', 'tipo'];
    orderBy: string = "1";
    order: string = "asc";
    filter: string = "all";
    pageIndex: number = 0;
    pageSize: number = 10;
    pageSizeInit = 10;
    cantidad: number;

    valorTotalRepuestos: number = 0;
    valorTotalManoObra: number = 0;
    valorTotal: number = 0;

    searchStrAbiertas$ = new BehaviorSubject<string>('');
    loadData: boolean = false;
    puedeSeleccionarImportador: boolean = false;

    form = this._formBuilder.group({
        fecha_inicial: null,
        fecha_final: null,
        id_importador: null,
        nombre_importador: null,
        id_marca: null,
        nombre_marca: null,
        id_distribuidor: null,
        proceso: 'all',
    });

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _gestionReporteService: GestionReporteService,
        private _gestionReportesService: GestionReportesService,
        private _aut: AuthService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit(): void {
        // Make the data source sortable
        this.dataSource.sort = this.sort;
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the contactenoss
        if (this._aut.accessAdmin == 'administrador') {
            this.puedeSeleccionarImportador = true;
        } else if (this._aut.accessAdmin == 'importador') {
            this.puedeSeleccionarImportador = false;
            this.form.get('id_importador').setValue(this._aut.accessImportador);
            this.form.get('nombre_importador').setValue(this._aut.accessCompany);
        } else if (this._aut.accessAdmin == 'distribuidor') {
            this.puedeSeleccionarImportador = true;
        }

        this.dataPaginator$ = this._gestionReporteService.dataPaginator$;
        this.dataSource.sort = this.sort;

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {

                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                }
                else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
    * Open marcas dialog
    */
    openBuscadorMarcas(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(BuscadorMarcasImportadorComponent, {
            data: {
                idImportador: this.form.get('id_importador').value
            }
        });

        dialogRef.afterClosed()
            .subscribe((result) => {
                if (!result) {
                    return;
                }
                const selected: Marca = result[1];
                this.form.get('id_marca').setValue(selected.id);
                this.form.get('nombre_marca').setValue(selected.nombre);
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
    * Open categorias dialog
    */
    openBuscadorImportador(): void {
        // Open the dialog
        const dialogRef = this._matDialog.open(BuscadorImportadorasComponent, {
            data: {
                idTaller: localStorage.getItem('accessTaller')
            }
        });

        dialogRef.afterClosed()
            .subscribe((result) => {
                if (!result) {
                    return;
                }
                const selected: Importador = result[1];
                this.form.get('id_importador').setValue(selected.id);
                this.form.get('nombre_importador').setValue(selected.nombre);
                this.form.get('id_marca').setValue('');
                this.form.get('nombre_marca').setValue('');
            });
    }

    consultarData() {
        const busqueda = this.form.getRawValue();
        const paginator = new Paginator();
        paginator.pageIndex = this.pageIndex;
        paginator.pageSize = this.pageSize;
        paginator.filter = this.filter || 'all';
        paginator.order = this.order;
        paginator.orderBy = this.orderBy;
        paginator.id_importador = busqueda.id_importador;
        paginator.id_marca = busqueda.id_marca;
        paginator.id_marca = busqueda.id_marca;
        paginator.fecha_inicial = busqueda.fecha_inicial;
        paginator.fecha_final = busqueda.fecha_final;
        paginator.proceso = busqueda.proceso;
        // Search
        this._gestionReporteService.getCuentasPorCobrarImportadorPaginator(paginator).subscribe(data => {

            // Update the counts
            this.dataCount = data.cantidad;

            // Store the table data
            this.dataSource.data = data.registros;

            this.loadData = true;

            this.valorTotalRepuestos = data.registros.filter(m => m.tipo === 'Repuesto').map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
            this.valorTotalManoObra = data.registros.filter(m => m.tipo === 'Mano de Obra').map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
            this.valorTotal = Number(this.valorTotalRepuestos) + Number(this.valorTotalManoObra);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        this.dataSource.sort = this.sort;

    }

    sortData(sort: Sort) {
        this.order = sort.direction;
        this.orderBy = sort.active;
        this.consultarData();
    }

    mostrarMas(e: any) {
        this.pageIndex = e.pageIndex * 10;
        this.pageSize = e.pageSize;
        this.consultarData();
    }

    applyFilter(filterValue: string): void {
        this.filter = (filterValue || 'all').trim().toLowerCase();
        //this.paginator.firstPage();
        this.consultarData();
    }

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create contactenos
     */
    exportar(): void {
        const busqueda = this.form.getRawValue();
        if (this._aut.accessAdmin == 'distribuidor') {
            busqueda.id_distribuidor = this._aut.accessDistribuidor;
        }
        this._gestionReporteService.reporteCuentasCobrarImportador(busqueda).subscribe(data => {
            const totalRepuestos = data.registros.filter(m => m.tipo === 'Repuesto').map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
            const totalManoObra = data.registros.filter(m => m.tipo === 'Mano de Obra').map(t => Number(t.valor)).reduce((acc, value) => acc + value, 0);
            const total = Number(totalRepuestos) + Number(totalManoObra);
            if (data.registros.length > 0) {
                var head = ['Importador', 'Ticket', 'Cliente', 'Descripción', 'Valor sin IVA', 'Fecha', 'Tipo'];
                var footer = ['TOTAL REPUESTOS', totalRepuestos, 'TOTAL MANO OBRA', totalManoObra, '', 'VALOR TOTAL', total];
                this._gestionReportesService.exportReportAsExcelFile(data.registros, 'reporte_cuentas_por_cobrar_importador', head, footer);
            } else {
                Swal.fire({
                    title: 'No existe información para exportar reporte con los parámetros de búsqueda ingresados',
                    icon: 'error',
                    timer: 2500
                })
            }
        })
    }


    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    abrirDetalleFactura() {

    }

}