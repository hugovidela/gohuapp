'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Precio extends Model {
  static get table () {
    return 'precios'
  }

  articulo () {
    return this.belongsTo('App/Models/Articulo', 'articulo_id', 'id')
  }

  lista () {
    return this.belongsTo('App/Models/UserLista', 'lista_id', 'id')
  }


}

module.exports = Precio
