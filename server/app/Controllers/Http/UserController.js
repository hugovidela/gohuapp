'use strict'

const { find } = require("../../Models/User")

//const UserRubro = require("../../Models/UserRubro");
const User = use('App/Models/User')
const Tercero = use('App/Models/Tercero')
const Articulo = use('App/Models/Articulo')
const Marca = use('App/Models/Marca')
const Grupo = use('App/Models/Grupo')
const Vinculo = use('App/Models/Vinculo')
const UserRubro = use('App/Models/UserRubro')
const Precio = use('App/Models/Precio')
const UserLista = use('App/Models/UserLista')
const ArticuloRubro = use('App/Models/ArticuloRubro')
const Sucursal = use('App/Models/Sucursal')
const UserDeposito = use('App/Models/UserDeposito')
const Caja = use('App/Models/Caja')
const Rubro = use('App/Models/Rubro')
const Notificacion = use('App/Models/Notificacion')
//const Encryption = use('Encryption')

//const AuthorizationService = use('App/Services/AuthorizationService')

class UserController {

  async login({ request, auth, response }) {

    /* EJEMPLO PARA AUTENTICAR BAJO CONDICIONES
    class UserController {
      async login({ request, response, auth }) {
        const { email, password } = request.all()
        let token = await auth.withRefreshToken().query((builder) => {
          builder.where('active', true)
        }).attempt(email, password)
    
        response.json({success:true, message:token})
      }
    */

    let {email, password, uid} = request.all();
    try {
      if (password==null) {
        const user = await User.find(uid)
        if (await auth.generate(user)) {
          let user = await User.findBy('email', email)
          let token = await auth.generate(user)
          Object.assign(user, token)
          return response.json(user)

        }
       } else {
        //console.log('con password')
        if (await auth.attempt(email, password)) {
          let user = await User.findBy('email', email)
          let token = await auth.generate(user)
          // console.log(user)
          Object.assign(user, token)
          return response.json(user)
        }
      }
    }
    catch (e) {
      //console.log(e)
      return e
//    return response.json({message: 'No se encontro ningún registro con esos datos!'})
    }
  }
  
  async register({ request }) {
    const { username, email, password } = request.all()
    await User.create({ email, password, username, })
    return this.login(...arguments)
  }

  // CONSULTA PRINCIPAL DE ARTICULOS - PARA EL BROWSE DE ARTICULOS
  // FILTRA POR LOS RUBROS ASIGNADOS AL USUARIO QUE CORRESPONDAN A LOS ARTICULOS
  async articulos ( {auth, params } ) {

    let { page, rows, search, vinculos } = params
    
    let bus = search == 'all' ? '' : search
    
    bus = decodeURIComponent(bus)
    const user = auth.current.user
    const userRubros = await user.rubros().ids()
    
    //console.log(bus)
    if (bus) {
      //page = 1
    }
    console.log('el page es:',page)
    console.log('perPage es:',rows)
    console.log('el search es:',search)
    console.log('el vinculo es:',vinculos)
    const nums = vinculos.split(',').map(x => parseInt(x, 10));
    console.log('nums',nums)
    
    const articulosRubros = await ArticuloRubro
    .query()
      .from('articulos_rubros as ar')
      .leftJoin('articulos as a', 'a.id' , '=' , 'ar.articulo_id')
      .leftJoin('users as u', 'a.creador_id' , '=' , 'u.id')
      .leftJoin('marcas as m', 'm.id' , '=' , 'a.marca_id')
      .leftJoin('grupos as g', 'g.id' , '=' , 'a.grupo_id')
      .leftOuterJoin('users_articulos_inactivos as uai', function() {
        this.on('uai.user_id', '=', user.id).andOn('uai.articulo_id', '=', 'a.id')
      })
      .select('a.codigo', 'a.nombre', 'uai.id as activo', 'm.nombre as nommar', 'g.nombre as nomgru', 'u.username as creador', 'a.creador_id as userid','a.id')
      .whereIn('rubro_id', userRubros)
      .whereIn('a.creador_id', nums )
      .where(function () 
      { this.where('a.codigo', 'like', '%'+bus+'%')
      this.orWhere('a.nombre', 'like', '%'+bus+'%') })
      .paginate(page, rows)

      const pagination = articulosRubros.toJSON()
      //console.log(pagination)

    return await articulosRubros
  }


