'use strict'

const Unidad = use('App/Models/Unidad')
const AuthorizationService = use('App/Services/AuthorizationService')

class UnidadController {

  async index ({ auth }) {
    const user = await auth.getUser()
    console.log(user.$attributes.username)
    return await Unidad.all()
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { nombre, tipo, unidad_id, coeficiente, activo } = request.all()
    const unidad = new Unidad()
    AuthorizationService.verifyPermission(unidad, user)
    unidad.fill({nombre, tipo, unidad_id, coeficiente, activo})
    await unidad.save(unidad)
    return unidad
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const unidad = await Unidad.find(id)
    AuthorizationService.verifyPermission(unidad, user)
    await unidad.delete()
    return unidad
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const unidad = await Unidad.find(id)
    AuthorizationService.verifyPermission(unidad, user)
    unidad.merge(request.only(['nombre','tipo','unidad_id','coeficiente','activo']))
    await unidad.save()
    return unidad
  }
}

module.exports = UnidadController
