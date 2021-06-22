const url = "http://localhost:9000"
const socket = io(url)
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const roomName = $("#room-name");

const call = $("#call")
const localVideo = $("#local-video");
const peerVideo = $("#peer-video");
let localStream;
let creator = false
let rtc;
let roomValue;
var constraints = window.constraints = {audio: false,video: true};
// Contains the stun server URL we will be using.
let iceServers = {
  mandatory: {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
  },
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};




call.addEventListener("click",()=>{
  roomValue = roomName.value
  if(roomValue == ""){
    alert("Room Name can't be empety")
  }else{
  call.style ="display:none"
    roomName.setAttribute("readOnly",true);
    socket.emit("join",roomValue)
  }
})





socket.on("created",async ()=>{
    creator = true
     console.log("created")
   //  try{
 
   //   const stream = await navigator.mediaDevices.getUserMedia(constraints)

   //    stream.onremovetrack = ()=>{ 
   //       console.log("Tracked Removed")
   //    }

   //    localVideo.srcObject = stream
   //    localStream = stream

   //    localVideo.onloadedmetadata = function (e) {
   //      localVideo.play();
   //    }
      
   // }catch(err){
   //    console.log("RTC error :",err)
   // }

  


   /**  navigator.getUserMedia()**/ 
    
   // navigator.getUserMedia(constraints,stream=>{
   //   localVideo.srcObject = stream
   //   localVideo.onloadedmetadata = ()=>localVideo.play();
   //   localStream = stream
   // },err=> alert("created :",err))


  
  /**  navigator.mediaDevices.getUserMedia()**/ 
   
  navigator.mediaDevices.getUserMedia(constraints)
  .then(stream=>{
    localVideo.srcObject = stream
    localStream = stream
  })
  .catch(err=> alert("Created",err))


})

socket.on("joined",async ()=>{
     creator=false
     console.log("Joined")

     //  try{
     //      const stream = await navigator.mediaDevices.getUserMedia(constraints)
        

     //      localVideo.srcObject = stream
     //      localStream = stream
          
     //      localVideo.onloadedmetadata = function (e) {
     //        localVideo.play();
     //      };

     //      socket.emit("ready",roomValue)
       
     // }catch(err){ 
     //      console.log(err)
     // }
  



        /**  navigator.getUserMedia()**/ 

     // navigator.getUserMedia(constraints,stream=>{
     //   localVideo.srcObject = stream
     //   localVideo.onloadedmetadata = (e)=> localVideo.play();
     //   localStream = stream
     //   window.stream = stream
     //   socket.emit("ready",roomValue)
     // },()=> alert("Joined :",err))



  /**  navigator.mediaDevices.getUserMedia()**/ 

  navigator.mediaDevices.getUserMedia(constraints)
  .then(stream=>{
    localVideo.srcObject = stream
    localStream = stream

    socket.emit("ready", roomValue);
  })
  .catch(err=> alert("Created",err))

})



socket.on("full",(room)=>{
  console.log(room)
  alert(`${room} room is full`)
})






socket.on("ready",(roomName)=>{
   console.log("ready")
  if(creator){
    rtc = new RTCPeerConnection(iceServers)
    rtc.onicecandidate = onicecandidateFunction
    rtc.ontrack = ontrackFunction 
    console.log(localStream.getTracks[0],localStream)
    console.log(localStream.getTracks[1],localStream)

    rtc.addTrack(localStream.getTracks[0],localStream) //video
    rtc.addTrack(localStream.getTracks[1],localStream) //audio
    
    // Create Offer
    rtc.createOffer().then((offer)=>{
      rtc.setLocalDescription(offer)
      socket.emit("offer",offer,roomValue)
    }).catch((err)=> alert("createOffer : ",err))
  }
})


socket.on("candidate",(candidate)=>{
  console.log("candidate : ",candidate)
  let icecandidate = new RTCIceCandidate(candidate)
  rtc.addIceCandidate(icecandidate)
})


socket.on("offer",(offer)=>{
  if(!creator){
    rtc = new RTCPeerConnection(iceServers)
    rtc.onicecandidate = onicecandidateFunction
    rtc.ontrack = ontrackFunction


    rtc.addTrack(localStream.getTracks[0],localStream)
    rtc.addTrack(localStream.getTracks[1],localStream)

    rtc.setRemoteDescription(offer)

    rtc.createAnswer().then((answer)=>{
      rtc.setLocalDescription(answer);
      socket.emit("answer",answer,roomValue)
    }).catch(err=>alert("createAnswer :",err))
  }
})
socket.on("answer",(answer)=>{
  rtc.setRemoteDescription(answer)
})

