import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class Group extends Component {

	group_handleClick(event) {
    	Session.set('currentRoom', event.currentTarget.id);
  	}

  	render() {
    	return (
            <li id={this.props.group.name} onClick={this.group_handleClick}>
                <div className="avatar">
                    <div className="avatar-image">
                        <div className="status online"></div>
                        <img src={this.props.group.image}/>
                    </div>
                </div>
                <div className="info">
                    <h3>{this.props.group.name}</h3>
                    <p>{this.props.group.address}</p>
                </div>
            </li>
    	);
  	}
}