'use strict'

const ImportService = use('App/Services/ImportService')
const ActualizaPrecios = use('App/Services/ActualizaPrecios')
const Articulo = use('App/Models/Articulo')
const UserArticuloInactivo = use('App/Models/UserArticuloInactivo')
const Precio = use('App/Models/Precio')
const ArticuloTag = use('App/Models/ArticuloTag')
const ComprobanteItem = use('App/Models/ComprobanteItem')
const Tag = use('App/Models/Tag')
const AuthorizationService = use('App/Services/AuthorizationService')
const Helpers = use('Helpers')

class ArticuloController {

  async indexNoVaMas ({ auth, request, params }) {
    const user = await auth.getUser()
    let { page, search } = params
    let bus = search == 'all' ? '' : search
    bus = decodeURIComponent(bus)
    const articulos = await Articulo
      .query()
      .orWhere('codigo', 'LIKE', '%'+bus+'%')
      .orWhere('nombre', 'LIKE', '%'+bus+'%')
      .paginate(page, 10)
    const pagination = articulos.toJSON()
    if(pagination.lastPage < page && page != 1) {
      response.route(pagination.route, { page: 1 }, null, true)
    }
    else {
      pagination.offset = (pagination.page - 1) * pagination.perPage
      pagination.search = search
      return { pagination }
    }
  }

  async articulo ( {auth, params } ) {
    let { id } = params
    const user = auth.current.user
    const articulo = Articulo.query()
      .where('id', id)
      .with('marca')
      .with('grupo')
      .with('creador')
      .with('umcompra')
      .with('umventa')
      .with('umstock')
      .with('iva')
      .with('tags')
      .with('fotos')
      .with('rubros')
      .with('precios.lista')
      .with('moneda')
      .fetch()
    return await articulo
  }

  async stock ({ auth, params }) {
    const user = await auth.getUser()
    const { id, dep } = params
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
    .catch((err) => {
      console.log(err)
    })
    console.log(stk)
    return stk ? stk[0].stock : 0
  }

  async stocks ({ auth, params }) {
    const user = await auth.getUser()
    const { id } = params
    const stk = await ComprobanteItem
      .query('deposito_id', 'c.tipo')
      .from('comprobantes_items as ci')
      .leftJoin('comprobantes as c', 'c.id', '=', 'ci.comprobante_id')
      .select('ci.deposito_id')
      .sum('stock as stock')
      .whereIn('c.tipo', ['VE','CO'])
      .where('ci.articulo_id',id)
      .where('c.user_id',user.id)
      .groupBy('ci.deposito_id')
    

    /*
    const co = await ComprobanteItem
      .query('deposito_id', 'c.tipo')
      .from('comprobantes_items as ci')
      .leftJoin('comprobantes as c', 'c.id', '=', 'ci.comprobante_id')
      .select('ci.deposito_id')
      .sum('cantidad as stock')
      .where('c.tipo','CO')
      .where('ci.articulo_id',id)
      .where('c.user_id',user.id)
      .groupBy('ci.deposito_id')
    */
    /*
      let f=[];
      if (co.length>0) {
        for (let i=0; i<=co.length-1; i++) {
          f.push( { deposito_id: co[i].deposito_id, stock: co[i].stock } )
          for (let j=0; j<=ve.length-1; j++) {
            if( co[i].deposito_id==ve[j].deposito_id) {
              f[i].stock -= ve[j].stock
            }
          }
        }
      } else if (ve.length>0) {
        for (let i=0; i<=ve.length-1; i++) {
          f.push( { deposito_id: ve[i].deposito_id, stock: ve[i].stock*-1 } )
        }
      }
      */
      //console.log(ve)
      //console.log(co)
      //console.log(stk)
    return stk
  }

  /*
  SELECT ci.articulo_id, sum(if(c.tipo='CO',ci.cantidad*-1, ci.cantidad)) as ctt, ci.deposito_id
  FROM comprobantes_items as ci
  left join comprobantes as c on c.id = ci.comprobante_id
  where c.user_id=16 group by ci.articulo_id, ci.deposito_id
  */

  async exists ({ auth, request, params }) {
    const user = await auth.getUser()
    const { codigo } = params
    const articulo = await Articulo.findBy('codigo', codigo  )
 // AuthorizationService.verifyPermission(afipdocumento, user)
    return await articulo ? true : false
  }

