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
    if (err !== null) console.log(err)

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
  fs.readFile(URI, (err, data) => {
    if (err) console.log(err)

    try {
      const pObject = JSON.parse(data.toString())
      const index = pObject.positions.findIndex(p => p.id === id)
      if (index === -1) return callback(new Error('Cant find position index'))
      pObject.positions[index] = position
      // console.log(pObject.positions[index].deals[0].images);
      if (pObject.positions[index].deals[0].images) {
        fs.writeFile(URI, JSON.stringify(pObject), (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log('edit position.json success');
          }
        })
      }
      callback(null)
    } catch (e) {
      callback(e)
    }
  })
}

const createPosition = (positonName, pageName, callback) => {
  fs.readFile(URI, (err, data) => {
    try {
      const pObject = JSON.parse(data.toString())
      if (!pObject.positions) return callback({ err: "Cant find positions"})
      const id = 1 + parseInt(pObject.positions.slice(-1)[0].id)
      pObject.positions.push({
        id: id+'',
        position: positonName,
        page: pageName,
        deals: []
      })

      if (pObject.positions.findIndex(p => p.id === id+'') === -1) callback({ err: "json file look bad"})
      const pString = JSON.stringify(pObject)
      fs.writeFile(URI, pString, callback)
    } catch (e) {
      callback(e)
    }
  })
}

const createDeal = (pid, callback) => {
  fs.readFile(URI, (err, data) => {
    try {
      const pObject = JSON.parse(data.toString())
      if (!pObject.positions) return callback({ err: "Cant find positions"})
      console.log(pObject);
      const positionIndex = pObject.positions.findIndex(p => p.id === pid)
      console.log(pid ,positionIndex );
      if (positionIndex === -1) return callback({ err: "Cant find position id"})
      if (!pObject.positions[positionIndex].deals) return callback({ err: 'Deals of position id not exist'})

      pObject.positions[positionIndex].deals.push({
        name: "Deal name default",
        deal_link: "https://jamja.vn/khuyenmai/defautl",
        images: {
          "750x93": "",
          "640x180": "",
          "1080x1920": ""
        },
        is_active: false
      })

      console.log(pObject.positions[positionIndex].deals);

      if (!pObject.positions[positionIndex].deals) callback({ err: "json file look bad"})
      const pString = JSON.stringify(pObject)
      fs.writeFile(URI, pString, callback)
    } catch (e) {
      callback(e)
    }
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
const updateDeal = (pid, deal, deal_index, callback) => {
  // read position
  readPosition(pid, (err, position) => {
    // Handle image in deal
    Object.keys(deal.images).forEach((key, i) => {
      // console.log(deal.images[key]);
      // This is image base64 encoded
      if (deal.images[key].startsWith('data:image')) {
        const result = deal.images[key].match(/^data:image\/(.+);base64(.+)/)
        const ext = result[1]
        const content = result[2]
        const imageName = (encodeURIComponent(pid + '---' + deal.name + '-' + key) + '.' + ext).replace(/%/g, '+')

        deal.images[key] = 'http://127.0.0.1:3001/api/uploads/' + imageName

        fs.writeFile(path.join(DIR_UPLOADS, imageName), content, 'base64', err => {
          if (err) {
            console.log(err);
            return callback(err)
          } else {
            console.log('store image success');
          }
        })
      }
    })

    position.deals[deal_index] = deal
    // position.deals[deal_index] = deal
    // console.log(position.deal[2].images);

    writePosition(pid, position, callback)

  })
}

module.exports = {
  readPosition,
  writePosition,
  updateDeal,
  createPosition,
  createDeal
}
