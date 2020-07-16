'use strict'

const Calle = use('App/Models/Calle')
const AuthorizationService = use('App/Services/AuthorizationService')

class CalleController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await Calle.all()
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { nombre } = params
    const calle = await Calle.findBy('nombre', nombre )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    console.log(calle)
    return await calle
  }
  
  async create ({ auth, request }) {
    const user = await auth.getUser()
    console.log(request.all())
    const { nombre, activo } = request.all()
    const calle = new Calle()
    AuthorizationService.verifyPermission(calle, user)
    calle.fill({nombre,activo})
    await calle.save(calle)
    console.log(calle)
    return calle
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const calle = await Calle.find(id)
    AuthorizationService.verifyPermission(calle, user)
    await calle.delete()
    return calle
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const calle = await Calle.find(id)
    AuthorizationService.verifyPermission(calle, user)
    calle.merge(request.only(['nombre','activo']))
    await calle.save()
    return calle
  }
}

module.exports = CalleController
