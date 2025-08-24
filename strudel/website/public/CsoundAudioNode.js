/**
 * C S O U N D
 *
 * L I C E N S E
 *
 * This software is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 *
 */
 
// import csound_audio_processor_module from 'CsoundAudioProcessor.js';

/**
 * Provides the Csound API as in csound_threaded.hpp, but implemented in 
 * WebAssembly. For a more complete description of what these functions 
 * do, see csound_threaded.hpp in the Csound GitHub repository, and of course 
 * the Csound API Reference. The semantics of all functions are virtually 
 * identical and the signatures are as equivalent as I could make them.
 * 
 * To conform with CsoundObj, method names in camel case are now primary, 
 * method names in initial caps defer to them.
 */
class CsoundAudioNode extends AudioWorkletNode {
    resolveCleanup(result) {
        return result;
    }
    resolveCompileCsdText(result) {
        this.message_callback("[" + window.performance.now() + " resolveCompileCsdText with: " + result + ", " + this + "]\n");
        return result;
    }
    resolveCompileOrc(result) {
        return result;
    }
    resolveGetControlChannel(result) {
        return result;
    }
    resolveGetFileData(result) {
        return result;
    }
    resolveReadScore(result) {
        return result;
    }
    resolveReset() {
        return;
    }
    resolveStop() {
        return;
    }
    async onMessage(event) {
            let data = event.data;
            switch(data[0]) {
                case "Message":
                    if (this.message_callback != null) {
                        this.message_callback(data[1]);
                    } else {
                        console.log(data[1]);
                    }
                    break;
                // Some Csound API calls should be serializable, i.e. 
                // synchronous. These cases resolve promises (above) from those calls.
                case "CleanupResult":
                    // this.message_callback("[" + window.performance.now() + " Received CleanupResult with: " + data[1] + ".]\n");
                    this.resolveCleanup(data[1]);
                    break;
                case "CompileOrcResult":
                    // this.message_callback("[" + window.performance.now() + " Received CompileOrcResult with: " + data[1] + ".]\n");
                    this.resolveCompileOrc(data[1]);
                    break;
                case "CompileCsdTextResult":
                    // this.message_callback("[" + window.performance.now() + " Received CompileCsdTextResult with: " + data[1] + ".]\n");
                    this.resolveCompileCsdText(data[1]);
                    break;
                case "GetControlChannelResult":
                     // this.message_callback("[" + window.performance.now() + " Received GetControlChannelResult with: " + data[1] + ".]\n");
                    this.resolveGetControlChannel(data[1]);
                    break;
                case "GetFileDataResult":
                    this.resolveGetFileData(data[1]);
                    break;
                case "GetScoreTimeResult":
                     // this.message_callback("[" + window.performance.now() + " Received GetScoreTimeResult with: " + data[1] + ".]\n");
                    this.resolveGetScoreTime(data[1]);
                    break;
                case "IsPlayingResult":
                    // this.message_callback("[" + window.performance.now() + " Received IsPlayingResult with: " + data[1] + ".]\n");
                    this.resolveIsPlaying(this.is_playing);
                    break;
                case "ReadScoreResult":
                    // this.message_callback("[" + window.performance.now() + " Received ReadScoreResult with: " + data[1] + ".]\n");
                    this.resolveReadScore(data[1]);
                    break;
                case "ResetResult":
                    // this.message_callback("[" + window.performance.now() + " Received ResetResult.]\n");
                    this.resolveReset();
                    break;
                case "StopResult":
                    // this.message_callback("[" + window.performance.now() + " Received StopResult.]\n");
                    this.resolveStop();
                    break;
            };
    };
    constructor(context, message_callback_, options) {
        options = options || {};
        options.numberOfInputs  = 1;
        options.numberOfOutputs = 1;
        options.outputChannelCount = [context.destination.channelCount];
        super(context, 'csound-audio-processor', options);
        this.message_callback = message_callback_;
        this.message_callback("CsoundAudioNode constructor...\n");
        this.reset_();
        this.CompileCsdTextPromise = null;
        this.CompileOrcPromise = null;
        this.IsPlayingPromise = null;
        this.StopPromise = null;
        this.CleanupPromise = null;
        this.GetFileDataPromise = null;
        this.GetScoreTimePromise = null;
        this.GetGetControlChannelPromise = null;
        this.ReadScorePromise = null;
        this.ResetPromise = null;
        this.port.onmessage = this.onMessage.bind(this);
        this.port.start();
    }
    reset_() {
        this.is_playing = false;
        this.is_realtime = false;
        this.userMediaAudioInputNode = null;
        this.input = null;
        this.output = null;
    }
    
