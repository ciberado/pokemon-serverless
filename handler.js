'use strict';

const fs = require('fs');
const crypto = require('crypto');

const AWS = require('aws-sdk');
AWS.config.update({
  region: process.env.AWS_REGION
});
const client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const pokemonIdentifiers = 
  ['111','112','123','129','130','131','133','134','135','136','143','144','147','148','149','15','150','169','172','174','179','180','181','194','195','196','197','200','204','205','208','212','215','23','24','246','247','248','25','252','253','254','26','280','281','282','304','305','306','346','347','348','355','356','358','361','362','363','364','365','374','375','376','379','383','384','39','390','391','392','393','394','395','396','397','398','399','4','40','400','403','404','405','41','410','411','42','425','426','429','433','442','443','444','445','446','447','448','451','452','453','454','455','461','464','470','471','475','477','478','483','493','495','496','497','498','499','5','500','501','502','503','511','512','513','514','515','516','517','518','52','522','523','524','525','526','529','53','530','531','532','533','534','540','541','542','543','544','545','546','547','548','549','551','552','553','554','555','559','560','570','571','572','573','574','575','576','587','595','596','6','607','608','609','610','611','612','613','614','624','625','627','628','63','633','634','635','636','637','639','64','643','644','65','66','67','68','92','93','94','95'];
const activePokemonId = pokemonIdentifiers[parseInt(Math.random()*pokemonIdentifiers.length)];

const htmlTemplate = fs.readFileSync('website/index.html', "utf8");

module.exports.getActivePokemon = async (event, context) => {
  const tableName = process.env.TABLE_ARN.substring(process.env.TABLE_ARN.lastIndexOf('/')+1);
  const params = {
    TableName: tableName,
    Key: {
      md5id: crypto.createHash('md5').update(activePokemonId).digest('hex')
    },
  };
  const data = await client.get(params).promise();
  const pokemon = { id: data.Item.id, name : data.Item.name };

  const pokemonName = data.Item.name;
  const pokemonImage = `https://${process.env.S3URLPREFIX}/pokemon/${data.Item.id}.png`;

  const html = htmlTemplate
    .replace(/<<staticAssetsUrlPrefix>>/g, process.env.S3URLPREFIX)
    .replace(/<<pokemonImageUrl>>/g, pokemonImage)
    .replace(/<<pokemonName>>/g, data.Item.name);
    

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: html
  };
};
