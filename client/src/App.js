import React from 'react';
import MessageHistory from '../components/MessageHistory/MessageHistory';
import SendMessageInput from '../components/SendMessageInput/SendMessageInput';
import UserList from '../components/UserList/UserList';
import SocketIoClient from 'socket.io-client';
import Modal from 'react-modal';
import './App.css';

// set up custom styles for modal
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      alignItems: 'center'
    }
};

// mount modal to the root element
Modal.setAppElement('#root')

/*
* Handles user authentication and intializing web socket connection
*/
class App extends React.Component {
    constructor() {
        super();
        
        this.state = {
            loggedIn: false,

            modalIsOpen: false,

            loginUsername: '',
            loginPassword: '',
            registerUsername: '',
            registerPassword: '',
            authSuccessMessage: '',
            authFailureMessage: ''
        }

        this.socket = SocketIoClient();
        this.checkConnection = undefined;
    }

    // register a user
    handleRegister = (e) => {
        e.preventDefault();
        this.socket.emit('register', this.state.registerUsername, this.state.registerPassword);
    }

    // log in a user
    handleLogin = (e) => {
        e.preventDefault();
        this.socket.emit('login', this.state.loginUsername, this.state.loginPassword);
    }

    // update state when value of input changes
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            authSuccessMessage: '',
            authFailureMessage: ''
        });
    }

    openModal = () => {
        this.setState({
            modalIsOpen: true
        });
    }
     
    closeModal = () => {
        this.setState({
            modalIsOpen: false,
            authSuccessMessage: '',
            authFailureMessage: '',
            loginUsername: '',
            loginPassword: '',
            registerUsername: '',
            registerPassword: ''
        });
    }

    // checks to see if the user is currently connected only if the app
    // gets disconnected during the current session
    connected = (time = 0) => {
        if (this.socket.connected) {
            this.setState({
                authSuccessMessage: 'Reconnected to server! Please log in to continue.',
                authFailureMessage: ''
            });

            clearInterval(this.checkConnection);
        } else {
            this.setState({
                authFailureMessage: `Disconnected from server. Trying to reconnect. (${time})`
            });
        }
    }

    // checks to see if the user is connected, only if app was initially loaded
    // in a disconnected state
    initialConnectionCheck = () => {
        if (this.socket.connected) {
            this.setState({
                authSuccessMessage: 'Server is back online! Please log in to continue.',
                authFailureMessage: ''
            });

            clearInterval(this.checkConnection);
        }
    }

    componentDidMount() {
        // give the app time to connect to websocket server
        // before displaying an error
        setTimeout(() => {
            // display an error message if not currently connected
            if (!this.socket.connected) {
                this.setState({
                    authFailureMessage: `Server is currently offline. Please try again later.`
                });
                
                this.checkConnection = setInterval(() => {
                    this.initialConnectionCheck();
                }, 1000);
            }
        }, 1000);

        // a message to display when a user logs in successfully
        this.socket.on('register success', (message) => {
            this.setState({
                authSuccessMessage: message
            });
        });

        // sets state so our current user is logged in
        this.socket.on('logged in', (token) => {
            localStorage.setItem('token', token);
            this.setState({
                loggedIn: true,
                modalIsOpen: false
            })
        });

        // displays an error message
        this.socket.on('auth error', (message) => {
            this.setState({
                authFailureMessage: message
            });
        });

        // displays an error message if current user gets disconnected from server
        this.socket.on('disconnect', () => {
            this.setState({
                loggedIn: false,

                modalIsOpen: true,

                loginUsername: '',
                loginPassword: '',
                registerUsername: '',
                registerPassword: '',
                authSuccessMessage: '',
                authFailureMessage: 'Disconnected from server. Trying to reconnect.'
            });

            var times = 0;
            this.checkConnection = setInterval(() => {
                this.connected(times);
                times++;
            }, 1000);
        });
    }

    render() {
        return (
            <div className="App">
                {this.state.authSuccessMessage.length > 0
                    ?   <p className="successMessage">{this.state.authSuccessMessage}</p>
                    :   null
                }
                {this.state.authFailureMessage.length > 0
                    ?   <p className="failureMessage">{this.state.authFailureMessage}</p>
                    :   null
                }
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Authentication Modal"
                >
                    <button className="CloseModalButton" onClick={this.closeModal}>X</button>

                    <div className="ModalContent">
                        <h3>Login</h3>
                        <form onSubmit={this.handleLogin}>
                            <input
                                name="loginUsername"
                                type="text"
                                placeholder="Username"
                                onChange={this.handleChange}
                                value={this.state.loginUsername}
                                required
                            />
                            <input
                                name="loginPassword"
                                type="password"
                                placeholder="Password"
                                onChange={this.handleChange}
                                value={this.state.loginPassword}
                                required
                            />
                            <button type="submit" className="LoginButton">Log In</button>
                        </form>
                    </div>

                    <h3 className="Separator">OR</h3>

                    <div className="ModalContent">
                        <h3>Register</h3>
                        <form onSubmit={this.handleRegister}>
                            <input
                                name="registerUsername"
                                type="text"
                                placeholder="Username"
                                onChange={this.handleChange}
                                value={this.state.registerUsername}
                                required
                            />
                            <input
                                name="registerPassword"
                                type="password"
                                placeholder="Password"
                                onChange={this.handleChange}
                                value={this.state.registerPassword}
                                required
                            />
                            <button type="submit" className="LoginButton">Register</button>
                        </form>
                    </div>
                </Modal>

                <UserList socket={this.socket} />

                <div className="MainView">
                    <MessageHistory
                        socket={this.socket}
                        loggedIn={this.state.loggedIn}
                    />

                    <SendMessageInput
                        socket={this.socket}

                        loggedIn={this.state.loggedIn}
                        openModal={this.openModal}
                    />
                </div>
            </div>
        );
    }
}

export default App;
