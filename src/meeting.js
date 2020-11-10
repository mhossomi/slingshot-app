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
        + `\n    <StartRecording recordingAvailableUrl="/recordingAvailable" fileFormat="mp3" transcribe="true"/>`
        + `\n    <SpeakSentence>`
        + `\n        This meeting is being recorded!`
        + `\n    </SpeakSentence>`
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
        + `\n    <ResumeRecording/>`
        + `\n    <PlayAudio>`
        + `\n        /audio/${recordingId}`
        + `\n    </PlayAudio>`
        + `\n    <SpeakSentence>`
        + `\n        Has joined the meeting!`
        + `\n    </SpeakSentence>`
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
        + `\n    <PlayAudio>`
        + `\n        /audio/${recordingId}`
        + `\n    </PlayAudio>`
        + `\n    <SpeakSentence>`
        + `\n        Has left the meeting! Let's wait for him.`
        + `\n    </SpeakSentence>`
        + `\n    <PauseRecording/>`
        + `\n</Response>\n`)
    }

    if (eventType === 'conferenceCompleted') {
      return res.sendStatus(200)
    }

    return res.sendStatus(400)
  })
  .use((req, res, next) => next())

module.exports = router
