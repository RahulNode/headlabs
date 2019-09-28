import React from 'react';
import ReactDOM from 'react-dom';
import './MessageHistory.css';

/*
* Handles incoming messages and overall message history
*/
class MessageHistory extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
        }
    }
    
    // scroll to bottom of message history
    scrollToBottom = () => {
        const { history } = this.refs;
        const scrollHeight = history.scrollHeight;
        const height = history.clientHeight;
        const maxScrollTop = scrollHeight - height;

        ReactDOM.findDOMNode(history).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    // will check to see if the user is at the bottom of the view
    // if they are then we will make sure to keep the scrollbar at the bottom
    // for new incoming messages. Otherwise we allow users to scroll freely
    checkScroll = () => {
        // check the current scroll position
        // only allow auto scroll if the scrollbar position is within 180px of the bottom
        const { history } = this.refs;
        const scrollHeight = history.scrollHeight;
        const height = history.clientHeight;
        const maxScrollTop = scrollHeight - height;
        const scrollPosition = history.scrollTop;

        if (scrollPosition >= maxScrollTop - 180) {
            this.scrollToBottom();
        }
    }

    componentDidMount() {
        // message list should only happen once right when the user logs in
        this.props.socket.on('message list', (messages) => {
            var formattedMessages = messages.map(message => {
                return {
                    type: 'user',
                    text: `${message.user.local.username}: ${message.message}`,
                    created_at: message.created_at
                }
            });

            this.setState({
                loadingMessages: false,
                messages: [...formattedMessages, ...this.state.messages,]
            });
            
            this.scrollToBottom();
        });

        // displays a user joined message when a user logs in
        this.props.socket.on('user joined', (message) => {
            this.setState({
                messages: [...this.state.messages, {
                    type: 'join',
                    text: message
                }]
            });

            this.checkScroll();
        });

        // displays new incoming messages in chat
        this.props.socket.on('new message', (username, message, created_at) => {
            this.setState({
                messages: [...this.state.messages, {
                    type: 'user',
                    text: `${username}: ${message}`,
                    created_at: created_at
                }]
            });

            this.checkScroll();
        });

        // display a user has left message when a user logs out of chat
        this.props.socket.on('user left', (message) => {
            this.setState({
                messages: [...this.state.messages, {
                    type: 'left',
                    text: message
                }]
            });

            this.checkScroll();
        });

        // once a user has logged in, get all previous messages from last 24 hours
        this.props.socket.on('logged in', (token) => {
            this.props.socket.emit('get messages', token);
        });
    }

    render() {
        // format messages before rendering to view
        var messages = this.state.messages.map((message, key) => {
            if (message.type !== 'user') {
                return (
                    <div key={key} className={message.type}>
                        <p>{message.text}</p>
                    </div>
                )
            } else {
                let date = new Date(message.created_at);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minutes = date.getMinutes();

                // format hours to always be in 12 hour increments
                if (hour > 12) {
                    hour -= 12;
                }
                
                // format minutes properly when minutes are below 10
                if (minutes < 10) {
                    minutes = `0${minutes}`;
                }

                return (
                    <div key={key} className={message.type}>
                        <p>{message.text}</p>
                        <p>{`${month}/${day}/${year} - ${hour}:${minutes}`}</p>
                    </div>
                )
            }
        });

        return (
            <div ref="history" className="MessageHistory">
                {!this.props.loggedIn
                    ?   <div className="loader">Please log in to view chat</div>
                    :   messages
                }
            </div>
        )
    }
}

export default MessageHistory;