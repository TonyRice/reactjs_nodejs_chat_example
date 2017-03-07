import React from 'react';
import ReactDOM from 'react-dom';

class MessageBox extends React.Component {
    componentDidUpdate() {
        this.refs.messageBox.scrollTop = this.refs.messageBox.scrollHeight;
    }

    render() {
        const messages = this.props.messages.slice();
        const messagesToDisplay = messages.map((message, index) => {
            return (
                <li key={index}>
                    <span className="messageIp">[{message.ip}] :: </span>{message.text}
                </li>
            );
        });
        return <div className="messageBox" ref="messageBox">
            <ul>{messagesToDisplay}</ul>
        </div>;
    }
}

class MessageBar extends React.Component {
    render() {
        return <input className="messageBar" onKeyUp={
            (e) => {
                if (e.keyCode == 13) {
                    this.props.sendMessage(e.target.value);
                    e.target.value = "";
                }
            }
        }/>;
    }
}

class ChatApp extends React.Component {
    constructor() {
        super();
        this.state = {
            socket: null,
            messages: []
        };
    }

    componentDidMount() {
        let socket = io('http://54.85.5.71:3500');
        let messages = this.state.messages;
        socket.on('connect', function () {
            // alert("online");
        });
        socket.on('recieveMessage', function (data) {
            let socket = this.state.socket;
            let messages = this.state.messages.slice();
            this.setState({
                socket: socket,
                messages: messages.concat({
                    ip: data.ip,
                    text: data.message
                })
            });
        }.bind(this));
        socket.on('disconnect', function () {
            // alert("offline");
        });
        this.setState({
            socket: socket,
            messages: messages
        });
    }

    sendMessage(message) {
        let socket = this.state.socket;
        socket.emit("shareMessage", {
            text: message
        });
    }

    render() {
        const messages = this.state.messages;
        return (
            <div>
                <h2>ReactJS & Node.js w/ Socket.io Chat Example</h2>
                <MessageBox messages={messages}/>
                <MessageBar sendMessage={this.sendMessage.bind(this)}/>
            </div>
        )
    }
}

ReactDOM.render(<ChatApp/>, document.querySelector("#chatApp"));