'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Vinculo extends Model {
  static get table () {
    return 'vinculos'
  }
  user() {
    return this.belongsTo('App/Models/User','user_id_hasta','id')
  }

}

module.exports = Vinculo
