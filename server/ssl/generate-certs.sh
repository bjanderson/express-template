#!/bin/bash

rm *.crt
rm *.csr
rm *.key
rm *.p12
rm *.srl

echo

echo "Create CA certificate..."
openssl genrsa -des3 -passout file:passphrase -out ca.key 4096
openssl req -new -x509 -days 720 -passin file:passphrase -key ca.key -passout file:passphrase -out ca.crt -subj '/CN=Test CA/O=AAAA-Test/OU=ERA/C=US/ST=Virginia/L=Fairfax'
echo "Done."

echo

echo "Creating Server certificate..."
openssl genrsa -des3 -passout file:passphrase -out server.key 1024
openssl req -new -passin file:passphrase -key server.key -passout file:passphrase -out server.csr -subj '/CN=localhost/O=AAAA-Test/OU=ERA/C=US/ST=Virginia/L=Fairfax'
openssl x509 -req -in server.csr -out server.crt -passin file:passphrase -CA ca.crt -CAkey ca.key -CAcreateserial -days 720
echo "Done."

echo

echo "Creating Client certificate..."
openssl genrsa -des3 -passout file:passphrase -out client.key 1024
openssl req -new  -passin file:passphrase -key client.key -passout file:passphrase -out client.csr -subj '/CN=Test User/O=AAAA-Test/OU=ERA/C=US/ST=Virginia/L=Fairfax'
openssl x509 -req -in client.csr -out client.crt -passin file:passphrase -CA ca.crt -CAkey ca.key -CAcreateserial -days 720
echo "Done."

echo

echo "Creating Expired Client certificate..."
openssl genrsa -des3 -passout file:passphrase -out expiredclient.key 1024
openssl req -new  -passin file:passphrase -key expiredclient.key -passout file:passphrase -out expiredclient.csr -subj '/CN=Expired Test User/O=AAAA-Test/OU=ERA/C=US/ST=Virginia/L=Fairfax'
openssl x509 -req -in expiredclient.csr -out expiredclient.crt -passin file:passphrase -CA ca.crt -CAkey ca.key -CAcreateserial -days -1
echo "Done."

echo

echo "Converting client certificates to p12..."
openssl pkcs12 -export -password pass: -passin file:passphrase -in client.crt -inkey client.key -name "User - Test" -out client.p12
openssl pkcs12 -export -password pass: -passin file:passphrase -in expiredclient.crt -inkey expiredclient.key -name "User - Test Expired" -out expiredclient.p12
echo "Done."

echo

echo "----- Don't forget to open your browser and install your ca.crt and client.p12 certificates -----"

echo