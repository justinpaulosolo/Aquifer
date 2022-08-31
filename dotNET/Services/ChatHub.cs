using Microsoft.AspNetCore.SignalR;
using Models.Domain;
using Services;
using System;
using System.Threading.Tasks;

namespace Web.Api.StartUp
{
    public class ChatHub : Hub
    {
        private readonly static ChatServices<string> _connections = new ChatServices<string>();

        public override Task OnConnectedAsync()
        {
            string user = Context.User.Identity.Name;

            _connections.Add(user, Context.ConnectionId);

            return Clients.All.SendAsync("ReceivedMessage", Context.ConnectionId);
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            string user = Context.User.Identity.Name; ;
            _connections.Remove(user, Context.ConnectionId);
            return Clients.All.SendAsync("ReceivedMessage", $"{user} has left the chat.");

        }


        public async Task SendChat(string user, string message)
        {

            foreach (var connectionId in _connections.GetConnections(user))
            {
                    await Clients.Client(connectionId).SendAsync("ReceivedMessage", message);
            }
        }

    }
}
