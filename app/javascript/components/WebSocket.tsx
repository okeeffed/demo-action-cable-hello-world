import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  addMessageToChannel,
  addChannel,
  selectMessagesById,
  removeChannel,
} from "../store/channels";
import consumer from "../channels/consumer";
import { store } from "../store/store";
import { Provider } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function WebSocket() {
  const params = useParams();
  const messages = useAppSelector((state) =>
    selectMessagesById(state, params.room_id)
  );
  const dispatch = useAppDispatch();
  const roomId = params.room_id ?? "root";

  React.useEffect(() => {
    const subscription = consumer.subscriptions.create(
      { channel: "RoomChannel", room_id: roomId },
      {
        received({ message }) {
          console.log(message);
          switch (message.type) {
            case "ADD_MESSAGE_TO_CHANNEL":
              dispatch(
                addMessageToChannel({ id: roomId, message: message.payload })
              );
              break;
            case "DISPLAY_NOTIFICATION":
              toast(message.payload);
              break;
            default:
              break;
          }
        },
      }
    );

    dispatch(addChannel({ id: roomId }));

    return () => {
      subscription.unsubscribe();
      dispatch(removeChannel({ id: roomId }));
    };
  }, []);

  return (
    <>
      <div>
        {messages.map((message: string, index: number) => (
          <p key={`message-${index}`}>{message}</p>
        ))}
      </div>
      <ToastContainer />
    </>
  );
}

function NotFound() {
  return <p>Not Found</p>;
}

document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.getElementById("root");
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="rooms" element={<WebSocket />}>
            <Route path=":room_id" element={<WebSocket />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>,
    rootEl
  );
});
