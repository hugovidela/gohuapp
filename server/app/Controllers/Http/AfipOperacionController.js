'use strict'

const AfipOperacion = use('App/Models/AfipOperacion')
const AuthorizationService = use('App/Services/AuthorizationService')

class AfipOperacionController {

  async index ({ auth }) {
    const user = await auth.getUser()
    return await AfipOperacion.all()
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { codigo } = params
    const afipoperacion = await AfipOperacion.findBy('codigo', codigo  )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    return await afipoperacion ? true : false
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { codigo, compras, ventas, activo } = request.all()
    const afipoperacion = new AfipOperacion()
    AuthorizationService.verifyPermission(afipoperacion, user)
    afipoperacion.fill({codigo, compras, ventas, activo})
    await afipoperacion.save(afipoperacion)
    return afipoperacion
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const afipoperacion = await AfipOperacion.find(id)
    AuthorizationService.verifyPermission(afipoperacion, user)
    await afipoperacion.delete()
    return afipoperacion
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const afipoperacion = await AfipOperacion.find(id)
    AuthorizationService.verifyPermission(afipoperacion, user)
    afipoperacion.merge(request.only(['codigo','compra','venta','activo']))
    await afipoperacion.save()
    return afipoperacion
  }
}
 
module.exports = AfipOperacionController
