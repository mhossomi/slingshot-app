module.exports = {
    getPublicUrl: async function () {
        if (process.env.HEROKU_APP_NAME) {
            console.log('Detected Heroku')
            return `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`
        }
    }
}