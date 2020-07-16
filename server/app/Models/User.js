'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
    
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  /*
  rubros () {
    return this.hasMany('App/Models/UserRubro','id','user_id')
  }
  */

  rubros () {
    return this.belongsToMany('App/Models/Rubro','user_id','rubro_id','id','id')
      .pivotTable('users_rubros')
      .withTimestamps()
  }

  listas () {
    return this.hasMany('App/Models/UserLista','id','user_id')
  }

  sucursales () {
    return this.hasMany('App/Models/Sucursal','id','user_id')
  }

  tercero() {
    return this.hasOne('App/Models/Tercero','tercero_id','id')
  }

  cajas () {
    return this.hasMany('App/Models/Caja','id','user_id')
  }

/*
  rubros () {
    return this.hasMany('App/Models/Rubro','id','user_id')
  }
*/

}

module.exports = User
