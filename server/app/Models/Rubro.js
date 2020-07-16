'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Rubro extends Model {

  static get table () {
    return 'rubros'
  }
/*
  user () {
    return this.belongsTo('App/Models/User','id','user_id')
  }
*/
  /*
  articulos () {
    return this.belongsToMany('App/Models/Articulo','rubro_id','articulo_id','id','id')
      .pivotTable('articulos_rubros')
  }
  */
}

module.exports = Rubro
