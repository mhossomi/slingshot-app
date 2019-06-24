SIPP Performance Test Scenarios
==================================================

Configure in VPS:

1. Modify your `mrf` cluster to point to a SIPp that simulates the MRF.
2. Modify your `sip-term` cluster to point to a SIPp that simulates B-leg SBC.

#### Local stack

In `operations/local/vps-mock/db.json`:
1. Change `mrf.entries[].url` to `sip:localhost:<MRF port>`, choose a unique port.
2. Change `sip-term.entries[].url` to `sip:localhost:<SBC port>`, choose a unique port.
3. The CE SIP `host:port` is `{sip.listener.host}:{sip.listener.sbc.port}` from your call engine properties.

*Take note of these arbitrary values as they will be used when executing scenarios.*

Even with the local stack, you have to configure an application in VPS to return the BXML under test. Provide the application ID to the client scenario.

Simple Transfer
--------------------------------------------------

This scenario makes an inbound call that is transferred to a single number. The B-leg answers then hangs up after a while.

### Application

Setup your application with the following callback:

```json
{
    "callInitiatedUrl": "http://{{callback.url}}/preset/scenario-simple-transfer",
    "callInitiatedMethod": "POST"
    ...
}
```

### Execution

Run the following commands in parallel:

```bash
./run-server mrf.xml
./run-server sbc-answer-bye.xml -p <MRF port>
./run-client sbc-invite-wait.xml -t <CE SIP host:port> -r <cps> -a <application ID>
```

Multi Transfer
--------------------------------------------------

This scenario makes an inbound call that is transferred to three numbers. Only one B-leg answers then hangs up after a while. Other B-legs will not answer.

### Application

Setup your application with the following callback:

```json
{
    "callInitiatedUrl": "http://{{callback.url}}/preset/scenario-multi-transfer",
    "callInitiatedMethod": "POST"
    ...
}
```

### Execution

Run the following commands in parallel:

```bash
./run-server mrf.xml
./run-server sbc-single-answer-bye.xml -p <MRF port>
./run-client sbc-invite-wait.xml -t <CE SIP host:port> -r <cps> -a <application ID>
```

Gather
--------------------------------------------------

This scenario makes an inbound call that receives a gather. MRF will reply with 123# after a while.

### Application

Setup your application with the following callback:

```json
{
    "callInitiatedUrl": "http://{{callback.url}}/preset/scenario-gather",
    "callInitiatedMethod": "POST"
    ...
}
```

### Execution

Run the following commands in parallel:

```bash
./run-server mrf.xml
./run-client sbc-invite-wait.xml -t <CE SIP host:port> -r <cps> -a <application ID>
```