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

### Preset BXML

Use either GET or POST on these endpoints for some preset BXMLs.

#### `/preset/say-hello`

Says hello.

#### `/preset/speak`

Speaks a sentence.

| Parameter  | Type   | Description            |
| ---------- | ------ | ---------------------- |
| `sentence` | String | The sentence to speak. |
| `voice`    | String | The voice.             |

#### `/preset/gather`

Gathers digits. The callback is [speak digits](#presetspeak-digits).

| Parameter           | Type    | Description                |
| ------------------- | ------- | -------------------------- |
| `maxDigits`         | Integer | Gather max digits.         |
| `terminatingDigits` | String  | Gather terminating digits. |

#### `/preset/speak-digits

Speaks the values of `body.digits` and `body.terminatingDigit`. Intended to reply to a gather event.

#### `/preset/play-audio`

Plays a 5 second audio from the lab box.

#### `/preset/play-long-audio`

Plays a 3 minute audio from the lab box.

#### `/preset/transfer`

Transfers to a phone number. Complete and answer callbacks are `speak` with pre-defined sentences.

| Parameter | Type         | Description                |
| --------- | ------------ | -------------------------- |
| `to`      | Phone number | The number to transfer to. |