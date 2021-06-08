import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargosService } from './services/cargos/cargos.service';
import { MercanciaService } from './services/mercancia/mercancia.service';
import { UsuariosService } from './services/usuarios/usuarios.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  mercanciaForm!: FormGroup;
  usuarios: any;
  mercancias: any;

  constructor(
    public fb: FormBuilder,
    public cargosService: CargosService,
    public mercanciaService: MercanciaService,
    public usuariosService: UsuariosService
  ){

  }
  ngOnInit():void {

    this.mercanciaForm = this.fb.group({
      id_producto: [''],
      nombre_producto : ['', Validators.required],
      cantidad : ['', Validators.required],
      fecha_ingreso : ['', Validators.required],
      usuario_registro : ['', Validators.required],
    });;

    this.usuariosService.getAllUsuarios().subscribe(resp=>{
      this.usuarios = resp;
    },
    error=>{console.error(error)}
    );

    this.mercanciaService.getAllMercancia().subscribe(resp=>{
      this.mercancias = resp;
    },
      error=> {console.error(error)}
    );
  }

  guardar(): void {
    this.mercanciaService.saveMercancia(this.mercanciaForm.value).subscribe(resp=>{
      this.mercanciaForm.reset();
      this.mercancias=this.mercancias.filter((mercancia: { id_producto: any; })=> resp.id_producto!==mercancia.id_producto);
      this.mercancias.push(resp);
    },
      error => {console.error(error)}
    );
  }

  eliminar(mercancia: { id_producto: string; }){
    this.mercanciaService.deleteMercancia(mercancia.id_producto).subscribe(resp=>{

      if(resp===false){
        this.mercancias.pop(mercancia);
      }
    })
  }

  editar(mercancia: { id_producto: any; nombre_producto: any; cantidad: any; fecha_ingreso: any; usuario_registro: any; }){
    this.mercanciaForm.setValue({
      id_producto: mercancia.id_producto,
      nombre_producto : mercancia.nombre_producto,
      cantidad : mercancia.cantidad,
      fecha_ingreso : mercancia.fecha_ingreso,
      usuario_registro : mercancia.usuario_registro
    })
  }
}
