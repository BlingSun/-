var express = require('express');
var router = express.Router();
var mysql=require("mysql");
var async=require("async");
var conn=mysql.createConnection({

  host:"localhost",
  user:"root",
  password:"root",
  database:"dialogPlate"
});

conn.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/story', function(req, res, next) {
  console.log("req");
  var storyId=req.query.storyId;
  var chapter=req.query.chapter;
  console.log(req.query);
  var data={};

  var sqls="select * from story where Id=?";
  conn.query(sqls,[storyId],function(error,result,fields) {
    if (error) {
      console.log("error");
      console.log(error);
    }
    if (result && result.length > 0) {
      console.log(result);
      data.story=result[0];
      var sql="select * from dialog where storyId=? and chapter=? order by orderId ASC";
      conn.query(sql,[storyId,chapter],function(error,result,fields){
        if(error){
          console.log("error");
          console.log(error);
        }
        if(result && result.length>0){
          console.log(result);

          data.result=result;

            var sql3="select * from vote where userId=? and storyId=?";
            conn.query(sql3,[1,storyId],function(error,result,fields){
              if(error){
                console.log("error");
                console.log(error);
              }
              if(result && result.length>0) {
                data.voteStatue = "1";
                console.log(data);

              }
              else{
                data.voteStatue = "0";
                console.log(data);
              }

              var sql4="select * from collect where userId=? and storyId=?";
              conn.query(sql4,[1,storyId],function(error,result,fields){
                if(error){
                  console.log("error");
                  console.log(error);
                }
                if(result && result.length>0) {
                  data.collectStatue = "1";
                  console.log(data);
                  res.json(data);

                }
                else{
                  data.collectStatue = "0";
                  console.log(data);
                  res.json(data);
                }

              })

            })

        }
        else{
          data.result=[];
          res.json(data);
        }

      })
    }
    else{
      res.json(data);
    }
  })



});

router.get('/chapter',function(req,res,next){
  console.log("req");
  var storyId=req.query.storyId;
  var chapter=req.query.chapter;


  var data={};
  var sql="select * from dialog where storyId=? and chapter=? order by orderId ASC";
  conn.query(sql,[storyId,chapter],function(error,result,fields) {
    if (error) {
      console.log("error");
      console.log(error);
    }
    if (result && result.length > 0) {
      console.log(result);
      data.result = result;
      res.json(data);
    }
  })

});


router.get('/main', function(req, res, next) {
  console.log("req");
  var userId=req.query.userId;
  var page=req.query.page;
  var kind=req.query.kind;
  console.log(req.query);
  var start=page*8-8;
  var end=page*8;
  var sql="select id,storyName,userId,userName,info,readNo,img,kind from story where id>? and id<=? and kind=? order by Id asc";
  conn.query(sql,[start,end,kind],function(error,result,fields){
    if(error){
      console.log("error");
      console.log(error);
    }
    if(result && result.length>0){
      console.log(result);

      res.json(result);
    }
  })
});

router.get('/kind', function(req, res, next) {
  console.log("req");

  var sql="select * from kind order by Id asc";
  conn.query(sql,function(error,result,fields){
    if(error){
      console.log("error");
      console.log(error);
    }
    if(result){
      console.log(result);
      res.json(result);
    }
  })
});


router.get('/vote', function(req, res, next) {
  var vote=req.query.vote;
  var userId=req.query.userId;
  var storyId=req.query.storyId;
  var add=req.query.add;
  console.log(add);

  var sql="update story set vote=? where Id=?";
  conn.query(sql,[vote,storyId],function(error,result,fields){
    if(error){
      console.log("error");
      console.log(error);
    }
    if(result){
      if(result.affectedRows){

        if(add==1){
          var sql2="insert into vote(storyId,userId) values(?,?)";
          conn.query(sql2,[storyId,1],function(error,result,fields){
            if(error){
              console.log(error);
            }
            if(result){
              console.log(result);
              if(result.affectedRows>0){
                res.json({"statue":"1"});
              }
              else{
                res.json({"statue":"0"});
              }
            }
          })
        }
        else{
          var sql3="delete from vote where storyId=? and userId=?";
          conn.query(sql3,[storyId,1],function(error,result,fields){
            if(error){
              console.log("error");
              console.log(error);
            }
            if(result){
              console.log(result);
              if(result.affectedRows>0){
                res.json({"statue":"1"});
              }
              else{
                res.json({"statue":"0"});
              }
            }
          })
        }


      }
    }

  })

});

