import React from 'react';
import './SendMessageInput.css';

/*
* Handles the sending of user messages
*
* If a user isn't logged in, input is disabled, and send message button is replaced
* with a log in/register button
*/
class SendMessageInput extends React.Component {
    constructor() {
        super();
        this.state = {
            newMessage: ''
        }
    }

    // send message to chat
    sendMessage = (e) => {
        e.preventDefault();

        if (this.state.newMessage.length === 0) {
            return null;
        }

        this.props.socket.emit('send message', this.state.newMessage, localStorage.getItem('token'));

        this.setState({
            newMessage: ''
        });
    }

    // update state with input value on change
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div className="SendMessageInput">
                <form onSubmit={this.sendMessage}>
                    <input
                        name="newMessage"
                        value={this.state.newMessage}
                        onChange={this.handleChange}
                        type="text"
                        placeholder={this.props.loggedIn ? "Your message here..." : "Please log in to chat"}
                        disabled={this.props.loggedIn ? false : true}
                    />
                    {this.props.loggedIn
                        ?   <button type="submit" className="sendButton">Send Message</button>
                        :   <button
                                type="button"
                                onClick={() => this.props.openModal()}
                                className="loginButton"
                            >Log In / Sign Up</button>
                    }
                </form>
            </div>
        )
    }
}

export default SendMessageInput;