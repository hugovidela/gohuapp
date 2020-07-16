'use strict'

const Caracteristica = use('App/Models/Caracteristica')
const AuthorizationService = use('App/Services/AuthorizationService')

class CaracteristicaController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await Caracteristica.all()
  }

  async read ({ auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const caracteristica = await Caracteristica.find(id)
    AuthorizationService.verifyPermission(caracteristica, user)
    return caracteristica
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { id, nombre, caracterisicta_id, activo, created_at, updated_at } = params
    const caracteristica = await Caracteristica.find(id)
    AuthorizationService.verifyPermission(caracteristica, user)
    return await caracteristica
  }

  async last ({ auth }) {
    const user = await auth.getUser()
    return await Caracteristica.last()
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { nombre, caracteristica_id, activo } = request.all()
    const caracteristica = new Caracteristica()
    AuthorizationService.verifyPermission(caracteristica, user)
    caracteristica.fill({nombre, caracteristica_id, activo})
    await caracteristica.save(caracteristica)
    return caracteristica
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const caracteristica = await Caracteristica.find(id)
    AuthorizationService.verifyPermission(caracteristica, user)
    await caracteristica.delete()
    return caracteristica
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const caracteristica = await Caracteristica.find(id)
    AuthorizationService.verifyPermission(caracteristica, user)
    caracteristica.merge(request.only(['nombre','activo']))
    await caracteristica.save()
    return caracteristica
  }
}

module.exports = CaracteristicaController
