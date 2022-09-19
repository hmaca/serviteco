import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, Subject } from 'rxjs';
import { GestionMarcasService } from '../../gestion-marcas/gestion-marcas.service';
import { Marca } from '../../gestion-marcas/marcas';

@Component({
    selector: 'buscador-marcas-importador',
    templateUrl: './buscador-marcas-importador.component.html',
    encapsulation: ViewEncapsulation.None
})
export class BuscadorMarcasImportadorComponent implements OnInit, AfterViewInit {

    dataSource: MatTableDataSource<Marca> | null;
    displayedColumns = ['id', 'nombre', 'descripcion'];
    seleccion: Marca;
    cantidad: number;
    marcas$ = this._gestionMarcasService.marcas$;
    searchCtrl = new FormControl('');
    searchStr$ = this.searchCtrl.valueChanges.pipe(debounceTime(10));
    idImportador: string;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    private _unsubscribeAll: Subject<any> = new Subject<any>();



    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<BuscadorMarcasImportadorComponent>,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _gestionMarcasService: GestionMarcasService,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.idImportador = _data.idImportador;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.dataSource = new MatTableDataSource();

        this.marcas$ = this._gestionMarcasService.getMarcasPorImportador(this.idImportador);

        this.marcas$.subscribe(item => {
            this.dataSource.data = item;
        });

        this.searchStr$.subscribe((busqueda) => {
            this.dataSource.filter = (busqueda || '').trim().toLowerCase();
        });

        this._changeDetectorRef.markForCheck();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    selectMarca(marca: Marca): void {
        this.seleccion = marca;
    }

    /**
     * Aceptar
     */
    aceptar(): void {

        // Close the dialog
        this.matDialogRef.close();
    }


    /**
     * Cancelar
     */
    cancelar(): void {
        // Close the dialog
        this.matDialogRef.close();
    }

}