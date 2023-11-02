
const {ipcRenderer}  =  require("electron")
const ExifReader = require('exifreader');
const jimp =  require("jimp")
const nodepath =  require("path")
let universal_data =[];

window.addEventListener("DOMContentLoaded",()=>{
    let selectedImage =  document.getElementById("image-upload");
    let imageKeeperSrc =  document.getElementById("uploaded-image")
    let metaData = document.getElementsByClassName("metadata-field")[0]
 


    selectedImage.addEventListener("change",()=>{
        let imageObj = selectedImage.files
        let file =  imageObj[0]
        let path = imageObj[0].path
        // let src =  window.URL.createObjectURL(imageObj);
        imageKeeperSrc.src = path
        setDataEmpty()
        getExif(file)
        styles(imageKeeperSrc)
            })
 
   imageKeeperSrc.addEventListener("dragover",(e)=>{
    e.preventDefault()
   })


    imageKeeperSrc.addEventListener("drop",(e)=>{
        e.preventDefault();
       
        let data = e.dataTransfer.files[0];
        if(data.type.startsWith("image")){
            setDataEmpty()
            getExif(data)
        }
        imageKeeperSrc.src = data.path
        styles(imageKeeperSrc)
        
    })


    ipcRenderer.on("open-file",(e,args)=>{
        imageKeeperSrc.src = args
        setDataEmpty()
        getExif(args)
        styles(imageKeeperSrc)
    })

    ipcRenderer.on("request-data",(e,args)=>{
        if(imageKeeperSrc.src){
            ipcRenderer.send("metadata",JSON.stringify(universal_data));
        }
    })
   
})

/**
 * gets exif data for image
 */
async function getExif(file){
let tags = await ExifReader.load(file);
let metaData = document.getElementsByClassName("metadata-field")[0]

tags = Object.entries(tags)

for (const [key,value] of tags ){
  
    universal_data.push( {[key]:value.description})
    writeExifToDom(metaData,key,value.description)
}


}

/**
 * writes data to html page
 * @param {HTMLElement} parent
 * @param {string} key 
 * @param {any} value 
 * 
 */
function writeExifToDom(parent,key,value){
    let label=  document.createElement("label")
    label.setAttribute("class","style-lable")
    let data  = `${key}: ${value}`
    label.innerText = `${data}`
    parent.appendChild(label)
   

}

/**
 * deals with javascript styles
 * @param {HTMLElement} imageKeeperSrc 
 */
function styles(imageKeeperSrc){
    imageKeeperSrc.style.padding=0
   imageKeeperSrc.style.height="500px"
}

/**
 * let universal array data to be empty 
 */
function setDataEmpty(){
    universal_data=[];
}