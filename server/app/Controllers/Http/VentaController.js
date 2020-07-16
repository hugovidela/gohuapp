'use strict'

const Comprobante = use('App/Models/Comprobante')
const ComprobanteItem = use('App/Models/ComprobanteItem')
const Valor = use('App/Models/Valor')
const ComprobantePendiente = use('App/Models/ComprobantePendiente')
const AuthorizationService = use('App/Services/AuthorizationService')

class VentaController {

  async index ({ auth, params }) {
    const { id } = params
    const user = await auth.getUser()
    const venta = await Comprobante.query()
    .where('sucursal_id', id)
    .orderBy('created_at', 'desc')
    .with('tercero')
    .with('tercero.responsable')
    .with('direccion.calle0')
    .with('direccion.postal.provincia.pais')
    .with('items.articulo')
    .with('valoresIngresos')
    .with('pendientes')
    .fetch()
    return venta
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()

    const { 
      fecha,
      sucursal_id,
      tercero_id,
      direccion_id,
      documento_id,
      mediodepago_id,
      lista_id,
      deposito_id,
      vendedor_id,
      moneda_id,
      tasadescuento,
      importedescuento,
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

    let { cpr } = request.all()
    let cbte = ''
    let part = cpr.substring(0,10)+'%'

    let nrocpr = await Comprobante.query()
      .where('user_id', user.id)
      .where('cpr', 'LIKE', part)
      .orderBy('cpr', 'desc')
      .limit(1)
      .fetch()

    if (nrocpr.rows.length>0) {
      let oldNro = nrocpr.rows[0].cpr.substring(12,19)
      let newNro = parseInt(oldNro, 10);
      newNro ++
      newNro = newNro.toString()
      newNro = '00000000'+newNro
      newNro = newNro.substr(newNro.length - 8)
      cbte = nrocpr.rows[0].cpr.substring(0,10)+'-'+newNro
    } else {
      cbte = cpr.substring(0,10)+'-00000001'
    }

    cpr = cbte
    const venta = new Comprobante()
    const user_id = user.id
    AuthorizationService.verifyPermission(venta, user)

    venta.fill({fecha,
                user_id,
                cpr,
                sucursal_id,
                tercero_id,
                direccion_id,
                documento_id,
                mediodepago_id,
                lista_id,
                deposito_id,
                vendedor_id,
                moneda_id,
                tasadescuento,
                importedescuento,
                gravado,
                exento,
                iva,
                total,
                regstk,
                estado,
                activo})
    await venta.save()

    // ARTICULOS
    for (let i=0; i<=articulos.length-1; i++) {
      let item = new ComprobanteItem()
      AuthorizationService.verifyPermission(item, user)
      item.fill({
        comprobante_id: venta.id,
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
        cpringreso_id: venta.id,
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
        comprobante_id: venta.id,
        vencimiento: pendientes[0].vencimiento,
        importe: pendientes[0].importe,
        pendiente: pendientes[0].pendiente,
        concepto: pendientes[0].concepto,
      })
      await item.save()
    }

    console.log('finalizo')

    return venta
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const venta = await Comprobante.find(id)
    AuthorizationService.verifyPermission(venta, user)
    await venta.delete()
    return venta
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const venta = await Comprobante.find(id)
    AuthorizationService.verifyPermission(venta, user)
    venta.merge(request.only(['fecha', 'cpr', 'activo']))
    await venta.save()
    return venta
  }

}

module.exports = VentaController
