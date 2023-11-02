
const {createWindow} = require("./windows/mainWin")
const {app,BrowserWindow, ipcMain, Menu} =  require("electron")
const {menu }=  require("./resources/menus/app_menu")
// call app when ready
app.on("ready",()=>{
    createWindow()

   let appMenu =  Menu.buildFromTemplate(menu)
   Menu.setApplicationMenu(appMenu)
    // for mac
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
      })
      
      
})


app.on("window-all-closed",()=>{
    if(process.platform!=="darwin")app.quit();
})

