const express = require("express");
const app = express();
const { List } = require("./models");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const moment = require('moment');


const flash = require("connect-flash");
app.use(express.urlencoded({extended:false}));
app.set("view engine","ejs");
const path = require('path');
app.use(express.static(path.join(__dirname,"public")));
app.set("views", path.join(__dirname, "views"));

function convertTime(timeString) {
  const timeParts = timeString.split(':');
  let hours = parseInt(timeParts[0]);
  let minutes = timeParts[1];
  let ampm = 'AM';

  if (hours >= 12) {
    ampm = 'PM';
    if (hours > 12) {
      hours -= 12;
    }
  }

  if (hours === 0) {
    hours = 12;
  }

  const formattedTime = `${hours}:${minutes} ${ampm}`;
  return formattedTime;
}



app.get("/", async (request, response)=> {
  const slist=["10:00 AM" ,"10:30 AM", "11:00 AM" ,"11:30 AM" ,"12:00 PM ","12:30 PM", "1:00 PM ","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM",];
  const slist1=["10:00 AM" , "11:00 AM" ,"12:00 PM" ,"1:00 PM ","2:00 PM","3:00 PM","4:00 PM"];
  const totallist1 = await List.getlist();
  const list1 =  [];
  const list2 =  [];
  

  for (let i = 0; i < totallist1.length; i++) {
    const twelveHourTime = convertTime(totallist1[i].start);
   // console.log(twelveHourTime); 
    list1.push(twelveHourTime);
  };
  for (let i = 0; i < totallist1.length; i++) {
    const twelveHourTime = convertTime(totallist1[i].end);
   // console.log(twelveHourTime); 
    list2.push(twelveHourTime);
  };

const startlist = slist.filter((elem) => !list1.includes(elem));

//console.log(startlist); 

const startlist1 = slist1.filter((elem) => !list1.includes(elem));

//console.log(startlist1); 


  console.log("list",list1);

  if(request.accepts('html')){
    response.render('index.ejs',{
        totallist1,list1,list2,startlist,startlist1
    });
  }
  else{
    response.json({
        totallist1,startlist,startlist1
    })
  }
});




app.post("/list", async (request, response)=> {
    console.log("request",request.body.title);
    const title=request.body.title;
    const starttime=request.body.start;
    const duration=request.body.duration;
    const endtime = moment(starttime, 'h:mm a').add(duration, 'minutes').format('h:mm a');
    //const endtime=request.body.endtime;
    console.log("end time ",endtime)
    
  try {
    const appointment = await List.addappointment(title,starttime,endtime,duration);
    if(request.accepts('html')){
      return response.redirect("/");
    }
    else{
      return response.json(appointment);
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});


app.put("/list/:id",async (request, response) => {
  // const appointment1 = await List.findByPk(request.params.id);
  console.log("title1",request.body.title)
  try {
    await List.modifytitle(
      request.body.title,
      request.params.id
    );
      
    return response.redirect(`/`);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/list/:id", async function (request, response) {
    console.log("We have to delete a appointment with ID: ", request.params.id);
    try{
      const deleted=await List.destroy({where: {id: request.params.id} });
      if(request.accepts('html')){
        return response.redirect(`/`);
      }
      else{
        return response.json(deleted ? true : false);
      }
    }
    catch(error){
      console.log(error);
      return response.status(422).json(error);
      }
  });

module.exports = app;