  async precio ({ auth, params }) {
    const user = await auth.getUser()
    const { art, lis } = params
    const precio = await Precio.query()
      .where('articulo_id', art)
      .where('lista_id', lis)
      .fetch()
    return precio
//  return await Articulo.all()
  }

  async create ({ auth, request }) {
    const user = await auth.getUser()
    const { 
      codigo,
      codbar,
      codbaroriginal,
      nombre,
      descripcion,
      grupo_id,
      marca_id,
      creador_id,
      um_compra_id,
      um_venta_id,
      um_stock_id,
      un_compra,
      un_venta,
      un_stock,
      secompra,
      sevende,
      stock,
      iva_id,
      moneda_id,
      activo} = request.all()

    const articulo = new Articulo()

    AuthorizationService.verifyPermission(articulo, user)
    articulo.fill({ 
      codigo,
      codbar,
      codbaroriginal,
      nombre,
      descripcion,
      grupo_id,
      marca_id,
      creador_id,
      um_compra_id,
      um_venta_id,
      um_stock_id,
      un_compra,
      un_venta,
      un_stock,
      secompra,
      sevende,
      stock,
      iva_id,
      moneda_id,
      activo
    })
    
    await articulo.save()
                 
    // ACTUALIZO RUBROS
    const rubros = request.only(['rubros'])
    const rb = Object.values(rubros)
    const rb2 = rb[0];
    if(rb2.length>0) {
      let arr = []
      for (let i=0; i<rb2.length; i++) {
        arr.push(rb2[i].id)
      }
      await articulo.rubros().attach(arr)
    }

    // ACTUALIZO TAGS
    const tags = request.only(['tags'])
    const tg = Object.values(tags)
    const tg2 = tg[0];
    if(tg2.length>0) {
      let arr = []
      for (let i=0; i<tg2.length; i++) {
        arr.push(tg2[i].id)
      }
      await articulo.tags().attach(arr)
    }
    
    // ACTUALIZO FOTOS
    const fotos = request.only(['fotos'])
    const ft = Object.values(fotos)
    const ft2 = ft[0];
    if(ft2.length>0) {
      let arr = []
      for (let i=0; i<ft2.length; i++) {
        arr.push(ft2[i].id)
      }
      await articulo.fotos().createMany(ft2)
    }

    // ACTUALIZO PRECIOS
    const precios = request.only(['precios'])
    const pr = Object.values(precios)
    const pr2 = pr[0];
    if(pr2.length>0) {
      let arr = []
      for (let i=0; i<pr2.length; i++) {
        arr.push({articulo_id: articulo.id,
                  lista_id: pr2[i].lista_id,
                  costo: pr2[i].costo,
                  porrem: pr2[i].porrem,
                  precio: pr2[i].precio
                })
      }
      await articulo.precios().createMany(arr)
    }
    return articulo
  }

