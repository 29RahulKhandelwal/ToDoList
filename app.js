const express=require("express");
const app=express();

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

const tasks=["Wake Up","Brush Your Teeth","Take a bath"];
const worktasks=[];

app.get("/",function(req,res){
    res.render("list",{Title:"Today",taskList:tasks});
});

app.post("/",function(req,res){
    var task=req.body.taskinput;
    if(req.body.tasksubmit==="Work-Task"){
        worktasks.push(task);
        res.redirect("/work");
    }
    else{
        tasks.push(task);
        res.redirect("/");
    }
});


app.get("/work",function(req,res){
    res.render("list",{Title:"Work-Task",taskList:worktasks});
});

app.listen(3000,function(){
    console.log("Server running on port 3000");
});