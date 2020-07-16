'use strict'

const Provincia = use('App/Models/Provincia')
const AuthorizationService = use('App/Services/AuthorizationService')

class ProvinciaController {

  async index ({ auth }) {
    const user = await auth.getUser()
    //return await Provincia.all()
    const provincias = await Provincia.query()
    .with('pais')
    .fetch()
    return provincias
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { codigo } = params
    const provincia = await Provincia.findBy('codigo', codigo  )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    return await provincia ? true : false
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { codigo, nombre, caract_tel, activo } = request.all()
    const provincia = new Provincia()
    AuthorizationService.verifyPermission(provincia, user)
    provincia.fill({codigo, nombre, activo})
    await provincia.save(provincia)
    return provincia
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const provincia = await Provincia.find(id)
    AuthorizationService.verifyPermission(provincia, user)
    await provincia.delete()
    return provincia
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const provincia = await Provincia.find(id)
    AuthorizationService.verifyPermission(provincia, user)
    provincia.merge(request.only(['codigo','nombre','pais_id','activo']))
    await provincia.save()
    return provincia
  }
}
 
module.exports = ProvinciaController