  // CONSULTA DE ARTICULOS EN EL FACTURADOR
  // FILTRA POR LOS RUBROS ASIGNADOS AL USUARIO QUE CORRESPONDAN A LOS ARTICULOS
  async articulosfac ( {auth, request } ) {

    let search = request.input('search')
    let vinculos  = request.input('vinculos')

    //let { search, vinculos } = params
    let bus = search == '' ? '' : search
    console.log('search es:',search)
    console.log('vinculos es:',vinculos)
    
    bus = decodeURIComponent(bus)
    console.log(bus)
    const user = auth.current.user
    const userRubros = await user.rubros().ids()
    
    //const nums = vinculos.split(',').map(x => parseInt(x, 10));

    const articulosRubros = await ArticuloRubro
    .query()
      .from('articulos_rubros as ar')
      .leftJoin('articulos as a', 'a.id' , '=' , 'ar.articulo_id')
      .leftJoin('afip_iva as i', 'i.id' , '=' , 'a.iva_id')
      .leftJoin('afip_monedas as mo', 'mo.id' , '=' , 'a.moneda_id')
      .leftJoin('unidades as um', 'um.id' , '=' , 'a.um_venta_id')
      .leftJoin('users as u', 'a.creador_id' , '=' , 'u.id')
      .leftJoin('marcas as m', 'm.id' , '=' , 'a.marca_id')
      .leftJoin('grupos as g', 'g.id' , '=' , 'a.grupo_id')
      .leftOuterJoin('users_articulos_inactivos as uai', function() {
        this.on('uai.user_id', '=', user.id).andOn('uai.articulo_id', '=', 'a.id')
      })
      .select('a.codigo', 
              'a.nombre',
              'concat(a.codigo,a.nombre) as codnom',
              'a.creador_id as userid',
              'a.iva_id as ivaid',
              'a.moneda_id as monedaid',
              'a.um_venta_id as unimedid',
              'uai.id as activo', 
              'm.nombre as nommar', 
              'g.nombre as nomgru', 
              'u.username as creador', 
              'i.tasa as tasa',
              'mo.simbolo as simbolo',
              'um.nombre as unimed',
              'a.id')
      .whereIn('rubro_id', userRubros)
      .whereIn('a.creador_id', vinculos )
      .where(function () { 
        this.where('a.codigo', 'like', '%'+bus+'%')
        this.orWhere('a.nombre', 'like', '%'+bus+'%') })
      .limit(25)
      .fetch()

      console.log('articulosRubros es= a: ',articulosRubros.rows.length)

    return await articulosRubros
  }


  /*
  select a.codigo, a.nombre, a.activo, m.nombre as nommar, g.nombre as nomgru, a.id,
  (select id from users_articulos_inactivos where(user_id=1 and articulo_id=a.id)) as uai
  from articulos_rubros as ar
  left join articulos as a on a.id = ar.articulo_id
  left join marcas as m on m.id = a.marca_id
  left join grupos as g on g.id = a.grupo_id
  where rubro_id in (1) and (a.codigo like '%%' or a.nombre like '%%') limit 9
  */

/*
  const stk = await ComprobanteItem
  .query('deposito_id', 'c.tipo')
  .from('comprobantes_items as ci')
  .leftJoin('comprobantes as c', 'c.id', '=', 'ci.comprobante_id')
  .select('ci.deposito_id')
  .sum('stock as stock')
  .whereIn('c.tipo', ['VE','CO'])
  .where('ci.articulo_id',id)
  .where('ci.deposito_id',dep)
  .where('c.user_id',user.id)
  .groupBy('ci.deposito_id')
*/

  async articulocopia ( {auth, params } ) {

    let { page, rows, search } = params
    page = Number(page)
    rows = Number(rows)
    let bus = search == 'all' ? '' : search

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
      .paginate(page, rows)
    return await articulosRubros
  }


  // CONSULTA DE ARTICULOS PARA IMPORTACION ( RESUMIDA )
  // FILTRA POR LOS RUBROS ASIGNADOS AL USUARIO QUE CORRESPONDAN A LOS ARTICULOS
  async userarticulosimp ( {auth } ) {
    const user = auth.current.user
    const userRubros = await user.rubros().ids()
    const articulosRubros = ArticuloRubro.query()
      .whereIn('rubro_id', userRubros)
      .with('articulo')
      .fetch()
    return articulosRubros
  }

