const Room = require('./rooms')
    , _ = require('underscore')
    , people = {}
    , rooms = {}
    , sockets = []
    , chatHistory = {};

module.exports = (server) => {
    let io = require("socket.io").listen(server);
    io.set("log level", 1);

    function purge(s, action) {
        if (people[s.id].inroom) {
            var room = rooms[people[s.id].inroom];
            if (s.id === room.owner) {
                if (action === "disconnect") {

                    io.sockets.in(s.room).emit("update", "The Owner (" + people[s.id].name + ") has left the server. The room is removed and you have been disconnected from it as well");
                    var socketIds = [];
                    for (let i = 0; i < sockets.length; i++) {
                        socketIds.push(sockets[i].id);
                        if (_.contains((socketIds)), room.people) {
                            sockets[i].leave(room.name);
                        }
                    }

                    if (_.contains((room.people)), s.id) {
                        for (let i = 0; i < room.people.length; i++) {
                            people[room.people[i]].inroom = null;
                        }
                    }

                    room.people = _.without(room.people, s.id);
                    delete rooms[people[s.id].owns];
                    delete people[s.id];
                    delete chatHistory[room.name];
                    sizePeople = _.size(people);
                    sizeRooms = _.size(rooms);
                    io.sockets.emit("update-people", { people: people, count: sizePeople });
                    io.sockets.emit("roomList", { rooms: rooms, count: sizeRooms });
                    let o = _.findWhere(sockets, { 'id': s.id });
                    sockets = _.without(sockets, o);

                } else if (action === "removeRoom") {

                    io.sockets.in(s.room).emit("update", "The Owner (" + people[s.id].name + ") has left the server. The room is removed and you have been disconnected from it as well");
                    var socketIds = [];
                    for (let i = 0; i < sockets.length; i++) {
                        socketIds.push(sockets[i].id);
                        if (_.contains((socketIds)), room.people) {
                            sockets[i].leave(room.name);
                        }
                    }

                    if (_.contains((room.people)), s.id) {
                        for (let i = 0; i < room.people.length; i++) {
                            people[room.people[i]].inroom = null;
                        }
                    }

                    delete rooms[people[s.id].owns];
                    people[s.id].owns = null;
                    room.people = _.without(room.people, s.id);
                    delete chatHistory[room.name];
                    sizeRooms = _.size(rooms);
                    io.sockets.emit("roomList", { rooms: rooms, count: sizeRooms });

                } else if (action === "leaveRoom") {

                    io.sockets.in(s.room).emit("update", "The Owner (" + people[s.id].name + ") has left the server. The room is removed and you have been disconnected from it as well");
                    var socketIds = [];
                    for (let i = 0; i < sockets.length; i++) {
                        socketIds.push(sockets[i].id);
                        if (_.contains((socketIds)), room.people) {
                            sockets[i].leave(room.name);
                        }
                    }

                    if (_.contains((room.people)), s.id) {
                        for (let i = 0; i < room.people.length; i++) {
                            people[room.people[i]].inroom = null;
                        }
                    }

                    delete rooms[people[s.id].owns];
                    people[s.id].owns = null;
                    room.people = _.without(room.people, s.id);
                    delete chatHistory[room.name];
                    sizeRooms = _.size(rooms);
                    io.sockets.emit("roomList", { rooms: rooms, count: sizeRooms });
                }

            } else {
                if (action === "disconnect") {
                    io.sockets.emit("update", people[s.id].name + " has disconnect from the server.");
                    if (_.contains((room.people), s.id)) {
                        let PersonIndex = room.people.indexOf(s.id);
                        room.people.splice(PersonIndex, 1);
                        s.leave(room.name);
                    }
                    delete people[s.id];
                    sizePeople = _.size(people);
                    io.sockets.emit("update-people", { people: people, count: sizePeople });
                    let o = _.findWhere(sockets, { 'id': s.id });
                    sockets = _.without(sockets, o);
                } else if (action === "removeRoom") {
                    s.emit("update", "Only the owner can remove a room");
                } else if (action === "leaveRoom") {
                    let personIndex = room.people.indexOf(s.id);
                    room.people.splice(personIndex, 1);
                    people[s.id].inroom = null;
                    io.sockets.emit("update", people[s.id].name + " has left the room.");
                    s.leave(room.name);
                }
            }

        } else {
            if (action === "disconnect") {
                io.sockets.emit("update", people[s.id].name + " has disconnected from the serve");
                delete people[s.id];
                sizePeople = _.size(people);
                io.sockets.emit("update-people", { people: people, count: sizePeople });
                let o = _.findWhere(sockets, { 'id': s.id });
                sockets = _.without(sockets, o);
            }
        }
    }

    io.sockets.on("connection", (socket) => {
        socket.on("joinserver", (name, device) => {
            let exists = false
                , ownerRoomID = inRoomID = null;

            _.find(people, (key, value) => {
                if (key.name.toLowerCase() === name.toLowerCase())
                    return exists = true;
            });
            if (exists) {
                let randomNumber = Math.floor(Math.random() * 1001);
                do {
                    proposedName = name + randomNumber;
                    _.find(people, (key, value) => {
                        if (key.name.toLowerCase() === proposedName.toLowerCase())
                            return exists = true;
                    });
                } while (!exists);
                socket.emit("exists", { msg: "Hte username already exists, please pick another one", proposedName: proposedName });

            } else {
                people[socket.id] = { "name": name, "owns": ownerRoomID, "inroom": inRoomID, "device": device };
                socket.emit("update", "You hace connected to the server");
                io.sockets.emit("update", people[socket.id].name + " is online");
                sizePeople = _.size(people);
                sizeRoom = _.size(rooms);
                io.sockets.emit("update-people", { people: people, count: sizePeople });
                socket.emit("roomList", { rooms: rooms, count: sizeRoom });
                socket.emit("joined");
                sockets.push(socket);
            }
        });

        socket.on("getOnlinePeople", (fn) => {
            fn({ people: people });
        });

        socket.on("countryUpdate", (data) => {
            country = data.country.toLowerCase();
            people[socket.id].country = country;
            io.sockets.emit("update-people", { people: people, count: sizePeople });
        });

        socket.on("typing", (data) => {
            if (typeof people[socket.id] !== "undefined")
                io.sockets.in(socket.room).emit("isTyping", { istyping: data, person: people[socket.id].name });
        });


        socket.on("send", (msgTime, msg) => {
            var regex = /^[w]:.*:/
                , whisper = re.test(msg)
                , whisperStr = msg.split(":")
                , found = false;
            if (whisper) {
                let wispetTo = whisperStr[1]
                    , keys = Object.keys(people);

                if (keys.length != 0) {
                    for (let i = 0; i < keys.length; i++) {
                        let whisperId = keys[i];
                        found = true;
                        if (socket.id === whisperId)
                            socket.emit("update", "You can't whisper to yourrself");

                        break;
                    }

                }
                if (found && socket.id !== whisperId) {
                    let whisperTo = whisperStr[1]
                        , whisperMsg = whisperStr[2];
                    socket.emit("whisper", { name: "you" }, whisperMsg);
                    io.sockets.sockets(whisperId).emit("whisper", msgTime, people[socket.id], whisperMsg);
                } else socket.emit("update", "Can't find " + whisperTo);

            } else {

                if (io.sockets.manager.roomCLients[socket.id]['/' + socket.room] !== undefined) {
                    io.sockets.in(socket.room).emit("chat", msgTime, people[socket.id], msg);
                    socket.emit("isTyping", false);
                    if (_.size(chatHistory[socket.room]) > 10)
                        chatHistory[socket.room].splice(0, 1);
                    else chatHistory[socket.room].push(people[socket.id].name + ": " + msg);

                } else socket.emit("update", "Please connect to a room");

            }

        });

        socket.on("disconnect", () => {
            if (typeof people[socket.id] !== "undefined")
                purge(socket, "disconnect");
        });

        socket.on("createRoom", (name) => {
            if (people[socket.id].inroom)
                socket.emit("update", "You are in a room. Please leave it first to create your own.");
            else if (!people[socket.id].owns) {
                var id = uuid.v4();
                var room = new Room(name, id, socket.id);
                rooms[id] = room;
                sizeRooms = _.size(rooms);
                io.sockets.emit("roomList", { rooms: rooms, count: sizeRooms });
                socket.room = name;
                socket.join(socket.room);
                people[socket.id].owns = id;
                people[socket.id].inroom = id;
                room.addPerson(socket.id);
                socket.emit("update", "Welcome to " + room.name + ".");
                socket.emit("sendRoomID", { id: id });
                chatHistory[socket.room] = [];
            } else socket.emit("update", "You have already created a room.");

        });

        socket.on("check", (name, fn) => {
            let match = false;
            _.find(rooms, (key, value) => {
                if (key.name === name)
                    return match = true;
            });
            fn({ result: match });
        });

        socket.on("removeRoom", (id) => {
            let room = rooms[id];
            if (socket.id === rooom.owner)
                purge(socket, "removeRoom");
            else socket.emit("update", "Only the owner can remove a room.")
        });

        socket.on("joinRoom", (id) => {
            if (typeof people[socket.id] !== "undefined") {
                var room = rooms[id];
                if (socket.id === room.owner)
                    socket.emit("update", "You are the owner of this room and you have already been joined.");
                else {
                    if (_.contains((room.people), socket.id))
                        socket.emit("update", "You have already joined this room.");
                    else {
                        if (people[socket.id].inroom !== null)
                            socket.emit("update", "You are already in a room (" + rooms[people[socket.id].inroom].name + "), please leave it first to join another room.");
                        else {
                            room.addPerson(socket.id);
                            people[socket.id].inroom = id;
                            socket.room = room.name;
                            socket.join(socket.room);
                            user = people[socket.id];
                            io.sockets.in(socket.room).emit("update", user.name + " has connected to " + room.name + " room.");
                            socket.emit("update", "Welcome to " + room.name + ".");
                            socket.emit("sendRoomID", { id: id });
                            var keys = _.keys(chatHistory);
                            if (_.contains(keys, socket.room))
                                socket.emit("history", chatHistory[socket.room]);

                        }
                    }
                }
            } else socket.emit("update", "Please enter a valid name first.");

        });

        socket.on("leaveRoom", (id) => {
            let room = rooms[id];
            if (room) purge(socket, "leaveRoom");
        });
        
    });
    return io;
};
