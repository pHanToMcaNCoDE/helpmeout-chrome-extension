console.log("Injected")

var recorder = null
function onAccessApproved(stream){
    recorder = new MediaRecorder(stream);

    recorder.start();

    let recordBoard = document.createElement("div");

    recordBoard.style.width = "35.438rem";
    recordBoard.style.height = "6.375rem";
    recordBoard.style.backgroundColor = "#141414";
    recordBoard.style.backgroundColor = "#626262";


    recorder.onstop = function(){
        stream.getTracks().forEach(function(track){
            if(track.readyState === "live"){
                track.stop()
            }
        })
    }

    recorder.ondataavailable = function(event){
        let recordedBlob = event.data;
        let url = URL.createObjectURL(recordedBlob);
        console.log(recordedBlob)

        let a = document.createElement("a");

        a.style.display = "none"
        a.href = url;
        a.download = "screen-recording.webm"

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.action === "request_recording"){
        console.log("requesting recording")

        sendResponse(`processed: ${message.action}`);

        navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: {
                width: 9999999999,
                height: 999999999
            }
        }).then((stream) => {
            onAccessApproved(stream)
        })
    }

    if(message.action === "stopvideo"){
        console.log("stopping video")

        sendResponse(`processed: ${message.action}`);
        if(!recorder) return console.log("no recorder")

        recorder.stop();
    }
})