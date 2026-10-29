# [negotium /neh-goh-shum/ 💼](https://claude.ai/artifact/TF8c8FiejTNNfbJP4DxEeR)

> This repo is workflow to get all the features and then some of the big tech products like met's muse or cladue code but protecting your identity at a fraction of the cost. Also its open source so it completely hackable. 

## Diagrams
### Deployment
```plantuml
cloud twilio
cloud deepseek
cloud qwen
cloud privacy.com
cloud pangram
node tailscale
rectangle laptop {
    rectangle goose
    rectangle nanobrowser
    rectangle opencode
    rectangle nanobrowser
    rectangle opendesign
}



rectangle phone {
    rectangle openclaw_client
}
rectangle lan #line.dashed {
    rectangle smart_speaker {
        rectangle home_assistant_voice
    }
    rectangle personal_server #line.dashed {
        rectangle strata
        rectangle openclaw
        rectangle presidio
        rectangle speech_io {
            rectangle kokoro
            rectangle whisper
        }
        rectangle home_assistant
        rectangle litellm
    }

}

goose -d- tailscale
nanobrowser -d- tailscale
opendesign -d- opencode
opencode -d- tailscale
openclaw_client -d- tailscale
tailscale -d- openclaw
tailscale -d- litellm
litellm -d- presidio
litellm - openclaw
litellm -- strata
presidio --d- deepseek
presidio --d- qwen
openclaw -d-- twilio
openclaw -d-- privacy.com
openclaw - pangram
home_assistant_voice -d- home_assistant

```

### Sequence Scenarios
#### Waiting On Hold
```plantuml
actor user
participant openclaw_client
participant openclaw
participant speech_io
participant litellm
participant strata
participant qwen
participant twilio
actor airline

user -> openclaw_client : "call the airline about my refund"
openclaw_client -> openclaw : transcript
openclaw -> litellm : plan the call
litellm -> qwen : masked prompt
openclaw -> twilio : start conference, add airline, stream audio
twilio -> airline : dial

loop phone menu
    airline -> openclaw : audio
    openclaw -> speech_io : whisper
    openclaw -> litellm : pick option
    litellm -> qwen : masked prompt
    openclaw -> speech_io : kokoro
    openclaw -> twilio : keypress or speech
end

loop on hold
    airline -> openclaw : audio
    openclaw -> speech_io : whisper
    openclaw -> litellm : hold music or human?
    litellm -> strata : local only
end

openclaw -> airline : "one moment, connecting you"
openclaw -> twilio : add user to conference
twilio -> user : ring
user <-> airline : talk
openclaw -> openclaw_client : call summary
openclaw_client -> user : speak summary
```
#### Payments
```plantuml
actor user
participant openclaw_client
participant openclaw
participant litellm
participant qwen
participant privacy_com
participant nytimes

user -> openclaw_client : "sign me up for the nyt free trial"
openclaw_client -> openclaw : transcript
openclaw -> privacy_com : create card, merchant locked, $1 limit
privacy_com -> openclaw : card

loop checkout
    openclaw -> litellm : page, next step?
    litellm -> qwen : masked prompt
    openclaw -> nytimes : click or type
end

nytimes -> privacy_com : $0 trial charge
privacy_com -> nytimes : approved
openclaw -> openclaw_client : subscribed, trial ends on date
openclaw_client -> user : speak reply

...trial ends...

nytimes -> privacy_com : renewal charge
privacy_com -> nytimes : declined, over limit
privacy_com -> user : declined alert
```

#### Job hunting
```plantuml
actor user
participant nanobrowser
participant litellm
participant qwen
participant pangram
participant job_site

user -> nanobrowser : apply to this job

loop prefill form
    nanobrowser -> litellm : page, next step?
    litellm -> qwen : masked prompt
    nanobrowser -> job_site : fill field
end

nanobrowser -> litellm : write cover letter
litellm -> qwen : masked prompt
litellm -> pangram : AI check, masked draft
nanobrowser -> job_site : paste cover letter

alt flagged as AI
    nanobrowser -> user : flagged lines, rewrite in your voice
    user -> job_site : edit cover letter
end

nanobrowser -> user : ready for review
user -> job_site : submit
```

#### Product Development
```plantuml
actor user
participant goose
participant opendesign
participant opencode
participant repo
participant litellm
participant deepseek

== product manager ==
user -> goose : product idea
goose -> litellm : write spec
litellm -> deepseek : masked prompt
goose -> repo : spec
user -> repo : commit spec

== graphic designer ==
user -> opendesign : design it
opendesign -> repo : read spec
opendesign -> litellm : design screens
litellm -> deepseek : masked prompt
opendesign -> repo : prototype
user -> repo : commit handoff

== engineer ==
user -> opencode : build it
opencode -> repo : read spec and prototype
loop until tests pass
    opencode -> litellm : write code
    litellm -> deepseek : masked prompt
    opencode -> repo : code and tests
end
opencode -> repo : push feature
```


#### Home Automation
```plantuml
actor user
participant openclaw_client
participant home_assistant_voice
participant home_assistant
participant speech_io
participant openclaw
participant litellm
participant qwen
participant delivery_app

== simple command ==
user -> home_assistant_voice : "living room lights off"
home_assistant_voice -> home_assistant : audio
home_assistant -> speech_io : whisper
home_assistant -> home_assistant : intent match, lights off
note right : milliseconds, no LLM
home_assistant -> speech_io : kokoro
home_assistant_voice -> user : "done"

== complex command ==
user -> home_assistant_voice : "let's make it a thai themed movie night"
home_assistant_voice -> home_assistant : audio
home_assistant -> speech_io : whisper
home_assistant -> openclaw : no intent match, fallback
openclaw -> openclaw : recall my tastes
openclaw -> litellm : plan the night
litellm -> qwen : masked prompt
openclaw -> home_assistant : living room lights warm and dim
openclaw -> home_assistant : play thai ambient instrumentals
openclaw -> delivery_app : order favorite thai dish
openclaw -> home_assistant : play ong bak on living room tv
openclaw -> home_assistant : reply
home_assistant -> speech_io : kokoro
home_assistant_voice -> user : "thai movie night is set"

== from the phone ==
user -> openclaw_client : "set up thai movie night at home"
openclaw_client -> openclaw : transcript
openclaw -> openclaw : recall my tastes
openclaw -> litellm : plan the night
litellm -> qwen : masked prompt
openclaw -> home_assistant : living room lights warm and dim
openclaw -> home_assistant : play thai ambient instrumentals
openclaw -> delivery_app : order favorite thai dish
openclaw -> home_assistant : play ong bak on living room tv
openclaw -> openclaw_client : reply
openclaw_client -> user : "thai movie night is set"
```
