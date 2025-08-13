import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { ContenedorComponent } from './pages/contenedor/contenedor.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AlmacenContenedorComponent } from './pages/almacen-contenedor/almacen-contenedor.component';
import { AlmacenListaComponent } from './pages/almacen-lista/almacen-lista.component';
import { AlmacenInventarioComponent } from './pages/almacen-inventario/almacen-inventario.component';
import { SucursalListaComponent } from './pages/sucursal-lista/sucursal-lista.component';
import { SucursalContenedorComponent } from './pages/sucursal-contenedor/sucursal-contenedor.component';
import { CategoriaListaComponent } from './pages/categoria-lista/categoria-lista.component';
import { UsuarioListaComponent } from './pages/usuario-lista/usuario-lista.component';
import { ClienteContenedorComponent } from './pages/cliente-contenedor/cliente-contenedor.component';
import { ClienteListaComponent } from './pages/cliente-lista/cliente-lista.component';
import { ClienteOtpComponent } from './pages/cliente-otp/cliente-otp.component';
import { CuentaListaComponent } from './pages/cuenta-lista/cuenta-lista.component';
import { CuentaHistorialComponent } from './pages/cuenta-historial/cuenta-historial.component';
import { PrecioventaListaComponent } from './pages/precioventa-lista/precioventa-lista.component';
import { ProductoListaComponent } from './pages/producto-lista/producto-lista.component';
import { CompraContenedorComponent } from './pages/compra-contenedor/compra-contenedor.component';
import { CompraListaComponent } from './pages/compra-lista/compra-lista.component';
import { CompraNuevaComponent } from './pages/compra-nueva/compra-nueva.component';
import { TraspasoListaComponent } from './pages/traspaso-lista/traspaso-lista.component';
import { VentaContenedorComponent } from './pages/venta-contenedor/venta-contenedor.component';
import { VentaListaComponent } from './pages/venta-lista/venta-lista.component';
import { VentaProductoListaComponent } from './pages/venta-producto-lista/venta-producto-lista.component';
import { VentaUsuarioListaComponent } from './pages/venta-usuario-lista/venta-usuario-lista.component';
import { VentaNuevaComponent } from './pages/venta-nueva/venta-nueva.component';
import { VentaComponent } from './pages/venta/venta.component';
import { DescuentoListaComponent } from './pages/descuento-lista/descuento-lista.component';
import { WhatsappIniciarSesionComponent } from './pages/whatsapp-iniciar-sesion/whatsapp-iniciar-sesion.component';
import { AudiometriaComponent } from './pages/audiometria/audiometria.component';
import { ComisionListaComponent } from './pages/comision-lista/comision-lista.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cliente/otp/:tipo/:idCliente/:id', component: ClienteOtpComponent },
  {
    path: '',
    component: ContenedorComponent,
    children: [
      { path: '', redirectTo: 'producto', pathMatch: 'full' },
      { path: 'audiometria', component: AudiometriaComponent },
      { path: 'usuario', component: UsuarioListaComponent },
      { path: 'usuario/comision/:idUsuario', component: ComisionListaComponent },
      { path: 'cuenta', component: CuentaListaComponent },
      {
        path: 'cuenta/historial/:idCuenta',
        component: CuentaHistorialComponent,
      },
      { path: 'sucursal/lista', component: SucursalListaComponent },
      { path: 'sucursal/:idSucursal', component: SucursalContenedorComponent,
        children: [
          { path: 'venta', component: VentaComponent },
          { path: 'venta/usuario', component: VentaUsuarioListaComponent },
          { path: 'venta/producto', component: VentaProductoListaComponent },
          { path: 'venta/lista/:tipoAlmacen', component: VentaListaComponent },
          { path: 'cuenta', component: CuentaListaComponent },
          { path: 'comision', component: ComisionListaComponent },
        ]
      },
      { path: 'categoria/lista', component: CategoriaListaComponent },
      { path: 'descuento/lista', component: DescuentoListaComponent },
      { path: 'almacen/lista', component: AlmacenListaComponent },
      { path: 'almacen/:idAlmacen', component: AlmacenContenedorComponent,
        children: [
          { path: 'inventario', component: AlmacenInventarioComponent },
          { path: 'salida/:tipo/:tipoAlmacen', component: VentaNuevaComponent },
          { path: 'traspaso/:tipoAlmacen', component: TraspasoListaComponent },
          { path: 'venta/:tipoAlmacen', component: VentaListaComponent },
        ]
      },
      { path: 'cliente/lista', component: ClienteListaComponent },
      { path: 'cliente/:idCliente', component: ClienteContenedorComponent,
        children: [
          { path: 'inventario', component: AlmacenInventarioComponent },
          { path: 'salida/:tipo/:tipoAlmacen', component: VentaNuevaComponent },
          { path: 'traspaso/:tipoAlmacen', component: TraspasoListaComponent },
          { path: 'venta/:tipoAlmacen', component: VentaListaComponent },
        ]
      },
      { path: 'producto', component: ProductoListaComponent },
      { path: 'compra', component: CompraListaComponent },
      { path: 'compra/nueva', component: CompraNuevaComponent },
      { path: 'compra', component: CompraListaComponent },
      { path: 'traspaso/lista', component: TraspasoListaComponent },
      { path: 'venta', component: VentaContenedorComponent },
      { path: 'venta/:tipo/:id', component: VentaListaComponent },
      { path: 'venta/nuevo', component: VentaComponent },
      { path: 'precio-venta', component: PrecioventaListaComponent },
      { path: 'whatsapp/iniciar-sesion', component: WhatsappIniciarSesionComponent }
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      useHash: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
