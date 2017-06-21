function room(name, id, owner) {
    this.name = name;
    this.id = id;
    this.owner = owner;
    this.people = [];
    this.peopleLimit = 5;
    this.status = "available";
    this.private = true;
};

room.prototype.addPerson = (personId) => {
    if (this.status == "available")
        this.person.push(personId);
};

room.prototype.removePerson = (person) => {
    let personIndex = -1;
    for (let i = 0; i < this.person.length; i++) {
        if (this.people[i].id == person.id) {
            personIndex = i;
            break;
        };
    };
    this.people.remove(personIndex);
};

room.prototype.getPerson = (personId) => {
    let person = null;
    for (let i = 0; i < this.people.length; i++) {
        if (this.people[i].id == person.id) {
            person = this.people[i];
            break;
        };
    };
    return person;
};

room.prototype.isAvailable = () => {
    return this.isAvailable === "available";
};

room.prototype.isPrivate = () => {
    return this.private;
};

module.exports = room;