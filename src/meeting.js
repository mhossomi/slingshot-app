const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const bxml = require('./bxml')
const u = require('./utils')

const calls = {}

router
  .use('/join', (req, res) => bxml.readAndSend('meeting-prompt', req, res))

  .use('/join-wait', (req, res) => bxml.readAndSend('meeting-wait', req, res))

  .use('/join-ready', (req, res) => {
    res.sendStatus(200)

    const event = req.body
    calls[event.callId] = event.recordingId

    u.downloadAudio(event.mediaUrl, event.recordingId)
      .then(() => {
        const redirectUrl = `${process.env.SELF_URL}/bxml/meeting-join`
        const body = JSON.stringify({ redirectUrl })
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': process.env.SLINGSHOT_AUTH
        }

        console.log(`Redirecting call ${event.callId}: ${redirectUrl}`)
        return fetch(event.callUrl, { method: 'POST', headers, body })
      }).then(res => {
        if (res.status != 200) throw new Error(`Failed to redirect call ${event.callId}: ${res.statusText}`)
        console.log(`Redirected call ${event.callId}`)
      }).catch(e => {
        console.log(`Failed to join call ${event.callId}: ${e}`)
      })
  })

  .use('/events', (req, res) => {
    const event = req.body
    const eventType = event.eventType

    if (eventType === 'conferenceCreated') {
      return bxml.send(res, '<?xml version="1.0" ?>'
        + `\n<Response>`
        + `\n    <SpeakSentence>`
        + `\n        This meeting has just started!`
        + `\n   </SpeakSentence>`
        + `\n</Response>\n`)
    }

    if (eventType === 'conferenceMemberJoin') {
      const recordingId = calls[event.callId]
      if (!recordingId) {
        console.log(`Media not found for ${event.callId}`)
        return res.sendStatus(400)
      }

      return bxml.send(res, '<?xml version="1.0" ?>'
        + `\n<Response>`
        + `\n    <PlayAudio ${process.env.BXML_AUTH}>`
        + `\n        ${process.env.SELF_URL}/audio/${recordingId}`
        + `\n    </PlayAudio>`
        + `\n    <SpeakSentence>`
        + `\n        Has joined the meeting!`
        + `\n   </SpeakSentence>`
        + `\n</Response>\n`)
    }

    if (eventType === 'conferenceMemberExit') {
      const recordingId = calls[event.callId]
      if (!recordingId) {
        console.log(`Media not found for ${event.callId}`)
        return res.sendStatus(400)
      }

      return bxml.send(res, '<?xml version="1.0" ?>'
        + `\n<Response>`
        + `\n    <PlayAudio ${process.env.BXML_AUTH}>`
        + `\n        ${process.env.SELF_URL}/audio/${recordingId}`
        + `\n    </PlayAudio>`
        + `\n    <SpeakSentence>`
        + `\n        Has left the meeting!`
        + `\n   </SpeakSentence>`
        + `\n</Response>\n`)
    }

    return res.sendStatus(400)
  })
  .use((req, res, next) => next())

module.exports = router