  async userarticulosmisprecios ( {auth, params } ) {
    let { lis } = params
    const user = auth.current.user
    const userRubros = await user.rubros().ids()
    const precios = Precio.query()
      .from('precios as p')
      .leftJoin('articulos as a', 'a.id' , '=' , 'p.articulo_id')
      .leftJoin('users_listas as ul', 'ul.id' , '=' , 'p.lista_id')
      .select('a.codigo', 'p.precio', 'p.costo')
      .where('p.lista_id', lis)
      .orderBy('a.codigo')
      .fetch()
    return precios
  }

  // CONSULTA PRINCIPAL DE ARTICULOS
  // FILTRA POR LOS RUBROS ASIGNADOS AL USUARIO QUE CORRESPONDAN A LOS ARTICULOS
  async userarticulosprecios ( {auth, params } ) {

    let { page, rows, search, rub, lis, mar, gru } = params
    //console.log('el page es:' , page)
    //console.log('perPage es:' , rows)
    //console.log('el search es:' , search)
    //console.log('el rub es:' , rub)
    //console.log('el lis es:' , lis)
    //console.log('el mar es:' , mar)
    //console.log('el gru es:' , gru)
    let bus = search == 'all' ? '' : search

    let busMar = ''
    if (mar=='Todas') {
      busMar = '(a.marca_id>=1 and a.marca_id<=99999999)'
    } else {
      busMar = mar
    }

    let busGru = ''
    if (gru=='Todos') {
      busGru = '(a.grupo_id>=1 and a.grupo_id<=99999999)'
    } else {
      busGru = gru
    }

    bus = decodeURIComponent(bus)
    const user = auth.current.user
    const userRubros = await user.rubros().ids()

    //console.log(bus)
    if (bus) {
      page = 1
    }

    const articulosRubros = await ArticuloRubro
      .query()
      .from('articulos_rubros as ar')
      .leftJoin('articulos as a', 'a.id' , '=' , 'ar.articulo_id')
      .leftJoin('marcas as m', 'm.id' , '=' , 'a.marca_id')
      .leftJoin('grupos as g', 'g.id' , '=' , 'a.grupo_id')
      .leftJoin('precios as p', 'p.articulo_id' , '=' , 'a.id')
      .select('a.codigo', 'a.nombre', 'a.activo', 'm.nombre as nommar', 'g.nombre as nomgru', 'p.costo', 'a.id')
      .where('p.lista_id',lis)
      .where('rubro_id', rub )
      .where('a.marca_id', busMar )
      .where('a.grupo_id', busGru )
      .where(function () {
          this.where('a.codigo', 'like', '%'+bus+'%')
          this.orWhere('a.nombre', 'like', '%'+bus+'%') 
      })
      .orderBy('a.codigo')
      .paginate(page, rows)

      /*
      select
      a.codigo, a.nombre, a.activo, m.nombre as nommar, g.nombre as nomgru, p.costo, a.id
      from articulos_rubros as ar left join articulos as a on a.id = ar.articulo_id
      left join marcas as m on m.id = a.marca_id
      left join grupos as g on g.id = a.grupo_id
      left join precios as p on ( p.articulo_id = a.id and p.lista_id = 1 )
      where rubro_id = 1 and a.marca_id = 1 and a.grupo_id = 1 and (a.codigo like '%%' or a.nombre like '%%')
      */



      const pagination = articulosRubros.toJSON()
      //console.log(pagination)

    return await articulosRubros
  }



  

  async tengoelarticulo ({ auth, request, params }) {
    const user = await auth.getUser()
    const { codigo, grupo, marca } = params
    const articulo = await Articulo.query()
    .where('codigo', codigo)
    .where('grupo_id', grupo)
    .where('marca_id', marca)
    .fetch()
    //console.log(articulo.rows.length)
    return (articulo.rows.length > 0) ? true : false
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
    //console.log('a')
    const user = await auth.getUser()
    //console.log('b')
    //console.log(user.id)
    //console.log('c')
    const caja = await Caja.query()
      .where('user_id', user.id)
      .where('cerrada', 0)
      .orderBy('id','desc')
      .limit(1)
      .fetch()
    //console.log('d')
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
    const usuario = await User.query()
    .where('id', user.id)
    .with('rubros')
    .with('listas')
    .with('users')
    .with('vinculos.user')
    .with('sucursales.depositos')
    .with('tercero.responsable')
    .fetch()
    return usuario
  }

