import { Mongo } from 'meteor/mongo';

export const groupsCollection = new Mongo.Collection('groupsdata');
export const messagesCollection = new Mongo.Collection('messagesdata');

if (Meteor.isServer) { //Từ server, chỉ publish ra những dữ liệu cần thiết cho client
  Meteor.publish('groupsdata', function tasksPublication() {
    return groupsCollection.find();
  });
  Meteor.publish('messagesdata', function tasksPublication(currentRoom) {
    return messagesCollection.find({ room: currentRoom}, { sort: { time: 1 }});
  });
}
