import { Meteor } from 'meteor/meteor';
import '../imports/api/connect-db.js';

const usersCollection = new Mongo.Collection('usersdata')

Meteor.startup(() => {
  // code to run on server at startup
});


Meteor.methods({
    'my-login': function(user){
    	if (usersCollection.find({
          "username": user.username,
          "password": user.password
        }).count()){
          	return true;
        }
        else{
          	return false;
        }
    }    
});

Meteor.methods({
  'my-check-username': function(user){
      if (usersCollection.find({
          "username": user.username
        }).count()){
            return true;
        }
        else{
            return false;
        }
    }
});

Meteor.methods({
  'register': function(user){
    usersCollection.insert({
      "username": user.username,
      "password": user.password
    });
    return true;
  }
});