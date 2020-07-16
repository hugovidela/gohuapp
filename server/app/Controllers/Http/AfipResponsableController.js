'use strict'

const AfipResponsable = use('App/Models/AfipResponsable')
const AuthorizationService = use('App/Services/AuthorizationService')

class AfipResponsableController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await AfipResponsable.all()
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { codigo } = params
    const afipresponsable = await AfipResponsable.findBy('codigo', codigo )
    //AuthorizationService.verifyPermission(afipresponsable, user)
    return await afipresponsable
  }

  async last ({ auth }) {
    const user = await auth.getUser()
    AuthorizationService.verifyPermission(afipresponsable, user)
    const last = await AfipResponsable.last()
    return await last
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { codigo, nombre, abrev, activo } = request.all()
    const afipresponsable = new AfipResponsable()
    AuthorizationService.verifyPermission(afipresponsable, user)
    afipresponsable.fill({codigo, nombre, abrev, activo})
    await afipresponsable.save(afipresponsable)
    return afipresponsable
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const afipresponsable = await AfipResponsable.find(id)
    AuthorizationService.verifyPermission(afipresponsable, user)
    await afipresponsable.delete()
    return afipresponsable
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const afipresponsable = await AfipResponsable.find(id)
    AuthorizationService.verifyPermission(afipresponsable, user)
    afipresponsable.merge(request.only(['codigo','nombre','abrev','activo']))
    await afipresponsable.save()
    return afipresponsable
  }
}
 
module.exports = AfipResponsableController
