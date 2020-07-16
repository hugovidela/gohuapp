'use strict'

const User = use('App/Models/User')
const Tercero = use('App/Models/Tercero')
const TerceroTipo = use('App/Models/TerceroTipo')
const TerceroDireccion = use('App/Models/TerceroDireccion')
const TerceroContacto = use('App/Models/TerceroContacto')
const TerceroMedioDePago = use('App/Models/TerceroMedioDePago')
const Calle = use('App/Models/Calle')
const Postal = use('App/Models/Postal')
const UserTercero = use('App/Models/UserTercero')
const UserTerceroTipo = use('App/Models/UserTerceroTipo')
const AuthorizationService = use('App/Services/AuthorizationService')

class TerceroController {

  async index ({ auth }) {
    const user = await auth.getUser()
    const terceros = await Tercero.all()
    /*
    const usersTerceros = await UserTercero.query()
    .with('tercero')
    .with('responsable')
    .with('documento')
    .with('terceroTipos')
    .byUser(user.id)
    .fetch()
    return usersTerceros
    */
    return terceros
  }

  async tipos ({auth}) {
    const tipos = await auth.getUser()
    return await TerceroTipo.all()    
  }

  async medios ({auth}) {
    const user = await auth.getUser()
    return await TerceroMedioDePago.all()    
  }

  async direcciones ({ auth, request, params }) {
    const { id } = params;
    const direcciones = await TerceroDireccion.query()
    .with('calle0')
    .with('calle1')
    .with('calle2')
    .with('postal')
    .with('postal.provincia')
    .where('tercero_id', id )
    .fetch()
    return direcciones
  }
  async calles ({ auth, request, params }) {
    const user = await auth.getUser()
    return await Calle.all()
  }

  async postales ({ auth, request, params }) {
    const user = await auth.getUser()
    return await Postal.all()
  }
  async contactos ({ auth, request, params }) {
    const { id } = params;
    const contactos = await TerceroContacto.query()
    .where('tercero_id', id )
    .with('contactoTipo')
    .fetch()
    return contactos
  }
  async contactosTipos ({ auth, request, params }) {
    const user = await auth.getUser()
    return await ContactoTipo.all()
    }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { nombre } = params
    const tercero = await Tercero.findBy('nombre', nombre  )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    return await tercero ? true : false
  }

  async documento ({ auth, request, params }) {
    const user = await auth.getUser()
    const { documento } = params
    const tercero = await Tercero.findBy('cuit', documento )
    AuthorizationService.verifyPermission(tercero, user)
    return await tercero
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const {
      nombre,
      razon_social,
      responsable_id,
      documento_id,
      cuit,
      observaciones,
      activo} = request.all()
    const tercero = new Tercero()
    AuthorizationService.verifyPermission(tercero, user)
    tercero.fill({nombre,
                  razon_social,
                  responsable_id,
                  documento_id,
                  cuit,
                  observaciones,
                  activo})

    //const userTercero = [user.id]
    //grabo la tabla terceros
    const a1 = await tercero.save(tercero)
    //grabo la tabla users_terceros
    const a2 = await tercero.users().attach(user.id)
    const tipos = request.only(['tipos'])
    const tp = Object.values(tipos)
    const tp2 = tp[0];
    if(tp2.length>0) {
      let arr = []
      for (let i=0; i<tp2.length; i++) {
        arr.push(tp2[i].id)
      }
      console.log('arr->',arr)
      //await tercero.tipos.attach(arr)
      await tercero.tercerosTipos().attach(arr)
    }
    return tercero
  }

  async incorporacion ({ auth, request }) {
    const user = await auth.getUser()
    const { user_id, tercero_id, tipo_id } = request.all()

    console.log('user:', user_id)
    console.log('tercero:', tercero_id)
    console.log('tipo:', tipo_id)

    // AGREGO EL TERCERO AL USUARIO
    const userTercero = new UserTercero()
    AuthorizationService.verifyPermission(userTercero, user)
    userTercero.fill({user_id, tercero_id})
    await userTercero.save()
    console.log('userTercero creado:', userTercero.id)


    // AGREGO EL TIPO AL TERCERO
    const userTerceroTipo = new UserTerceroTipo()
    console.log('linea 1')
    userTerceroTipo.user_tercero_id = userTercero.id;
    console.log('linea 2')
    userTerceroTipo.tipo_id = tipo_id;
    console.log('linea 3')
    await userTerceroTipo.save()
    console.log('userTerceroTipo creado:')

    return userTercero
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const tercero = await Tercero.find(id)
    AuthorizationService.verifyPermission(tercero, user)
    await tercero.delete()
    return tercero
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const tercero = await Tercero.find(id)
    AuthorizationService.verifyPermission(tercero, user)

    const tipos = request.only(['tipos'])
    const tp = Object.values(tipos)
    const tp2 = tp[0];
    if(tp2.length>0) {
      await tercero.tipos().detach()
      let arr = []
      for (let i=0; i<tp2.length; i++) {
        arr.push(tp2[i].id)
      }
      await tercero.tipos().attach(arr)
    }
    tercero.merge(request.only(['nombre',
                                'razon_social',
                                'responsable_id',
                                'documento_id',
                                'cuit',
                                'observaciones',
                                'activo']))
    await tercero.save()
    console.log('okeyyyyy')
    return tercero
  }
}
 
module.exports = TerceroController
