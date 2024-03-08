#!/bin/bash
APT="sudo apt -y"

echo "Updating system"
$APT update
$APT upgrade
$APT dist-upgrade
$APT full-upgrade

echo "Installing tools"
$APT install vim-nox vlc gimp ubuntu-restricted-extras
$APT install fortune-mod rsync
$APT install python3 python3-pip pylint
$APT install git gitk git-gui optipng
$APT install thunderbird
$APT install dotnet-sdk-8.0

echo "Installing Spotify"
curl -sS https://download.spotify.com/debian/pubkey_6224F9941A8AA6D1.gpg | sudo gpg --dearmor --yes -o /etc/apt/trusted.gpg.d/spotify.gpg
echo "deb http://repository.spotify.com stable non-free" | sudo tee /etc/apt/sources.list.d/spotify.list
$APT update
$APT install spotify-client

echo "Installing Office + spellcheck"
$APT install libreoffice-l10n-da libreoffice-help-da
$APT install hunspell hunspell-da

echo "Installing OpenConnect"
$APT install openconnect network-manager-openconnect network-manager-openconnect-gnome

echo "Configuring git"
git config --global user.name "Brian Schau"
git config --global user.email brian@schau.dk

echo "Done"
exit 0
