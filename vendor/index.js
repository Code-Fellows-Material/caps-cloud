'use strict'

 // ============= Vendor App =============

const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2'})

const nanoid = require('nanoid').nanoid;
//Make sure AWS-cli is configured with access and secret access key
const SNS = new AWS.SNS();
// const SQS = new AWS.SQS()

const topic = 'arn:aws:sns:us-west-2:024169153531:pickup_topic.fifo'; //<---- Arn goes here

const message = {
  orderId: 3,
  customer: 'Mya Linse',
  vender: "????"
};


const payload = {
  Message: JSON.stringify(message),
  TopicArn: topic, 
  MessageGroupId: nanoid(),
  MessageDeduplicationId: nanoid()
}

SNS.publish(payload).promise()
  .then((data) => console.log(data))
  .catch((e) => console.log(e));
