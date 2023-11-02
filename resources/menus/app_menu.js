const {app} =  require("electron")
const {openFile,saveToFile}    = require("../../windows/mainWin")
let isMac = process.platform=="darwin"

exports.menu =[

{
    label:app.name,
    submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },

        { role: 'quit' }
      ]
},{
    label:"File",
    submenu:[
      {
        label:"Open File",
        click:()=>openFile(),
        accelerator:`${isMac?"Command+N":"Ctrl+N"}`
      },{
        label:"save metadata to file",
        click:()=>saveToFile(),
        accelerator:`${isMac?"Command+S":"Ctrl+S"}`,
      }
    ],

}


]