router.get('/collect', function(req, res, next) {
  var collect=req.query.collect;
  var userId=req.query.userId;
  var storyId=req.query.storyId;
  var add=req.query.add;
  console.log(add);

  var sql="update story set collect=? where Id=? and userId=?";
  conn.query(sql,[collect,storyId,1],function(error,result,fields){
    if(error){
      console.log("error");
      console.log(error);
    }
    if(result){
      if(result.affectedRows){

        if(add==1){
          var sql2="insert into collect(storyId,userId) values(?,?)";
          conn.query(sql2,[storyId,1],function(error,result,fields){
            if(error){
              console.log(error);
            }
            if(result){
              console.log(result);
              if(result.affectedRows){
                res.json({"statue":"1"});
              }
              else{
                res.json({"statue":"0"});
              }
            }
          })
        }
        else{
          var sql3="delete from collect where storyId=? and userId=?";
          conn.query(sql3,[storyId,1],function(error,result,fields){
            if(error){
              console.log("error");
              console.log(error);
            }
            if(result){
              console.log(result);
              if(result.affectedRows){
                res.json({"statue":"1"});
              }
              else{
                res.json({"statue":"0"});
              }
            }
          })
        }


      }
    }

  })

});

router.get("/comment",function(req,res,next){
  var storyId=req.query.storyId;
  comment(storyId,res);
});

router.get("/replay",function(req,res,next){
  var storyId=req.query.storyId;
  var param=req.query;
  var sql="insert into comment(userId,userName,storyId,comment,pid,date) values(?,?,?,?,?,?)";
  conn.query(sql,[1,"韩刚",param.storyId,param.comment,param.pid,new Date()],function(error,result,fields){
    if(error){
      console.log(error);
    }
    if(result){
      console.log(result);
      comment(storyId,res);

    }

  })
});

function comment(storyId,res){
  var sql="select * from comment where storyId=? and pid=0";
  conn.query(sql,[storyId],function(error,result,fields){
    if(error){
      console.log(error);
    }
    if(result && result.length>0){
      console.log(result);

      async.map(result,function(item, callback){
        var commentId=item.Id;
        var pid=item.Id;
        var sql1="select * from vote where userId=? and commentId=?";
        conn.query(sql1,[1,commentId],function(error,result,fields) {
          if (error) {
            console.log("error");
            console.log(error);
          }
          if (result && result.length > 0) {
            item.voteStatue = "like";
            console.log(item);

          }
          else {
            item.voteStatue = "";
            console.log(item);
          }

          var sql2="select * from comment where storyId=? and pid=?";
          conn.query(sql2,[storyId,pid],function(error,result,fields){
            if(error){
              console.log(error);
            }
            if(result && result.length>0){
              console.log(result);
              item.child=result;
            }
            callback(null,item);
          })
        });

      }, function(err,results) {
        console.log("======================");
        console.log(results);
        res.json(results);
      });

    }
    else{
      console.log("======================");
      res.json(result);
    }
  })
};

