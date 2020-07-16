'use strict'

//const UserRubro = require("../../Models/UserRubro");
const User = use('App/Models/User')
const Tercero = use('App/Models/Tercero')
const UserRubro = use('App/Models/UserRubro')
const UserLista = use('App/Models/UserLista')
const ArticuloRubro = use('App/Models/ArticuloRubro')
const Sucursal = use('App/Models/Sucursal')
const UserDeposito = use('App/Models/UserDeposito')
const Caja = use('App/Models/Caja')
const Rubro = use('App/Models/Rubro')

//const AuthorizationService = use('App/Services/AuthorizationService')

class UserController {

  async login({ request, auth, response }) {
    /*
    const { email, password } = request.all()
    const token = await auth.attempt(email, password)
    return token
    */
    let {email, password} = request.all();
    try {
      if (await auth.attempt(email, password)) {
        let user = await User.findBy('email', email)
        let token = await auth.generate(user)
        // console.log(user)
        Object.assign(user, token)
        return response.json(user)
      }
    }
    catch (e) {
      //console.log(e)
      return response.json({message: 'No se encontro ningún registro con esos datos!'})
    }
  }
  
  async register({ request }) {
    const { email, password } = request.all()
    //console.log('email:',email)
    //console.log('password:',password)
    await User.create({
      email,
      password,
      username: email,
    })
    return this.login(...arguments)
  }


  //CONSULTA PRINCIPAL DE ARTICULOS
  // FILTRA POR LOS RUBROS ASIGNADOS AL USUARIO QUE CORRESPONDAN A LOS ARTICULOS
  async articulos ( {auth } ) {
    const user = auth.current.user
    const userRubros = await user.rubros().ids()
    const articulosRubros = ArticuloRubro.query()
      .whereIn('rubro_id', userRubros)
      .with('articulo')
      .with('articulo.marca')
      .with('articulo.grupo')
      .with('articulo.creador')
      .with('articulo.umcompra')
      .with('articulo.umventa')
      .with('articulo.umstock')
      .with('articulo.iva')
      .with('articulo.tags')
      .with('articulo.fotos')
      .with('articulo.rubros')
      .with('articulo.precios.lista')
      .with('articulo.moneda')
      .fetch()
    return articulosRubros
  }

  // LEE TODOS LOS TERCEROS PERTENENCIENTES AL USUARIO ACTUAL
  async index ({ auth }) {
    const user = await auth.getUser()
    const terceros = await Tercero.query()
      .with('users')
    //.with('rubros')
      .fetch()
    return terceros
  }

  async rubros ({ auth }) {
    const user = await auth.getUser()
    const rubros = await UserRubro.query()
    .where('user_id', user.id)
    .with('rubro')
    .fetch()
    return rubros
  }

  async caja ({ auth }) {
    const user = await auth.getUser()
    const caja = await Caja.query()
    .where('user_id', user.id)
    .where('cerrada', 0)
    .orderBy('id','desc')
    .limit(1)
    .fetch()
    if (caja.rows==0) {
      const newCaja = await new Caja()
      newCaja.merge( { user_id: user.id, fechadesde: new Date, cerrada: 0, nrocaja: 1 } )
      await newCaja.save()
      // console.log(newCaja)
      return newCaja
    }
    return caja
  }


  /*
  async rubrosall ({ auth }) {
    const user = await auth.getUser()
    const rubros = await UserRubro.all()
    return rubros
  }
  */

  async user ({ auth }) {
    const user = await auth.getUser()
    // console.log(user.id)
    const usuario = await User.query()
    .where('id', user.id)
    //.with('rubros.rubro')
    .with('rubros')
    .with('listas')
    .with('sucursales.depositos')
    .with('tercero.responsable')
    .fetch()
    return usuario
  }

  async updateProfile ( { request, auth, response }) {

    // USUARIO ACTUAL
    const user = auth.current.user

    // ACTUALIZO EL USER
    user.username = request.input('username')
    user.email = request.input('email')
    user.tercero_id = request.input('tercero_id')
    await user.save()

    // ACTUALIZO LOS RUBROS
    const rubros = request.only(['rubros'])
    const rb = Object.values(rubros)
    const rb2 = rb[0];

    // OJOOOO -> TENGO QUE DETACHEAR SOLO LOS RUBROS DEL SISTEMA
    const userRubros = await user.rubros().ids()
    const rub = await Rubro.query().whereIn('id', userRubros).fetch()
    let arr = []
    if (rub.rows.length>0) {
      for(let i=0; i<=rub.rows.length-1; i++) {
        if (rub.rows[i].user_id==null) {
          arr.push(rub.rows[i].id)
        }
      }
    }

    /*
    const articulosRubros = await ArticuloRubro.query()
      .whereIn('rubro_id', userRubros)
      .with('articulo.rubros')
      .fetch()
    */

    await user.rubros().detach(arr)
    console.log('y?')

    if(rb2.length>0) {
      let arr = []
      for (let i=0; i<rb2.length; i++) {
        arr.push(rb2[i].id)
      }
      await user.rubros().attach(arr)
    }

    // ACTUALIZO LAS LISTAS
    const listas = request.only(['listas'])
    const li = Object.values(listas)
    const li2 = li[0];
    if(li2.length>0) {
      let ul = null
      for (let i=0; i<li2.length; i++) {
        if (li2[i].id == 0 ) {
          ul = new UserLista()
          ul.activo = 1
        } else {
          ul = await UserLista.find(li2[i].id)
        }
        ul.user_id = li2[i].user_id
        ul.nombre = li2[i].nombre
        ul.porrem = li2[i].porrem
        await ul.save()
      }
    }

    // ACTUALIZO O CREO SUCURSALES
    const sucursales = request.only(['sucursales'])
    const su = Object.values(sucursales)
    const su2 = su[0];
    if(su2.length>0) {
      for (let i=0; i<su2.length; i++) {
        let suc = null;
        if (su2[i].id == 0) { // NUEVA SUCURSAL
          suc = new Sucursal()
          suc.activo = 1 }
        else {
          console.log('4')
          suc = await Sucursal.find(su2[i].id)
        }
        suc.user_id = su2[i].user_id
        suc.nombre = su2[i].nombre
        suc.abreviado = su2[i].abreviado
        suc.fiscal = su2[i].fiscal
        suc.electronica = su2[i].electronica
        suc.sucursaldemo = su2[i].sucursaldemo
        suc.activo = su2[i].activo
        await suc.save()
        for (let j=0; j<su2[i].depositos.length; j++) {
          let dep = null;
          console.log(su2[i].depositos[j])
          if (su2[i].depositos[j].id == 0) { // NUVA SUCURSAL
            dep = await new UserDeposito()
            dep.sucursal_id = suc.id
            dep.activo = 1 
          } else {
            dep = await UserDeposito.find(su2[i].depositos[j].id)
          }
          dep.nombre = su2[i].depositos[j].nombre
          dep.activo = su2[i].depositos[j].activo
          dep.save()
        }
      }
    }
    return user
  }
}

module.exports = UserController
