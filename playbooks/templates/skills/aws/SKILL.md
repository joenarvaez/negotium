---
name: aws
description: "Use the owner's AWS account with the AWS CLI (region us-east-1 by default)."
---

# AWS

The AWS CLI is at `/home/node/.openclaw/tools/bin/aws`; credentials and region are already in the
environment. Example:

```sh
/home/node/.openclaw/tools/bin/aws sts get-caller-identity
```

Ask the owner before anything that deletes resources or costs money.
