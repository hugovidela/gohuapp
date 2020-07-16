'use strict'

const Banco = use('App/Models/Banco')
const AuthorizationService = use('App/Services/AuthorizationService')

class BancoController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await Banco.all()
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { codigo } = params
    const banco = await Banco.findBy('codigo', codigo )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    return await banco ? true : false
  }
  
  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { nombre, codigo, activo } = request.all()
    const banco = new Banco()
    AuthorizationService.verifyPermission(banco, user)
    banco.fill({nombre,codigo,activo})
    await banco.save(banco)
    return banco
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const banco = await Banco.find(id)
    AuthorizationService.verifyPermission(banco, user)
    await banco.delete()
    return banco
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const banco = await Banco.find(id)
    AuthorizationService.verifyPermission(banco, user)
    banco.merge(request.only(['nombre','codigo','activo']))
    await banco.save()
    return banco
  }
}

module.exports = BancoController
