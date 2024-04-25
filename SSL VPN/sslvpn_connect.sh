#!/bin/bash
#Step to connect with sslvpn3
#created by Pramod Prajapati
#Dt. 20.08.2021

cd /usr/local/vpnclient/
#sudo ./vpnclient start

(
    echo "2"
    echo ""
    echo "accountconnect ibs"
    echo "exit"
) | sudo ./vpncmd
sudo dhclient vpn_ibs
sudo ip route del default via 172.20.70.1 dev vpn_ibs
sudo ip route add 172.20.22.0/23 via 172.20.70.1 dev vpn_ibs
if [ "ping -c 4 172.20.22.1" ]
then
    zenity --info --window-icon=information --text="Impressico VPN Connected"
else
    zenity --info --window-icon=information --text="VPN Not Connected"
fi
