'use strict'

const Excel   = require('exceljs')
const Articulo = use('App/Models/Articulo')
const UserLista = use('App/Models/UserLista')
const ArticuloRubro = use('App/Models/ArticuloRUbro')
const Precio  = use('App/Models/Precio')

class ImportService {

  static async ImportClassification(filelocation) {
    var workbook = new Excel.Workbook()
    console.log(filelocation)
    workbook = await workbook.xlsx.readFile(filelocation)
    console.log(workbook)
    let explanation = workbook.getWorksheet('Hoja1') // get sheet name
    let colComment = explanation.getColumn('C') //column name
    
    let li = []
    const ul = await UserLista.query()
      .where('user_id', 1).fetch()
      for (let i=0; i<= ul.rows.length-1; i++) {
        li.push(ul.rows[i])
      }

    colComment.eachCell(async (cell, rowNumber) => {
      
      if (rowNumber >= 1) {

        let codigo = explanation.getCell('A' + rowNumber).value+'@1#1$.'
        let nombre = explanation.getCell('B' + rowNumber).value
        let marca = explanation.getCell('C' + rowNumber).value
        let grupo = explanation.getCell('D' + rowNumber).value
        let precio = explanation.getCell('E' + rowNumber).value

        let art = await Articulo.findBy('codigo', codigo)

        if (!art) {
          let editado = {
            codigo: codigo,
            codbar: null,
            nombre: nombre,
            grupo_id: grupo,
            marca_id: marca,
            creador_id: 1,
            padre_id: null,
            um_compra_id: 1,
            um_venta_id: 1,
            um_stock_id: 1,
            secompra: 1,
            sevende: 1,
            stock: 1,
            iva_id: 5,
            activo: 1,
            un_compra: 1,
            un_venta: 1,
            un_stock: 1,
            descripcion: null,
            codbaroriginal: null,
            moneda_id: 51
          }

          let arti = await Articulo.create(editado)

          let rubro = {
            articulo_id: arti.id,
            rubro_id: 1,
          }
          let rub = await ArticuloRubro.create(rubro)

          for (let i=0; i<=li.length-1; i++) {
            let pre = {
              articulo_id: arti.id,
              lista_id: li[i].id,
              comprobante_item_id: null,
              costo: precio,
              porrem: li[i].porrem,
              precio: precio*(1+(li[i].porrem/100)),
              estado: 'A'
            }
            let prec = await Precio.create(pre)
          }
        }
      }
    })
    return 'ok'
  }

}

module.exports = ImportService