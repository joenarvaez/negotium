#!/bin/sh
# Hands a live Twilio call to the owner's mobile by replacing its TwiML with a <Dial>.
# `bridge.sh check` only confirms the credentials are present.
set -eu
: "${TWILIO_ACCOUNT_SID:?}" "${TWILIO_AUTH_TOKEN:?}" "${TWILIO_FROM_NUMBER:?}" "${PERSONAL_MOBILE_NUMBER:?}"
case "${1:-}" in
  check) echo "ready"; exit 0 ;;
  CA*) ;;
  *) echo "usage: bridge.sh <Twilio call ID, starts with CA> | check" >&2; exit 2 ;;
esac
curl -fsS -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" \
  "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Calls/$1.json" \
  --data-urlencode "Twiml=<Response><Dial callerId=\"$TWILIO_FROM_NUMBER\"><Number>$PERSONAL_MOBILE_NUMBER</Number></Dial></Response>" \
  >/dev/null
echo "bridged"
