'use strict';

const AWS = require("aws-sdk");
const crypto = require('crypto');
const pokemonInfo = require('./pokemon').pokemonInfo;

console.log(`About to insert ${pokemonInfo.length} into ${process.env.TABLE_ARN}.`);

AWS.config.update({
  region: process.env.REGION
});

const docClient = new AWS.DynamoDB.DocumentClient();
let count = 0;

pokemonInfo.forEach(pokemon => {
  const params = {
    TableName: "pokemon",
    Item: {
      "md5id": crypto.createHash('md5').update(pokemon.id).digest('hex'),
      "id": pokemon.id,
      "name": pokemon.name
    }
  };

  docClient.put(params, (err, data) => {
    if (err) {
      console.error(`Error updating pokemon: ${err}`);
    } else {
      count = count + 1;
    }
  });
});

console.log(`Done.`);