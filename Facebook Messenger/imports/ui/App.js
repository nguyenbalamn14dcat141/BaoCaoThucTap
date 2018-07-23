import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap';
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

import { groupsCollection, messagesCollection } from '../api/connect-db.js';

import Group from './Group.js';
import Message from './Message.js';

class App extends Component {

  username_handleKeyPress(event) { //Khi nhấn Enter sẽ chuyển sang ô Password
    if (event.which === 13 && event.currentTarget.value.trim() != "") {
      $('.password').focus();
    }
  }

  password_handleKeyPress(event) { //Khi nhấn Enter sẽ tiến hành đăng nhập, nếu thiếu username sẽ quay lại ô Username
    if (event.which === 13 && event.currentTarget.value.trim() != "") {
      if ($('.username').val().trim() === ""){
        $('.username').focus();
      }
      else{
        var username = ReactDOM.findDOMNode(this.refs.userName).value.trim(); // Lay gia tri cua o text o dang String
        var password = ReactDOM.findDOMNode(this.refs.passWord).value.trim();
        check(username, String); // Kiem tra username/password nhap vao co phai la String hay khong? 
        check(password, String);
        Meteor.call('my-login', {
          username: username,
          password: password
        }, (err, res) => {
          if (err) { // Nếu xảy ra lỗi ngoài ý muốn
            alert("Something went wrong!");
          }
          else {
            if (res === true){ // Nếu đăng nhập thành công
              Session.set('currentUser', username); // Tạo Session currentUser
            }
            else if (res === false){ // Nếu đăng nhập thất bại
              Meteor.call('my-check-username', {
                username: username
              }, (err, res) => {
                if (err) { // Nếu xảy ra lỗi ngoài ý muốn
                  alert("Something went wrong!");
                }
                else{ 
                  if (res === true){ // Username co ton tai nhung sai Password
                    alert("Password is wrong!");
                  }
                  else if (res === false){ //Username khong ton tai, hoi xem khach co muon dang ky khong?
                    var choose = confirm("Do you want to register?");
                    if (choose){
                      Meteor.call('register', {
                        username: username,
                        password: password
                      }, (err, res) => {
                        if (err) { // Nếu xảy ra lỗi ngoài ý muốn
                          alert("Something went wrong!"); 
                        }
                        else{ // Dang ky thanh cong
                          alert("Done! Please login again!");
                        }
                      });
                    }
                  }
                }
              });
            }
          }
        });      
      }
    }
  }

  newmessage_handleKeyPress(event) {
    if (event.which === 13 && event.currentTarget.value.trim() != "") { //Nếu người dùng ấn Enter và ô chat khác rỗng
       var text = event.currentTarget.value.trim();
       check(text, String); //Kiểm tra text có phải là định dạng String hay không?
       var time = moment(new Date()).format("YY/MM/DD HH:mm:ss");
       messagesCollection.insert({ //Chèn dữ liệu dòng chat vào MongoDB
         text: text, //Nội dung chat
         time: time, //Thời gian
         username: Session.get('currentUser'), //ID người dùng
         room: Session.get('currentRoom') //ID phòng chat
       });
       event.currentTarget.value = ""; //Xóa nội dung trong ô chat
     }
  }

  logout_handleOnClick(event) { // Đăng xuất
    Session.set('currentUser', undefined); //Xóa Session currentUser
  }

  renderGroups() { //Render danh sách nhóm
    return this.props.groupsdata.map((group) => (
      <Group key={group._id} group={group}/>
    ));
  }

  renderChatMessages() { //Render lịch sử chat
    return this.props.messagesdata.map((message) => (
      <Message key={message._id} message={message} currentUser={this.props.currentUser}/>
    ));
  }
 
  render() { //Render tất cả
    return (
    <div className="wrapper">
        <header>
            <div className="container-flud">
                <div className="left">
                    <img src="./logo.svg"/>
                </div>
                
                { this.props.currentUser
                ?
                  <div className="right">
                    <p>Hi {this.props.currentUser}</p>
                    <button className="btn-danger" onClick={this.logout_handleOnClick}>Logout</button>
                  </div>
                :
                  <div className="right">
                    <input type="text" className="username" ref="userName" placeholder="Username" onKeyPress={this.username_handleKeyPress}/>
                    <input type="password" className="password" ref="passWord" placeholder="Password" onKeyPress={this.password_handleKeyPress.bind(this)}/>
                  </div>
                }
            </div>
        </header>

        <div className="container-flud" id="chatbox">
            <div className="row">
              <div className="col-sm-3 .col-md-3 .col-lg-2 .col-xl-2 col-left">
                  <div className="row-content">
                      <div className="groups">
                          {this.renderGroups()}
                      </div>
                  </div>
              </div>

              <div className="col-sm-9 .col-md-9 .col-lg-10 .col-xl-10 col-right">
                <div className="row-content">
                    <section className="message">
                        <div className="grid-message">
                            {this.renderChatMessages()}
                        </div>
                    </section>
                </div>

                { this.props.currentUser
                ?
                    <div className="row-foot">
                        <div className="compose">
                            <input type="text" className="new-message" ref="newMessage" placeholder="Send message..." onKeyPress={this.newmessage_handleKeyPress}/>
                            <div className="compose-dock">
                                <div className="dock">
                                    <img src="./picture.svg"/>
                                    <img src="./smile.svg"/>
                                    <img src="./like.svg"/>
                               </div>
                            </div>
                        </div>
                    </div>
                :
                  <div className="row-foot">
                      <div className="new-message-warning">
                          <p>Please sign in to write new message!</p>
                      </div>
                  </div>
                }
              </div>
            </div>
        </div>
    </div>
    );
  }
}

export default withTracker(() => { //Dùng subcribe tại client để nhận Collection được publish từ server
  Meteor.subscribe('groupsdata');
  Meteor.subscribe('messagesdata', Session.get('currentRoom'));
  return {
    groupsdata: groupsCollection.find({}, { sort: { name: 1 }}).fetch(),
    messagesdata: messagesCollection.find().fetch(),
    currentUser: Session.get('currentUser')
  };
})(App);