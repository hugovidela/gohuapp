'use strict'

const Tercero = use('App/Models/Tercero')
const TerceroTipo = use('App/Models/TerceroTipo')
const UserTercero = use('App/Models/UserTercero')
const TerceroMedioDePago = use('App/Models/TerceroMedioDePago')
const TerceroDireccion = use('App/Models/TerceroDireccion')
const UserTerceroTipo = use('App/Models/UserTerceroTipo')
const AuthorizationService = use('App/Services/AuthorizationService')

class UserTerceroController {
  // INDEX PRINCIPAL DEL FORMULARIO TERCEROS
  // ESTO DEJO DE ANDAR Y NO SE PORQUE
  static scopeByUser (query, user_id) {
    if (user_id) {
      query.whereHas('users', query => {
        if (user_id instanceof Array) {
          query.whereIn('user_id', user_id)
        } else {
          query.where('user_id', user_id)
        }
      })
    }
  }  

  async indexclientes ({ auth, params }) {
    const user = await auth.getUser()
    const { saydisables } = params
    const filtro = [true]
    if (saydisables=='true') { filtro.push(false) }
    const usersTerceros = await UserTercero.query()
    .with('tercero')
    .with('tercero.documento')
    .with('tercero.responsable')
    .with('terceroTipos')
    .with('terceroListas.lista')
    .whereHas('terceroTipos', (builder) => { builder.where('tipo_id', '1')} ) //clientes
    .with('tercero.direcciones')
    .with('tercero.contactos')
    .with('tercero.contactos.contactoTipo')
    .with('terceromediosdepago')
    .where('user_id', user.id)
    .whereIn('activo', filtro)
//  .byUser(user.id)
    .fetch()
    return usersTerceros
  }

  async indexproveedores ({ auth, params }) {
    const user = await auth.getUser()
    const { saydisables } = params
    const filtro = [true]
    if (saydisables=='true') { filtro.push(false) }
    const usersTerceros = await UserTercero.query()
    .with('tercero')
    .with('tercero.documento')
    .with('tercero.responsable')
    .with('terceroTipos')
    .whereHas('terceroTipos', (builder) => { builder.where('tipo_id', '2')} ) //proveedores
    .with('tercero.direcciones')
    .with('tercero.contactos')
    .with('tercero.contactos.contactoTipo')
    .with('terceromediosdepago')
    .where('user_id', user.id)
    .whereIn('activo', filtro)
    .fetch()
    return usersTerceros
  }

  async tercero ({ auth, params }) {
    const { id } = params;
    const tercero = await UserTercero.query()
    .where('id', id )
    .with('terceroListas.lista')
    .with('tercero.responsable')
    .with('tercero.documento')
    .with('tercero.direcciones.calle0')
    .with('tercero.direcciones.postal.provincia.pais')
    .with('terceromediosdepago.mediodepago')
    .with('terceromediosdepago.banco')
    .where('activo',true)
    .fetch()
    return tercero
  }

  async index ({ auth }) {
    const user = await auth.getUser()
    // SOBRE ESTA CONSULTA SE BASA EL CRUD DE TERCEROS
    
    /*
    COMO FUNCIONAN LOS ARMADOS DE CONSULTAS
    --------------------------------------------------------------------
    EN LOS WITH VAN LAS RELACIONES ENTRE LOS MODELOS. Es decir que las consultas se hacen
    sobre las relaciones.
    Para que esto funcione el modelo que la contiene la relacion debe estar cargado en el controlador.
    SE PUEDEN ANIDAR, POR EJEMPLO:

    el modelo UserTercero tiene una relacion que se llama 'tercero' y hace referencia al Modelo Tercero.
    y este modelo, Tercero, tiene una relacion a documentos
    Entonces puedo hacer 
      tercero.documento

    el modelo UserTercero tiene una relacion que se llama 'terceromediosdepago' y hace referencia
    al modelo TerceroMedioDePago, luego este modelo tiene una relacion a banco, a tarjeta y a mediodepago
    Entonces puedo hacer 
      terceromediosdepago.banco, 
      terceromediosdepago.tarjeta, 
      terceromediosdepago.mediodepago

    EN LOS CONTOLADORES SE HACEN LAS CONSULTAS
    Y ESTAS CONSULTAS SE HACEN SOBRE LAS RELACIONES QUE EXISTEN ENTRE LOS MODELOS.
    NO SOBRE LOS MODELOS NI LOS CONTROLADORES.

    OTRO EJEMPLO
    El modelo UserTercero tienen una relacion belongsTo a Tercero que se llama 'tercero'
    A su vez, el modelo Tercero tiene una relacion al modelo TerceroDireccion que se llama 'direccion'
    A su vez, el modelo TerceroDireccion tiene una relacion a Postal que se llama 'postal'
    A su vez, el modelo Postal tiene una relacion al modelo Provincia que se llama 'provincia'

    entonces puedo hacer .with('tercero.direccion.postal.provincia')
    Si hago tercero.direccion, solo va a traer las direcciones de los terceros
    Si hago tercero.direccion.postal, va a traer ademas el detalle de postal dentro de cada direccion
    Y si hago tercero.direccion.postal.provincia, va a traer ademas de direcciones y los postales,
    el detalle de provincia
    
    PROBLEMA: EL TEMA ES QUE ESTAS RELACIONES TRAEN "TODOS LOS CAMPOS"
    TENGO QUE VER COMO HACER CONSULTAS CON MENOS DATOS, O MAS ESPECIFICOS.

    */

    const usersTerceros = await UserTercero.query()
    .with('tercero')
    .with('tercero.documento')
    .with('tercero.responsable')
    .with('tercero.terceroTipos')
    .with('tercero.direcciones')
    .with('tercero.contactos')
    .with('tercero.contactos.contactoTipo')
    /*
    .with('terceromediosdepago')
    .with('terceromediosdepago.tarjeta')
    .with('terceromediosdepago.banco')
    .with('terceromediosdepago.mediodepago')
    */
    .with('tercero.mediosdepago')
    .byUser(user.id)
    .fetch()
    return usersTerceros
  }

