from pymongo import MongoClient
from bson.objectid import ObjectId
import os

class DataBase:
    def __init__(self, userId):
        with open("Eduvise/secrets.txt") as f:
            lines = f.readlines()
            secret_key = lines[0].strip()
            mongo_pw = lines[1].strip()
        self.db = MongoClient("mongodb+srv://admin:{}@eduvise-f0zco.gcp.mongodb.net/test?retryWrites=true&w=majority".format(mongo_pw)).Eduvise.user
        if self.db.find_one({'_id': ObjectId(userId)}) != None:
            self.id = {'_id': ObjectId(userId)}
    
    def updateOne(self, key, value):
        self.db.update_one(self.id, {"$set": {key: value}}, upsert=True)
    
    def updateMany(self, json):
        self.db.update_one(self.id, {"$set": json}, upsert=True)
    
    def getAll(self):
        return self.db.find_one(self.id)

    def search(self, key):
        return self.db.find_one(self.id, {'_id': 0, key: 1})[key]

class GetID:
    def __init__(self):
        with open("Eduvise/secrets.txt") as f:
            lines = f.readlines()
            secret_key = lines[0].strip()
            mongo_pw = lines[1].strip()
        self.db = MongoClient("mongodb+srv://admin:{}@eduvise-f0zco.gcp.mongodb.net/test?retryWrites=true&w=majority".format(mongo_pw)).Eduvise.user
    
    def keyvalue(self, key, value):
        return self.db.find_one({key: value}).get('_id')