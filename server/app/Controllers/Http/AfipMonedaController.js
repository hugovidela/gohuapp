'use strict'

const AfipMoneda = use('App/Models/AfipMoneda')
const AuthorizationService = use('App/Services/AuthorizationService')

class AfipMonedaController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await AfipMoneda.all()
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { codigo } = params
    const afipmoneda = await AfipMoneda.findBy('codigo', codigo  )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    return await afipmoneda ? true : false
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { codigo, nombre, simbolo, activo } = request.all()
    const afipmoneda = new AfipMoneda()
    AuthorizationService.verifyPermission(afipmoneda, user)
    afipmoneda.fill({codigo, nombre, simbolo, activo})
    await afipmoneda.save(afipmoneda)
    return afipmoneda
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const afipmoneda = await AfipMoneda.find(id)
    AuthorizationService.verifyPermission(afipmoneda, user)
    await afipmoneda.delete()
    return afipmoneda
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const afipmoneda = await AfipMoneda.find(id)
    AuthorizationService.verifyPermission(afipmoneda, user)
    afipmoneda.merge(request.only(['codigo','nombre','simbolo','activo']))
    await afipmoneda.save()
    return afipmoneda
  }
}
 
module.exports = AfipMonedaController
