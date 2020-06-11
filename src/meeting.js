const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const bxml = require('./bxml')

const AUTHORIZATION = 'Basic ' + Buffer.from(`${process.env.CALL_API_USERNAME}:${process.env.CALL_API_PASSWORD}`).toString('base64')
const calls = {}

router
  .use('/join', (req, res) => bxml.readAndSend('meeting-prompt', req, res))
  .use('/join-wait', (req, res) => bxml.readAndSend('meeting-wait', req, res))

  .use('/join-ready', (req, res) => {
    const event = req.body
    calls[event.callId] = event.mediaUrl
    console.log(`Registered media for call ${event.callId}`)
    res.sendStatus(200)

    const redirectUrl = `${process.env.HTTPS_SELF}/bxml/meeting-join`
    console.log(`Updating call ${event.callId}: ${redirectUrl}`)
    fetch(event.callUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': AUTHORIZATION
      },
      body: JSON.stringify({ redirectUrl })
    }).then(res => {
      if (res.status != 200) {
        let e = new Error(res.statusText)
        e.res = res
        throw e
      }
      console.log(`Updated call ${event.callId}`)
    }).catch(e => {
      if (e.res) e.res.text().then(e => console.log(`Failed to update call ${event.callId}: ${e}`))
      else console.log(`Failed to update call ${event.callId}: ${e}`)
    })
  })

  .use('/events', (req, res) => {
    const event = req.body
    const eventType = event.eventType
    if (eventType === 'conferenceCreated') {
      return res.send('<?xml version="1.0" ?>'
        + `\n<Response>`
        + `\n    <SpeakSentence>`
        + `\n        This meeting has just started!`
        + `\n   </SpeakSentence>`
        + `\n</Response>`)
    }
    if (eventType === 'conferenceMemberJoin') {
      const mediaUrl = calls[event.callId]
      if (!mediaUrl) {
        console.log(`Media not found for ${event.callId}`)
        return res.sendStatus(400)
      }

      calls[event.callId] = undefined
      return res.send('<?xml version="1.0" ?>'
        + `\n<Response>`
        + `\n    <PlayAudio username="${process.env.CALL_API_USERNAME}" password="${process.env.CALL_API_PASSWORD}">`
        + `\n        ${mediaUrl}`
        + `\n    </PlayAudio>`
        + `\n    <SpeakSentence>`
        + `\n        Has joined!`
        + `\n   </SpeakSentence>`
        + `\n</Response>`)
    }

    return res.sendStatus(400)
  })
  .use((req, res, next) => next())

module.exports = router