import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ClipboardModule } from 'ngx-clipboard';
import { PickerComponent  } from '@ctrl/ngx-emoji-mart';
import { ToastrModule } from "ngx-toastr";
import { Select2Module } from 'ng-select2-component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from "angular-datatables";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ImageCropperModule } from 'ngx-image-cropper';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

import { LoginComponent } from './pages/login/login.component';
import { ContenedorComponent } from './pages/contenedor/contenedor.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { WhatsappConfiguracionComponent } from './pages/whatsapp-configuracion/whatsapp-configuracion.component';
import { AlertSwalComponent } from './components/alert-swal/alert-swal.component';
import { AlmacenListaComponent } from './pages/almacen-lista/almacen-lista.component';
import { UsuarioListaComponent } from './pages/usuario-lista/usuario-lista.component';
import { ClienteListaComponent } from './pages/cliente-lista/cliente-lista.component';
import { CuentaListaComponent } from './pages/cuenta-lista/cuenta-lista.component';
import { CuentaHistorialComponent } from './pages/cuenta-historial/cuenta-historial.component';
import { ProductoListaComponent } from './pages/producto-lista/producto-lista.component';
import { CompraListaComponent } from './pages/compra-lista/compra-lista.component';
import { CompraNuevaComponent } from './pages/compra-nueva/compra-nueva.component';
import { CompraContenedorComponent } from './pages/compra-contenedor/compra-contenedor.component';
import { VentaContenedorComponent } from './pages/venta-contenedor/venta-contenedor.component';
import { VentaListaComponent } from './pages/venta-lista/venta-lista.component';
import { VentaNuevaComponent } from './pages/venta-nueva/venta-nueva.component';
import { AlmacenInventarioComponent } from './pages/almacen-inventario/almacen-inventario.component';
import { ClienteOtpComponent } from './pages/cliente-otp/cliente-otp.component';
import { WhatsappIniciarSesionComponent } from './pages/whatsapp-iniciar-sesion/whatsapp-iniciar-sesion.component';
import { TraspasoListaComponent } from './pages/traspaso-lista/traspaso-lista.component';
import { AlmacenContenedorComponent } from './pages/almacen-contenedor/almacen-contenedor.component';
import { ClienteContenedorComponent } from './pages/cliente-contenedor/cliente-contenedor.component';
import { TraspasoDetalleComponent } from './pages/traspaso-detalle/traspaso-detalle.component';
import { PrecioventaListaComponent } from './pages/precioventa-lista/precioventa-lista.component';
import { VentaComponent } from './pages/venta/venta.component';
import { ModalVentaCreditoAgregarComponent } from './components/modal-venta-credito-agregar/modal-venta-credito-agregar.component';
import { ComponentFiltroFechaComponent } from './components/component-filtro-fecha/component-filtro-fecha.component';
import { SucursalListaComponent } from './pages/sucursal-lista/sucursal-lista.component';
import { CategoriaListaComponent } from './pages/categoria-lista/categoria-lista.component';
import { SucursalContenedorComponent } from './pages/sucursal-contenedor/sucursal-contenedor.component';
import { VentaUsuarioListaComponent } from './pages/venta-usuario-lista/venta-usuario-lista.component';
import { VentaProductoListaComponent } from './pages/venta-producto-lista/venta-producto-lista.component';
import { DescuentoListaComponent } from './pages/descuento-lista/descuento-lista.component';
import { AudiometriaComponent } from './pages/audiometria/audiometria.component';
import { ComisionListaComponent } from './pages/comision-lista/comision-lista.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    ContenedorComponent,
    InicioComponent,
    WhatsappConfiguracionComponent,
    AlertSwalComponent,
    AlmacenListaComponent,
    UsuarioListaComponent,
    ClienteListaComponent,
    CuentaListaComponent,
    CuentaHistorialComponent,
    ProductoListaComponent,
    CompraListaComponent,
    CompraNuevaComponent,
    CompraContenedorComponent,
    VentaContenedorComponent,
    VentaListaComponent,
    VentaNuevaComponent,
    AlmacenInventarioComponent,
    ClienteOtpComponent,
    WhatsappIniciarSesionComponent,
    TraspasoListaComponent,
    AlmacenContenedorComponent,
    ClienteContenedorComponent,
    TraspasoDetalleComponent,
    PrecioventaListaComponent,
    VentaComponent,
    ModalVentaCreditoAgregarComponent,
    ComponentFiltroFechaComponent,
    SucursalListaComponent,
    CategoriaListaComponent,
    SucursalContenedorComponent,
    VentaUsuarioListaComponent,
    VentaProductoListaComponent,
    DescuentoListaComponent,
    AudiometriaComponent,
    ComisionListaComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    DataTablesModule,
    HttpClientModule,
    NgxDropzoneModule,
    ImageCropperModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    Select2Module,
    ClipboardModule,
    PickerComponent,
    
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
