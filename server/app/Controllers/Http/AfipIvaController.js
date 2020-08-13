'use strict'

const AfipIva = use('App/Models/AfipIva')
const AuthorizationService = use('App/Services/AuthorizationService')

class AfipIvaController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await AfipIva.all()
  }
  
  async indexbus ({ auth }) {
    const user = await auth.getUser()
    return await AfipIva.all()
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { codigo } = params
    const afipiva = await AfipIva.findBy('codigo', codigo  )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    return await afipiva ? true : false
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { codigo, nombre, activo } = request.all()
    const afipiva = new AfipIva()
    AuthorizationService.verifyPermission(afipiva, user)
    afipiva.fill({codigo, nombre,activo})
    await afipiva.save(afipiva)
    return afipiva
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const afipiva = await AfipIva.find(id)
    AuthorizationService.verifyPermission(afipiva, user)
    await afipiva.delete()
    return afipiva
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const afipiva = await AfipIva.find(id)
    AuthorizationService.verifyPermission(afipiva, user)
    afipiva.merge(request.only(['codigo','nombre','activo']))
    await afipiva.save()
    return afipiva
  }
}
 
module.exports = AfipIvaController
