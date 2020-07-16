'use strict'

const MedioDePago = use('App/Models/MedioDePago')
const AuthorizationService = use('App/Services/AuthorizationService')

class MedioDePagoController {

  async index ({ auth }) {
    const user = await auth.getUser()
    //return await MedioDePago.all()
    return await MedioDePago.query().where('id', '>', 3).fetch()
  }

  async indexfijos ({ auth }) {
    const user = await auth.getUser()
    //return await MedioDePago.all()
    return await MedioDePago.query().where('id', '<', 4).fetch()
  }
  
  async read ({ auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const medioDePago = await MedioDePago.find(id)
    AuthorizationService.verifyPermission(medioDePago, user)
    return medioDePago
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { abrev } = params
    const medioDePago = await MedioDePago.findBy('abrev', abrev)
    AuthorizationService.verifyPermission(medioDePago, user)
    return await medioDePago ? true : false
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { abrev, nombre, activo } = request.all()
    const medioDePago = new MedioDePago()
    AuthorizationService.verifyPermission(medioDePago, user)
    medioDePago.fill({abrev, nombre, activo})
    await medioDePago.save(medioDePago)
    return medioDePago
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const medioDePago = await MedioDePago.find(id)
    AuthorizationService.verifyPermission(medioDePago, user)
    await medioDePago.delete()
    return medioDePago
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const medioDePago = await MedioDePago.find(id)
    AuthorizationService.verifyPermission(medioDePago, user)
    medioDePago.merge(request.only(['abrev','nombre','activo']))
    await medioDePago.save()
    return medioDePago
  }
}

module.exports = MedioDePagoController
