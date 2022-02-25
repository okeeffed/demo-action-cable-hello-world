class RoomChannel < ApplicationCable::Channel
  def subscribed
    if params[:room_id]
      stream_from "room_channel_#{params[:room_id]}" if params[:room_id]
    else
      stream_from 'room_channel'
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def speak
    if params[:room_id]
      ActionCable.server.broadcast "room_channel_#{params[:room_id]}", message: data['message']
    else
      ActionCable.server.broadcast 'room_channel', message: data['message']
    end
  end
end
