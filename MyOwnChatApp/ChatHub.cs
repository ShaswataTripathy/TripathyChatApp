using Owin;
using System;
using System.Web;
using Microsoft.AspNet.SignalR;
namespace MyOwnChatApp
{
    public class ChatHub : Hub
    {
        public void Hello()
        {
            Clients.All.hello();
        }

        public void sendMessage(string username, string message, string userto)
        {
            Clients.All.broadcastMessage(username, message, userto);
        }

        public bool register(string username)
        {
            return ListUser.register(username);
        }

        public void getListUser()
        {
            Clients.All.loadUser(ListUser.list);
        }
    }
}
