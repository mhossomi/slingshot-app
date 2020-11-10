const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const bxml = require('./bxml')
const u = require('./utils')

const calls = {
  rebridged: false
}

router
  .use('/wait', (req, res) => {
    calls.a = {
      id: req.body.callId,
      url: req.body.callUrl
    }
    return bxml.readAndSend('rebridge-ring', req, res)
  })

  .use('/start', (req, res) => {
    calls.b = {
      id: req.body.callId,
      url: req.body.callUrl
    }
    return bxml.readAndSend('rebridge-start', req, res)
  })

  .use('/connect', (req, res) => bxml.readAndSend('rebridge-connect', req, res))

  .use('/connected', (req, res) => {
    u.redirectCall(calls.a.url, `${process.env.SELF_URL}/rebridge/bridge`)
    return bxml.readAndSend('rebridge-ring', req, res)
  })

  .use('/bridge', (req, res) => {
    req.query.target = calls.b.id
    return bxml.readAndSend('rebridge-bridge', req, res)
  })

  .use('/dtmf', (req, res) => {
    const event = req.body
    if (event.digit === '5') {
      u.redirectCall(calls.a.url, `${process.env.SELF_URL}/bxml/rebridge-audio`)
        .then(() => u.redirectCall(calls.b.url, `${process.env.SELF_URL}/bxml/rebridge-hold`))
    }
    res.sendStatus(200)
  })

  .use('/clear', (req, res) => {
    delete calls.a
    delete calls.b
    res.sendStatus(200)
    console.log('Rebridge cleared')
  })

  .use((req, res, next) => next())

module.exports = router
