const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const bxml = require('./bxml')

const calls = {}

router
  .use('/join', (req, res) => bxml.readAndSend('meeting-prompt', req, res))
  .use('/join-wait', (req, res) => bxml.readAndSend('meeting-wait', req, res))
  
  .use('/join-ready', (req, res) => {
    const event = req.body
    calls[event.callId] = event.mediaUrl
    res.sendStatus(200)
    
    fetch(event.callUrl, {
      method: 'POST',
      body: {
        redirectUrl: `${process.env.HTTPS_SELF}/bxml/meeting-join`
      }
    }).then(res => {
      if (res.status != 204) {
        let error = await res.json()
        throw new Error(error)
      }
      console.log(`Updated call ${event.callId}`)
    }).catch(e => {
      console.log(`Failed to update call ${event.callId}: ${e}`)
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