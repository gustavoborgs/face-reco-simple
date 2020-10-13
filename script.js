const video = document.getElementById('video')

const humor = { }

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}


const playerListener = video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    const log = Object.entries(detections[0].expressions)

    log.map((value) => {
      if(value[1] < 0.9) {
        return;
      }

      if(humor[value[0]]) {
        humor[value[0]] += 1;
      } else {
        humor[value[0]] = 1;
      }
    })
  
      if(document.getElementById("command").value == "finished") {
        try{
          $.post("save.php",
          {
            ghumor: humor,
          },
          function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
            //refresh page to stop process
            location.href="index.html";
          });
          alert("post called");
        } catch (error) {
          console.log(error);
        }
        
      }
      console.log(humor);
  }, 100)

})
