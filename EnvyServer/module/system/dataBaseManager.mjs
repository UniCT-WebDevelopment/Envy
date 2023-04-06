import { MongoClient, ServerApiVersion } from 'mongodb';

class DataBaseManager
{
	#mongoClient;
    #db;

	async init(dbURL, dbName) 
    {
        this.#mongoClient = new MongoClient(dbURL, 
			{
				
			});
        await this.#mongoClient.connect();
        this.#db = await this.#mongoClient.db(dbName);
        await this.#db.command({ping: 1});
        console.log("Connected successfully to db")
    }

	async itemExist(collName, filter)
	{
		const coll = await this.#db.collection(collName);
        const count = await coll.countDocuments(filter);
        return count ? true : false;
	}

	async readOne(collName, filter, option)
	{
		const coll = await this.#db.collection(collName);
		return await coll.findOne(filter, option);
	}

	async readMany(collName, filter, option)
	{
		const col = await this.#db.collection(collName);
        return await col.find(filter).project(option).toArray();
	}

	async aggregate(collName, pipeline)
	{	
		const col = await this.#db.collection(collName);
		return await col.aggregate(pipeline).toArray();
	}

	async insertOne(collName, item)
	{
		const coll = await this.#db.collection(collName, {strict : true});
        return await coll.insertOne(item);
	}

	async insertAndReadID(collName, item)
	{
		let id;
		const coll = await this.#db.collection(collName, {strict : true});
        await coll.insertOne(item).then((doc) => id = doc.insertedId);
		return id;
	}

	async updateColl(collName, filter, command)
	{
		const coll = await this.#db.collection(collName, {strict : true});
        await coll.updateOne(filter, command);
	}

	async removeOne(collName, filter)
	{
		const coll = await this.#db.collection(collName, {strict : true});
		return await coll.deleteOne(filter);
	}
	
	async drop()
	{
		console.log("Drop db");
		await this.#db.dropDatabase();
	}
}

export { DataBaseManager };