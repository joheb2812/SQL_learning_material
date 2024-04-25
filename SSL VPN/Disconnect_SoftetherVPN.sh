#!/bin/bash
#starting VPN Service 
cd /usr/local/vpnclient/
sudo ./vpnclient start
#Connecting with VPN server 
(
echo "2"
echo ""
echo "accountdisconnect ibs"
#echo IMP>
echo "exit" ) | sudo ./vpncmd