  async destroy ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const articulo = await Articulo.find(id)
    AuthorizationService.verifyPermission(articulo, user)
    await articulo.delete()
    return articulo
  }

  async update ( { auth, request, params }) {
    const user = await auth.getUser()
    const { id } = params
    const articulo = await Articulo.find(id)
    AuthorizationService.verifyPermission(articulo, user)

    const tags = request.only(['tags'])
    const tg = Object.values(tags)
    const tg2 = tg[0];
    if(tg2.length>0) {
      await articulo.tags().detach()
      let arr = []
      for (let i=0; i<tg2.length; i++) {
        arr.push(tg2[i].id)
      }
      await articulo.tags().attach(arr)
    }

    const rubros = request.only(['rubros'])
    const rb = Object.values(rubros)
    const rb2 = rb[0];
    if(rb2.length>0) {
      await articulo.rubros().detach()
      let arr = []
      for (let i=0; i<rb2.length; i++) {
        arr.push(rb2[i].id)
      }
      await articulo.rubros().attach(arr)
    }

    const fotos = request.only(['fotos'])
    const ft = Object.values(fotos)
    const ft2 = ft[0];
    if(ft2.length>0) {
      await articulo.fotos().delete()
      let arr = []
      for (let i=0; i<ft2.length; i++) {
        arr.push(ft2[i].id)
      }
      await articulo.fotos().createMany(ft2)
    }

    // ACTUALIZO PRECIOS
    const precios = request.only(['precios'])
    const pr = Object.values(precios)
    const pr2 = pr[0];
    if(pr2.length>0) {
      let arr = []
      let arrId = []
      for (let i=0; i<pr2.length; i++) {
        arr.push({articulo_id: Number(id),
                  lista_id: pr2[i].lista_id,
                  costo: pr2[i].costo,
                  porrem: pr2[i].porrem,
                  precio: pr2[i].precio
                })
        arrId.push(pr2[i].lista_id)
      }

      let act = null
      let estaba = false
      for (let i=0; i<=arrId.length-1; i++) {
        act = await Precio.query()
        .where('articulo_id', id)
        .where('lista_id', arrId[i])
        .fetch()

        if (act.rows.length > 0) {
          estaba = true
          act = await Precio.query()
          .where('articulo_id', id)
          .where('lista_id', arrId[i])
          .update({costo: arr[i].costo, porrem: arr[i].porrem, precio: arr[i].precio})
        }
      }
      if (!estaba) {
        await articulo.precios().createMany(arr)
      }
    }
    
    articulo.merge(request.only([
      'codigo',
      'codbar',
      'codbaroriginal',
      'nombre',
      'descripcion',
      'grupo_id',
      'marca_id',
      'creador_id',
      'um_compra_id',
      'um_venta_id',
      'um_stock_id',
      'un_compra',
      'un_venta',
      'un_stock',
      'secompra',
      'sevende',
      'stock',
      'iva_id',
      'moneda_id',
      'activo',
    ]))

    await articulo.save();

    /*
    const tg = Object.values(tags)
    tg.forEach(o => {
      for (let i=0; o.length-1; i++) {
//      let data = [{id:1, name: 'ted', user_id: 1}, {id:2, name: 'ales', user_id:3}, {id:3, name: 'ted', user_id: 1}];
        console.log(id)
        await ArticuloTag.all(tags.map( async d => {
         await findOrCreate({articulo_id: id, tag_id: o[i].id}, d); 
        }))
      }      
    });
    */
    //console.log('el articulo es:' , articulo)
    //const tgs = articulo.merge(request.only(['tags']))
    //console.log('el tgs es', tgs)
    //const tg = JSON.stringify(tgs)
    //console.log('pasado a obj es',tg)

//  tags.merge(request.only(['tags']))
//  await tags.save()

    return articulo
  }

  async activardesactivar ( { auth, params }) {
    const user = await auth.getUser()
    const { id } = params
    const actdes = await UserArticuloInactivo.query()
      .where('articulo_id', id)
      .where('user_id', user.id)
      .fetch()
    AuthorizationService.verifyPermission(actdes, user)
    if (actdes.rows.length > 0) {
      let uai = await UserArticuloInactivo.find(actdes.rows[0].id)
      await uai.delete()
      return true
    } else {
      let uai = { user_id: user.id, articulo_id: Number(id) }
      await UserArticuloInactivo.create(uai)
      return false
    }
  }


  async import({request, response}) {
    let upload  = request.file('upload')
    let fname   = `${new Date().getTime()}.${upload.extname}`
    let dir     = 'upload/'
    console.log('a')
    //move uploaded file into custom folder
    await upload.move(Helpers.tmpPath(dir), {
        name: fname
    })
    console.log('b')
    if (!upload.moved()) {
        console.log('error')
        return (upload.error(), 'Error moving files', 500)
    }
    console.log('c')
    let send = await ImportService.ImportClassification('tmp/' + dir + fname)
    console.log(send)
  }

  async actualizaprecios({request, response}) {

    const file = request.file('file',{
      maxSize: '5mb',
      allowedExtensions: ['xlsx']
    })

    console.log('a', file)
    const filename = `${new Date().getTime()}.${file.extension()}`
    console.log('b', filename)

    let dir = 'upload/'
    
    await file.move(Helpers.tmpPath(dir), {
        name: filename
    })

    if (!file.moved()) {
        console.log('error')
        return (file.error(), 'Error moving files', 500)
    }

    console.log('okey')
    // let send = await ActualizaPrecios.ImportClassification('tmp/' + dir + fname)
    console.log(send)
  }

}

module.exports = ArticuloController
