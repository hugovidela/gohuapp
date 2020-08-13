'use strict'

const AfipComprobante = use('App/Models/AfipComprobante')
const AuthorizationService = use('App/Services/AuthorizationService')

class AfipComprobanteController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await AfipComprobante.query()
    .where('abrev','<>','null')
    .orderBy('nombre')
    .fetch()
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { codigo } = params
    const afipcomprobante = await AfipComprobante.findBy('codigo', codigo  )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    return await afipcomprobante ? true : false
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { codigo, nombre, activo } = request.all()
    const afipcomprobante = new AfipComprobante()
    AuthorizationService.verifyPermission(afipcomprobante, user)
    afipcomprobante.fill({codigo, nombre, activo})
    await afipcomprobante.save(afipcomprobante)
    return afipcomprobante
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const afipcomprobante = await AfipComprobante.find(id)
    AuthorizationService.verifyPermission(afipcomprobante, user)
    await afipcomprobante.delete()
    return afipcomprobante
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const afipcomprobante = await AfipComprobante.find(id)
    AuthorizationService.verifyPermission(afipcomprobante, user)
    afipcomprobante.merge(request.only(['codigo','nombre','activo']))
    await afipcomprobante.save()
    return afipcomprobante
  }
}
 
module.exports = AfipComprobanteController