  async tipos ({auth}) {
    //const tipos = await auth.getUser()
    return await TerceroTipo.all()
  }

  async mediosdepago ({auth}) {
    //const tipos = await auth.getUser()
    return await TerceroMedioDePago.all()
  }

  async terceromediosdepago ({ auth, request, params }) {
    const { id } = params;
    const medios = await UserTercero.query()
    .where('id', id )
/*    
    .with('tercero.mediosdepago')
    .with('tercero.mediosdepago.tarjeta')
    .with('tercero.mediosdepago.banco')
    .with('tercero.mediosdepago.mediodepago')
*/
    .with('terceromediosdepago')
    .with('terceromediosdepago.tarjeta')
    .with('terceromediosdepago.banco')
    .with('terceromediosdepago.mediodepago')
    .fetch()
    return medios
  }

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { nombre } = params
    const tercero = await Tercero.findBy('nombre', nombre  )
    // AuthorizationService.verifyPermission(afipdocumento, user)
    return await tercero ? true : false
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { nombre, razon_social, responsable_id, documento_id, cuit, observaciones, activo} = request.all()
    const tercero = new Tercero()
    AuthorizationService.verifyPermission(tercero, user)
    tercero.fill({nombre, razon_social, responsable_id, documento_id, cuit, observaciones, activo})

    //grabo la tabla terceros
    await tercero.save(tercero)

    //grabo la tabla users_terceros
    const userTercero = new UserTercero()
    userTercero.user_id = user.id;
    userTercero.tercero_id = tercero.id
    await userTercero.save()

    //grabo los tipos de terceros ( viene un solo tipo )
    const tp = request.only(['tipos'])
    const tipos = tp.tipos;
    if(tipos.length>=0) {
      let utt = null;
      for (let i=0; i<tipos.length; i++) {
        utt = new UserTerceroTipo()
        utt.user_tercero_id = userTercero.id;
        utt.tipo_id = tipos[i].id;
        await utt.save()
      }
    }

    // grabo las direcciones
    const direcciones = request.only(['direcciones'])
    const dr = Object.values(direcciones)
    const dr2 = dr[0];
    if(dr2.length>0) {
      let arr = []
      for (let i=0; i<dr2.length; i++) {
        arr.push({tercero_id: Number(tercero.id),
                  calle_id: dr2[i].calle_id,
                  postal_id: dr2[i].postal_id,
                  numero: dr2[i].numero,
                  pisodepto: dr2[i].pisodepto,
                  tipo: dr2[i].tipo,
                  entrecalle1_id: dr2[i].entrecalle1_id,
                  entrecalle2_id: dr2[i].entrecalle2_id
                })
        }
        await tercero.direcciones().createMany(arr)
      }
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

  async activardesactivar ( { auth, request, params } ) {
    const user = await auth.getUser()
    const { usrter } = params
    const { activo } = request.only(['activo'])
    const ut = await UserTercero.find(usrter)
    ut.merge(request.only(['activo']))
    await ut.save()
    return ut
  }

