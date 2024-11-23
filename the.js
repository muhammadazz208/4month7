import express from 'express';
import * as uuid from "uuid";
import fs from "node:fs/promises"
import path from "node:path";
class ResData {
    constructor(statusCode,message,data) {
        this.statusCode=statusCode
        this.message=message
        this.data=data
    }
}
class Repository {
    #dir
    constructor(dir) {
        this.#dir=dir
    }

    async read(){
        let data=await fs.readFile(this.#dir,"utf-8")
            return JSON.parse(data)
    }
    async write(data){
        await fs.writeFile(this.#dir, JSON.stringify(data, null, 2),"utf-8")
    }
}
const locateFile = path.resolve("database","basa.json");
const fruitRepository=new Repository(locateFile)



const server=express()



server.use(express.json())
class FruitStn {
    constructor(name,count,price) {
        this.id=uuid.v4();
        this.name=name
        this.count=count
        this.price=price
    }
}

server.get("/fruit",async(req,res,next)=>{
    const fruits=await fruitRepository.read()
    const resData=new ResData(200,"success",fruits)
    res.status(resData.statusCode)
    res.json(resData)
})

server.get("/fruit/:id", async (req, res, next) => {
    const { id } = req.params;
    const fruits = await fruitRepository.read();
    const fruit = fruits.find(fruit => fruit.id === id);

    if (fruit) {
        const resData = new ResData(200, "success", fruit);
        res.status(resData.statusCode);
        res.json(resData);
    } else {
        const resData = new ResData(404, "Fruit not found", null);
        res.status(resData.statusCode);
        res.json(resData);
    }
});


server.post("/fruit",async(req,res,next)=>{
    const { name, count, price } = req.body;
    const newFruit = new FruitStn(name, count, price);
    const fruits = await fruitRepository.read();
    fruits.push(newFruit);
    await fruitRepository.write(fruits)
    const resData=new ResData(201,"fruit is added",fruits)
    res.status(resData.statusCode)
    res.json(resData)
})

server.put("/fruit/:id",async(req,res,next)=>{
    const { id } = req.params;
    const { name, count, price } = req.body;
    const fruits=await fruitRepository.read()
    const fruitIndex = fruits.findIndex(fruit => fruit.id === id);
    if (fruitIndex !== -1) {
        fruits[fruitIndex].name = name || fruits[fruitIndex].name;
        fruits[fruitIndex].count = count || fruits[fruitIndex].count;
        fruits[fruitIndex].price = price || fruits[fruitIndex].price;
        await fruitRepository.write(fruits);

        const resData = new ResData(200, "fruit is updated", fruits);
        res.status(resData.statusCode);
        res.json(resData);
    }else {
        const resData = new ResData(404, "fruit not found", null);
        res.status(resData.statusCode);
        res.json(resData);
    }
})

server.patch("/fruit",async(req,res,next)=>{
    const { id } = req.params;
    const { name, count, price } = req.body;
    const fruits=await fruitRepository.read()
    const fruitIndex = fruits.findIndex(fruit => fruit.id === id);
    if (fruitIndex !== -1) {
        fruits[fruitIndex].name = name || fruits[fruitIndex].name;
        fruits[fruitIndex].count = count || fruits[fruitIndex].count;
        fruits[fruitIndex].price = price || fruits[fruitIndex].price;
        await fruitRepository.write(fruits);

        const resData = new ResData(200, "fruit is updated", fruits);
        res.status(resData.statusCode);
        res.json(resData);
    }else {
        const resData = new ResData(404, "fruit not found", null);
        res.status(resData.statusCode);
        res.json(resData);
    }
})

server.delete("/fruit/:id",async(req,res,next)=>{
    const { id } = req.params;
    const { name, count, price } = req.body;
    const fruits=await fruitRepository.read()
    const fruitIndex = fruits.findIndex(fruit => fruit.id === id);
    if (fruitIndex===-1) {
        const resData=new ResData(404,"fruit not found")
        res.status(resData.statusCode)
        return res.json(resData)
    }
    const deleted=fruits.splice(fruitIndex,1)
    await fruitRepository.write(fruits)
    const resData=new ResData(200,"deleted",deleted)
    res.status(resData.statusCode)
    res.json(resData)
})
 
server.listen(7777,()=>{
    console.log("http://localhost:7777");
    
})


