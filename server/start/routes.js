'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.post('auth/register', 'UserController.register')
  Route.post('auth/login', 'UserController.login')
  Route.post('auth/user', 'UserController.user')
  Route.get('auth/user', 'UserController.index').middleware('auth')

  Route.get('user/:id', 'UserController.user').middleware('auth')
  Route.get('userarticulos', 'UserController.articulos').middleware('auth')
  Route.get('usersrubros', 'UserController.rubros').middleware('auth')
  Route.get('userscaja', 'UserController.caja').middleware('auth')
  Route.patch('user/:id', 'UserController.updateProfile').middleware('auth')

  Route.get('articulos','ArticuloController.index').middleware('auth')
  Route.get('precio/:art/:lis','ArticuloController.precio').middleware('auth')
  Route.get('articulos/exists/:codigo','ArticuloController.exists').middleware('auth')
  Route.post('articulos','ArticuloController.create').middleware('auth')
  Route.delete('articulos/:id','ArticuloController.destroy').middleware('auth')
  Route.patch('articulos/:id','ArticuloController.update').middleware('auth')

  Route.get('marcas','MarcaController.index').middleware('auth')
  Route.post('marcas','MarcaController.create').middleware('auth')
  Route.get('marcas/exists/:nombre','MarcaController.exists').middleware('auth')
  Route.delete('marcas/:id','MarcaController.destroy').middleware('auth')
  Route.patch('marcas/:id','MarcaController.update').middleware('auth')

  Route.post('terceroincorporar','TerceroController.incorporacion').middleware('auth')
  Route.get('terceros','TerceroController.index').middleware('auth')
  Route.get('tercero/:id','UserTerceroController.tercero').middleware('auth')
  Route.get('terceros/documento/:documento','TerceroController.documento').middleware('auth')
  Route.get('tercerostipos','TerceroController.tipos').middleware('auth')
  Route.get('tercerosmedios','TerceroController.medios').middleware('auth')

  Route.get('tags','TagController.index').middleware('auth')
  Route.get('tags/exists/:nombre','TagController.exists').middleware('auth')
  Route.post('tags','TagController.create').middleware('auth')
  Route.delete('tags/:id','TagController.destroy').middleware('auth')
  Route.patch('tags/:id','TagController.update').middleware('auth')

  Route.get('rubros','RubroController.index').middleware('auth')
  Route.get('rubrosall','RubroController.indexall').middleware('auth')
  Route.post('rubros','RubroController.create').middleware('auth')
  Route.get('rubros/exists/:nombre','RubroController.exists').middleware('auth')
  Route.delete('rubros/:id','RubroController.destroy').middleware('auth')
  Route.patch('rubros/:id','RubroController.update').middleware('auth')

  Route.get('caracteristicas','CaracteristicaController.index').middleware('auth')
  Route.get('caracteristicas/last','CaracteristicaController.last').middleware('auth')
  Route.get('caracteristicas/exists/:id','CaracteristicaController.exists').middleware('auth')
  Route.post('caracteristicas','CaracteristicaController.create').middleware('auth')
  Route.delete('caracteristicas/:id','CaracteristicaController.destroy').middleware('auth')
  Route.patch('caracteristicas/:id','CaracteristicaController.update').middleware('auth')

  Route.get('contactostipos','ContactoTipoController.index').middleware('auth')
  Route.get('contactostipos/last','ContactoTipoController.last').middleware('auth')
  Route.get('contactostipos/exists/:id','ContactoTipoController.exists').middleware('auth')
  Route.get('contactos/:id','TerceroController.contactos').middleware('auth')
  Route.post('contactostipos','ContactoTipoController.create').middleware('auth')
  Route.delete('contactostipos/:id','ContactoTipoController.destroy').middleware('auth')
  Route.patch('contactostipos/:id','ContactoTipoController.update').middleware('auth')

  Route.get('grupos','GrupoController.index').middleware('auth')
  Route.get('grupos/last','GrupoController.last').middleware('auth')
  Route.get('grupos/:id','GrupoController.read').middleware('auth')
  Route.get('grupos/exists/:id','GrupoController.exists').middleware('auth')
  Route.post('grupos','GrupoController.create').middleware('auth')
  Route.delete('grupos/:id','GrupoController.destroy').middleware('auth')
  Route.patch('grupos/:id','GrupoController.update').middleware('auth')

  Route.get('unidades','UnidadController.index').middleware('auth')
  Route.get('unidades/last','UnidadController.last').middleware('auth')
  Route.post('unidades','UnidadController.create').middleware('auth')
  Route.delete('unidades/:id','UnidadController.destroy').middleware('auth')
  Route.patch('unidades/:id','UnidadController.update').middleware('auth')

  Route.get('afipiva','AfipIvaController.index').middleware('auth')
  Route.get('afipiva/last','AfipIvaController.last').middleware('auth')
  Route.get('afipiva/exists/:codigo','AfipIvaController.exists').middleware('auth')
  Route.post('afipiva','AfipIvaController.create').middleware('auth')
  Route.delete('afipiva/:id','AfipIvaController.destroy').middleware('auth')
  Route.patch('afipiva/:id','AfipIvaController.update').middleware('auth')

  Route.get('afipoperaciones','AfipOperacionController.index').middleware('auth')
  Route.get('afipoperaciones/last','AfipOperacionController.last').middleware('auth')
  Route.get('afipoperaciones/exists/:codigo','AfipOperacionController.exists').middleware('auth')
  Route.post('afipoperaciones','AfipOperacionController.create').middleware('auth')
  Route.delete('afipoperaciones/:id','AfipOperacionController.destroy').middleware('auth')
  Route.patch('afipoperaciones/:id','AfipOperacionController.update').middleware('auth')

  Route.get('afipmonedas','AfipMonedaController.index').middleware('auth')
  Route.get('afipmonedas/last','AfipMonedaController.last').middleware('auth')
  Route.get('afipmonedas/exists/:codigo','AfipMonedaController.exists').middleware('auth')
  Route.post('afipmonedas','AfipMonedaController.create').middleware('auth')
  Route.delete('afipmonedas/:id','AfipMonedaController.destroy').middleware('auth')
  Route.patch('afipmonedas/:id','AfipMonedaController.update').middleware('auth')

  Route.get('afipdocumentos','AfipDocumentoController.index').middleware('auth')
  Route.get('afipdocumentos/last','AfipDocumentoController.last').middleware('auth')
  Route.post('afipdocumentos','AfipDocumentoController.create').middleware('auth')
  Route.delete('afipdocumentos/:id','AfipDocumentoController.destroy').middleware('auth')
  Route.patch('afipdocumentos/:id','AfipDocumentoController.update').middleware('auth')

  Route.get('afipresponsables','AfipResponsableController.index').middleware('auth')
  Route.get('afipresponsables/last','AfipResponsableController.last').middleware('auth')
  Route.get('afipresponsables/exists/:codigo','AfipResponsableController.exists').middleware('auth')
  Route.post('afipresponsables','AfipResponsableController.create').middleware('auth')
  Route.delete('afipresponsables/:id','AfipResponsableController.destroy').middleware('auth')
  Route.patch('afipresponsables/:id','AfipResponsableController.update').middleware('auth')

  Route.get('paises','PaisController.index').middleware('auth')
  Route.get('paises/last','PaisController.last').middleware('auth')
  Route.get('paises/exists/:codigo','PaisController.exists').middleware('auth')
  Route.post('paises','PaisController.create').middleware('auth')
  Route.delete('paises/:id','PaisController.destroy').middleware('auth')
  Route.patch('paises/:id','PaisController.update').middleware('auth')

  Route.get('provincias','ProvinciaController.index').middleware('auth')
  Route.get('provincias/last','ProvinciaController.last').middleware('auth')
  Route.get('provincias/exists/:codigo','ProvinciaController.exists').middleware('auth')
  Route.post('provincias','ProvinciaController.create').middleware('auth')
  Route.delete('provincias/:id','ProvinciaController.destroy').middleware('auth')
  Route.patch('provincias/:id','ProvinciaController.update').middleware('auth')

  Route.get('postales','PostalController.index').middleware('auth')
  Route.get('postales/last','PostalController.last').middleware('auth')
  Route.get('postales/exists/:codigo','PostalController.exists').middleware('auth')
  Route.post('postales','PostalController.create').middleware('auth')
  Route.delete('postales/:id','PostalController.destroy').middleware('auth')
  Route.patch('postales/:id','PostalController.update').middleware('auth')

  Route.get('bancos','BancoController.index').middleware('auth')
  Route.get('bancos/exists/:codigo','BancoController.exists').middleware('auth')
  Route.post('bancos','BancoController.create').middleware('auth')
  Route.delete('bancos/:id','BancoController.destroy').middleware('auth')
  Route.patch('bancos/:id','BancoController.update').middleware('auth')

  Route.get('tarjetas','TarjetaController.index').middleware('auth')
  Route.get('tarjetas/exists/:codigo','TarjetaController.exists').middleware('auth')
  Route.post('tarjetas','TarjetaController.create').middleware('auth')
  Route.delete('tarjetas/:id','TarjetaController.destroy').middleware('auth')
  Route.patch('tarjetas/:id','TarjetaController.update').middleware('auth')

  Route.get('usersclientes','UserTerceroController.indexclientes').middleware('auth')
  Route.get('usersclientes/exists/:nombre','UserTerceroController.exists').middleware('auth')
  Route.post('usersclientes','UserTerceroController.create').middleware('auth')
  Route.delete('usersclientes/:id','UserTerceroController.destroy').middleware('auth')
  Route.patch('usersclientes/:id','UserTerceroController.update').middleware('auth')

  Route.get('usersproveedores','UserTerceroController.indexproveedores').middleware('auth')
  Route.get('usersproveedores/exists/:nombre','UserTerceroController.exists').middleware('auth')
  Route.post('usersproveedores','UserTerceroController.create').middleware('auth')
  Route.delete('usersproveedores/:id','UserTerceroController.destroy').middleware('auth')
  Route.patch('usersproveedores/:id','UserTerceroController.update').middleware('auth')

  Route.get('mediosdepago','UserTerceroController.mediosdepago').middleware('auth')
  Route.get('mediosdepago/:id','UserTerceroController.terceromediosdepago').middleware('auth')  //ESTE
  
  Route.get('direcciones','TerceroDireccionController.index').middleware('auth')
  Route.get('direcciones/exists/:nombre','TerceroDireccionController.exists').middleware('auth')
