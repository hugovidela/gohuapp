'use strict'

const Grupo = use('App/Models/Grupo')
const AuthorizationService = use('App/Services/AuthorizationService')

class GrupoController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await Grupo.all()
  }

  async read ({ auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const grupo = await Grupo.find(id)
    AuthorizationService.verifyPermission(grupo, user)
    return grupo
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { id, nombre, grupo_id, activo, created_at, updated_at } = params
    const grupo = await Grupo.find(id)
    AuthorizationService.verifyPermission(grupo, user)
    return await grupo
  }

  async last ({ auth }) {
    const user = await auth.getUser()
    return await Grupo.last()
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { nombre, grupo_id, activo } = request.all()
    const grupo = new Grupo()
    AuthorizationService.verifyPermission(grupo, user)
    grupo.fill({nombre,grupo_id,activo})
    await grupo.save(grupo)
    return grupo
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const grupo = await Grupo.find(id)
    AuthorizationService.verifyPermission(grupo, user)
    await grupo.delete()
    return grupo
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const grupo = await Grupo.find(id)
    AuthorizationService.verifyPermission(grupo, user)
    grupo.merge(request.only(['nombre','activo']))
    await grupo.save()
    return grupo
  }
}

module.exports = GrupoController
