'use strict'

const Postal = use('App/Models/Postal')
const AuthorizationService = use('App/Services/AuthorizationService')

class PostalController {

  async index ({ auth }) {
    const user = await auth.getUser()
    const postales = await Postal.query()
    .with('provincia')
    .fetch()
    return postales    
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { codigo } = params
    const postal = await Postal.findBy('codigo', codigo  )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    return await postal ? true : false
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { codigo, nombre, provincia_id, activo } = request.all()
    const postal = new Postal()
    AuthorizationService.verifyPermission(postal, user)
    postal.fill({codigo, nombre, provincia_id, activo})
    await postal.save(postal)
    return postal
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const postal = await Postal.find(id)
    AuthorizationService.verifyPermission(postal, user)
    await postal.delete()
    return postal
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const postal = await Postal.find(id)
    AuthorizationService.verifyPermission(postal, user)
    postal.merge(request.only(['codigo','nombre','provincia_id','activo']))
    await postal.save()
    return postal
  }
}
 
module.exports = PostalController
