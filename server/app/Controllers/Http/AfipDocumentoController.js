'use strict'

const AfipDocumento = use('App/Models/AfipDocumento')
const AuthorizationService = use('App/Services/AuthorizationService')

class AfipDocumentoController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await AfipDocumento.all()
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { codigo } = params
    console.log(params)
    const afipdocumento = await AfipDocumento.findBy('codigo', codigo )
    //AuthorizationService.verifyPermission(afipdocumento, user)
    return await afipdocumento
  }

  async last ({ auth }) {
    const user = await auth.getUser()
    const last = await AfipDocumento.last()
    console.log(last)
    return await last
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { codigo, nombre, activo } = request.all()
    const afipdocumento = new AfipDocumento()
    AuthorizationService.verifyPermission(afipdocumento, user)
    afipdocumento.fill({codigo, nombre, activo})
    await afipdocumento.save(afipdocumento)
    return afipdocumento
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const afipdocumento = await AfipDocumento.find(id)
    AuthorizationService.verifyPermission(afipdocumento, user)
    await afipdocumento.delete()
    return afipdocumento
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const afipdocumento = await AfipDocumento.find(id)
    AuthorizationService.verifyPermission(afipdocumento, user)
    afipdocumento.merge(request.only(['codigo','nombre','activo']))
    await afipdocumento.save()
    return afipdocumento
  }
}
 
module.exports = AfipDocumentoController
