    
if test $1 -eq 1; then
    curl -X POST http://envy-server.homenet.telecomitalia.it/sub -H "Content-Type: application/json" -d '{"name" : "Giamp", "email" : "giamp@gemail.com", "password" : "dasdsadsadsadasdsadsadasdsadsa"}' -v
fi
if test $1 -eq 2; then
    curl -X POST http://envy-server.homenet.telecomitalia.it/auth -H "Content-Type: application/json" -d '{"name" : "Giamp", "password" : "dasdsadsadsadasdsadsadasdsadsa"}' -v -c cookie.txt
fi
if test $1 -eq 3; then
    curl -X POST http://envy-server.homenet.telecomitalia.it/renew -v -L -b cookie.txt
fi