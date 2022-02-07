'use strict'

const driver = require('./driver')
const vendor = require('./vendor')

setInterval(() =>{
  console.log('\n >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> REQUESTING DELIVERY <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< \n');
  vendor.requestDelivery();
}, 5000)

setInterval(() => {
  console.log('\n >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  DELIVERY <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< \n');
  driver.delivery()
}, 3500)

setInterval(() => {
  console.log('\n >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> CHECKING FOR DELIVERIES <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< \n');
  vendor.checkDeliveries()
}, 8500)
