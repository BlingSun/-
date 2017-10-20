/**
 * Created by SDH on 2017/9/22.
 */
var express = require('express');
var router = express.Router();
var http=require("http");
var mysql=require("mysql");
var async=require("async");
var conn=mysql.createConnection({

    host:"localhost",
    user:"root",
    password:"root",
    database:"dialogPlate"
});

conn.connect();
var storyId=0;

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get("/answer",function(req,res,next){
    storyId=req.query.storyId;
    console.log(storyId);
    answer(storyId,res);
});

router.get("/areplay",function(req,res,next){
    var param=req.query;
    var sql="insert into answer(userId,userName,note,pid,questionId,date) values(?,?,?,?,?,?)";
    conn.query(sql,[1,"韩刚",param.note,param.pid,param.questionId,new Date()],function(error,result,fields){
        if(error){
            console.log(error);
        }
        if(result){
            console.log(result);
            answer(storyId,res);

        }

    })
});

function answer(storyId,res){

    var sql="select * from question where storyId=?";

    conn.query(sql,[storyId],function(error,result,fields){
        if(error){
            console.log(error);
        }
        if(result && result.length>0){
            console.log("result==================");
            console.log(result);

            async.mapSeries(result,function(item, callback){
                //查询问题回答
                var questionId=item.Id;
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
                                answer(storyId,res);
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
                                answer(storyId,res);
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

router.get('/code',function(req,res,next){
    http.request('https://api.weixin.qq.com/sns/jscode2session?appid="wxd084961615f6cf72"&secret="wxd084961615f6cf72"&js_code=JSCODE&grant_type=authorization_code',function(res){
            // 不断更新数据
            var body = '';
            response.on('data', function(data) {
                body += data;
            });

            response.on('end', function() {
                // 数据接收完成
                console.log("body==============");
                console.log(body);
            });
        }

    )

})

module.exports=router;