  async update ( { auth, request, params }) {

    const user = await auth.getUser()
    const { id } = params
    const tercero = await Tercero.find(id)
    AuthorizationService.verifyPermission(tercero, user)
    tercero.merge(request.only(['nombre','razon_social','responsable_id','documento_id','cuit','observaciones','activo']))

    // ACTUALIZO EL TERCERO
    await tercero.save()
    
    // ACTUALIZO TIPOS
    /*
    const tipos = request.only(['tipos'])
    const tp = Object.values(tipos)
    const tp2 = tp[0];
    if(tp2.length>0) {
      await tercero.terceroTipos().detach()
      let arr = []
      for (let i=0; i<tp2.length; i++) {
        arr.push(tp2[i].id)
      }
      await tercero.terceroTipos().attach(arr)
    }
    */

    // ACTUALIZO DIRECCIONES
    const direcciones = request.only(['direcciones'])
    const dr = Object.values(direcciones)
    const dr2 = dr[0];
    if(dr2.length>0) {
      // let arr = []
      for (let i=0; i<dr2.length; i++) {
        let dir = null
        if (dr2[i].id==0) {    // es una nueva direccion
          dir = new TerceroDireccion()
        } else {            // es una nueva direccion
          dir = await TerceroDireccion.find(dr2[i].id)
          const tercero = await Tercero.find(id)
        }
        dir.tercero_id = tercero.id;
        dir.calle_id = dr2[i].calle_id;
        dir.postal_id = dr2[i].postal_id;
        dir.numero = dr2[i].numero;
        dir.pisodepto = dr2[i].pisodepto;
        dir.tipo = dr2[i].tipo;
        dir.entrecalle1_id = dr2[i].entrecalle1_id;
        dir.entrecalle2_id = dr2[i].entrecalle2_id;
        dir.activo = dr2[i].activo;
        await dir.save()
        /*
        arr.push({tercero_id: Number(id),
                  calle_id: dr2[i].calle_id,
                  postal_id: dr2[i].postal_id,
                  numero: dr2[i].numero,
                  pisodepto: dr2[i].pisodepto,
                  tipo: dr2[i].tipo,
                  entrecalle1_id: dr2[i].entrecalle1_id,
                  entrecalle2_id: dr2[i].entrecalle2_id
                })
        */
      }
      /*
      await tercero.direcciones().delete()
      await tercero.direcciones().createMany(arr)
      */
    }

    // ACTUALIZO CONTACTOS
    const contactos = request.only(['contactos'])
    const co = Object.values(contactos)
    const co2 = co[0];
    if(co2.length>0) {
      let arr = []
      for (let i=0; i<co2.length; i++) {
        arr.push({tercero_id: Number(id),
                  contacto_tipo_id: co2[i].contacto_tipo_id,
                  observaciones: co2[i].observaciones
                })
      }
      await tercero.contactos().delete()
      await tercero.contactos().createMany(arr)
    }

    // ACTUALIZO MEDIOS DE PAGO
    const medios = request.only(['medios'])
    const me = Object.values(medios)
    const me2 = me[0];
    let userTercero = ''
    // console.log('a?')
    if(me2.length>0) {
      let arr = []
      // console.log('me2', me2)
      for (let i=0; i<me2.length; i++) {
        arr.push({user_tercero_id: me2[i].user_tercero_id,
                  mediodepago_id: me2[i].mediodepago.id,
                  banco_id: me2[i].banco_id,
                  tarjeta_id: me2[i].tarjeta_id,
                  tarjeta_numero: me2[i].tarjeta_numero,
                  banco_cuenta: me2[i].banco_cuenta,
                  banco_cbu: me2[i].banco_cbu,
                  dias_vencimiento: me2[i].dias_vencimiento,
                  activo: me2[i].activo
                })
      }
      userTercero = await UserTercero.find(me2[0].user_tercero_id)
      // console.log(userTercero)
      await userTercero.terceromediosdepago().delete()
      await userTercero.terceromediosdepago().createMany(arr)
    }

    // ACTUALIZO LISTAS DE PRECIOS
    const listas = request.only(['listas'])
    const li = Object.values(listas)
    const li2 = li[0];
    if(li2.length>0) {
      let arr = []
      for (let i=0; i<li2.length; i++) {
        arr.push({user_tercero_id: li2[i].user_tercero_id,
                  user_lista_id: li2[i].user_lista_id,
                  porrem: Number(li2[i].porrem),
                  activo: li2[i].activo,
                })
      }
      userTercero = await UserTercero.find(li2[0].user_tercero_id)
      // console.log(userTercero)
      await userTercero.terceroListas().delete()
      await userTercero.terceroListas().createMany(arr)

      /*
      const userTercero = await UserTercero
      .query()
      .where('tercero_id', '=', tercero.id)
      .where('user_id', '=', user.id)
      .fetch()
      console.log(userTercero)
      console.log('tercero:',tercero.id)
      console.log('user:',user.id)
      await userTercero.terceroListas().delete()
      console.log('cc')
      await userTercero.terceroListas().createMany(arr)
      console.log('dd')
      */

      /*
      await userTercero.terceroListas().detach()
      console.log('c')
      await userTercero.terceroListas().attach(arr)
      */
      //console.log('arr',arr)
      //await UserTercero.tercerolistas().delete();
      //console.log('userTercero.id',id)
      //await UserTercero.tercerolistas().createMany(arr)
    }
    return tercero
  }
}
 
module.exports = UserTerceroController