router.get('/cvote', function(req, res, next) {
  var vote=req.query.vote;
  var userId=req.query.userId;
  var commentId=req.query.commentId;
  var storyId=req.query.storyId;
  var add=req.query.add;
  console.log("add===============");
  console.log(add);

  var sql="update comment set vote=? where Id=?";
  conn.query(sql,[vote,commentId],function(error,result,fields){
    if(error){
      console.log("error");
      console.log(error);
    }
    if(result){
      if(result.affectedRows){

        if(add==1){
          var sql2="insert into vote(commentId,userId) values(?,?)";
          conn.query(sql2,[commentId,1],function(error,result,fields){
            if(error){
              console.log(error);
            }
            if(result){
              console.log(result);
              if(result.affectedRows>0){
                comment(storyId,res);
              }
              else{
                res.json({"statue":"0"});
              }
            }
          })
        }
        else{
          var sql3="delete from vote where commentId=? and userId=?";
          conn.query(sql3,[commentId,1],function(error,result,fields){
            if(error){
              console.log("error");
              console.log(error);
            }
            if(result){
              console.log(result);
              if(result.affectedRows>0){
                comment(storyId,res);
              }
              else{
                res.json({"statue":"0"});
              }
            }
          })
        }




      }
    }

  })

});
router.get("/myCollect",function(req,res,next){
  var userId=req.query.userId;
  var sql="select * from collect where userId=?";
  conn.query(sql,[userId],function(error,result,fields){
    if(error){
      console.log(error);
    }
    if(result && result.length>0){
      async.map(result,function(item,callback){
        var storyId=item.storyId;
        var sql="select * from story where Id=?";
        conn.query(sql,[storyId],function(error,result,fields){
          if(error){
            console.log(error);
          }
          if(result && result.length>0){
            item.story=result[0];
          }
          callback(null,item);

        })
      },function(error,results){
        if(error){
          console.log(error);
        }
        console.log(results);
        res.json(results);

      })


    }
  })
});

router.get("/zone",function(req,res,next){
  var userId=req.query.userId;
  var sql="select * from user where Id=?";
  var data={};
  conn.query(sql,[userId],function(error,result,fields){
    if(error){
      console.log(error);
    }
    if(result && result.length>0){
      data.zone=result[0];
      var sql="select * from collect where userId=? order by Id desc limit 1";
      conn.query(sql,[userId],function(error,result,fields) {
        if (error) {
          console.log(error);
        }
        data.collect={};
        if (result && result.length > 0) {
          console.log(result[0]);
          var storyId=result[0].storyId;
          var sql2="select * from story where Id=?";
          conn.query(sql2,[storyId],function(error,result,fields) {
            if (error) {
              console.log(error);
            }

            if (result && result.length > 0) {
              console.log(result[0]);
              data.collect = result[0];

            }
            res.json(data);

          })

        }

      })

    }
  })
});

router.get("/answer",function(req,res,next){
  answer(res);
});

router.get("/areplay",function(req,res,next){
  var storyId=req.query.storyId;
  var param=req.query;
  var sql="insert into answer(userId,userName,note,pid,questionId,date) values(?,?,?,?,?,?)";
  conn.query(sql,[1,"韩刚",param.note,param.pid,param.questionId,new Date()],function(error,result,fields){
    if(error){
      console.log(error);
    }
    if(result){
      console.log(result);
      answer(res);

    }

  })
});

function answer(res){
  var sql="select q.Id as qId,q.question as qQuestion,q.userId as qUser,q.userName as qUserName,q.date as qDate,s.* from question as q inner join story as s on q.storyId=s.Id";

  conn.query(sql,function(error,result,fields){
    if(error){
      console.log(error);
    }
    if(result && result.length>0){
      console.log("result==================");
      console.log(result);

      async.mapSeries(result,function(item, callback){
        //查询问题回答
        var questionId=item.qId;
        var sql1="select * from answer where questionId=?";
        conn.query(sql1,[questionId],function(error,result,fields) {
          if (error) {
            console.log(error);
          }
          item.answer=[];
          if (result && result.length > 0) {
            console.log("answer===============");
            console.log(result);
            //遍历回答查询回答赞
            async.mapSeries(result,function(it, callback){
              var answerId=it.Id;
              if(it.vote>0){
                //查询点赞中是否有自己
                var sql2="select * from vote where userId=? and answerId=?";
                conn.query(sql2,[1,answerId],function(error,result,fields) {
                  if (error) {
                    console.log("error");
                    console.log(error);
                  }
                  if (result && result.length > 0) {
                    console.log("vote===============");
                    console.log(result);
                    it.voteStatue = "like";
                    console.log(it);

                  }
                  else {
                    it.voteStatue = "";
                    console.log(it);

                  }
                  callback(null,it);
                });
              }
              else{
                callback(null,it);
              }
            },function(error, results){
              if (error){
                console.log(error);
              }
              item.answer=results;
              console.log("item===============");
              console.log(item);
              callback(null,item);
            });
          }
          else{
            callback(null,item);
          }
        });
      }, function(err,results) {
        if (error){
          console.log(error);
        }
        console.log("======================");
        console.log(results);
        res.json(results);
      });
    }
  })
};

