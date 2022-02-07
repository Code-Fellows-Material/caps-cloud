"use strict";

// ============= Vendor App =============

const AWS = require("aws-sdk");

AWS.config.update({ region: "us-west-2" });

const nanoid = require("nanoid").nanoid;
//Make sure AWS-cli is configured with access and secret access key
const SNS = new AWS.SNS();
const SQS = new AWS.SQS();

const topic             = "arn:aws:sns:us-west-2:024169153531:pickup_topic.fifo"; //<---- Arn goes here
const deliveredQueueURL = "https://sqs.us-west-2.amazonaws.com/024169153531/delivered_queue"; //<---- URL goes he

const message = {
  orderId: randomOrderNum(100),
  customer: "Mya Linse",
  vendor: deliveredQueueURL,
};

function requestDelivery(){
  const payload = {
    Message: JSON.stringify(message),
    TopicArn: topic,
    MessageGroupId: nanoid(),
    MessageDeduplicationId: nanoid(),
  };
  
  SNS.publish(payload)
    .promise()
    .then((data) => console.log('\n REQUESTED DELIVERY: \n', data, '\n'))
    .catch((e) => console.log(e));
}

// ================================== SQS =================================

// Vendor will reach out to check delivered queue  



const params = {
  AttributeNames: ["SentTimestamp"],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: ["All"],
  QueueUrl: deliveredQueueURL,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 0,
};

function getDelivered() {
  SQS.receiveMessage(params, function (err, data) {
    if (err) {
      console.log("Receive Error", err);
    } else if (data.Messages) {
      let responseBody = JSON.parse(data.Messages[0].Body);
      console.log("Received Packages:", JSON.parse(responseBody.Body));

      const deleteParams = {
        QueueUrl: deliveredQueueURL,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      };
      SQS.deleteMessage(deleteParams, function (err, data) {
        if (err) {
          console.log("Delete Error", err);
        } else {
          console.log("Message Deleted", data);
        }
      });
    } else {
      console.log("\n |=== No messages currently in queue ===| \n");
    }
  });
}

  function checkDeliveries(){
    const checkParams = {
      QueueUrl: deliveredQueueURL,
      AttributeNames: ['ApproximateNumberOfMessages']
    };
      SQS.getQueueAttributes(checkParams, (err, data) => {
        if(err){
          console.log(err)
        } else if( data){
          console.log('Number of Messages in queue: ', data.Attributes.ApproximateNumberOfMessages)
          const numMessages = data.Attributes.ApproximateNumberOfMessages;
          fullDeliveredCheck(numMessages);
        }
      })
  }

  function fullDeliveredCheck(num){
    for(let i = 0; i < num; i++){
      getDelivered();
    }
  }

  function printNumMessages(){
    const checkParams = {
      QueueUrl: deliveredQueueURL,
      AttributeNames: ['ApproximateNumberOfMessages']
    };
    SQS.getQueueAttributes(checkParams, (err, data) => {
      if(err){
        console.log(err)
      } else if( data){
        console.log('Number of Messages in queue: ', data.Attributes.ApproximateNumberOfMessages)
      }
    })
  }
  // =================== Control section ===================

  // Enable this section for testing 

  // switch (process.argv[2]) {
  //   case 'request':
  //     requestDelivery();
  //     break;

  //     case 'print':
  //       printNumMessages();
  //       break;

  //       case 'check':
  //         checkDeliveries();
  //         break;
  //   default:
  //     console.log('\n Please enter "request", "print", or "check" as an argument to this command. \n')
  //     break;
  // }
// =================== helper functions ===================

//create random num between 1 and max
function randomOrderNum(max) {
  return Math.floor(Math.random() * max) + 1;
}


module.exports = {
  requestDelivery,
  checkDeliveries,
  printNumMessages
}