  async userprecios ({ auth, params }) {
    const { user, articulo } = params
    let art = Number(articulo)
    // BUSCO LA LISTA DEL CREADOR
    const listas = await UserLista
      .query()
        .where('user_id', user)
        .fetch()
    let lista = listas.rows[0].id
    const precio = await Precio
      .query()
        .where('lista_id', lista)
        .where('articulo_id', art)
        .fetch()
    return precio.rows[0].precio
  }

  async empresa ({ auth, params }) {
    const { id } = params
    const empresa = await User.query()
    .where('id', id)
    .with('rubros')
    .with('listas')
    .with('users')
    .with('sucursales.depositos')
    .with('tercero.responsable')
    .fetch()
    return empresa
  }

  async depositos ({ auth, params}) {
    const user = await auth.getUser()
    const depositos = await User.query()
    .where('id', user.id)
    .with('sucursales.depositos')
    .fetch()
    // console.log(depositos)
    return depositos
  }

  async updateProfile ( { request, auth, response }) {

    // USUARIO ACTUAL
    const user = auth.current.user

    // ACTUALIZO EL USER
    user.username = request.input('username')
    user.email = request.input('email')
    user.tercero_id = request.input('tercero_id')
    user.tipo = request.input('tipo')
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
          //console.log('4')
          suc = await Sucursal.find(su2[i].id)
        }
        //console.log(su2[i])
        suc.user_id = su2[i].user_id
        suc.color = su2[i].color
        suc.nombre = su2[i].nombre
        suc.abreviado = su2[i].abreviado
        suc.fiscal = su2[i].fiscal
        suc.electronica = su2[i].electronica
        suc.sucursaldemo = su2[i].sucursaldemo
        suc.activo = su2[i].activo
        await suc.save()
        for (let j=0; j<su2[i].depositos.length; j++) {
          let dep = null;
          //console.log(su2[i].depositos[j])
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

    // ACTUALIZO LAS USUARIOS
    const usuarios = request.only(['users'])
    //console.log(usuarios)
    const us = Object.values(usuarios)
    const us2 = us[0];
    if(us2.length>0) {
      let ul = null
      let lv = null
      for (let i=0; i<us2.length; i++) {
        if (us2[i].id == 0 ) {
          //console.log('nuevo')
          ul = new User()
          ul.activo = 1
          lv = us2[i].level.level
        } else {
          //console.log('modifica')
          ul = await User.find(us2[i].id)
          lv = us2[i].level
        }

        //const Hash = use("Hash")
        //let pwd = Hash.make(us2[i].password)
        let pwd = us2[i].password
        //console.log(us2[i].username)
        //console.log(us2[i].email)
        //console.log(us2[i].password)
//      console.log(pwd)
        //console.log(us2[i].user_id)
        //console.log(lv)
        //console.log(us2[i].activo)

        ul.username = us2[i].username
        ul.email = us2[i].email
        ul.password = pwd
        ul.user_id = us2[i].user_id
        ul.level = lv
        ul.activo = us2[i].activo
        await ul.save()
      }
    }

    // ACTUALIZO LOS VINCULOS
    const vin = request.only(['vin'])
    let v = Object.values(vin)
    let vinculo = ''
    let vinculoConElOtroUsuario = ''
    let id = 0
    for (let i=0; i<=v[0].length-1; i++) {

      // ACTUALIZO EL VINCULO PROPIO
      vinculo = await Vinculo.find(v[0][i].id)
      vinculo.activo = v[0][i].activo
      vinculo.articulos = v[0][i].articulos
      vinculo.operaciones = v[0][i].operaciones
      await vinculo.save()

      // ACTUALIZO EL VINCULO DEL USUARIO VINCULADO
      vinculoConElOtroUsuario = await Vinculo
        .query()
        .where('user_id_desde', '=', v[0][i].user_id_hasta)
        .where('user_id_hasta', '=', v[0][i].user_id_desde)
        .fetch()
      id = vinculoConElOtroUsuario.rows[0].id
      vinculo = await Vinculo.find(id)
      vinculo.activo = v[0][i].activo
      vinculo.articulos = 0 // v[0][i].articulos
      vinculo.operaciones = v[0][i].operaciones
      await vinculo.save()
    }
    return user
  }

