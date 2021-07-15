const express=require("express");
const app=express();
const mongoose=require("mongoose");
const _=require("lodash");

app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

// const tasks=["Wake Up","Brush Your Teeth","Take a bath"];
// const worktasks=[];

mongoose.connect("mongodb://localhost:27017/todolistDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const taskSchema=new mongoose.Schema({
    name:String
});

const Task=mongoose.model("Task",taskSchema);

const task1=new Task({
    name:"Welcome to your todolist!"
});
const task2=new Task({
    name:"Hit the + button to add a new task into list."
});
const task3=new Task({
    name:"<-- Hit this to delete a task."
});

const defaultTasks=[task1,task2,task3];

const listSchema={
    name:String,
    tasks:[taskSchema]
};

const List=mongoose.model("List",listSchema);


app.get("/",function(req,res){
    Task.find({},function(err,foundTasks){
        if(foundTasks.length===0){
            Task.insertMany(defaultTasks,function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("successfully added");
                }
            });
            res.render("/");
        }else{
            res.render("list",{Title:"Today",taskList:foundTasks});
        }
    });
});

app.post("/",function(req,res){
    const taskName=req.body.taskinput;
    const listName=req.body.tasksubmit;
    const task=new Task({
        name:taskName
    });
    if(listName==="Today"){
        task.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName},function(err,foundList){
            foundList.tasks.push(task);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});

app.post("/delete",function(req,res){
    const checkedListId=req.body.checkbox;
    const listName=req.body.listName;

    if(listName==="Today"){
        Task.findByIdAndRemove(checkedListId,function(err){
            if(!err){
                console.log("Successfully deleted the Task!");
                res.redirect("/");
            }
        });
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{tasks:{_id:checkedListId}}},function(err,foundList){
            if(!err){
                res.redirect("/"+listName);
            }
        });
    }
});

app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);
    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                const list=new List({
                    name:customListName,
                    tasks:defaultTasks
                });
                list.save();
                res.redirect("/"+customListName);
            }
            else{
                res.render("list",{Title:foundList.name,taskList:foundList.tasks});             
            }
        }
    });
});

app.listen(3000,function(){
    console.log("Server running on port 3000");
});