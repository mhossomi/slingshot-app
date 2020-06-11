const fs = require('fs')

const resolvers = {
    body: (req, key) => req.body[key],
    header: (req, key) => req.headers[key],
    query: (req, key) => req.query[key],
    env: (req, key) => process.env[key],
    none: () => undefined
}

function expand(bxml, req) {
    return bxml.replace(/\${(\w+)\.(\w+)(:(.*?))?}/g, (match, src, key, hasDefault, defaultValue) => {
        const resolver = resolvers[src] || resolvers.none
        const value = resolver(req, key)

        if (value) return value
        if (hasDefault) return defaultValue
        return `undefined: ${src}.${key}`
    })
}

function obfuscate(bxml) {
    return bxml.replace(/([Pp]assword\w*?)=".*?"/g, (match, prefix) => `${prefix}="***"`)
}

function read(name) {
    return fs.readFileSync(`bxml/${name}.xml`, 'utf8')
}

function readAndSend(name, req, res) {
    try {
        send(res, expand(read(name), req))
    } catch (e) {
        res.sendStatus(404)
        console.log(e)
        console.log(`Not found: bxml/${name}.xml`)
    }
}

function send(res, bxml) {
    res.send(bxml)
    console.log(`\n${obfuscate(bxml)}`)
}

module.exports = {
    read,
    readAndSend,
    send,
    handler: (req, res) => readAndSend(req.baseUrl.substring(6), req, res)
}