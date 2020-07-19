'use strict'

const Comprobante = use('App/Models/Comprobante')
const ComprobanteItem = use('App/Models/ComprobanteItem')
const Valor = use('App/Models/Valor')
const ComprobantePendiente = use('App/Models/ComprobantePendiente')
const AuthorizationService = use('App/Services/AuthorizationService')

class CompraController {

  async index ({ auth, params }) {
    const { id } = params
    const user = await auth.getUser()
    const compra = await Comprobante.query()
    .where('sucursal_id', id)
    .orderBy('created_at', 'desc')
    .with('tercero')
    .with('tercero.responsable')
    .with('direccion.calle0')
    .with('direccion.postal.provincia.pais')
    .with('items.articulo')
    .with('valoresIngresos')
    .with('pendientes')
    .where('tipo','CO')
    .fetch()
    return compra
  }
  
  async create ({ auth, request }) {
    console.log('0')
    const user = await auth.getUser()
    console.log('1')
    const { 
      fecha,
      perfiscal,
      cpr,
      tipo,
      user_id,
      sucursal_id,
      tercero_id,
      documento_id,
      mediodepago_id,
      lista_id,
      deposito_id,
      vendedor_id,
      moneda_id,
      direccion_id,
      tasadescuento,
      importedescuento,
      retiva,
      retgan,
      retib,
      gravado,
      exento,
      iva,
      total,
      regstk,
      estado,
      activo,
      articulos,
      valores,
      pendientes,
     } = request.all()

    console.log('2')
    const compra = new Comprobante()
    console.log('3')
    AuthorizationService.verifyPermission(compra, user)
    console.log('4')

    console.log(fecha);
    console.log(perfiscal);
    console.log(cpr);
    console.log(tipo);
    console.log(user_id);
    console.log(sucursal_id);
    console.log(tercero_id);
    console.log(documento_id);
    console.log(mediodepago_id);
    console.log(lista_id);
    console.log(deposito_id);
    console.log(vendedor_id);
    console.log(moneda_id);
    console.log(direccion_id);
    console.log(tasadescuento);
    console.log(importedescuento);
    console.log(retiva);
    console.log(retgan);
    console.log(retib);
    console.log(gravado);
    console.log(exento);
    console.log(iva);
    console.log(total);
    console.log(regstk);
    console.log(estado);
    console.log(activo);

    compra.fill({
      fecha,
      perfiscal,
      cpr,
      tipo,
      user_id,
      sucursal_id,
      tercero_id,
      documento_id,
      mediodepago_id,
      lista_id,
      deposito_id,
      vendedor_id,
      moneda_id,
      direccion_id,
      tasadescuento,
      importedescuento,
      retiva,
      retgan,
      retib,
      gravado,
      exento,
      iva,
      total,
      regstk,
      estado,
      activo})
    await compra.save()
    console.log('5')

    // ARTICULOS
    for (let i=0; i<=articulos.length-1; i++) {
      let item = new ComprobanteItem()
      AuthorizationService.verifyPermission(item, user)
      item.fill({
        comprobante_id: compra.id,
        articulo_id: articulos[i].articulo_id,
        deposito_id: articulos[i].deposito_id.id,
        unidad_id: articulos[i].unidad_id,
        moneda_id: articulos[i].moneda_id,
        iva_id: articulos[i].iva_id,
        cantidad: articulos[i].cantidad,
        costo: articulos[i].costo,
        precio: articulos[i].precio,
        preciooriginal: articulos[i].precio,
        tasadescuento: articulos[i].tasadescuento,
        importedescuento: articulos[i].importedescuento,
        total: articulos[i].total,
        texto: articulos[i].texto
      })
      await item.save()
    }

    // VALORES
    for (let i=0; i<=valores.length-1; i++) {
      let item = new Valor()
      AuthorizationService.verifyPermission(item, user)
      item.fill({
        caja_id: valores[i].caja_id,
        medio_id: valores[i].medio_id,
        cpringreso_id: compra.id,
        cpregreso_id: valores[i].cpregreso_id,
        librador_id: valores[i].librador_id,
        librador_medio_id: valores[i].librador_medio_id,
        cheque_id: valores[i].cheque_id,
        fechafinanciera: valores[i].fechafinanciera,
        fechasalida: valores[i].fechasalida,
        importe: valores[i].importe,
        nrovalor: valores[i].nrovalor,
        tipo: valores[i].tipo,
        observ: valores[i].observ
      })
      await item.save()
    }

    // PENDIENTES
    if (pendientes.length>0) {
      let item = new ComprobantePendiente()
      AuthorizationService.verifyPermission(item, user)
      item.fill({
        comprobante_id: compra.id,
        vencimiento: pendientes[0].vencimiento,
        importe: pendientes[0].importe,
        pendiente: pendientes[0].pendiente,
        concepto: pendientes[0].concepto,
      })
      await item.save()
    }

    console.log('finalizo')

    return compra
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const compra = await Comprobante.find(id)
    AuthorizationService.verifyPermission(compra, user)
    await compra.delete()
    return compra
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const compra = await Comprobante.find(id)
    AuthorizationService.verifyPermission(compra, user)
    compra.merge(request.only(['fecha', 'cpr', 'activo']))
    await compra.save()
    return compra
  }

}

module.exports = CompraController
