#!/bin/bash
#
# On mac, install homebrew, then brew install rsync
#
dryrun="--dry-run"
slow=""
restore=""

function usage
{
	echo "Usage: rsup.sh [real] [slow] [slave]"
}

for arg in "$@"; do
	if test "$arg" = "real"; then
		dryrun=""
	elif test "$arg" = "slow"; then
		slow="yes"
	elif test "$arg" = "slave"; then
		slave="yes"
	elif test "$arg" = "--help" -o "$arg" = "-h"; then
		usage
		exit 0
	fi
done

if test ! -e ".rsmaster"; then
	if test -z "$slave"; then
		echo "You cannot backup on a slave unless you specify the slave option" >&2
		usage >&2
		exit 1
	fi
fi

path="$(pwd)"
root="${path##*/}"
ssh rsync test -d "$root"
if test $? -ne 0; then
	echo "${root} does not exist on remote" >&2
	exit 1
fi

if test -n "$slow"; then
	echo "Running in slow mode."
	mode="--ignore-times"
else
	mode="--omit-dir-times --size-only"
fi

if test "$(uname -s)" = "Darwin"; then
	iconv="--iconv=utf-8-mac,utf-8"
	echo "Running on mac - adding $iconv"
else
	iconv=""
fi

if test -n "$dryrun"; then
	echo "Running in dry-run mode. Invoke this script with the 'real' argument"
	echo "to actually perform the transfers:"
	echo ""
	echo "        $0 $* real"
	echo ""
	echo ""
	echo "Press enter to continue ..."
	read line
fi

rsync_flags="$dryrun -rvz -zz --progress $mode --delete $iconv --exclude=.Spotlight-V100 --exclude=.DocumentRevisions-V100 --exclude=.DS_Store --exclude="._*" --exclude=.fseventsd --exclude=.Trashes --exclude=.TemporaryItems --exclude=.git --exclude=.gitignore --exclude=.gd --exclude=*~ --exclude=.rsmaster"

src="."
dst="rsync:${root}/"

echo "Synchronizing from $src to $dst..."
rsync $rsync_flags --rsh=ssh "${src}" "${dst}"
exit 0
