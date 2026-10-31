#!/bin/sh
# graphide-ci's zero-touch proof: a job that reads a secret. DEPLOY_CHECK_FAIL, a file, makes it
# fail (to plant a red on a moved job that was never compared).
set -eu
if [ -n "${SAMPLE_TOKEN:-}" ]; then echo "token: set"; else echo "token: not set"; fi
if [ -f DEPLOY_CHECK_FAIL ]; then echo "deploy-check: planted failure"; exit 1; fi
echo "deploy-check: ok"
