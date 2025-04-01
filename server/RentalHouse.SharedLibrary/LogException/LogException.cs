using Serilog;

namespace RentalHouse.SharedLibrary.Logs
{
    public static class LogException
    {
        public static void LogExceptions(Exception e)
        {
            LogToFile(e.Message);
            LogToDebugger(e.Message);
            LogToConsole(e.Message);
        }
        public static void LogToFile(string message)
        {
            Log.Information(message);
        }

        public static void LogToDebugger(string message)
        {
            Log.Debug(message);
        }

        public static void LogToConsole(string message)
        {
            Log.Warning(message);
        }
    }
}
