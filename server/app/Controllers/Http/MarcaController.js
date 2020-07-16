'use strict'

const Marca = use('App/Models/Marca')
const AuthorizationService = use('App/Services/AuthorizationService')

class MarcaController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await Marca.all()
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { nombre } = params
    const marca = await Marca.findBy('nombre', nombre )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    return await marca ? true : false
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { nombre, activo } = request.all()
    const marca = new Marca()
    AuthorizationService.verifyPermission(marca, user)
    marca.fill({nombre,activo})
    await marca.save(marca)
    return marca
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const marca = await Marca.find(id)
    AuthorizationService.verifyPermission(marca, user)
    await marca.delete()
    return marca
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const marca = await Marca.find(id)
    AuthorizationService.verifyPermission(marca, user)
    marca.merge(request.only(['nombre','activo']))
    await marca.save()
    return marca
  }
}

module.exports = MarcaController
