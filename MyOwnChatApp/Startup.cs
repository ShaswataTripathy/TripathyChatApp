using Microsoft.Owin;
using Owin;
using System.Timers;
[assembly: OwinStartup(typeof(MyOwnChatApp.Startup))]
namespace MyOwnChatApp
{
    public class Startup
    {
        public static System.Timers.Timer aTimer;
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();

            aTimer = new System.Timers.Timer(120000);
            aTimer.Elapsed += new ElapsedEventHandler(RunThis);
            aTimer.AutoReset = true;
            aTimer.Enabled = true;
        }
        private static void RunThis(object source, ElapsedEventArgs e)
        {
            ListUser.ClearList();


        }
    }
}