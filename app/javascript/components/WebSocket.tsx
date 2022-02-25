import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import consumer from "../channels/consumer";

function WebSocket() {
  const [messages, setMessages] = React.useState([]);
  const params = useParams();

  React.useEffect(() => {
    consumer.subscriptions.create(
      { channel: "RoomChannel", room_id: params.room_id ?? undefined },
      {
        received(data) {
          setMessages([...messages, data.message]);
        },
      }
    );
  }, [messages, setMessages, params]);

  return (
    <div>
      {messages.map((message: string, index: number) => (
        <p key={`message-${index}`}>{message}</p>
      ))}
    </div>
  );
}

function NotFound() {
  return <p>Not Found</p>;
}

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("root");
  ReactDOM.render(
    <BrowserRouter>
      <Routes>
        <Route path="rooms" element={<WebSocket />}>
          <Route path=":room_id" element={<WebSocket />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>,
    rootEl
  );
});