    // NOTE: All class member function names, i.e. the actual Csound API, 
    // are declared and defined both in initial caps (as in C++), and in camel 
    // case (for compatibility with CsoundObj). If CsoundObj has a member 
    // function that is needed here and that has a different name, it should 
    // get an alias or an implementation here.

    async cleanup() {
        // this.message_callback("[" + window.performance.now() + " Cleanup.]\n");
        let promise = new Promise((resolve, reject) => {
            // Not exactly intuitive!
            this.resolveCleanup = resolve;
            this.port.postMessage(["Cleanup"]);
        });
        let result = await promise;
        // this.message_callback("[" + window.performance.now() + " Cleanup resolved with: " + result + ".]\n");
        return result;
    };
    async Cleanup() {
        await this.cleanup();
    };
    async compileCsd(filename) {
        this.port.postMessage(["CompileCsd", filename]);
    };
    async CompileCsd(filename) {
        await this.compileCsd(filename);
    };
    async compileCsdText(csd) {
        // this.message_callback("[" + window.performance.now() + " CompileCsdText.]\n");
        let promise = new Promise((resolve, reject) => {
            // Not exactly intuitive!
            this.resolveCompileCsdText = resolve;
            this.port.postMessage(["CompileCsdText", csd]);
        });
        let result = await promise;
        // this.message_callback("[" + window.performance.now() + " CompileCsdText resolved with: " + result + ".]\n");
        return result;
    };
    async CompileCsdText(csd) {
        return this.compileCsdText(csd);
    };
    async compileOrc(orc) {
        // this.message_callback("[" + window.performance.now() + " CompileOrc.]\n");
        let promise = new Promise((resolve, reject) => {
            // Not exactly intuitive!
            this.resolveCompileOrc = resolve;
            this.port.postMessage(["CompileOrc", orc]);
        });
        let result = await promise;
        // this.message_callback("[" + window.performance.now() + " CompileOrc resolved with: " + result + ".]\n");
        return result;
    };
    async CompileOrc(orc) {
        return await this.compileOrc(orc);
    };
    destroy() {
        this.port.postMessage(["Destroy"]);
    };
    Destroy() {
        this.destroy();
    };
    evalCode(code) {
        this.port.postMessage(["EvalCode", code]);
    };
    EvalCode(code) {
        this.evalCode(code);
    };
    get0dBFS() {
        this.port.postMessage(["Get0dBFS"]);
    };
    Get0dBFS() {
        this.get0dBFS();
    }
    getAPIVersion() {
        this.port.postMessage(["GetAPIVersion"]);
    };
    GetAPIVersion() {
        this.getAPIVersion();
    };
    async getControlChannel(name) {
        // this.message_callback("[" + window.performance.now() + " GetControlChannel.]\n");
        let promise = new Promise((resolve, reject) => {
            // Not exactly intuitive!
            this.resolveGetControlChannel = resolve;
            this.port.postMessage(["GetControlChannel", name]);
        });
        let result = await promise;
        // this.message_callback("[" + window.performance.now() + " GetControlChannel resolved with: " + result + ".]\n");
        return result;    
    };
    async GetControlChannel(name) {
        return this.getControlChannel(name);
    };
    async getFileData(filename) {
        // this.message_callback("[" + window.performance.now() + " GetControlChannel.]\n");
        let promise = new Promise((resolve, reject) => {
            // Not exactly intuitive!
            this.resolveGetFileData = resolve;
            this.port.postMessage(["GetFileData", filename]);
        });
        let result = await promise;
        // this.message_callback("[" + window.performance.now() + " GetControlChannel resolved with: " + result + ".]\n");
        return result;    
    };
    async GetFileData(name) {
        return this.getFileData(name);
    };
    getCurrentTimeSamples() {
        this.port.postMessage(["GetCurrentTimeSamples"]);
    };
    GetCurrentTimeSamples() {
        this.getCurrentTimeSamples();
    };
    getEnv(name) {
        this.port.postMessage(["GetEnv", name]);
    };
    GetEnv(name) {
        this.getEnv();
    };
    getInputName() {
        this.port.postMessage(["GetInputName"]);
    };
    GetInputName() {
        this.getInputName();
    };
    getKsmps() {
        this.port.postMessage(["GetKsmps"]);
    };
    GetKsmps() {
        this.getKsmps();
    };
    getNchnls() {
        this.port.postMessage(["GetNchnls"]);
    };
    GetNchnls() {
        this.getNchnls();
    };
    getNchnlsInput() {
        this.port.postMessage(["GetNchnlsInput"]);
    };
    GetNchnlsInput() {
        this.getNchnlsInput();
    };
    getOutputName() {
        this.port.postMessage(["GetOutputName"]);
    };
    GetOutputName() {
        this.getOutputName();
    };
    getScoreOffsetSeconds() {
        this.port.postMessage(["GetScoreOffsetSeconds"]);
    };
    GetScoreOffsetSeconds() {
        this.GetScoreOffsetSeconds();
    };
    async getScoreTime() {
        // this.message_callback("[" + window.performance.now() + " GetScoreTime.]\n");
        let promise = new Promise((resolve, reject) => {
            // Not exactly intuitive!
            this.resolveGetScoreTime = resolve;
            this.port.postMessage(["GetScoreTime"]);
        });
        let result = await promise;
        // this.message_callback("[" + window.performance.now() + " GetScoreTime resolved with: " + result + ".]\n");
        return result;
    };
    async GetScoreTime() {
        return await this.getScoreTime();
    };
    getSr() {
        this.port.postMessage(["GetSr"]);
    };
    GetSr() {
        this.getSr();
    };
    getStringChannel(name) {
        this.port.postMessage(["GetStringChannel", name]);
    };
    GetStringChannel(name) {
        this.getStringChannel();
    };
    getVersion() {
        this.port.postMessage(["GetVersion"]);
    };
    GetVersion() {
        this.getVersion();
    };
    inputMessage(text) {
        this.port.postMessage(["InputMessage", text]);
    };
    InputMessage(text) {
        this.inputMessage(text);
    };
    async isPlaying() {
        // this.message_callback("[" + window.performance.now() + " IsPlaying.]\n");
        let promise = new Promise((resolve, reject) => {
            // Not exactly intuitive!
            this.resolveIsPlaying = resolve;
            this.port.postMessage(["IsPlaying"]);
        });
        let result = await promise;
        // this.message_callback("[" + window.performance.now() + " IsPlaying resolved with: " + result + ".]\n");
        return result;
    };
    async IsPlaying() {
        return await this.isPlaying();
    };
    isScorePending() {
        this.port.postMessage(["IsScorePending"]);
    };
    IsScorePending() {
        this.isScorePending();
    };
    killInstance(p1, insname, mode, release) {
        this.port.postMessage(["KillInstance", p1, insname, mode, release]);
    };
    KillInstance(p1, insname, mode, release) {
        this.killInstance(p1, insname, mode, release);
    };
    message(text) {
        this.port.postMessage(["Message", text]);
    };
    Message(text) {
        this.message(text);
    };
    perform() {
        // this.message_callback("[" + window.performance.now() + " Perform.]\n");
        this.port.postMessage(["Perform"]);
    };
    Perform() {
        this.perform();
    };
    /**
     * Because AudioWorklet messages are asynchronous, a sequence 
     * of method calls cannot be guaranteed to execute in proper order. 
     * Hence, this helper.
     */
    performCsd(options, csd) {
        this.port.postMessage(["PerformCsd", options, csd]);
    }
    PerformCsd(options, csd) {
        this.performCsd(options, csd);
    };
    /**
     * Because AudioWorklet messages are asynchronous, a sequence 
     * of method calls cannot be guaranteed to execute in proper order. 
     * Hence, this helper.
     */
    performOrc(options, orc, sco) {
        this.port.postMessage(["PerformOrc", options, orc, sco]);
    };
    PerformOrc(options, orc, sco) {
        this.performOrc(options, orc, sco);
    };
    async readScore(score) {
        // this.message_callback("[" + window.performance.now() + " ReadScore.]\n");
        let promise = new Promise((resolve, reject) => {
            // Not exactly intuitive!
            this.resolveReadScore = resolve;
            this.port.postMessage(["ReadScore", score]);
        });
        let result = await promise;
        // this.message_callback("[" + window.performance.now() + " ReadScore resolved with: " + result + ".]\n");
        return result;
    };
    async ReadScore(score) {
        return await this.readScore(score);
    }
    async reset() {
        // this.message_callback("[" + window.performance.now() + " Reset.]\n");
        let promise = new Promise((resolve, reject) => {
            // Not exactly intuitive!
            this.resolveReset = resolve;
            this.port.postMessage(["Reset"]);
        });
        await promise;
        // this.message_callback("[" + window.performance.now() + " Reset resolved.]\n");
    };
    Reset() {
        this.reset();
    };
    rewindScore() {
        this.port.postMessage(["RewindScore"]);
    };
    RewindScore() {
        this.rewindScore();
    };
    setControlChannel(name, value) {
        this.port.postMessage(["SetControlChannel", name, value]);
    };
    SetControlChannel(name, value) {
        this.setControlChannel(name, value);
    };
    setGlobalEnv(name, value) {
        this.port.postMessage(["SetGlobalEnv", name, value]);
    };
    SetGlobalEnv(name, value) {
        this.setGlobalEnv(name, value);
    };
    setInput(name) {
        this.input = name;
        this.port.postMessage(["SetInput", name]);
    };
    SetInput(name) {
        this.setInput(name);
    };
    setMessageCallback(message_callback_) {
        this.message_callback = message_callback_;
    };
    SetMessageCallback(message_callback_) {
        this.setMessageCallback(message_callback_);
    };
    setOption(option) {
        if (option.startsWith("-odac")) {
            this.output = option.substr(2);
        }
        if (option.startsWith("-iadc")) {
            this.input = option.substr(2);
        }
        this.port.postMessage(["SetOption", option]);
    };
    SetOption(option) {
        this.setOption(option);
    };
    setOutput(name, type, format) {
        this.output = name;
        this.port.postMessage(["SetOutput", name, type, format]);
    };
    SetOutput(name, type, format) {
        this.setOutput(name, type, format);
    };
    SetScoreOffsetSeconds(seconds) {
        this.port.postMessage(["SetScoreOffsetSeconds", seconds]);
    };
    setScorePending(is_pending) {
        this.port.postMessage(["SetScorePending", is_pending]);
    };
    SetScorePending(is_pending) {
        this.setScorePending(is_pending);
    };
    setStringChannel(name, value) {
        this.port.postMessage(["SetStringChannel", name, value]);
    };
    SetStringChannel(name, value) {
        this.setStringChannel(name, value);
    };
    /**
     * Starts the Csound performance with or without any connection to the 
     * Web Audio signal flow graph. Such connections may be created in the 
     * usual manner for constructing Web Audio graphs, either before, or 
     * after, calling StartNode.
     */
    startNode() {
        // this.message_callback("[" + window.performance.now() + " StartNode.]\n");
        try {
            this.port.postMessage(["Start"]);
            this.is_playing = true;
            this.message_callback("is_playing...\n");
        } catch (e) {
            this.message_callback(e);
        }
    }
    startNode() {
        this.StartNode();
    }
    /**
     * First connects to the default WebAudio output and the WebAudio 
     * context's media source input, if it exists, and the MIDI input, 
     * if it exists, then starts the Csound performance. Wiring into the Web 
     * Audio graph is up here in the upper half, wiring within Csound is down 
     * in the lower half.
     */
    async start() {
        // this.message_callback("[" + window.performance.now() + " Start.]\n");
        try {
            let device_list = await navigator.mediaDevices.enumerateDevices();
            var message_callback_ = this.message_callback;
            var index = 0;
            var input_connected = false;
            var print_device = function(device) {
                message_callback_("mediaDevices: " + index + " " + device.kind + ": " + device.label + "\n");
                index++;
            };     
            device_list.forEach(print_device);
            this.message_callback("WebAudio frames per second:         " +  this.context.sampleRate + "\n");
            this.message_callback("WebAudio maximum output channels:   " +  this.context.destination.maxChannelCount + "\n");
            this.connect(this.context.destination);
            if (navigator.requestMIDIAccess) {
              let midi_access = await navigator.requestMIDIAccess({sysex:false});
              const inputs = midi_access.inputs.values();
              let thus = this;
              for (let entry of midi_access.inputs) {
                  const midi_input = entry[1];
                  message_callback_("MIDI port: type: " + midi_input.type + "  manufacturer: " + midi_input.manufacturer + " name: " + midi_input.name +
                      " version: " + midi_input.version + "\n");
                  // Using the MessagePort for this is probably not good enough.
                  midi_input.onmidimessage = function(event) {
                      console.log(event, event.data[0], event.data[1], event.data[2]);
                      thus.port.postMessage(["MidiEvent", event.data[0], event.data[1], event.data[2]]);
                  };
              }
              for (let entry of midi_access.outputs) {
                  var port_ = entry[1];
                  message_callback_( "MIDI port: type: " + port_.type + " manufacturer: " + port_.manufacturer + " name: " + port_.name +
                    " version: " + port_.version + "\n");
              }
            }
            // Try to obtain the Web browser audio input, if available.
            // Not to be confused with any other audio input interfaces on the 
            // computer, which are inputs in the device list above!
            try {
                this.message_callback("Trying to open browser audio input...\n")
                let stream = await navigator.mediaDevices.getUserMedia({audio: true});
                this.userMediaAudioInputNode = this.context.createMediaStreamSource(stream);
                this.message_callback("WebAudio UserMedia outputs:         " +  this.userMediaAudioInputNode.numberOfOutputs + "\n");
                this.userMediaAudioInputNode.connect(this);
                this.message_callback("Audio input initialized.\n");
            } catch (e) {
                this.message_callback(e + "\n");
            }
            this.port.postMessage(["Start"]);
            this.is_playing = true;
            this.message_callback("is_playing...\n");
        } catch (e) {
            this.message_callback(e);
        }
    }
    async Start() {
        await this.start();
    };
    async stop() {
        this.message_callback("[" + window.performance.now() + " Stop.]\n");
        let promise = new Promise((resolve, reject) => {
            // Not exactly intuitive!
            this.resolveStop = resolve;
            this.port.postMessage(["Stop"]);
            if (this.userMediaAudioInputNode !== null) {
                ///this.userMediaAudioInputNode.stop();
                this.userMediaAudioInputNode.disconnect(this);
            }
            this.disconnect();
            this.reset_();
        });
        await promise;
        this.message_callback("[" + window.performance.now() + " Stop resolved.]\n");
    };
    async Stop() {
        await this.stop();
    };
    tableGet(number, index) {
        this.port.postMessage(["TableGet", number, index]);
    };
    TableGet(number, index) {
        this.tableGet(number, index);
    };
    tableLength(number) {
        this.port.postMessage(["TableLength", number]);
    };
    TableLength(number) {
        this.tableLength(number);
    };
    tableSet(number, index, value) {
        this.port.postMessage(["TableSet", index, value]);
    };   
    TableSet(number, index, value) {
        this.tableSet(number, index, value);
    };
}




