'use strict'

const Excel   = require('exceljs')
const Articulo = use('App/Models/Articulo')
const UserLista = use('App/Models/UserLista')
const Precio  = use('App/Models/Precio')

class ActualizaPrecios {

  static async ImportClassification(filelocation, lista) {
    var workbook = new Excel.Workbook()
    console.log('filelocation:',filelocation)
    console.log('lista:',lista)
    workbook = await workbook.xlsx.readFile(filelocation)
    console.log(workbook)
    let explanation = workbook.getWorksheet('precios') // get sheet name
    let colComment = explanation.getColumn('A') //column name
    
    let lis = 1
    const ul = await UserLista.find(lis) //busco la lista, recordemos que hay una lista por usuario
    let porrem = ul.porrem
    console.log(porrem)

    colComment.eachCell(async (cell, rowNumber) => {
      if (rowNumber >= 2) {
        let codigo = explanation.getCell('A' + rowNumber).value
        let precio = explanation.getCell('B' + rowNumber).value
        let art = await Articulo.findBy('codigo', codigo)
        if (art) {
          //console.log(art.id, li)
          let l = await Precio.query()
            .where('articulo_id', art.id).where('lista_id', lis).fetch()
            let pre = {
              articulo_id: art.id,
              lista_id: lis,
              comprobante_item_id: null,
              costo: precio,
              porrem: porrem,
              precio: precio*(1+(porrem/100)),
              estado: 'A'
            }
            if (l.rows.length!=0) {
              //console.log('found...',l.rows[0].id)
              await l.rows[0].save(pre)
            } else {
              let prec = await Precio.create(pre)
              //console.log('not found...',art.id)
            }
        }
      }
    })
    return 'ok'
  }
}

module.exports = ActualizaPrecios