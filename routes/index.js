const express = require('express');
const router = express.Router();
const path=require('path');
const formidable=require('formidable');
const fs=require('fs');
const exec=require("exec");
const PdfReader=require('pdfreader');
const dircreate="./UploadedFiles";
if(!fs.existsSync(dircreate)) {
    fs.mkdirSync(dircreate)
}
const dir="./"+dircreate;
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/upload',(req,res)=>{
    const form=formidable.IncomingForm();
    form.parse(req);
    form.uploadDir=path.join(__dirname,"../UploadedFiles");
    form.on('file',(field,file)=>{
        // console.log(file)
        fs.rename(file.path,path.join(form.uploadDir,file.name), (err)=> {
            if(err) throw err;
            getFiles((err,data)=>{
                if(err) throw err;
                res.send({files:data})

            })

        })
    });

    form.on('error',(err)=>{
        console.log(err)
    });
    form.on('end',()=>{
        console.log("upload")

    })
})

router.get('/listFiles',(req,res)=>{
    console.log("here")
    getFiles((err,data)=>{
        if(err) throw err;
        res.render("List_Files",{files:data})

    })

})

router.post('/rename',(req,res)=>{
    const darta=formidable.IncomingForm();
    console.log(req.body)
    var ext=req.body.oldname.split('.');
    ext=ext[ext.length-1]
    const pathUrl=path.join(__dirname,"../UploadedFiles");
    fs.exists(pathUrl+"/"+req.body.oldname,(exit)=>{
        console.log(exit)
        if(exit) {
            fs.rename(pathUrl + "/" + req.body.oldname, pathUrl + "/" + req.body.newname + "." + ext, function (err, data) {
                if (err) throw err;
                // getFiles((err, data) => {
                //     if (err) throw err;
                //     res.render("List_Files", {files: data})
                // })
            })
        }
        getFiles((err, data) => {
            if (err) throw err;
            res.render("List_Files", {files: data})
        })
    })

})

router.post('/delete',(req,res)=> {
    const pathUrl = path.join(__dirname, "../UploadedFiles");
    fs.exists(pathUrl + "/" + req.body.deletefilename, (exit) => {
        console.log(exit)
        if (exit) {
            fs.unlink(pathUrl + "/" + req.body.deletefilename, (err, data) => {
                if (err) throw err;
            })
        }
        getFiles((err, data) => {
            if (err) throw err;
            res.render("List_Files", {files: data})
        })
    })
})
router.post("/attributes",(req,res)=>{
    console.log(req.body)
    const pathUrl=path.join(__dirname,"../UploadedFiles");
    fs.stat(pathUrl+"/"+req.body.fileName,(err,stats)=> {
        if(err) throw err
        var stats={
            size:stats.size/1024,
            createTime:stats.ctime.toString(),
            modifiedTime:stats.mtime.toString(),
            accessTime:stats.atime.toString(),
        }
        res.send(stats)

    })
})

function getFiles(cb){
    const dirpath=path.join(__dirname,"../UploadedFiles")
    fs.readdir(dirpath,(err,files)=>{
        if(err) throw err;
        cb(null,files)
    })}

module.exports = router;
