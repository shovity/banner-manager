const fs = require('fs')
const path = require('path')
const URI = path.join(__dirname, 'storage', 'position.json')
const DIR_UPLOADS = path.join(__dirname, 'uploads')

/**
 * Get position object
 * @param  {String}   id position id
 * @param  {Function} callback callback(err, null)
 */
const readPosition = (id, callback) => {
  fs.readFile(URI, (err, data) => {
    if (err) console.log(err)

    try {
      const position = JSON.parse(data.toString()).positions.find(p => p.id == id)
      callback(null, position)
    } catch (e) {
      callback(e, null)
    }
  })
}

/**
 * Write Positiion
 * @param  {String}   id
 * @param  {Object}   position { id, device, deals ... }
 * @param  {Function} callback callback(err)
 */
const writePosition = (id, position, callback) => {
  readPosition(id, (err, data) => {
    if (err) return callback(err)
    const i = data.positions.findIndex(p => p.id === id)
    data.positions[i] = position
    if (data && data.positions && data.positions[i]) {
      const dataJsonString = JSON.stringify(data)
      fs.writeFile(URI, dataJsonString, callback)
    } else {
      callback(new Error('You went try to write a empty position'), null)
    }
  })
}

/**
 * Create Deal
 * @param  {String}   id
 * @param  {Object}   deal     [description]
 * @param  {Function} callback callback(err)
 */
const createDeal = (id, deal, callback) => {
  readPosition(id, (err, position) => {
    if (err) return callback(err)

    const positionIndex = position.positions.findIndex(p => p.id === id)
    if (positionIndex === -1) return callback(new Error('Position id not exist'))
    position.positions[positionIndex].deals.push(deal)
    const positionJsonData = JSON.parse(position)
    fs.writeFile(URI, positionJsonData, callback)
  })
}

/**
updateDeal(id, name, { newName, deal_link, images }, (err) => {
 * Update Deal
 * @param {String}   id        [description]
 * @param {String}   imgBase64 [description]
 * @param {String}   imgSize   [description]
 * @param {String}   ext       [description]
 * @param {Object}   deal      [description]
 * @param {Function} callback  callback(err)
 */
const updateDeal = (id, name, deal, callback) => {
  // read position
  readPosition(id, (err, position) => {
    // Get deal index need to update
    if (err) return console.log(err);
    if (!position) return console.log('can not read position');
    console.log(position);
    const dealId = position.deals.findIndex(d => {
      console.log(d.name + '==='+ deal.name);
      return d.name === deal.name
    })
    console.log('idex=' + dealId);
    const images = deal.images
    images.forEach((image, i) => {
      const result = image.match(/^data:image\/(.+);base64(.+)/)
      if (!resutl) return
      // image is base64 encoded
      const ext = resutl[1]
      const content = result[2]
      const imageName = encodeURI(deal.name + '---' + imgSize) + '.' + ext
      images[i] = 'http://127.0.0.1:3001/api/uploads/' + imageName
      fs.writeFile(path.join(DIR_UPLOADS, imageName), content, 'base64', err => {
        if (err) return callback(err)
        position.deals[dealId] = deal
        writePosition(id, position, callback)
      })
    })
  })
}

module.exports = {
  readPosition,
  writePosition,
  createDeal,
  updateDeal,
}