router.get('/avote', function(req, res, next) {
  var vote=req.query.vote;
  var answerId=req.query.answerId;
  var add=req.query.add;
  console.log(req.query);
  console.log("add===============");
  console.log(add);

  var sql="update answer set vote=? where Id=?";
  conn.query(sql,[vote,answerId],function(error,result,fields){
    if(error){
      console.log("error");
      console.log(error);
    }
    if(result){
      if(result.affectedRows){

        if(add==1){
          var sql2="insert into vote(answerId,userId) values(?,?)";
          conn.query(sql2,[answerId,1],function(error,result,fields){
            if(error){
              console.log(error);
            }
            if(result){
              console.log(result);
              if(result.affectedRows>0){
                answer(res);
              }
              else{
                res.json({"statue":"0"});
              }
            }
          })
        }
        else{
          var sql3="delete from vote where answerId=? and userId=?";
          conn.query(sql3,[answerId,1],function(error,result,fields){
            if(error){
              console.log("error");
              console.log(error);
            }
            if(result){
              console.log(result);
              if(result.affectedRows>0){
                answer(res);
              }
              else{
                res.json({"statue":"0"});
              }
            }
          })
        }

      }
    }

  })

});


router.get("/test",function(req,res,next){

  var list=[{"a":"1"},{"a":"2"},{"a":"3"},{"a":"4"}];
  async.mapSeries(list,function(item,callback){
    var lis=[{"b":"1"},{"b":"2"},{"b":"3"},{"b":"4"}];

    async.mapSeries(lis,function(item,callback){

      console.log(item);
      var value=Number(item.b);
      value=value+1;
      console.log(value);
      if(value==5){

        item.c=value;
        callback(null,item);
      }
      else{
        callback(null,item);
      }


    },function(error,result){
      console.log("result1===============");
      item.result=result;
      console.log(item);

      callback(null,item);
    })

  },function(error,result){
    console.log("result2===============");
    console.log(result);
    res.json(result);
  })

});
router.get("/total",function(req,res,next){
    res.json({page:1});
})

router.get('/artical', function(req, res, next) {
  console.log("req");
  var storyId=req.query.storyId;
  var chapter=req.query.chapter;
  console.log(req.query);
  var data={};

  var sqls="select * from story where Id=?";
  conn.query(sqls,[storyId],function(error,result,fields) {
    if (error) {
      console.log("error");
      console.log(error);
    }
    if (result && result.length > 0) {
      console.log(result);
      data.story=result[0];
      var sql3="select * from vote where userId=? and storyId=?";
      conn.query(sql3,[1,storyId],function(error,result,fields){
        if(error){
          console.log("error");
          console.log(error);
        }
        if(result && result.length>0) {
          data.voteStatue = "1";
          console.log(data);

        }
        else{
          data.voteStatue = "0";
          console.log(data);
        }

        var sql4="select * from collect where userId=? and storyId=?";
        conn.query(sql4,[1,storyId],function(error,result,fields){
          if(error){
            console.log("error");
            console.log(error);
          }
          if(result && result.length>0) {
            data.collectStatue = "1";
            console.log(data);
            res.json(data);

          }
          else{
            data.collectStatue = "0";
            console.log(data);
            res.json(data);
          }

        })

      })
    }
    else{
      res.json(data);
    }
  })



});
module.exports = router;
