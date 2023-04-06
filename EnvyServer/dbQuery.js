[  {
    "name": "gianfryHome",
    "location": {
      "district": "Siracusa",
      "city": "Buccheri",
      "street": "Ramoddetta",
      "streetNumber": 3
    },
    "rooms": [
      {
        "name": "room",
        "floor": 4,
        
      },
      {
        "name": "room2",
        "floor": 4,
        
      }
    ],
    "deviceSet": [
      {
        "name": "gianfryProto",
        "room": "room"
      },
      {
        "name": "gianfryProto1",
        "room": "room"
      },
      {
        "name": "gianfryProto2",
        "room": "room2"
      },
      {
        "name": "gianfryProto3",
        "room": "room"
      },
      
    ],
    "allarmSet": [
      {
        "device": "gianfryProto",
        "sensor": "PIR1",
        "type": "Activity",
        
      },
      {
        "device": "gianfryProto1",
        "sensor": "PIR1",
        "type": "Activity",
        
      },
      {
        "device": "gianfryProto1",
        "sensor": "PIR1",
        "type": "Activity",
        
      },
      {
        "device": "gianfryProto2",
        "sensor": "PIR1",
        "type": "Activity",
        
      }
    ],
    "measure": [
      {
        "name": "temperature",
        "unit": "°C",
        "measureSet": [
          {
            "device": "gianfryProto1",
            "value": 33,
            "time": new Date(),
            
          },
          {
            "device": "gianfryProto1",
            "value": 31,
            "time": new Date(),
            
          },
          {
            "device": "gianfryProto2",
            "value": 35,
            "time": new Date(),
            
          },
          {
            "device": "gianfryProto2",
            "value": 44,
            "time": new Date(),
            
          },
          {
            "device": "gianfryProto1",
            "value": 12,
            "time": new Date(),
            
          },
          {
            "device": "gianfryProto1",
            "value": 35,
            "time": new Date(),
            
          },
             {
            "device": "gianfryProto2",
            "value": 21,
            "time": new Date(),
            
          },
         {
            "device": "gianfryProto1",
            "value": 11,
            "time": new Date(),   
          }
        ]
      }
    ]
  }
]


db.collection.aggregate([
  {
    "$match": {
      "name": "gianfryHome"
    }
  },
  {
    "$project": {
      "_id": 0,
      researchedMeasure: {
        "$first": {
          "$filter": {
            "input": "$measure",
            "as": "m",
            "cond": {
              "$and": [
                {
                  "$eq": [
                    "$$m.name",
                    "temperature"
                  ]
                }
              ]
            }
          }
        }
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      currentMeasure: {
        "$first": {
          "$filter": {
            "input": "$researchedMeasure.measureSet",
            "as": "m",
            "cond": {
              "$eq": [
                "$$m.time",
                {
                  "$max": "$researchedMeasure.measureSet.time"
                }
              ]
            }
          }
        }
      },
      maxMeasure: {
        "$first": {
          "$filter": {
            "input": "$researchedMeasure.measureSet",
            "as": "m",
            "cond": {
              "$eq": [
                "$$m.value",
                {
                  "$max": "$researchedMeasure.measureSet.value"
                }
              ]
            }
          }
        }
      },
      minMeasure: {
        "$first": {
          "$filter": {
            "input": "$researchedMeasure.measureSet",
            "as": "m",
            "cond": {
              "$eq": [
                "$$m.value",
                {
                  "$min": "$researchedMeasure.measureSet.value"
                }
              ]
            }
          }
        }
      },
      midMeasure: {
        "$filter": {
          "input": "$researchedMeasure.measureSet",
          "as": "m",
          "cond": {
            "$lte": [
              "$$m.value",
              {
                "$avg": "$researchedMeasure.measureSet.value"
              }
            ]
          }
        }
      }
    }
  },
  {
    "$project": {
      currentMeasure: 1,
      maxMeasure: 1,
      minMeasure: 1,
      midMeasure: {
        "$first": {
          "$filter": {
            "input": "$midMeasure",
            "as": "m",
            "cond": {
              "$eq": [
                "$$m.value",
                {
                  "$max": "$midMeasure.value"
                }
              ]
            }
          }
        }
      }
    }
  }
])

db.collection.aggregate([
  {
    "$match": {
      "name": "gianfryHome"
    }
  },
  {
    "$project": {
      _id: 0,
      measure: 1,
      roomDeviceSet: {
        $filter: {
          input: "$deviceSet",
          as: "device",
          cond: {
            $eq: [
              "$$device.room",
              "room2"
            ]
          }
        }
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      roomDeviceSet: 1,
      researchedMeasure: {
        "$first": {
          "$filter": {
            "input": "$measure",
            "as": "m",
            "cond": {
              "$and": [
                {
                  "$eq": [
                    "$$m.name",
                    "temperature"
                  ]
                }
              ]
            }
          }
        }
      }
    }
  },
  {
    "$project": {
      researchedMeasure: {
        "$filter": {
          "input": "$researchedMeasure.measureSet",
          "as": "m",
          "cond": {
            "$eq": [
              "$$m.device",
              "gianfryProto2"
            ]
          }
        }
      }
    }
  },
  {
    "$project": {
      "_id": 0,
      currentMeasure: {
        "$first": {
          "$filter": {
            "input": "$researchedMeasure",
            "as": "m",
            "cond": {
              "$eq": [
                "$$m.time",
                {
                  "$max": "$researchedMeasure.time"
                }
              ]
            }
          }
        }
      },
      maxMeasure: {
        "$first": {
          "$filter": {
            "input": "$researchedMeasure",
            "as": "m",
            "cond": {
              "$eq": [
                "$$m.value",
                {
                  "$max": "$researchedMeasure.value"
                }
              ]
            }
          }
        }
      },
      minMeasure: {
        "$first": {
          "$filter": {
            "input": "$researchedMeasure",
            "as": "m",
            "cond": {
              "$eq": [
                "$$m.value",
                {
                  "$min": "$researchedMeasure.value"
                }
              ]
            }
          }
        }
      },
      midMeasure: {
        "$filter": {
          "input": "$researchedMeasure",
          "as": "m",
          "cond": {
            "$lte": [
              "$$m.value",
              {
                "$avg": "$researchedMeasure.value"
              }
            ]
          }
        }
      }
    }
  },
  {
    "$project": {
      currentMeasure: 1,
      maxMeasure: 1,
      minMeasure: 1,
      midMeasure: {
        "$first": {
          "$filter": {
            "input": "$midMeasure",
            "as": "m",
            "cond": {
              "$eq": [
                "$$m.value",
                {
                  "$max": "$midMeasure.value"
                }
              ]
            }
          }
        }
      }
    }
  }
])

https://mongoplayground.net/p/JlZ5Uvw_2rl