  async notificaciones ({ auth, params }) {
    const user = await auth.getUser()
    const { id } = params;

    /*
    Como debe funcionar esto:
    1) detectar que tipo de usuario es el actual
      
      'IP' -> Importador / Productor
      'MD' -> Mayorista / Distribuidor
      'MI' -> Minorista

      'IP' buscara a los 'MP'
      'MD' buscara a los 'IP' y a los 'MI'
      'MI' buscara a los 'MD'
    */

    // DESIGNO LOS TIPOS POSIBLES CON LOS CUALES VINCULAR LA CUENTA
    //console.log('el user es:', user.id)
    let tipoABuscar = ''
    if (user.tipo=='IP' || user.tipo=='MI')  {
      tipoABuscar = ['MD']
    } else if ( user.tipo=='MD') {
      tipoABuscar = ['IP','MI']
    } else {
      tipoABuscar = ['SU']
    }
    
    // BUSCO LOS RUBROS A LOS CUALES PERTENECE EL USUARIO
    const usrRub = []
    const usrrubros = await User
    .query()
      .from('users_rubros as ur')
      .leftJoin('users as u', 'u.id' , '=' , 'ur.user_id')
      .where('ur.user_id', user.id)
      .fetch()
    for (let i=0; i<=usrrubros.rows.length-1; i++) {
      usrRub.push(usrrubros.rows[i].id)
    }
    //console.log(usrRub)

    // BUSCO TODOS LOS OTROS USUARIOS QUE PERTENECEN A LOS RUBROS DEL USUARIO
    const usrsRub = []
    const usrsrubros = await User
    .query()
      .from('users_rubros as ur')
      .leftJoin('users as u', 'u.id' , '=' , 'ur.user_id')
      .where('ur.user_id', '!=', user.id)
      .whereIn('u.tipo', tipoABuscar)
      .fetch()
    for (let i=0; i<=usrsrubros.rows.length-1; i++) {
      usrsRub.push(usrsrubros.rows[i].id)
    }
    //console.log(usrsRub)

    // UNA VEZ QUE TENGO LOS USUARIOS A VINCULAR, BUSCO A VER SI YA ESTAN VINCULADOS
    const aVincular = []
    const aVin = await Vinculo
    .query()
      .with('user')
      .from('vinculos as v')
      .where('v.user_id_desde', '=', user.id)
      .fetch()
    //console.log(aVin)
    for (let i=0; i<=aVin.rows.length-1; i++) {
      aVincular.push(aVin.rows[i].user_id_hasta)
    }
    //console.log(aVincular)

    let faltantes = usrsRub.filter(el => !aVincular.includes(el));
    let  nv = null
    for (let i=0; i<=faltantes.length-1; i++) {
      nv = new Vinculo()
      nv.user_id_desde = user.id
      nv.user_id_hasta = faltantes[i]
      nv.articulos = 0
      nv.operaciones = 0
      nv.activo = 0
      await nv.save()

      nv = new Vinculo()
      nv.user_id_desde = faltantes[i]
      nv.user_id_hasta = user.id
      nv.articulos = 0
      nv.operaciones = 0
      nv.activo = 0
      await nv.save()

      // Tengo que generar la notificacion
      const notif = new Notificacion()
      notif.user_id_desde = user.id
      notif.user_id_hasta = faltantes[i]
      notif.comprobante_id = null
      notif.tipo = 'V'
      notif.detalles = 'Solicitud de Vinculo Comercial'
      notif.estado = 'P'
      await notif.save()
    }
    console.log('4')

    const notificaciones = await Notificacion.query()
    .with('comprobante')
    .with('comprobante.items')
    .with('comprobante.tercero')
    .with('userdesde')
    .where('estado', 'P')
    .where('user_id_hasta', id)
    .orderBy('created_at','desc')
    .fetch()

    if (notificaciones) {
//    console.log(notificaciones.rows)
      return notificaciones
    } else {
      return []
    }
  }
  