const onicecandidateFunction = (event)=>{
  console.log("onicecandidateFunction :" ,event)
  if(event.candidate){
    socket.emit("candidate",event.candidate,roomValue)
  }
}

const ontrackFunction = (event)=>{
  peerVideo.srcObject = event.streams[0];
  peerVideo.onloadedmetadata = ()=>{
    peerVideo.play();
  }
}




$("#leave").addEventListener("click",()=>{
   localVideo.pause();
   localVideo.src = "";
   localStream.getTracks()[0].stop();
   console.log("Video Off");
})





//   const loc = window.location.href
//   const url = new URL(loc);
//   const username = url.searchParams.get("name")

//    if(loc.split("=")[1] === ""){
//      window.location = "http://localhost:9000/login.html"
//    }


//   var connected_user,localstream,rtc;




//   conswindow.createObjectURL(tcwindow.reat)eObjectURL( $ = d)ocument.querySelector.bind(document)
//   const $$ = document.querySelectorAll.bind(document)
//   const socket = new WebSocket("ws://localhost:9000");
    

//   socket.onopen = ()=>{
//     // Console.log in server side status
//     send({type:"status",status:"socket connection estableshed  - This is from frontend"})
//   }

 
//   setTimeout(function () {
//       if (socket.readyState === 1) {
//           if (username != null) {
//               name = username;
//               if (name.length > 0) {
//                   send({
//                       type: "login",
//                       nawindow.createObjectURL(stream): name
//                   })
//               }
//           }
//       } else {
//           console.log("Connection has not stublished");
//       }
//   }, 3000)


//   socket.onclose = (event)=>{
//     if(event.wasClean){
//       console.log("event clear : socket.onclose")
//       send({status:"socket events are clear : socket.onclose"})
//     }else{
//       console.log("connection died socket.onclose")
//       send({status:"socket events are clear : socket.onclose"})
//     }
//    }


//    socket.onmessage = (msg)=>{
//      const data = JSON.parse(msg.data)
//      console.log(data)
//      switch(data.type){
//       case "login":
//         loginProcess(data.sucess)
//         break;
//       case "offer":
//        offerProcess(data.offer,data.name)
//        break;
//       case "status":
//        console.log(data.status)
//        break;
//       default:
//         console.log("INVALID COMMAND");
//        break;
//      }
//    }

  
//   // Set Input Value of callee for connected user
//   $("#call").addEventListener("click",()=>{
      
//       let call_to_username = $("#calleeId").value;
//       if(call_to_username.length >0){
//         connected_user = call_to_username;

//         rtc.createOffer((offer)=>{
//           console.log("offer",offer)
//            send({
//              type:"offer",
//              offer:offer
//            })

//           rtc.setLocalDescription(offer)
//         },(err)=>{
//           alert(`Offer is not created ${JSON.stringify(err)}`)
//         })
//       }
//   })

  
  
  


//   // let media ={devices:navigator.getUserMedia ||  navigator.webkitGetUserMedia || navigator.mozGetUserMedia}

//   const loginProcess = async () => {

//     console.log("start call!!!")
    

//     var constraints = window.constraints = {
//       audio: false,
//       video: true
//     };
   
//     try{
//       const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
//       var videoTracks = stream.getVideoTracks();
      
//       stream.onremovetrack = ()=>{ 
//         console.log("Tracked Removed")
//       }


//       window.stream = stream
//       localstream = stream
//       $$(".video")[0].srcObject = stream;
      

//       // RTC Object Create


//       const configurations = {
//         "iceServers":[{
//           "url":"stun:stun2.1.google.com:19302"
//         }]
//       }

//       rtc = new webkitRTCPeerConnection(configurations,{
//         optional:[{RTPDatacChannels:true}]
//       })       
     
//       rtc.addStream(stream)


//     }catch(err){
//       console.log(err) 
//     }


//   }


// function offerProcess(offer,name){
//   connected_user = name
//   rtc.setRemoteDescription(new RTCSessionDescription(offer))

//   alert(name)

// }



//  function send(message){
//   if(connected_user){
//     message.name = connected_user;
//   }
//   socket.send(JSON.stringify(message))
//  }





// const videoOff = async ()=>{
//   $$(".video")[0].pause();
//   $$(".video")[0].src = "";
//   localstream.getTracks()[0].stop();
//   console.log("Video Off");
// }

// $("#leave").addEventListener("click",videoOff);











// $(document).ready(function(){
//   $('button.mode-switch').click(function(){
//     $('body').toggleClass('dark');
//   });
  
//   $(".btn-close-right").click(function () {
//     $(".right-side").removeClass("show");
//     $(".expand-btn").addClass("show");
//   });
  
//   $(".expand-btn").click(function () {
//     $(".right-side").addClass("show");
//     $(this).removeClass("show");
//   });
// });