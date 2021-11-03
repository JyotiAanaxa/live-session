
const socket = io("/");
let myVideo = document.createElement("video");
myVideo.muted = true;
const videoGrid = document.getElementById("video-grid") 
let videoStream;

const peer = new Peer(undefined, {
    path: "/peerjs",
    host:"/",
    port: 3000
});


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
.then(stream => {
    videoStream = stream;
    addVideoStream(myVideo,videoStream)
    
    peer.on('call', (call) => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    });
    socket.on('user connected', (userid) => {
        connectNewUser(userid,videoStream)    
    })
})
.catch()
peer.on('open', (id) => {
    socket.emit('join-room',ROOM__ID,id)
})



const connectNewUser = (userid, videoStream) => {
    console.log('new user ',userid);
    const call = peer.call(userid,videoStream);
    const video = document.createElement("video");
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream  = (video,stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    }) 
    videoGrid.append(video)
}