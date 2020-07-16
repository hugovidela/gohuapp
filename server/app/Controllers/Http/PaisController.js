'use strict'

const Pais = use('App/Models/Pais')
const AuthorizationService = use('App/Services/AuthorizationService')

class PaisController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await Pais.all()
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { codigo } = params
    const pais = await Pais.findBy('codigo', codigo  )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    return await pais ? true : false
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { codigo, nombre, caract_tel, activo } = request.all()
    const pais = new Pais()
    AuthorizationService.verifyPermission(pais, user)
    pais.fill({codigo, nombre, caract_tel, activo})
    await pais.save(pais)
    return pais
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const pais = await Pais.find(id)
    AuthorizationService.verifyPermission(pais, user)
    await pais.delete()
    return pais
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const pais = await Pais.find(id)
    AuthorizationService.verifyPermission(pais, user)
    pais.merge(request.only(['codigo','nombre','caract_tel','activo']))
    await pais.save()
    return pais
  }
}
 
module.exports = PaisController
