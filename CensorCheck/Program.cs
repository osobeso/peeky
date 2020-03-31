using Censored;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace CensorCheck
{
    public class Program
    {
        public static int Main(string[] args)
        {
            Console.WriteLine("Hello World!");

            var path = args[0];
            var censoredWords = args[1];


            if (string.IsNullOrWhiteSpace(path))
            {
                Console.WriteLine($"Wrong path was send as argument.");
                return -1;
            }

            if (string.IsNullOrWhiteSpace(censoredWords))
            {
                Console.WriteLine("No censored words were given");
                return -1;
            }

            var directoryInfo = new DirectoryInfo(path);
            if (!directoryInfo.Exists)
            {
                return -1;
            }

            var censorResults = new List<CensoredResult>();

            var censor = new Censor(censoredWords.Split(","));
            foreach (var file in directoryInfo.EnumerateFiles("*.md", SearchOption.AllDirectories))
            {
                try
                {
                    using (var stream = file.OpenText())
                    {
                        int lineNumber = 0;
                        string line;
                        while ((line = stream.ReadLine()) != null)
                        {
                            lineNumber++;
                            if (censor.HasCensoredWord(line))
                            {
                                var censoredResult = new CensoredResult();
                                censoredResult.FileName = file.FullName;
                                censoredResult.LineNumber = lineNumber;
                                censoredResult.CensoredLine = censor.CensorText(line);
                                censorResults.Add(censoredResult);
                            }
                        }
                    }
                }
                catch
                {
                    continue;
                }
            }

            if (censorResults.Count > 0)
            {

                Console.WriteLine($"{censorResults.Count} Censors found");
                var jsonString = JsonConvert.SerializeObject(censorResults, Formatting.Indented);
                Console.WriteLine(jsonString);
                return -1;
            }

            return 0;
        }
    }

    public struct CensoredResult
    {
        public string FileName { get; set; }
        public int LineNumber { get; set; }
        public string CensoredLine { get; set; }
    }
}
