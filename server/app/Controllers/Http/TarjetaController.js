'use strict'

const Tarjeta = use('App/Models/Tarjeta')
const AuthorizationService = use('App/Services/AuthorizationService')

class TarjetaController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await Tarjeta.all()
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { codigo } = params
    const tarjeta = await Tarjeta.findBy('codigo', codigo )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    return await tarjeta ? true : false
  }
  
  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { nombre, codigo, activo } = request.all()
    const tarjeta = new Tarjeta()
    AuthorizationService.verifyPermission(tarjeta, user)
    tarjeta.fill({nombre,codigo,activo})
    await tarjeta.save(tarjeta)
    return tarjeta
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const tarjeta = await Tarjeta.find(id)
    AuthorizationService.verifyPermission(tarjeta, user)
    await tarjeta.delete()
    return tarjeta
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const tarjeta = await Tarjeta.find(id)
    AuthorizationService.verifyPermission(tarjeta, user)
    tarjeta.merge(request.only(['nombre','codigo','activo']))
    await tarjeta.save()
    return tarjeta
  }
}

module.exports = TarjetaController
