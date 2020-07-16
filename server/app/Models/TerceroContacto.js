'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TerceroContacto extends Model {
  static get table () {
    return 'terceros_contactos'
  }

  tercero () {
    return this.belongsTo('App/Models/Tercero','tercero_id','id')
  }
  contactoTipo() {
    return this.belongsTo('App/Models/ContactoTipo')
//  return this.belongsTo('App/Models/ContactoTipo', 'contacto_tipo_id', 'id')
  }

}

module.exports = TerceroContacto
