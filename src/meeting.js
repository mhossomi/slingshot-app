const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const fs = require('fs')
const bxml = require('./bxml')
const u = require('./utils')

const calls = {}

router
  .use('/join', (req, res) => bxml.readAndSend('meeting-prompt', req, res))

  .use('/join-wait', (req, res) => bxml.readAndSend('meeting-wait', req, res))

  .use('/join-ready', (req, res) => {
    const event = req.body
    calls[event.callId] = event.recordingId

    console.log(`Registered media for call ${event.callId}`)
    res.sendStatus(200)

    u.downloadAudio(event.mediaUrl, event.recordingId)
      .then(() => {
        const payload = {
          redirectMethod: 'GET',
          redirectUrl: `${process.env.HTTPS_SELF}/bxml/meeting-join`
        }
        console.log(`Redirecting call ${event.callId}: ${payload.redirectUrl}`)
        return fetch(event.callUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': u.SLINGSHOT_AUTHORIZATION
          },
          body: JSON.stringify(payload)
        })
      }).then(res => {
        if (res.status != 200) throw u.ResponseError(res, `Error updating call ${event.callId}`)
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
      const recordingId = calls[event.callId]
      if (!recordingId) {
        console.log(`Media not found for ${event.callId}`)
        return res.sendStatus(400)
      }

      return res.send('<?xml version="1.0" ?>'
        + `\n<Response>`
        + `\n    <PlayAudio username="${process.env.APP_USERNAME}" password="${process.env.APP_PASSWORD}">`
        + `\n        ${process.env.HTTPS_SELF}/audio/${recordingId}`
        + `\n    </PlayAudio>`
        + `\n    <SpeakSentence>`
        + `\n        Has joined the meeting!`
        + `\n   </SpeakSentence>`
        + `\n</Response>`)
    }
    if (eventType === 'conferenceMemberExit') {
      const recordingId = calls[event.callId]
      if (!recordingId) {
        console.log(`Media not found for ${event.callId}`)
        return res.sendStatus(400)
      }

      return res.send('<?xml version="1.0" ?>'
        + `\n<Response>`
        + `\n    <PlayAudio username="${process.env.APP_USERNAME}" password="${process.env.APP_PASSWORD}">`
        + `\n        ${process.env.HTTPS_SELF}/audio/${recordingId}`
        + `\n    </PlayAudio>`
        + `\n    <SpeakSentence>`
        + `\n        Has left the meeting!`
        + `\n   </SpeakSentence>`
        + `\n</Response>`)
    }

    return res.sendStatus(400)
  })
  .use((req, res, next) => next())

module.exports = router