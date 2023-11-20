import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getUser } from '../../api/UserRequests';
import ChatBox from '../../components/ChatBox/ChatBox';
import { useNavigate } from "react-router-dom";
import { UilPrevious } from "@iconscout/react-unicons";
import './Chat.css'
import { useSelector } from 'react-redux';
import { addMessage } from '../../api/MessageRequests';

const SingleChat = () => {
    let params = useParams();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.authReducer.authData);

    const [chatUser, setChatUser] = useState({});
    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [receivedMessage, setReceivedMessage] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [chat, setChat] = useState([])

    useEffect(async () => {
        const { data } = await getUser(params.id);
        setChatUser(data);
    }, [params.id])

    console.log(chatUser);

    const handleSend = async (e) => {
        e.preventDefault()
        const message = {
            senderId: user._id,
            text: newMessage,
            chatId: chat._id,
        }
        const receiverId = chat.members.find((id) => id !== user._id);
        // send message to socket server
        setSendMessage({ ...message, receiverId })
        // send message to database
        try {
            const { data } = await addMessage(message);
            setMessages([...messages, data]);
            setNewMessage("");
        }
        catch
        {
            console.log("error")
        }
    }

    return (
        <div className='User-Chat-Container'>
            <div className="user-chat-top">
                <div className="user-chat-back" onClick={() => { navigate('/chat') }}>
                    <UilPrevious />
                    Back
                </div>
                {chatUser.firstname} {chatUser.lastname}
            </div>

            <div className='chat-box'>
                <input
                    type='text'
                    placeholder='Chat'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />

                <button className="send-button button" onClick={handleSend}>Send</button>
            </div>
            {/* <ChatBox currentUser={} /> */}
        </div>
    )
}

export default SingleChat