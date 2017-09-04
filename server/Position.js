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
 * Update Deal
 * @param {String}   id        [description]
 * @param {String}   imgBase64 [description]
 * @param {String}   imgSize   [description]
 * @param {String}   ext       [description]
 * @param {Object}   deal      [description]
 * @param {Function} callback  callback(err)
 */
const updateDeal = (id, imgBase64, imgSize, ext, deal, callback) => {

  readPosition(id, (err, position) => {

    // Get deal index need to update
    const dealId = position.positions[id].deals.findIndex(d => d.name === deal.name)
    // Rename deal
    if (deal.name !== deal.newName) deal.name = deal.newName
    delete deal.newName
    // Merger deal
    const newDeal = Object.assign(position.deals[dealId], deal)
    // Generate image name
    const imageName = encodeURI(deal.name + '---' + imgSize) + '.' + ext
    // Storage image
    fs.writeFile(path.join(DIR_UPLOADS, imageName), imgBase64, 'base64', err => {
      if (err) return callback(err)
      newDeal.images[imgSize] = imageName
      position.deals[dealId] = newDeal
      writePosition(id, position, callback)
    })
  })
}

module.exports = {
  readPosition,
  writePosition,
  createDeal,
  updateDeal,
}
