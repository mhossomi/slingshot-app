# Slingshot: Application Template

This is a template for Slingshot applications:

- Default `slingshot(name, port, configurer)` builder powered by Express
- BXML utilities
- Access logging out of the box

### Settings

Use `PUT /settings` to change log settings. The following properties exists:

| Setting       | Type    | Description                             |
| ------------- | ------- | --------------------------------------- |
| `showParams`  | Boolean | If `true`, query parameters are listed. |
| `showHeaders` | Boolean | If `true`, headers are listed.          |
| `pretty`      | Boolean | If `true`, output is pretty             |

### BXML

All files under `/bxml` are served using the same path as URL and any method. For example: `GET /bxml/say-hello`.
Below are some default BXML.

#### `/bxml/say-hello`

Says hello.

#### `/bxml/speak`

Speaks a sentence.

| Parameter  | Type   | Description            |
| ---------- | ------ | ---------------------- |
| `sentence` | String | The sentence to speak. |
| `voice`    | String | The voice.             |

#### `/bxml/gather`

Gathers digits. The callback is [speak digits](#presetspeak-digits).

| Parameter           | Type    | Description                |
| ------------------- | ------- | -------------------------- |
| `maxDigits`         | Integer | Gather max digits.         |
| `terminatingDigits` | String  | Gather terminating digits. |

#### `/bxml/speak-digits

Speaks the values of `body.digits` and `body.terminatingDigit`. Intended to reply to a gather event.

#### `/bxml/play-audio`

Plays a 5 second audio from the lab box.

#### `/bxml/play-long-audio`

Plays a 3 minute audio from the lab box.

#### `/bxml/transfer`

Transfers to a phone number. Complete and answer callbacks are `speak` with pre-defined sentences.

| Parameter | Type         | Description                |
| --------- | ------------ | -------------------------- |
| `to`      | Phone number | The number to transfer to. |