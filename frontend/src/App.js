import React ,{useState,useEffect} from 'react'
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput'
import "./App.css";


function App() {
  const [data, setData] = useState([{}])
  const [messages,setMessages] = useState([
    {
      sender:"bot", text :"How can i assist you today?"
    },
  ])

  const handleSendMessage = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {sender:"user",text:message},
      {sender:"bot",text:"This is a saample response"},//put api logic here 
    ]);
  }

  useEffect(() => {
     fetch("/random").then(
      res => res.json()
    ).then(
       data => {
        setData(data)
        console.log(data)
       }
    )
  }, [])
  useEffect(() => {
    fetch("/api").then(
     res => res.json()
   ).then(
      data => {
       setData(data)
       console.log(data)
      }
   )
 }, [])
  return (
    <div className='app'>
          {/* {!data ? (
            <p>Loading...</p>
          ): (
            <div>
              <p>Random Number: {data.number}</p>
              <p>Limit: {data.limit}</p>
            </div>
          )}*/}
       <ChatWindow messages={messages} />
       <ChatInput onSendMessage={handleSendMessage} />
          
    </div>
    
  )
}

export default App