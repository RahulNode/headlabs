import React from 'react';
import './UserList.css';

/*
* Keeps the user list up to date
*
* Logged in user count, not logged in user count,
* and a list of logged in users
*/
class UserList extends React.Component {
    constructor() {
        super();
        this.state = {
            anonymousUserCount: 0,
            loggedInUserCount: 0,
            users: []
        }
    }
    
    componentDidMount() {
        // update user list and count when a user first joins
        this.props.socket.on('user list', (count, list) => {
            this.setState({
                users: list,
                loggedInUserCount: count
            });
        });

        // update the total count of unauthenticated users
        this.props.socket.on('anonymous left', (count) => {
            this.setState({
                anonymousUserCount: count
            });
        });

        // update the total count of logged in users, as well as list of users
        this.props.socket.on('user joined', (message, count, users) => {
            this.setState({
                loggedInUserCount: count,
                users: users
            });
        });

        // update the total count of unauthenticated users
        this.props.socket.on('anonymous joined', (count) => {
            this.setState({
                anonymousUserCount: count
            });
        });

        this.props.socket.on('disconnect', () => {
            this.setState({
                anonymousUserCount: 0,
                loggedInUserCount: 0,
                users: []
            });
        });
    }

    render() {
        var users = this.state.users.map((user, key) => {
            return <li key={key}>{user}</li>
        })

        return (
            <div className="UserList">
                <div className="List">
                    <ul>
                        {users}
                    </ul>
                </div>
                <div className="Info">
                    <span>Logged In Users: {this.state.loggedInUserCount}</span>
                    <span>Anonymous Users: {this.state.anonymousUserCount}</span>
                </div>
            </div>
        )
    }
}

export default UserList;