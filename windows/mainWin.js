const {BrowserWindow,dialog} = require("electron");
const {promisify} =  require("util")
const path =  require("path")
const fs = require('fs');
const { ipcMain } = require("electron/main");
let mainWindow;
let  requested_data =null;
/**
 * Creates mainWindow to be shown
 *
 */

function createWindow(){
    mainWindow =  new BrowserWindow({
        height:1150,
        width:2000,
        resizable:false,
        webPreferences:{
            preload:path.join(__dirname,"../viewsScripts/preload.js"),
            nodeIntegration:true,
            contextIsolation:false,
            sandbox:false
        } 
    })
    let fpath =  path.join(__dirname,"../views/main.html");
    mainWindow.loadFile(fpath);

    if(process.env.NODE_ENV=="development"){
        mainWindow.webContents.openDevTools();
    }
    mainWindow.on("close",()=>{
        mainWindow =null
    })
    
}

/**
 * sends open-file event
 */
async function openFile(){
    try {
            let res = await dialog.showOpenDialog(mainWindow,{
            title:"chooose image",
            properties:["openFile"],
            filters:{
                filters: [
                      { name: 'Images', extensions: ['*'] },
                    ]
              }
            })
           if(res.canceled){
                    await  dialog.showMessageBox(mainWindow,{
                    message:"You cancelled the file you wanted to choose",
                })
           }else{
              let file = res.filePaths[0]
              mainWindow.webContents.send("open-file",file)
            }
      } catch (error) {
              console.log(error)
    }
}
/**
 * directory to store the metadata information
 */
async function saveToFile(){
    requestData();
    let res = await dialog.showSaveDialog(mainWindow,{
            title:"Your MetaData",
            defaultPath:path.join(__dirname,"../"),
            properties:["createDirectory"]
      })
      if(res.canceled){
            await  dialog.showMessageBox(mainWindow,{
            message:"You cancelled the file you wanted to choose",
      })
      }else{
            let path = res.filePath
            await  createFile(path,JSON.stringify(requested_data))
            requestData = null
    }
    
}
 
/**
 *  creates a file
 * @param {string} path 
 * @param {*} data 
 * 
 */
async function  createFile(path,data){
    await fs.writeFile(path,data, async(err)=>{
    if(err){
      await dialog.showMessageBox(mainWindow,"An error occured")
    }
  }) 

}
/**
 * request data from preload.js
 */
function requestData(){
    mainWindow.webContents.send("request-data","request-data")
    ipcMain.on("metadata",(e,args)=>{
        let data  =  JSON.parse(args);
        requested_data = data
    })
    
}


module.exports = {mainWindow,createWindow,openFile,saveToFile}