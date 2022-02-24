import * as React from "react";
import * as ReactDOM from "react-dom";
import consumer from "../channels/consumer";

interface WebSocketProps {
  arg: string;
}

function WebSocket({ arg }: WebSocketProps) {
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    consumer.subscriptions.create(
      { channel: "RoomChannel" },
      {
        received(data) {
          setMessages([...messages, data.message]);
        },
      }
    );
  }, [messages, setMessages]);

  return (
    <div>
      {messages.map((message: string) => (
        <p>{message}</p>
      ))}
    </div>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("root");
  ReactDOM.render(<WebSocket arg="Rails 7 with ESBuild" />, rootEl);
});
