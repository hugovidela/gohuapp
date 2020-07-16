'use strict'

const Calle = use('App/Models/Calle')
const Postal = use('App/Models/Postal')
const TerceroDireccion = use('App/Models/TerceroDireccion')
const AuthorizationService = use('App/Services/AuthorizationService')

class TerceroDirecconController {

  /*
  async tercerodirecciones ({ auth, request, params }) {
    const { id } = params;
    const terceroDireccion = await TerceroDireccion.query()
    .with('calle0')
    .with('calle1')
    .with('calle2')
    .with('postal')
    .with('postal.provincia')
    .where('tercero_id', id )
    .fetch()
    return terceroDireccion
  }
  */

  /*
  async calles ({ auth, request, params }) {
    const user = await auth.getUser()
      return await Calle.all()
  }

  async postales ({ auth, request, params }) {
    const user = await auth.getUser()
      return await Postal.all()
  }
  */
  
  async index ({ auth }) {

/*  const user = await auth.getUser()
    return await TerceroDireccion.all()*/
    const { id } = params;
    const terceroDireccion = await TerceroDireccion.query()
    .with('calle0')
    .with('postal')
    .with('calle1')
    .with('calle2')
    .where('tercero_id', id )
    .fetch()
    return terceroDireccion
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { 
      tercero_id,
      calle_id,
      postal_id,
      numero,
      pisodepto,
      tipo,
      entrecalle1_id,
      entrecalle2_id,
      observaciones } = request.all()
    const terceroDireccion = new TerceroDireccion()
    AuthorizationService.verifyPermission(terceroDireccion, user)
    terceroDireccion.fill({
      tercero_id,
      calle_id,
      postal_id,
      numero,
      pisodepto,
      tipo,
      entrecalle1_id,
      entrecalle2_id,
      observaciones
    })
    await terceroDireccion.save(terceroDireccion)
    return terceroDireccion
  }

  /*
  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const terceroDireccion = await TerceroDireccion.find(id)
    AuthorizationService.verifyPermission(terceroDireccion, user)
    await terceroDireccion.delete()
    return terceroDireccion
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const terceroDireccion = await TerceroDireccion.find(id)
    AuthorizationService.verifyPermission(terceroDireccion, user)
    terceroDireccion.merge(request.only(
      ['tercero_id','calle_id','postal_id','numero','pisodepto','entrecalle1_id','entrecalle2_id','observaciones']))
    await terceroDireccion.save()
    return terceroDireccion
  }
  */
}

module.exports = TerceroDirecconController
