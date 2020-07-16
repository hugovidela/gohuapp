'use strict'

const Rubro = use('App/Models/Rubro')
const UserRubro = use('App/Models/UserRubro')
const AuthorizationService = use('App/Services/AuthorizationService')

class RubroController {

  async index ({ auth }) {
    const user = await auth.getUser()
    const rub = await Rubro.query()
      .where('user_id', user.id)
      .fetch()
    return rub || []
  }

  async indexall ({ auth }) {
    const user = await auth.getUser()
    const rub = await Rubro.query()
      .where('user_id', null)
      .fetch()
    return rub || []
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { nombre } = params
    // const rubro = await Rubro.findBy('nombre', nombre )
    const rubro = await Rubro.query()
      .where('nombre', nombre)
      .where('user_id', user.id)
      .fetch()
    console.log(rubro.rows.length)
    return await rubro.rows.length > 0 ? true : false
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { nombre, activo, privado, user_id } = request.all()
    const rubro = new Rubro()
    AuthorizationService.verifyPermission(rubro, user)
    rubro.fill({nombre,activo,privado,user_id})
    await rubro.save(rubro)
    await user.rubros().attach(rubro.id)
    return rubro
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const rubro = await Rubro.find(id)
    AuthorizationService.verifyPermission(rubro, user)
    await rubro.delete()
    return rubro
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const rubro = await Rubro.find(id)
    AuthorizationService.verifyPermission(rubro, user)
    rubro.merge(request.only(['nombre','activo','privado','user_id']))
    await rubro.save()
    return rubro
  }
}

module.exports = RubroController
