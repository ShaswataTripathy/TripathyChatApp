using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MyOwnChatApp
{
    public class ListUser
    {
        public static List<String> list = new List<string>();

        public static bool register(string username)
        {
            if (username.Trim().ToLower() == "all")
            {
                return false;
            }
            var result = list.Where(x => x == username).ToList();
            if (result.Count() > 0)
            {
                return false;
            }
            list.Add(username);
            return true;
        }

        public static void ClearList()
        {
            list.Clear();

        }

    }
}