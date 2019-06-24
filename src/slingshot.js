const express = require('express')
const bodyParser = require('body-parser')
const bxml = require('./bxml')
const ngrok = require('./ngrok')

// ==================================================

var settings = {
    showParams: true,
    showHeaders: false,
    pretty: true
}

// Register ngrok tunnels if detected
ngrok.getTunnels().then(tunnels => {
    console.log(`Found ${tunnels.length} ngrok tunnels!`)
    tunnels.forEach(tunnel => process.env[`${tunnel.proto.toUpperCase()}_SELF`] = tunnel.public_url)
})

// ==================================================

function settingsHandler(req, res) {
    settings = Object.keys(settings)
        .reduce((out, key) => {
            out[key] = req.body[key] || settings[key];
            return out
        }, {})
    res.send(settings)
}

function loggingHandler(req, res, next) {
    let time = new Date().toISOString().replace('T', ' ')
    let lines = ['-'.repeat(30), `${time} ${req.method} ${req.baseUrl}`]

    if (settings.showParams && Object.keys(req.query).length > 0) {
        lines.push('Params:')
        Object.keys(req.query).forEach(key => lines.push(`  ${key}: ${req.query[key]}`))
    }

    if (settings.showHeaders && Object.keys(req.headers).length > 0) {
        lines.push('Headers:')
        Object.keys(req.headers).forEach(key => lines.push(`  ${key}: ${req.headers[key]}`))
    }

    if (settings.pretty) {
        lines.push(`${JSON.stringify(req.body, null, 2)}`)
    }
    else {
        lines.push(`${JSON.stringify(req.body)}`)
    }

    console.log(lines.join('\n'))

    next()
}

// ==================================================

module.exports = (name, port, configurer) => {
    configurer(express()
        .use(bodyParser.json())
        .put('/settings', settingsHandler)
        .use('/*', loggingHandler)
        .use('/bxml/*', bxml.handler)
    ).listen(port, () => console.log(`Slingshot '${name}' listening at ${port}`))
}