  async articulosvinculos ({ auth, params }) {
    const user = await auth.getUser()
    const aVin = await Vinculo
    .query()
      .where('user_id_desde', '=', user.id)
      .where('articulos', '=', 1)
      .fetch()
    return await aVin
  }
  
  async vinculos ({ auth, params }) {

    /*
    Como debe funcionar esto:
    1) detectar que tipo de usuario es el actual
      
      'IP' -> Importador / Productor
      'MD' -> Mayorista / Distribuidor
      'MI' -> Minorista

      'IP' buscara a los 'MP'
      'MD' buscara a los 'IP' y a los 'MI'
      'MI' buscara a los 'MD'

    */

    const user = await auth.getUser()

    // DESIGNO LOS TIPOS POSIBLES CON LOS CUALES VINCULAR LA CUENTA
    //console.log('el user es:', user.id)
    let tipoABuscar = ''
    if (user.tipo=='IP' || user.tipo=='MI')  {
      tipoABuscar = ['MD']
    } else if ( user.tipo=='MD') {
      tipoABuscar = ['IP','MI']
    }
    
    // BUSCO LOS RUBROS A LOS CUALES PERTENECE EL USUARIO
    const usrRub = []
    const usrrubros = await User
    .query()
      .from('users_rubros as ur')
      .leftJoin('users as u', 'u.id' , '=' , 'ur.user_id')
      .where('ur.user_id', user.id)
      .fetch()
    for (let i=0; i<=usrrubros.rows.length-1; i++) {
      usrRub.push(usrrubros.rows[i].id)
    }
    //console.log(usrRub)

    // BUSCO TODOS LOS OTROS USUARIOS QUE PERTENECEN A LOS RUBROS DEL USUARIO
    const usrsRub = []
    const usrsrubros = await User
    .query()
      .from('users_rubros as ur')
      .leftJoin('users as u', 'u.id' , '=' , 'ur.user_id')
      .where('ur.user_id', '!=', user.id)
      .where('u.tipo','=',tipoABuscar)
      .fetch()
    for (let i=0; i<=usrsrubros.rows.length-1; i++) {
      usrsRub.push(usrsrubros.rows[i].id)
    }
    //console.log(usrsRub)

    // UNA VEZ QUE TENGO LOS USUARIOS A VINCULAR, BUSCO A VER SI YA ESTAN VINCULADOS
    const aVincular = []
    const aVin = await Vinculo
    .query()
      .with('user')
      .from('vinculos as v')
      .where('v.user_id_desde', '=', user.id)
      .fetch()
    //console.log(aVin)
    for (let i=0; i<=aVin.rows.length-1; i++) {
      aVincular.push(aVin.rows[i].user_id_hasta)
    }

    let faltantes = usrsRub.filter(el => !aVincular.includes(el));
    let  nv = null
    for (let i=0; i<=faltantes.length-1; i++) {
      nv = new Vinculo()
      nv.user_id_desde = user.id
      nv.user_id_hasta = faltantes[i]
      nv.lista = 0
      nv.notificado = 0           // ESTE NO VA, ESTA AL PEDO.-
      nv.activo = 0
      await nv.save()

      // Tengo que generar la notificacion
      const notif = new Notificacion()
      notif.user_id_desde = user.id
      notif.user_id_hasta = faltantes[i]
      notif.comprobante_id = null
      notif.tipo = 'V'
      notif.detalles = 'Solicitud de Vinculo Comercial'
      notif.estado = 'P'
      await notif.save()
    }

    //console.log('usrsRub',usrsRub)
    //console.log('aVincular',aVincular)
    //console.log(faltantes);
    return aVin
    
    /*
    let a = 'SELECT users.id, users.username, users.tipo, rubros.id, rubros.nombre,'
    a += '(select id from vinculos where user_id_hasta=users.id) as idvin from users '
    a += 'left join users_rubros on users_rubros.user_id = users.id'
    a += 'left join rubros on rubros.id = users_rubros.rubro_id'
    a += 'where users.tipo = "'+tipoABuscar+'" and users.id <> '+user.id+' and rubros.id = rubro_id'
    console.log(a)
    const vin = query(a).fetch()
    */
  }

