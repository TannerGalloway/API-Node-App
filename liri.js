require("dotenv").config();
var keys = require("./keys.js");
//add npm packages in to the file
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


//get the first command
var command = process.argv[2];

//remove node file name and command from the array
process.argv.splice(0,3);

//commandValue is the array that is remaining
var commandValue = process.argv;
var doWhatItSaysCount = false;
actions();
log(command);

var infoText = "";

function actions()
{

// track what command was chosen
switch (command)
{
    case "movie-this":
    //if no movie was provided show results for Mr. Nobody
    if(commandValue.length === 0)
    {
        commandValue = "Mr. Nobody";
        return movie();
    }

    if(doWhatItSaysCount === false)
    {
        commandValue = commandValue.join("+");
    }
    //turn the remaining array values into a string with a plus inbetween them
    movie();
    break;

    case "concert-this":
    if(commandValue === "")
    {
        return console.log("No artist was provided");
    }
    if(doWhatItSaysCount === false)
    {
        commandValue = commandValue.join(" ");
    }
    concert();
    break;

    case "do-what-it-says":
    commandValue = commandValue.join(" ");
    doit();
    break;

    case "spotify-this-song":
    if(doWhatItSaysCount === false)
    {
        commandValue = commandValue.join(" ");
    }
    song();
    break;

    default:
    console.log("No command was given");
}

}
//if there was movie provided give infomation about that movie
function movie()
{
    axios.get("http://www.omdbapi.com/?t=" + commandValue + "&y=&plot=short&apikey=trilogy").then(
    function(responce)
    {
        infoText = "Title: " + responce.data.Title;
        log(infoText)
        infoText = "Realease Year: " + responce.data.Year;
        log(infoText);
        infoText = "Imdb Rating: " + responce.data.imdbRating;
        log(infoText);
        infoText = "Rotten Tomatos Rating: ";
        log(infoText);
        infoText = "Country: " + responce.data.Country;
        log(infoText);
        infoText = "Language: " + responce.data.Language;
        log(infoText);
        infoText = "Plot: " + responce.data.Plot;
        log(infoText);
        infoText = "Actors: " + responce.data.Actors;
        log(infoText);
        console.log("Title: " + responce.data.Title);
        console.log("Realease Year: " + responce.data.Year);
        console.log("Imdb Rating: " + responce.data.imdbRating);
        console.log("Rotten Tomatos Rating: ");
        console.log("Country: " + responce.data.Country);
        console.log("Language: " + responce.data.Language);
        console.log("Plot: " + responce.data.Plot);
        console.log("Actors: " + responce.data.Actors);

    });
}

//get infomation about concert of the artist requiested
function concert()
{
    axios.get("https://rest.bandsintown.com/artists/" + commandValue + "/events?app_id=codingbootcamp").then(
        function(responce)
        {
            //loop through the returned object to get the name 
            for(info in responce.data)
            {
                infoText = responce.data[info].venue.name;
                log(infoText);
                
                //gets name of venue cancert is at
                console.log(responce.data[info].venue.name);

                //this is for concerts that are international or in the U.S.
                if(responce.data[info].venue.region === "")
                {
                    infoText = responce.data[info].venue.city + ", " + responce.data[info].venue.country;
                    log(infoText);
                    console.log(responce.data[info].venue.city + ", " + responce.data[info].venue.country);
                }
                else
                {
                    infoText = responce.data[info].venue.city+ ", " + responce.data[info].venue.region + ", " + responce.data[info].venue.country;
                    log(infoText);
                    console.log(responce.data[info].venue.city+ ", " + responce.data[info].venue.region + ", " + responce.data[info].venue.country);
                }
                //get date
                var date = responce.data[info].datetime.split("T");
                infoText = moment(date[0]).format("MM/DD/YYYY");
                log(infoText);

                //format date
                console.log(moment(date[0]).format("MM/DD/YYYY") + "\n");

            }
        }
    )
}

function doit()
{
    fs.readFile("random.txt", "utf8", function(error, text)
    {
        if(error)
        {
            return console.log(error);
        }

        var splitText = text.split(", ");
        command = splitText[0];
        commandValue = splitText[1];
        doWhatItSaysCount = true;
        log("(" + command + ")");
        actions();
    })
}

function song()
{
    spotify.search({ type: 'track', query: commandValue, limit: 1 }, function(error, data) 
    {
        if (error) 
        {
          return console.log('Error occurred: ' + error);
        }
       
        //goes through returned data
      for(songInfo in data.tracks.items)
      {
            //gets the song name
            console.log("Song: " + data.tracks.items[songInfo].name);
            

            //gets name of artist
            console.log("Artist: " + data.tracks.items[songInfo].artists[songInfo].name);
            

            //gets album name
            console.log("Album: " + data.tracks.items[songInfo].album.name);
            

            //check to see if there is a preview link
            if(data.tracks.items[songInfo].preview_url === null)
            {
                infoText = "Song Preview: None";
                log(infoText);
                return console.log("Song Preview: None");
            }

            //get link to preview song
            console.log("Song Preview: " + data.tracks.items[songInfo].preview_url);
            

            infoText = "Song: " + data.tracks.items[songInfo].name;
            log(infoText);
            infoText ="Artist: " +  data.tracks.items[songInfo].artists[songInfo].name;
            log(infoText);
            infoText = "Album: " + data.tracks.items[songInfo].album.name;
            log(infoText);
            infoText = "Song Preview: " + data.tracks.items[songInfo].preview_url;
            log(infoText);
      } 
    });
}

function log(text)
{
    // append text to file given 
    fs.appendFile("log.txt", text + "\n", function(error)
    {
        if(error)
        {
            console.log(error);
        }
    });
}