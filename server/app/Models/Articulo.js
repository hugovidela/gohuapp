'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Articulo extends Model {

  static get table () {
    return 'articulos'
  }

  rubro () {
    return this.belongsTo('App/Models/Rubro')
  }
  marca () {
    return this.belongsTo('App/Models/Marca')
  }
  grupo () {
    return this.belongsTo('App/Models/Grupo')
  }
  creador () {
    return this.belongsTo('App/Models/User', 'creador_id', 'id')
  }
  umcompra () {
    return this.belongsTo('App/Models/Unidad', 'um_compra_id', 'id')
  }
  umventa () {
    return this.belongsTo('App/Models/Unidad', 'um_venta_id', 'id')
  }
  umstock () {
    return this.belongsTo('App/Models/Unidad', 'um_stock_id', 'id')
  }
  iva () {
    return this.belongsTo('App/Models/AfipIva', 'iva_id', 'id')
  }
  moneda () {
    return this.belongsTo('App/Models/AfipMoneda', 'moneda_id', 'id')
  }
  tags () {
    return this.belongsToMany('App/Models/Tag','articulo_id','tag_id','id','id')
      .pivotTable('articulos_tags')
      .withTimestamps()
  }
  rubros () {
    return this.belongsToMany('App/Models/Rubro','articulo_id','rubro_id','id','id')
      .pivotTable('articulos_rubros')
      .withTimestamps()
  }
  fotos () {
    return this.hasMany('App/Models/ArticuloFoto')
  }

  precios() {
    return this.hasMany('App/Models/Precio')
  }

}

module.exports = Articulo
