#!/bin/sh
# Each file under needs/ names, one per line, files the tree must hold. A pull request that needs
# a file only its base has passes on the merge GitHub tests, and fails on its head alone.
set -eu
status=0
for n in needs/*; do
  [ -f "$n" ] || continue
  while read -r f; do
    [ -n "$f" ] || continue
    if [ -f "$f" ]; then
      echo "ok: $n needs $f"
    else
      echo "missing: $n needs $f"
      status=1
    fi
  done <"$n"
done
exit "$status"