//Route.get('direcciones/:id','TerceroDireccionController.tercerodirecciones').middleware('auth')
  Route.get('direcciones/:id','TerceroController.direcciones').middleware('auth')
  Route.get('calles','TerceroController.calles').middleware('auth')
  Route.post('calles','CalleController.create').middleware('auth')
  Route.get('calles/exists/:nombre','CalleController.exists').middleware('auth')
  Route.get('postales','TerceroController.postales').middleware('auth')

  Route.get('calles','TerceroDireccionController.calles').middleware('auth')
  Route.get('postales','TerceroDireccionController.postales').middleware('auth')
  Route.post('direcciones','TerceroDireccionController.create').middleware('auth')
  Route.delete('direcciones/:id','TerceroDireccionController.destroy').middleware('auth')
  Route.patch('direcciones/:id','TerceroDireccionController.update').middleware('auth')

  Route.get('mediosdepagos','MedioDePagoController.index').middleware('auth')
  Route.get('mediosdepagosfijos','MedioDePagoController.indexfijos').middleware('auth')
  Route.get('mediosdepagos/exists/:abrev','MedioDePagoController.exists').middleware('auth')
  Route.post('mediosdepagos','MedioDePagoController.create').middleware('auth')
  Route.delete('mediosdepagos/:id','MedioDePagoController.destroy').middleware('auth')
  Route.patch('mediosdepagos/:id','MedioDePagoController.update').middleware('auth')

  // VENTAS
  Route.get('ventas/:id','VentaController.index').middleware('auth')
  Route.post('ventas','VentaController.create').middleware('auth')
  Route.delete('ventas/:id','VentaController.destroy').middleware('auth')
  Route.patch('ventas/:id','VentaController.update').middleware('auth')

}).prefix('api')
