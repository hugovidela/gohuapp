'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TerceroDireccion extends Model {
  static get table () {
    return 'terceros_direcciones'
  }

  calle0 () {
    return this.belongsTo('App/Models/Calle', 'calle_id', 'id')
  }

  calle1 () {
    return this.belongsTo('App/Models/Calle', 'entrecalle1_id', 'id')
  }

  calle2 () {
    return this.belongsTo('App/Models/Calle', 'entrecalle2_id', 'id')
  }

  postal () {
    return this.belongsTo('App/Models/Postal')
  }

  /*
  tercero () {
    return this.belongsTo('App/Models/UserTercero','tercero_id','id')
  }
  */

  tercero () {
    return this.belongsTo('App/Models/Tercero','tercero_id','id')
  }

}

module.exports = TerceroDireccion
