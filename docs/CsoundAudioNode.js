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
                case "GetScoreTimeResult":
                     // this.message_callback("[" + window.performance.now() + " Received GetScoreTimeResult with: " + data[1] + ".]\n");
                    this.resolveGetScoreTime(data[1]);
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
        this.StopPromise = null;
        this.CleanupPromise = null;
        this.GetScoreTimePromise = null;
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

    async Cleanup() {
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
    CompileCsd(filename) {
        this.port.postMessage(["CompileCsd", filename]);
    };
    compileCsd(filename) {
        this.compileCsd(filename);
    };
    async CompileCsdText(csd) {
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
    async CompileOrc(orc) {
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
    Destroy() {
        this.port.postMessage(["Destroy"]);
    };
    destroy() {
        this.Destroy();
    };
    EvalCode(code) {
        this.port.postMessage(["EvalCode", code]);
    };
    evalCode(code) {
        this.EvalCode(code);
    };
    Get0dBFS() {
        this.port.postMessage(["Get0dBFS"]);
    };
    get0dBFS() {
        this.Get0dBFS();
    }
    GetAPIVersion() {
        this.port.postMessage(["GetAPIVersion"]);
    };
    getAPIVersion() {
        this.GetAPIVersion();
    };
    GetControlChannel(name) {
        return this.port.postMessage(["GetControlChannel", name]);
    };
    getControlChannel(name) {
        return this.GetControlChannel(name);
    };
    GetCurrentTimeSamples() {
        this.port.postMessage(["GetCurrentTimeSamples"]);
    };
    getCurrentTimeSamples() {
        this.GetCurrentTimeSamples();
    };
    GetEnv(name) {
        this.port.postMessage(["GetEnv", name]);
    };
    getEnv(name) {
        this.GetEnv();
    };
    GetInputName() {
        this.port.postMessage(["GetInputName"]);
    };
    getInputName() {
        this.GetInputName();
    };
    GetKsmps() {
        this.port.postMessage(["GetKsmps"]);
    };
    getKsmps() {
        this.GetKsmps();
    };
    GetNchnls() {
        this.port.postMessage(["GetNchnls"]);
    };
    getNchnls() {
        this.GetNchnls();
    };
    GetNchnlsInput() {
        this.port.postMessage(["GetNchnlsInput"]);
    };
    getNchnlsInput() {
        this.GetNchnlsInput();
    };
    GetOutputName() {
        this.port.postMessage(["GetOutputName"]);
    };
    getOutputName() {
        this.GetOutputName();
    };
    GetScoreOffsetSeconds() {
        this.port.postMessage(["GetScoreOffsetSeconds"]);
    };
    getScoreOffsetSeconds() {
        this.GetScoreOffsetSeconds();
    };
    async GetScoreTime() {
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
    GetSr() {
        this.port.postMessage(["GetSr"]);
    };
    getSr() {
        this.GetSr();
    };
    GetStringChannel(name) {
        this.port.postMessage(["GetStringChannel", name]);
    };
    getStringChannel(name) {
        this.GetStringChannel();
    };
    GetVersion() {
        this.port.postMessage(["GetVersion"]);
    };
    getVersion() {
        this.GetVersion();
    };
    InputMessage(text) {
        this.port.postMessage(["InputMessage", text]);
    };
    inputMessage(text) {
        this.InputMessage(text);
    };
    IsPlaying() {
        this.port.postMessage(["IsPlaying"]);
    };
    isPlaying() {
        this.IsPlaying();
    };
    IsScorePending() {
        this.port.postMessage(["IsScorePending"]);
    };
    isScorePending() {
        this.IsScorePending();
    };
    KillInstance(p1, insname, mode, release) {
        this.port.postMessage(["KillInstance", p1, insname, mode, release]);
    };
    killInstance(p1, insname, mode, release) {
        this.KillInstance(p1, insname, mode, release);
    };
    Message(text) {
        this.port.postMessage(["Message", text]);
    };
    message(text) {
        this.Message(text);
    };
    Perform() {
        // this.message_callback("[" + window.performance.now() + " Perform.]\n");
        this.port.postMessage(["Perform"]);
    };
    perform() {
        this.Perform();
    };
    /**
     * Because AudioWorklet messages are asynchronous, a sequence 
     * of method calls cannot be guaranteed to execute in proper order. 
     * Hence, this helper.
     */
    PerformCsd(options, csd) {
        this.port.postMessage(["PerformCsd", options, csd]);
    }
    performCsd(options, csd) {
        this.PerformCsd(options, csd);
    };
    /**
     * Because AudioWorklet messages are asynchronous, a sequence 
     * of method calls cannot be guaranteed to execute in proper order. 
     * Hence, this helper.
     */
    PerformOrc(options, orc, sco) {
        this.port.postMessage(["PerformOrc", options, orc, sco]);
    };
    performOrc(options, orc, sco) {
        this.PerformOrc(options, orc, sco);
    };
    async ReadScore(score) {
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
    }
    async Reset() {
        // this.message_callback("[" + window.performance.now() + " Reset.]\n");
        let promise = new Promise((resolve, reject) => {
            // Not exactly intuitive!
            this.resolveReset = resolve;
            this.port.postMessage(["Reset"]);
        });
        await promise;
        // this.message_callback("[" + window.performance.now() + " Reset resolved.]\n");
    };
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
    RewindScore() {
        this.port.postMessage(["RewindScore"]);
    };
    SetControlChannel(name, value) {
        this.port.postMessage(["SetControlChannel", name, value]);
    };
    SetGlobalEnv(name, value) {
        this.port.postMessage(["SetGlobalEnv", name, value]);
    };
    SetInput(name) {
        this.input = name;
        this.port.postMessage(["SetInput", name]);
    };
    SetMessageCallback(message_callback_) {
        this.message_callback = message_callback_;
    }
    SetOption(option) {
        if (option.startsWith("-odac")) {
            this.output = option.substr(2);
        }
        if (option.startsWith("-iadc")) {
            this.input = option.substr(2);
        }
        this.port.postMessage(["SetOption", option]);
    };
    SetOutput(name, type, format) {
        this.output = name;
        this.port.postMessage(["SetOutput", name, type, format]);
    };
    SetScoreOffsetSeconds(seconds) {
        this.port.postMessage(["SetScoreOffsetSeconds", seconds]);
    };
    SetScorePending(is_pending) {
        this.port.postMessage(["SetScorePending", is_pending]);
    };
    SetStringChannel(name, value) {
        this.port.postMessage(["SetStringChannel", name, value]);
    };
    // Wiring into the Web Audio graph is up here in the upper half, 
    // wiring within Csound is down in the lower half.
    async Start() {
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
    async start() {
        this.Start();
    };
    async Stop() {
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
    TableGet(number, index) {
        this.port.postMessage(["TableGet", number, index]);
    };
    tableGet(number, index) {
        this.TableGet(number, index);
    };
    TableLength(number) {
        this.port.postMessage(["TableLength", number]);
    };
    tableLength(number) {
        this.TableLength(number);
    };
    TableSet(number, index, value) {
        this.port.postMessage(["TableSet", index, value]);
    };   
    tableSet(number, index, value) {
        this.TableSet(number, index, value);
    };
}