  async vinculoconfirmarrechazar ({ auth, request, params }) {

    // marco la notificacion como procesada
    let activo = request.input('activo')
    let estado = request.input('estado')
    let desde = request.input('user_id_desde')
    let hasta = request.input('user_id_hasta')
    //console.log(estado)
    //console.log(activo)
    const user = await auth.getUser()
    let { id } = params
    const not = await Notificacion.find(id)
    //AuthorizationService.verifyPermission(not, user)
    not.estado = estado
    await not.save()

    // marco el vinculo segun seleccion, confirma o rechaza
    const vin = await Vinculo.query()
      .where('user_id_desde', '=', desde)
      .where('user_id_hasta', '=', hasta)
      .fetch()
      id = vin.rows[0].id

    const v = await Vinculo.find(id)
    v.activo = activo
    await v.save()
    return not
  }
  
  async notificaragohu ({ auth }) {
    /*
      Un usuario nuevo notifica a gohu para ser autorizado
      para utilizar el sistema.
    */
    const user = await auth.getUser()
    const notif = new Notificacion()
    notif.user_id_desde = user.id
    notif.user_id_hasta = 1
    notif.comprobante_id = null
    notif.tipo = 'A'
    notif.detalles = 'Solicitud de Vinculo Comercial'
    notif.estado = 'P'
    await notif.save()

    /* 
      genero los vinculos asi ya los dejo listos. 
    */
    let nv = await new Vinculo()
    nv.user_id_desde = user.id
    nv.user_id_hasta = 1
    nv.articulos = 0
    nv.operaciones = 0
    nv.activo = 0
    await nv.save()

    nv = await new Vinculo()
    nv.user_id_desde = 1
    nv.user_id_hasta = user.id
    nv.articulos = 0
    nv.operaciones = 0
    nv.activo = 0
    await nv.save()

  }

  async gohuestanotificado ({ auth }) {
    /*
      Un usuario nuevo notifica a gohu para ser autorizado
      para utilizar el sistema.
    */
    const user = await auth.getUser()
    const notif = await Notificacion.query()
    .where('user_id_desde', user.id)
    .where('user_id_hasta', 1)
    .where('tipo', 'A')
    .where('estado', 'P')
    .fetch()
    console.log(notif)
    return (await notif.rows.length > 0) ? true : false
  }

  async notificacionesgohu ({ auth, params }) {
    const user = await auth.getUser()
    const { id } = params;

    const notificaciones = await Notificacion.query()
    .with('comprobante')
    .with('comprobante.items')
    .with('comprobante.tercero')
    .with('userdesde')
    .where('estado', 'P')
    .where('user_id_hasta', 1)
    .orderBy('created_at','desc')
    .fetch()

    if (notificaciones) {
      return notificaciones
    } else {
      return []
    }
  }

  async activarrechazarusuario ({ params, request }) {

    const { id } = params;
    let venc = new Date().toISOString().substr(0, 10)
    const activo = request.input('activo')
    const user = await User.find(id)
    user.activo = activo
    user.vencimiento = venc
    await user.save()

    const notificacion = await Notificacion
    .query()
      .where('estado', 'P')
      .where('user_id_desde', id)
      .where('user_id_hasta', 1)
    .fetch()
    
    let notid = notificacion.rows[0].id
    const not = await Notificacion.find(notid)
    not.estado = 'R'
    await not.save()

    // activo el vinculo del usuario con gohu
    let vin = await Vinculo
    .query()
      .where('user_id_desde', '=', id)
      .where('user_id_hasta', '=', 1 )
    .fetch()
    let vinid = vin.rows[0].id
    let vinculo = await Vinculo.find(vinid)
    vinculo.activo = activo
    vinculo.articulos = 0
    vinculo.operaciones = 0
    await vinculo.save()

    // activo el vinculo de gohu con el usuario
    vin = await Vinculo
    .query()
      .where('user_id_desde', '=', 1)
      .where('user_id_hasta', '=', id )
    .fetch()
    vinid = vin.rows[0].id
    vinculo = await Vinculo.find(vinid)
    vinculo.activo = activo
    vinculo.articulos = 1
    vinculo.operaciones = 1
    await vinculo.save()

  }

}

module.exports = UserController
