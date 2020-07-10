const Tasks = require("../models/task.model")
const config = require("../../config/db.config")


//welcome text

exports.text = (req, res) => {

    res.send('hello file created')
    console.log(res.send)
}

//created task successfully
exports.createTask = (req , res) => {
    let createTask = new Tasks ({
        name: req.body.name , 
        email: req.body.email,
        password: req.body.password,
        description: req.body.description,
        date_created: req.body.date_created,
        editable: req.body.editable,
        isVerify: false
    });

    createTask.save(function (err , user) {
     if(err){
         res.json({
            status: false,
            statuscode: 400,
            message: "Task not created",
            error : err
         });

     }else{
         res.json({
             status: true,
             statuscode: 200,
             message: "Task created successfully",
             data: user
         });
       }
    });
}

//get all user 

//exports.getAllTask = (req, res) => {
  //  Tasks.findById()
    //.then(users => {
      //  res.send(users);
   // }).catch(err => {
     //   res.status(500).send({
       //     message: err.message || "Some error occurred while retrieving notes."
    //    });
 //   });
//  };
  

  exports.getAllTask = (req, res) => {
    Tasks.findById(req.body.id, (err, user) => {
        if (err) {
            res.json({
                status: false,
                statusCode: 404,
                message: "Task not get successfully",
                error: err
            });
        }
        res.json({
            status: true,
            statusCode: 200,
            message: "Task get successfully",
            data: user
        });
    });
};



//update task 


exports.updateTask = (req, res) => {
    var updatedate = req.body;
  //  updatedate.date_updated = new Date();
    Tasks.findByIdAndUpdate(
        req.params.id,
    
        {$set: req.body},
        {new: true},
        (err, role) => {
            if (err) {
                res.json({
                    status: false,
                    statusCode: 404,
                    message: "Task not update successfully",
                    error: err
                });
            }
            res.json({
                status: true,
                statusCode: 200,
                message: "Task update successfully",
                data: role
            });
        }
    );
};


//delete task 


exports.deleteTask = function(req, res) {
    Tasks.findByIdAndDelete(req.userId, function(err) {
      if (err) {
        res.json({
          status: false,
          statusCode: 404,
          message: "task not delete successfully",
          error: err
        });
      } else {
        res.json({
          status: true,
          statusCode: 200,
          message: "task delete successfully"
        });
      }
    });
  };
  