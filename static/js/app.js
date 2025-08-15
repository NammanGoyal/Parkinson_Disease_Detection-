//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream;                      //stream from getUserMedia()
var rec;                            //Recorder.js object
var input;                          //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

// Only add event listeners if buttons exist (for pages that don't have them)
if (recordButton && stopButton && pauseButton) {
    recordButton.addEventListener("click", startRecording);
    stopButton.addEventListener("click", stopRecording);
    pauseButton.addEventListener("click", pauseRecording);
}

var recordingTimer = null;
var recordingStartTime = null;
var isRecording = false;

function updateButtonStates(recording, paused) {
    if (!recordButton || !stopButton || !pauseButton) return;
    
    recordButton.disabled = recording;
    stopButton.disabled = !recording;
    pauseButton.disabled = !recording;
    
    if (recording && !paused) {
        recordButton.innerHTML = '<span>🎤</span> Recording...';
        recordButton.style.opacity = '0.6';
    } else {
        recordButton.innerHTML = '<span>🎤</span> Record';
        recordButton.style.opacity = '1';
    }
}

function startTimer() {
    recordingStartTime = Date.now();
    recordingTimer = setInterval(function() {
        if (!isRecording) {
            clearInterval(recordingTimer);
            return;
        }
        var elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
        var minutes = Math.floor(elapsed / 60);
        var seconds = elapsed % 60;
        var timeString = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
        
        // Update button text with timer
        if (recordButton) {
            recordButton.innerHTML = '<span>🔴</span> Recording: ' + timeString;
        }
    }, 1000);
}

function stopTimer() {
    if (recordingTimer) {
        clearInterval(recordingTimer);
        recordingTimer = null;
    }
}

function startRecording() {
    console.log("recordButton clicked");

    var constraints = { audio: true, video: false }

    updateButtonStates(true, false);
    isRecording = true;

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        audioContext = new AudioContext();

        gumStream = stream;
        input = audioContext.createMediaStreamSource(stream);

        rec = new Recorder(input, {numChannels: 1});

        //start the recording process
        rec.record();
        startTimer();

        console.log("Recording started");

        // Show visual feedback
        if (recordButton) {
            recordButton.classList.add('recording');
        }

    }).catch(function(err) {
        console.error("getUserMedia error:", err);
        
        // Show user-friendly error message
        var errorMsg = "Unable to access microphone. Please check your browser permissions and try again.";
        if (typeof showNotification === 'function') {
            showNotification(errorMsg, 'error');
        } else {
            alert("Microphone access denied. Please allow microphone access and try again.");
        }

        updateButtonStates(false, false);
        isRecording = false;
        stopTimer();
    });
}

function pauseRecording(){
    if (!rec) return;
    
    console.log("pauseButton clicked rec.recording=", rec.recording);
    
    if (rec.recording){
        //pause
        rec.stop();
        pauseButton.innerHTML = "▶️ Resume";
        isRecording = false;
        stopTimer();
        
        if (recordButton) {
            recordButton.innerHTML = '<span>⏸️</span> Paused';
        }
    } else {
        //resume
        rec.record();
        pauseButton.innerHTML = "⏸️ Pause";
        isRecording = true;
        recordingStartTime = Date.now() - (Date.now() - recordingStartTime); // Adjust start time
        startTimer();
        
        if (recordButton) {
            recordButton.innerHTML = '<span>🔴</span> Recording...';
        }
    }
}

function stopRecording() {
    console.log("stopButton clicked");

    if (!rec || !gumStream) return;

    updateButtonStates(false, false);
    isRecording = false;
    stopTimer();

    //reset button just in case the recording is stopped while paused
    if (pauseButton) {
        pauseButton.innerHTML = "⏸️ Pause";
    }

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
    
    // Remove recording class
    if (recordButton) {
        recordButton.classList.remove('recording');
    }
}

function createDownloadLink(blob) {
    var url = URL.createObjectURL(blob);
    var filename = new Date().toISOString().replace(/[:.]/g, '-') + ".wav";
    
    // Create a temporary link to download the file
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL after a delay
    setTimeout(function() {
        URL.revokeObjectURL(url);
    }, 100);
    
    // Show success message
    if (typeof showNotification === 'function') {
        showNotification('Recording saved! You can now upload it for analysis.', 'success');
    }
}

// Utility function for showing notifications (if not already defined)
if (typeof showNotification === 'undefined') {
    window.showNotification = function(message, type) {
        // Create notification element
        var notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#c0392b' : '#27ae60'};
            color: white;
            padding: 14px 20px;
            border-left: 4px solid ${type === 'error' ? '#e74c3c' : '#2ecc71'};
            box-shadow: 2px 3px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
            font-weight: 500;
            font-size: 0.95em;
        `;
        notification.textContent = message;
        
        // Add animation
        var style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(function() {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    };
}
