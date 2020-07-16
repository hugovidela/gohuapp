'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ArticuloTag extends Model {

  static get table () {
    return 'articulos_tags'
  }

}

module.exports = ArticuloTag
