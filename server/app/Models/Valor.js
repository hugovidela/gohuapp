'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Valor extends Model {
  static get table () {
    return 'valores'
  }

  caja() {
    return this.belongsTo('App/Models/Caja')
  }

}

module.exports = Valor
