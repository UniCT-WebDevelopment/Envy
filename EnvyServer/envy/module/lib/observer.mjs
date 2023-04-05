class Observer
{
    socket;
    constructor(socket)
    {
        this.socket = socket;
    }
    update(transition){}
    logUpdate(obs, from, to)
    {
        console.log("["+ obs +"][socketID][" + this.socket.id + "][transition][" + from + "][" + to + "]");
        console.log("");
    }
    getID()
    {
        return this.socket.id;
    }
}


export { Observer };