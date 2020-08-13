'use strict'

const Comprobante = use('App/Models/Comprobante')
const ComprobanteItem = use('App/Models/ComprobanteItem')
const Valor = use('App/Models/Valor')
const ComprobantePendiente = use('App/Models/ComprobantePendiente')
const User = use('App/Models/User')
const Notificacion = use('App/Models/Notificacion')
const AuthorizationService = use('App/Services/AuthorizationService')

class VentaController {
  async index ({ auth, params }) {

    // OJO, VER EL with de direccion

    const { id } = params
    const user = await auth.getUser()
    const venta = await Comprobante.query()
    .where('sucursal_id', id)
    .orderBy('created_at', 'desc')
    .with('tercero')
    .with('tercero.documento')
    .with('tercero.responsable')
    .with('tercero.direcciones.calle0')                // ?? agregado para la importacion de pedidos. revisar
    .with('tercero.direcciones.postal.provincia.pais') // ?? agregado para la importacion de pedidos. revisar
//  .with('direccion.calle0')
//  .with('direccion.postal.provincia.pais')
    .with('items.articulo')
    .with('valoresIngresos')
    .with('pendientes')
    .where('tipo','VE')
    .fetch()
    return venta
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { 
      fecha,
      perfiscal,
      sucursal_id,
      tercero_id,
      comprobante_id,
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
      notificacion,
      notificaEnBaseAOtro,
      notificaOriginal,
     } = request.all()

    let { cpr } = request.all()
    let cbte = ''
    let part = cpr.substring(0,10)+'%'
    let tipo = 'VE'
    let carga = 'I'

     // NOTA: notificacion=0 es cuando viene n comprobante de venta, !=0, cuando es
     // un pedido o remito o presupuesto, que tiene que notificar.
     // Si es el primer caso y es en baseAOtro, notifica luego en el metodo "Notificaciones"

    if (notificacion == 0) { // CALCULO EL COMPROBANTE SIEMPRE QUE NO SEA UNA NOTIFICACION
      carga = 'M'
      let nrocpr = await Comprobante.query()
        .where('user_id', user.id)
        .where('cpr', 'LIKE', part)
        .where('sucursal_id', sucursal_id)
        .orderBy('cpr', 'desc')
        .limit(1)
        .fetch()

        if (nrocpr.rows.length > 0) {
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
    }

    console.log('empieza')

    const venta = new Comprobante()
    const user_id = user.id
    AuthorizationService.verifyPermission(venta, user)
    venta.fill({
      fecha,
      perfiscal,
      user_id,
      cpr,
      tipo,
      sucursal_id,
      tercero_id,
      comprobante_id,
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
      carga})
    await venta.save()

    console.log('paso cabecera')

    // ARTICULOS
    for (let i=0; i<=articulos.length-1; i++) {
      let item = new ComprobanteItem()
      AuthorizationService.verifyPermission(item, user)

      console.log(venta.id)
      console.log(articulos[i].articulo_id)
      console.log(articulos[i].deposito_id)
      console.log(articulos[i].unidad_id)
      console.log(articulos[i].moneda_id)
      console.log(articulos[i].iva_id)
      console.log(articulos[i].cantidad)
      console.log(articulos[i].stock)
      console.log(articulos[i].costo)
      console.log(articulos[i].precio)
      console.log(articulos[i].precio)
      console.log(articulos[i].tasadescuento)
      console.log(articulos[i].importedescuento)
      console.log(articulos[i].total)
      console.log(articulos[i].texto)

      item.fill({
        comprobante_id: venta.id,
        articulo_id: articulos[i].articulo_id,
        deposito_id: articulos[i].deposito_id,
        unidad_id: articulos[i].unidad_id,
        moneda_id: articulos[i].moneda_id,
        iva_id: articulos[i].iva_id,
        cantidad: articulos[i].cantidad,
        stock: articulos[i].stock,
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

    console.log('paso items')

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

    console.log('paso valores')

    // PENDIENTES
    if (pendientes.length > 0) {
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

    console.log('paso pendientes')

    // VEO SI HAY QUE NOTIFICAR ( CUANDO EL PROVEEDOR TOMA UN COMPROBANTE ( ej:PEDIDO ) )
    if (notificacion != 0) {

      console.log('entro al if')

      // marco la notificacion como procesada
      const not = await Notificacion.find(notificacion)
      AuthorizationService.verifyPermission(not, user)
      not.estado = 'R'
      await not.save()

      // Ademas de marcarlo como procesado, tengo que generar una nueva notificacion
      // avisando que el comprobante ha sido leido
      const notif = new Notificacion()
      notif.user_id_desde = not.user_id_hasta
      notif.user_id_hasta = not.user_id_desde
      notif.comprobante_id = not.comprobante_id
      notif.tipo = 'L'
      notif.detalles = 'Leido'
      notif.estado = 'P'
      await notif.save()

    } else if (notificaEnBaseAOtro.length > 0)  { 
      
      // SI EL COMPROBANTE ES EN BASE A OTRO DEBO NOTIFICARLO
      // BUSCO EL USER DEL TERCERO A NOTIFICAR
      let usercli = await User.query()
      .where('tercero_id', notificaEnBaseAOtro[0].user_id_hasta)
      .fetch()
      if (usercli.rows.length > 0) {
        const notif = new Notificacion()
        notif.user_id_desde = notificaEnBaseAOtro[0].user_id_desde
        notif.user_id_hasta = usercli.rows[0].id
        notif.comprobante_id = venta.id
        notif.tipo = notificaEnBaseAOtro[0].tipo
        notif.detalles = notificaEnBaseAOtro[0].detalles
        notif.estado = notificaEnBaseAOtro[0].estado
        await notif.save()

        // MARCO EL COMPROBANTE ORIGINAL CON EL NUEVO ESTADO
        const original = await Comprobante.find(notificaOriginal[0].comprobante_id)
        original.estado = notificaOriginal[0].estado
        await original.save()
      }

    } else {

      console.log('entro al else')

      // BUSCO EN USER SI HAY ALGUN USUARIO CON EL ID DEL CLIENTE
      console.log('el venta tercero_id es:', venta.tercero_id)
      let usercli = await User.query()
      .where('tercero_id',venta.tercero_id)
      .fetch()
      if (usercli.rows.length > 0) {
        const notif = new Notificacion()
        notif.user_id_desde = user.id
        notif.user_id_hasta = usercli.rows[0].id
        notif.comprobante_id = venta.id
        notif.tipo = 'A'
        notif.detalles = 'Para importar desde compras'
        notif.estado = 'P'
        await notif.save()
      }
    }
    console.log('termino')
    return venta
  }

  async notificarEnBaseAOtro ( { auth, params }) {
    const user = await auth.getUser()
    const { id } = params
    const venta = await Comprobante.find(id)
    AuthorizationService.verifyPermission(compra, user)
    // BUSCO EN USER SI HAY ALGUN USUARIO CON EL ID DEL CLIENTE
    let userpro = await User.query()
    .where('tercero_id',compra.tercero_id)
    .fetch()
    if (userpro.rows.length > 0) {
      const notif = new Notificacion()
      notif.user_id_desde = user.id
      notif.user_id_hasta = userpro.rows[0].id
      notif.comprobante_id = compra.id
      notif.tipo = 'A'
      notif.detalles = 'Pedido'
      notif.estado = 'P'
      await notif.save()
      compra.estado = 'F'
      await compra.save()
      }
    // NOTIFICACION
    return 'ok'
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
