# replica.sh
dockerize -wait tcp://mongodb1:27017 -wait tcp://mongodb2:27017 -wait tcp://mongodb3:27017

mongosh --host mongodb1 --port 27017 --username admin --password 1234 --eval "rs.initiate({
    _id: \"myRepl\",
    members: [
        {_id: 0, host: \"mongodb1\"},
        {_id: 1, host: \"mongodb2\"},
        {_id: 2, host: \"mongodb3\"}
    ]
})"
mongosh --host mongodb1 --port 27017 --username admin --password 1234 --eval "rs.status()"
# mongo 명령어로 replica set 초기화
