'use strict'

 // ==================================== Vendor App ====================================

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'us-west-2'});

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// Sets package queue
const queueURL = "https://sqs.us-west-2.amazonaws.com/024169153531/package_queue.fifo";

// ================================== SQS =================================

const params = {
 AttributeNames: [
    "SentTimestamp"
 ],
 MaxNumberOfMessages: 1,
 MessageAttributeNames: [
    "All"
 ],
 QueueUrl: queueURL,
 VisibilityTimeout: 20,
 WaitTimeSeconds: 0
};

function delivery(){
  sqs.receiveMessage(params, function(err, data) {
    if (err) {
      console.log("Receive Error", err);
    } else if (data.Messages) {
      let receivedMessage = data.Messages[0];
      console.log('\n ================= Received Message: ================= \n', receivedMessage);
      publishDelivered(receivedMessage);
  
      const deleteParams = {
        QueueUrl: queueURL,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      };
      sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
          console.log("Delete Error", err);
        } else {
          console.log("\n ===== Message Deleted: ===== \n", data.ResponseMetadata);
        }
      });
    } else {
      console.log('\n |=== No messages currently in queue ===| \n');
    }
  });
}

// ================================== SNS =================================


// Publishes received package to vendors delivered queue
async function publishDelivered(message){
  console.log('\n ================= Published Delivered: ================= \n');

  const params = {
    QueueUrl: JSON.parse(message.Body).vendor,
    MessageBody: JSON.stringify(message),
  };
  
  const messageAcknowledge = await sqs.sendMessage(params).promise();

  console.log('\n ===== Acknowledged: ===== \n');

  for(let key in messageAcknowledge) {
    console.log(key + ":", messageAcknowledge[key]);
  }
}


// https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascript/example_code/sqs/sqs_receivemessage.js


module.exports = {delivery};