'use strict'

 // ============= Vendor App =============

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-west-2'});

// Create an SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// Create an SQS service object
const sns = new AWS.SNS(); //<<<<<<<<<<<<<<<<<<<<<<<<<<< 

const queueURL = "https://sqs.us-west-2.amazonaws.com/024169153531/package_queue.fifo";

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

sqs.receiveMessage(params, function(err, data) {
  if (err) {
    console.log("Receive Error", err);
  } else if (data.Messages) {
    console.log(data.Messages)

    const deleteParams = {
      QueueUrl: queueURL,
      ReceiptHandle: data.Messages[0].ReceiptHandle
    };
    sqs.deleteMessage(deleteParams, function(err, data) {
      if (err) {
        console.log("Delete Error", err);
      } else {
        console.log("Message Deleted", data);
      }
    });
  }
});

// https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascript/example_code/sqs/sqs_receivemessage.js