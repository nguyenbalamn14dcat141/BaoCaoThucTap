import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

export default class Message extends Component {
  	render() {
  		if (this.props.currentUser && this.props.message.username === this.props.currentUser){
	  		return (
	    		<div className="col-message-sent">
					<div className="message-sent">
						<p>
							<strong>{this.props.message.text}</strong>
							<span> :{this.props.message.username}</span>
						</p>
					</div>
				</div>
	    	);
    	}
    	else
		{
	    	return (
	    		<div className="col-message-received">
					<div className="message-received">
						<p>
							<span>{this.props.message.username}: </span>
							<strong>{this.props.message.text}</strong>
						</p>
					</div>
				</div>
	    	);
    	}
  	}
}