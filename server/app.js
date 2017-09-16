const http = require('http')
const path = require('path')
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { readPosition, writePosition, updateDeal, createPosition, createDeal } = require('./Position')

const app = express()
const port = process.env.PORT || 3001
const server = http.createServer(app)
const dirUpload = path.join(__dirname, 'uploads')

const updateMapBanner = (pathName, id) => {
  console.log('update mapBanner - ' + pathName + ' - ' + id);
  const ids = Array.isArray(id)? id : [id]
  fs.readFile(path.join(__dirname, 'mapBanner.json'), (err, data) => {
    if (err) return console.log(err)
    const mapBanner = JSON.parse(data)
    if (!mapBanner.map) return console.log('Cant read mapBanner')
    ids.forEach(i => {
      const ibanner = mapBanner.map.findIndex(b => b.id === i)
      if (ibanner === -1) return console.log('Cant find banner for id ' + i);
      mapBanner.map[ibanner].name = pathName
    })

    if (mapBanner && mapBanner.map) {
      fs.writeFile(path.join(__dirname, 'mapBanner.json'), JSON.stringify(mapBanner), err => {
        if (err) console.log('ERROR: Write mapBanner ', err)
      })
    } else {
      console.log('ERROR: Write mapBanner - Something went wrong!')
    }
  })
}

app.use(cors())
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }))
app.use(cookieParser())
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/api/position', (req, res, next) => {
  fs.readFile(path.join(__dirname, 'storage', 'position.json'), (err, data) => {
    if (err) return res.json({ err })
    res.json(JSON.parse(data))
  })
})

app.get('/api/position/:id', (req, res, next) => {
  readPosition(req.params.id, (err, position) => {
    if (err) return res.json({err})
    res.json(position)
  })
})

app.put('/api/position', (req, res, next) => {
  const {
    pid, deal, deal_index
  } = req.body

  updateDeal(pid, deal, deal_index, (err) => {
    if (err) {
      res.json({ err })
    } else {
      res.json({ message: 'upload success!' })
    }
  })
})

app.post('/api/position', (req, res, next) => {
  const {
    positionName, pageName
  } = req.body

  createPosition(positionName, pageName, (err) => {
    if (err) {
      res.json({ err })
    } else {
      res.json({ message: 'create position success!' })
    }
  })
})

app.post('/api/position/deal', (req, res, next) => {
  const {
    pid
  } = req.body

  createDeal(pid, (err) => {
    if (err) {
      res.json({ err })
    } else {
      res.json({ message: 'create deal success!' })
    }
  })
})

server.listen(port, () => {
  console.log('Server upload banner listening on ' + port);
})
