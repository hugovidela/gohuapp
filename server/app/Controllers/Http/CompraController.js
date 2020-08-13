'use strict'

const Comprobante = use('App/Models/Comprobante')
const ComprobanteItem = use('App/Models/ComprobanteItem')
const Valor = use('App/Models/Valor')
const ComprobantePendiente = use('App/Models/ComprobantePendiente')
const User = use('App/Models/User')
const Notificacion = use('App/Models/Notificacion')
const AuthorizationService = use('App/Services/AuthorizationService')

class CompraController {

  async index ({ auth, params }) {
    const { id } = params
    const user = await auth.getUser()
    const compra = await Comprobante.query()
    .where('sucursal_id', id)
    .orderBy('created_at', 'desc')
    .with('tercero')
    .with('tercero.user')
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

  async comprasitems ({ auth, params }) {
    const { id } = params
    const user = await auth.getUser()
    const compraitems = await ComprobanteItem.query()
    .where('comprobante_id', id)
    .with('articulo')
    .fetch()
    return compraitems
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { 
      fecha,
      perfiscal,
      tipo,
      user_id,
      sucursal_id,
      tercero_id,
      comprobante_id,
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
      valores,
      pendientes,
      notificacion,
      notificaEnBaseAOtro,
      notificaOriginal,
     } = request.all()
    let { cpr } = request.all()
    let cbte = ''
    let part = cpr.substring(0,10)+'%'
    let carga = 'I'

    // OJO ACA: TENGO QUE GENERAR UN NUMERO PROPIO CUANDO SOLO ES PEDIDO O REMITO
    // EN TODO LOS OTROS CASOS SE CARGA EL COMPROBANTE INGRESADO EN EL FORMULARIO
    if (notificacion == 0) {
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

    if (1 == 2) {
    console.log(cpr)
    console.log(fecha)
    console.log(perfiscal)
    console.log(cpr)
    console.log(tipo)
    console.log(user_id)
    console.log(sucursal_id)
    console.log(tercero_id)
    console.log(comprobante_id)
    console.log(documento_id)
    console.log(mediodepago_id)
    console.log(lista_id)
    console.log(deposito_id)
    console.log(vendedor_id)
    console.log(moneda_id)
    console.log(direccion_id)
    console.log(tasadescuento)
    console.log(importedescuento)
    console.log(retiva)
    console.log(retgan)
    console.log(retib)
    console.log(gravado)
    console.log(exento)
    console.log(iva)
    console.log(total)
    console.log(regstk)
    console.log(estado)
    console.log(activo)
    console.log(notificacion)
  }

  console.log('La notificacion es:', notificacion)
  
  const compra = new Comprobante()
  AuthorizationService.verifyPermission(compra, user)
  
    compra.fill({
      fecha,
      perfiscal,
      cpr,
      tipo,
      user_id,
      sucursal_id,
      tercero_id,
      comprobante_id,
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
      carga})
    await compra.save()


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
    if (pendientes.length > 0) {
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

    console.log('paso pendientes')

    // VEO SI HAY QUE NOTIFICAR ( CUANDO EL PROVEEDOR TOMA UN COMPROBANTE ( ej:PEDIDO ) )
    if (notificacion != 0) {
      
      console.log('entro al if de notificacion')
      // ES UNA NOTIFICACION

      // RECORDEMOS QUE LAS COMPRAS NO SON COMO LAS VENTAS
      // LOS ITEMS DE LAS COMPRAS SE CARGAN EN OTRO PROCESO
      // PERO CUANDO SE NOTIFICA UN PEDIDO, LOS ITEMS SI SE 
      // DEBEN AGREGAR EN FORMA CONJUNTA
      
      const { articulos } = request.all()
      // ARTICULOS
      for (let i=0; i<=articulos.length-1; i++) {
        let item = new ComprobanteItem()
        AuthorizationService.verifyPermission(item, user)
        item.fill({
          comprobante_id: compra.id,
          articulo_id: articulos[i].articulo_id,
          deposito_id: articulos[i].deposito_id,
          unidad_id: articulos[i].unidad_id,
          moneda_id: articulos[i].moneda_id,
          iva_id: articulos[i].iva_id,
          cantidad: articulos[i].cantidad,
          costo: articulos[i].costo,
          precio: articulos[i].precio,
          preciooriginal: articulos[i].preciooriginal,
          tasadescuento: articulos[i].tasadescuento,
          importedescuento: articulos[i].importedescuento,
          total: articulos[i].total,
          texto: articulos[i].texto
        })
        await item.save()
      }

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

    } else if (notificaEnBaseAOtro.length > 0)  {       // FALTA TERMINARLO ( ESTA COPIADO DE VENTAS )
      
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

  async updateitems ( { auth, request, params }) {

    const user = await auth.getUser()
    const { id } = params
    const { articulos } = request.all()

    // ARTICULOS
    for (let i=0; i<=articulos.length-1; i++) {
      let it = null
      if (articulos[i].id != 0) { //HAY QUE MODIFICAR
        it = await ComprobanteItem.find(articulos[i].id)
      } else {
        it = await new ComprobanteItem()
      }
      AuthorizationService.verifyPermission(it, user)
      it.comprobante_id = id;
      it.articulo_id = articulos[i].articulo_id;
      it.deposito_id = articulos[i].deposito_id;
      it.unidad_id = articulos[i].unidad_id;
      it.moneda_id = articulos[i].moneda_id;
      it.iva_id = articulos[i].iva_id;
      it.cantidad = articulos[i].cantidad;
      it.stock = articulos[i].stock;
      it.costo = articulos[i].costo;
      it.precio = articulos[i].precio;
      it.preciooriginal = articulos[i].precio;
      it.tasadescuento = articulos[i].tasadescuento;
      it.importedescuento = articulos[i].importedescuento;
      it.total = articulos[i].total;
      it.texto = articulos[i].texto;
      await it.save()
    }
    return it
  }

  async enviarpedido ( { auth, params }) {
    const user = await auth.getUser()
    const { id } = params
    const compra = await Comprobante.find(id)
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
}

module.exports = CompraController
