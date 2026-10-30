# ci-merge-sample

A sample repository for graphide-ci's own checks. Its pull requests need files that only their
base gained after they branched, so each pull request run passes on the merge GitHub tested and
fails on its head alone. graphide-ci rebuilds the merge of an earlier pull request run and feeds
the run again; the run's outcome shows whether the rebuilt tree is the one GitHub tested.

`check.sh` reads `needs/`: each file there names, one per line, files the tree must hold.
