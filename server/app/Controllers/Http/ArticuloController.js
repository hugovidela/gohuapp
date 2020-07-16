'use strict'

const Articulo = use('App/Models/Articulo')
const Precio = use('App/Models/Precio')
const ArticuloTag = use('App/Models/ArticuloTag')
const Tag = use('App/Models/Tag')
const AuthorizationService = use('App/Services/AuthorizationService')

class ArticuloController {

  async index ({ auth }) {
    const user = await auth.getUser()
    const articulos = await Articulo.query()
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
    return articulos
//  return await Articulo.all()
  }

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
    articulo.fill({ codigo,
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
      for (let i=0; i<pr2.length; i++) {
        arr.push({articulo_id: Number(id),
                  lista_id: pr2[i].lista_id,
                  costo: pr2[i].costo,
                  porrem: pr2[i].porrem,
                  precio: pr2[i].precio
                })
      }
      await articulo.precios().delete()
      await articulo.precios().createMany(arr)
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
}

module.exports = ArticuloController
