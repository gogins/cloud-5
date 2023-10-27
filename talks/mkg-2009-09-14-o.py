#!/usr/bin/python
'''
A   S I L E N C E   C O M P O S I T I O N
Copyright (C) 2009 by Michael Gogins.
All rights reserved.

This file serves as a template for Csound compositions,
and is intended to speed up and simplify the music production 
workflow as much as possible. 

A studio quality, general-purpose Csound orchestra with a multi-buss
mixer and mastering effects is embedded in this file, 
and can of course be extended and/or customized.

This file should contain and archive all materials required
to realize a composition, with the exception of binaries 
(Csound, external plugins) and external source material
(audio samples, SoundFonts, external MIDI or MusicXML files).

In general, new compositions will be created by using the 
previous composition as a template, replacing the bodies 
of the CsoundComposition.createMusicModel() and 
CsoundComposition.createCsoundArrangement() functions,
and modifying the CsoundComposition.createCsoundOrchestra
function.

The execution of this file is controlled by the 
CsoundComposition.renderingMode field:

  'score':   There is no waveform audio output. The generated score, 
             which is always saved as a MIDI file, is loaded into 
             a notation program or MIDI file player for rapid preview.
             This is the quickest way to get a preview of the piece.
  'audio':   The score will be rendered to the real-time audio output (dac),
             44,100 Hz stereo float samples, at 100 ksmps.
  'preview:' The master output soundfile will be CD audio quality,
             44,100 Hz stereo float samples, at 100 ksmps (this is the default).
  'cd':      The master output soundfile will be CD audio quality,
             44,100 Hz stereo float samples, at 1 ksmps.
  'master':  The master output soundfile will be high-resolution audio,
             88,200 Hz stereo float samples, at 1 ksmps.
  'virtual': The orchestra only will render to the real-time audio output,
             using a virtual MIDI keyboard for interactive instrument testing.
  'midi':    The orchestra only will render to the real-time audio output,
             using an actual MIDI keyboard for interactive instrument testing.

For the 'preview', 'cd,' and 'master' modes, the following additional
processing is automatically performed:

  (1) The initial output soundfile is normalized to -3 dBFS.
  (2) The normalized output soundfile is converted to a CD audio track 
      (44,100 Hz, stereo, 16 bit samples), with ID tags.
  (3) The normalized output soundfile is converted to an MP3 soundfile,
      with ID tags.
  (4) If in addition the CsoundComposition.playback field is True, 
      the normalized output soundfile is opened in an external editor for audition
      and/or additional processing.

'''
print (__doc__)
print ('IMPORTING REQUIRED MODULES...')
print
#import csnd
import CsoundAC
import datetime
import math
import numpy
import os
try:
    import psyco
    psyco.full()
    print ('Using psyco.')
    print
except:
    print ('Psyco not available.')
    print
import random
import signal
import string
import subprocess
import sys
import time
import traceback

class CsoundComposition(object):
    def __init__(self):
        # Set "renderingMode" to:  "cd", "preview" (default), "master", "test" (virtual keyboard orc test) or "audio".
        # Set "playback" to:       True (default) or False.
        self.renderingMode = 'preview'
        self.playback = True
        if os.name == 'posix':
            self.dacName = 'dac'
        else:
            self.dacName = 'dac'
    def createGlobalObjects(self):
        print ('CREATING GLOBAL OBJECTS...')
        print
        self.model = CsoundAC.MusicModel()
        self.csound = self.model.getCppSound()
        self.csound.setPythonMessageCallback()  
        self.score = self.model.getScore()
    def createFilenames(self):
        print ('CREATING FILENAMES...')
        print
        self.composer = 'Michael_Gogins'
        print ('Composer:                %s' % self.composer)
        self.began = time.clock()
        self.timestamp = datetime.datetime.now()
        print ('Timestamp:               %s' % self.timestamp)
        self.scriptPathname = os.path.realpath(sys.argv[0])
        print ('Full script pathname:    %s' % self.scriptPathname)
        self.title, self.ext = os.path.splitext(os.path.basename(self.scriptPathname))
        print ('Title:                   %s' % self.title)
        self.copyright = 'Copr._%d_%s' % (self.timestamp.year, self.composer)
        print ('Copyright:               %s' % self.copyright)
        self.directory = os.path.dirname(self.scriptPathname)
        if len(self.directory):
            os.chdir(self.directory)
        print ('Working directory:       %s' % self.directory)
        self.orcFilename = self.scriptPathname + '.orc'
        print ('Csound orchestra:        %s' % self.orcFilename)
        self.scoFilename =  self.scriptPathname + '.sco'
        print ('Csound score:            %s' % self.scoFilename)
        self.midiFilename =  self.scriptPathname + '.mid'
        print ('MIDI file:               %s' % self.midiFilename)
        self.xmlFilename =  self.scriptPathname + '.xml'
        print ('MusicXML2 file:          %s' % self.xmlFilename)
        self.csoundOutputSoundfile = self.scriptPathname + '.output.wav'
        print ('Output soundfile:        %s' % self.csoundOutputSoundfile)
        self.rescaledSoundfile =  self.scriptPathname + '.wav'
        print ('Rescaled soundfile:      %s' % self.rescaledSoundfile)
        self.cdTrackSoundfile =  self.scriptPathname + '.cd.wav'
        print ('CD track soundfile:      %s' % self.cdTrackSoundfile)
        self.mp3Soundfile =  self.scriptPathname + '.mp3'
        print ('MP3 soundfile:           %s' % self.mp3Soundfile)
        print ('Audio output name:       %s' % self.dacName)
        self.createCsoundCommands()
        if os.name == 'posix':
            self.soundfileScaler = '/home/mkg/csound5/scale'
            self.formatConverter = '/usr/bin/sndfile-convert'
            self.mp3encoder = '/usr/bin/lame'
            self.soundfilePlayer = '/usr/bin/sweep'
        elif os.name == 'nt':
            self.soundfileScaler = r'scale'
            self.formatConverter = r'D:/utah/opt/Mega-Nerd/libsndfile/sndfile-convert'
            self.mp3encoder = r'D:/utah/opt/lame/lame'
            self.soundfilePlayer = r'audacity'
        self.rescalerCommand = r'%s -P 75 -o %s %s' % (self.soundfileScaler, self.rescaledSoundfile, self.csoundOutputSoundfile)
        print ('Rescaler command:        %s' % self.rescalerCommand)
        self.cdTrackCommand = r'%s -pcm16 %s %s' % (self.formatConverter, self.rescaledSoundfile, self.cdTrackSoundfile)
        print ('CD track command:        %s' % self.cdTrackCommand)
        self.encoderCommand = r'%s -b 192 --tt %s --ta %s --tc %s %s %s' % (self.mp3encoder, self.title, self.composer, self.copyright, self.cdTrackSoundfile, self.mp3Soundfile)
        print ('Encoder command:         %s' % self.encoderCommand)
        self.playerCommand = r'%s %s' % (self.soundfilePlayer, self.rescaledSoundfile)
        print ('Player command:          %s' % self.playerCommand)
        print
    def createCsoundCommands(self):
        self.commandsForRendering = {
            'preview':  r'csound -g -m255 -W -f -R -K -r 44100 -k 441   --midi-key=4 --midi-velocity=5 -+id_artist=%s -+id_copyright=Copyright_2007_by_%s -+id_title=%s -o %s %s %s' % (self.composer, self.composer, self.title, self.csoundOutputSoundfile, self.orcFilename, self.scoFilename),
            'cd':       r'csound -g -m255 -W -f -R -K -r 44100 -k 44100 --midi-key=4 --midi-velocity=5 -+id_artist=%s -+id_copyright=Copyright_2007_by_%s -+id_title=%s -o %s %s %s' % (self.composer, self.composer, self.title, self.csoundOutputSoundfile, self.orcFilename, self.scoFilename),
            'master':   r'csound -g -m255 -W -f -R -K -r 88200 -k 88200 --midi-key=4 --midi-velocity=5 -+id_artist=%s -+id_copyright=Copyright_2007_by_%s -+id_title=%s -o %s %s %s' % (self.composer, self.composer, self.title, self.csoundOutputSoundfile, self.orcFilename, self.scoFilename),
            'audio':    r'csound -g -m255 -h -r 44100 -k 100 --midi-key=4 --midi-velocity=5 -o %s %s %s' % (self.dacName, self.orcFilename, self.scoFilename),           'score':    r'',
            'virtual':  r'csound -g -m255 -h -r 44100 -k 441 --midi-key=4 --midi-velocity=5 -+rtmidi=virtual -M0 -o %s %s %s' % (self.dacName, self.orcFilename, self.scoFilename),
            'midi':     r'csound -g -m255 -h -r 44100 -k 100 --midi-key=4 --midi-velocity=5 -M0 -o %s %s %s' % (self.dacName, self.orcFilename, self.scoFilename)
        }    
        self.csoundCommand = self.commandsForRendering[self.renderingMode]
        print ('Csound command line:     %s' % self.csoundCommand)
        print
    def renderCsound(self):
        self.model.setCsoundCommand(self.csoundCommand)
        self.createMusicModel()
        self.model.generate()
        self.createScore()
        self.ended = time.clock()
        self.elapsed = self.ended - self.began
        print ('Finished generating at               %s' % time.strftime('%Y-%b-%d %A %H:%M:%S'))
        print ('Elapsed time:                        %-9.2f seconds.' % self.elapsed)
        self.csound.perform()
        print
        self.ended = time.clock()
        self.elapsed = self.ended - self.began
        print ('Finished rendering at                %s' % time.strftime('%Y-%b-%d %A %H:%M:%S'))
        print ('Elapsed time:                        %-9.2f seconds.' % self.elapsed)
        print
        if self.renderingMode == 'audio':
            exit(0)
        self.normalizeOutputSoundfile()
        self.createCdAudioTrack()
        self.createMp3Soundfile()
        if self.playback == True:
            self.openOutputSoundfile()
    def renderMidiScore(self):
        print ('GENERATING MIDI SCORE FOR PREVIEW...')
        print
        self.createMusicModel()
        self.model.generate()
        self.createScore()
        self.ended = time.clock()
        self.elapsed = self.ended - self.began
        print ('Finished generating at               %s' % time.strftime('%Y-%b-%d %A %H:%M:%S'))
        print ('Elapsed time:                        %-9.2f seconds.' % self.elapsed)
        self.ended = time.clock()
        self.elapsed = self.ended - self.began
        print ('Finished rendering at                %s' % time.strftime('%Y-%b-%d %A %H:%M:%S'))
        print ('Elapsed time:                        %-9.2f seconds.' % self.elapsed)
        print
        exit()
    def renderMidiVirtualTest(self):
        self.createScore()
        print ('PLAY VIRTUAL KEYBOARD FOR CSOUND ORCHESTRA TEST...')
        print
        self.csound.perform()
        exit()
    def renderMidiActualTest(self):
        self.createScore()
        print ('PLAY ACTUAL MIDI KEYBOARD FOR CSOUND ORCHESTRA TEST...')
        print
        self.csound.perform()
        exit()
    def createScore(self):
        print ('CREATING SCORE...')
        print
        self.createCsoundOrchestra()
        self.createCsoundArrangement()
        self.model.createCsoundScore()
        print
        print ('Saving MIDI file %s...' % self.midiFilename)
        print
        self.score.save(self.midiFilename)
        print
    def normalizeOutputSoundfile(self):
        print ('NORMALIZING OUTPUT SOUNDFILE...')
        print
        try:
            status = subprocess.call(self.rescalerCommand, shell=True)
            os.remove(self.csoundOutputSoundfile)
        except:
            traceback.print_exc()
        print
    def createCdAudioTrack(self):
        print ('PREPARING CD-AUDIO TRACK...')
        print
        try:
            status = subprocess.call(self.cdTrackCommand, shell=True)
        except:
            traceback.print_exc()
        print
    def createMp3Soundfile(self):
        print ('ENCODING TO MP3...')
        print
        try:
            status = subprocess.call(self.encoderCommand, shell=True)
        except:
            traceback.print_exc()
        print
    def openOutputSoundfile(self):
        print ('OPENING OUTPUT SOUNDFILE...')
        print
        try:
            popen = subprocess.call(self.playerCommand, shell=True)
        except:
            traceback.print_exc()
        print
    def render(self):
        print ('RENDERING OPTIONS...')
        print
        print ('Rendering mode:          %s' % self.renderingMode)
        print ('Playback:                %s' % self.playback)
        print
        self.createGlobalObjects()
        self.createFilenames()
        self.createCsoundCommands()
        if   self.renderingMode == 'score':
            self.renderMidiScore()
        elif self.renderingMode == 'virtual':
            self.renderMidiVirtualTest()
        elif self.renderingMode == 'midi':
            self.renderMidiActualTest()
        else:
            self.renderCsound()
    def createCsoundOrchestra(self):
        print ('CREATING CSOUND ORCHESTRA...')
        print
        self.csoundOrchestra = \
'''
<CsoundSynthesizer>
<CsOptions>
csound -f -h -M0 -g -m99 --midi-key=4 --midi-velocity=5 -odac4 temp.orc temp.sco
</CsOptions>
<CsInstruments>
                        sr                      =           44100
                        ksmps                   =           441
                        nchnls                  =           2
                        0dbfs                   =           40000

                                                ; Source                        Outlet      Sink            Inlet
                                    
                        connect                 "Gogins_Waveshaping_Drone",     "left",     "BigReverb",    "left"
                        connect                 "Gogins_Waveshaping_Drone",     "right",    "BigReverb",    "right"
                        connect                 "Bergeman_Phasing_Sines",       "left",     "Master",       "left"
                        connect                 "Bergeman_Phasing_Sines",       "right",    "Master",       "right"
                        connect                 "Gogins_Waveshaping_Drone_1",   "left",     "BigReverb",    "left"
                        connect                 "Gogins_Waveshaping_Drone_1",   "right",    "BigReverb",    "right"
                        connect                 "Bergeman_Phasing_Sines_1",     "left",     "Master",       "left"
                        connect                 "Bergeman_Phasing_Sines_1",     "right",    "Master",       "right"
                        connect                 "Kung_Chorusing_FM",            "left",     "Master",       "left"
                        connect                 "Kung_Chorusing_FM",            "right",    "Master",       "right"
                        connect                 "Nelson_Melody",                "left",     "Master",       "left"
                        connect                 "Nelson_Melody",                "right",    "Master",       "right"
                        connect                 "Mikelson_Tone_Wheel_Organ",    "left",     "Master",       "left"
                        connect                 "Mikelson_Tone_Wheel_Organ",    "right",    "Master",       "right"
                        connect                 "Zakian_Flute",                 "left",     "Master",       "left"
                        connect                 "Zakian_Flute",                 "right",    "Master",       "right"
                        connect                 "BigReverb",                    "left",     "Master",       "left"
                        connect                 "BigReverb",                    "right",    "Master",       "right"

                        alwayson                "BigReverb"
                        alwayson                "Master"
                        
                        ; Basic just intonation.
giscale                 ftgen                   0, 0, 64, -2, 12, 2, 51.913, 32, 1./1., 16./15., 9./8., 6./5., 5./4., 4./3., 7./5., 3./2., 8./5., 5./3., 9./5., 15./8., 2./1. 

giseed                  init                    0.5

giextrap3               init                    0.0

                        opcode		        NoteOn, ikii, iii
                        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
                        ; General purpose instrument control UDO.
                        ; Returns the pitch at i-rate, the pitch at k-rate
                        ; (with addition of smoothed MIDI pitch bend, if any),
                        ; decibels full scale scaled from MIDI velocity,
                        ; and the amplitude scaled such that 127 == 0 dBFS.
                        ;
                        ; If an instrument is balanced, then its solo peak 
                        ; amplitude at MIDI velocity 127 should be exactly 
                        ; 0 dBFS. If the instrument is too loud (or too soft) 
                        ; at velocity 127, set imeasuredDBFS to minus the peak level 
                        ; reported by Csound; e.g. for the following messsage:
                        ;
                        ; rtevent:     T 12.257 TT 12.257 M:    +3.35    +3.60
                        ;    number of samples out of range:      511      552  
                        ;
                        ; set the imeasuredDBFS parameter in the NoteOn call 
                        ; in the instrument to -3.6. This will normalize the 
                        ; instrument. It also is possible to use this feature
                        ; to balance levels in a mix by adding or subtracting
                        ; decibels (1 dB is roughly a just noticeable difference, 
                        ; +6 dB is roughly twice as loud).
ikey,ivelocity,imeasureddBFS xin
imeasureddBFS           =                       -1.0 * imeasureddBFS
                        ; Convert MIDI key number to cycles per second.
iHz 		            cpstuni                 ikey, giscale
                        ; Modify with MIDI pitch bend, if any.
kpitchbend              pchbend                 -6.0, +6.0    
kpitchbend              =                       kpitchbend + 6.0
iinitialpb              init                    i(kpitchbend)
                        ;print                   iinitialpb
                        ; Smooth out the stepping in the MIDI control signal.
ksmoothbend             port                    kpitchbend, 0.125, iinitialpb                        
kKey                    =                       ikey + ksmoothbend
kHz                     =                       cpsmidinn(kKey)
                        ; Scale MIDI velocity to decibels.
ipower			        pow			ivelocity / 127.0, 2.0
idecibels               =			20.0 * log10(ipower)
imidiamplitude		    =			ampdbfs(idecibels)
                        ; Normalize so amplitude at velocity 127 == amplitude at full scale.
inormalFS		        =		ampdbfs(0)
imeasured127            =                       ampdbfs(imeasureddBFS)
inormal                 =                       inormalFS / imeasured127
inormalizedamplitude    =                       imidiamplitude * inormal
                        ; print                 ivelocity, idecibels, imidiamplitude, inormal, inormalizedamplitude
                        xout			iHz, kHz, inormalizedamplitude, idecibels
                        endop
                        
                        opcode			Modulation, k, j
                        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
                        ; Returns +- one octave of pitch bend in MIDI 
                        ; key numbers.
kpitchbend              init                    0
                        xout                    kpitchbend                  
                        endop

                        
                        opcode			Pan, aa, ka
                        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
kpan, asignal		    xin
                        ;  Constant-power pan.
apan                    =                       (kpan / 2.0) + 0.5
aleft, aright           pan2                    asignal, apan
                        xout			aleft, aright
                        endop

                        opcode                  AdjustTimes, 0, ii
                        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
                        ; Ajusts p3 so that total duration is unchanged unless iatt + irel > p3
iatt, irel              xin
iends                   =                       iatt + irel
                        if      iends > p3      then
p3                      =                       p3 + iends
                        endif
                        endop
            
                        opcode			Declick, iaa, iiiaa
                        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
iatt,idur,irel,a1,a2	xin
                        if (idur > 0)           then
isustain		= 			idur
idur			=			iatt + isustain + irel                        
                        else
isustain                =                       100000.0
                        endif                        
aenv			linsegr			0.0, iatt, 1.0, isustain, 1.0, irel, 0.0
ab1			=			a1 * aenv
ab2			=			a2 * aenv
                        xout			idur, ab1, ab2
                        endop	

                        opcode			Damping, ia, iii
                        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
iatt,idur,irel		xin
iends                   =                       iatt + irel
                        if  idur > iends        then
idur                    =                       idur - iends
                        endif
                        if (idur > 0)           then
isustain		= 			idur
idur			=			iatt + isustain + irel                        
                        else
isustain                =                       100000.0
                        endif                        
                        ; Releasing envelope for MIDI performance.
aenv			linsegr			0.0, iatt, 1.0, isustain, 1.0, irel, 0.0
                        xout			idur, aenv
                        endop

                        opcode			ADSR, ia, iiiiiiii
                        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
                        ; Outputs new p3, arate envelope for
                        ; attack time, attack level, 
                        ; decay time, decay level, 
                        ; sustain time (should usually be p3), sustain level,
                        ; release time, release level, slope exponent. 
                        ; Handles real-time by indefinitely extending 
                        ; sustain time and p3.
iat,ial,idt,idl,ist,irt,irl,islope	xin
ip3                     =                       iat + idt + ist + irt             
aenvelope               transeg                 0.0, iat, islope, ial, idt, islope, idl, ist, islope, irl, irt, islope, 0.0
                        xout			ip3, aenvelope
                        endop	

                        instr Kung_Chorusing_FM ; Kung FM with modulated delay line chorusing
                        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
iHz,kHz,iamplitude,idB  NoteOn                  p4, p5, -17
iattack 		=	                p3 * 0.25
isustain		=	                giextrap3 + p3 * 0.5
irelease 		= 			p3 * 0.25
                        AdjustTimes             iattack, irelease
p3, adamping		Damping			0.03, p3, 0.05
ip6                     =                       p6
ip7                     =                       p7 
ip8                     =                       p8
ip9                     =                       p9
ip10                    =                       p10
ip11                    =                       p11
ip6                     =                       0.3
ip7                     =                       2.2
ishift      	        =           	        2.0 / 12000.0
kpch  		        =               	kHz
koct        		=           	        octcps(kHz) 
isine                   ftgenonce               0, 0, 65537,    10,     1
icosine                 ftgenonce               0, 0, 65537,    11,     1 ; Cosine wave. Get that noise down on the most widely used table!
iln                     ftgenonce               0, 0, 65537,   -12,    20.0 ; Unscaled ln(I(x)) from 0 to 20.0.
aadsr                   linseg                  0, iattack, 1, isustain, 1, irelease, 0
amodi                   linseg                  0, iattack, 5, isustain, 2, irelease, 0
                        ; r moves from ip6 to ip7 in p3 secs.
amodr                   linseg                  ip6, p3, ip7
a1                      =                       amodi * (amodr - 1 / amodr) / 2
                        ; a1*2 is argument normalized from 0-1.
a1ndx                   =                       abs(a1 * 2 / 20)
a2                      =                       amodi * (amodr + 1 / amodr) / 2
a3                      tablei                  a1ndx, iln, 1
                        ; Cosine
ao1                     poscil                  a1, kpch, icosine
a4                      =                       exp(-0.5 * a3 + ao1)
                        ; Cosine
ao2                     poscil                  a2 * kpch, kpch, icosine
                        ; Final output left
aleft                   poscil                  a4, ao2 + cpsoct(koct + ishift), isine
                        ; Final output right
aright                  poscil                  a4, ao2 + cpsoct(koct - ishift), isine
aleft, aright		Pan			p7, (aleft + aright) * iamplitude * adamping * aadsr
                        outleta                 "left", aleft
                        outleta                 "right", aright
                        endin

                        instr Gogins_Waveshaping_Drone ; Gogins waveshaping drone
                        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
iHz,kHz,iamplitude,idB  NoteOn                  p4, p5, -40
iattack 		=	                p3 * 0.25
isustain		=	                giextrap3 + p3 * 0.5
irelease 		= 			p3 * 0.25
p3                      =                       iattack + isustain + irelease
ip6                     =                       p6
ip7                     =                       p7
ip8                     =                       p8
ip9                     =                       p9
ip10                    =                       p10
ip11                    =                       p11
ipan                    =                       p7
ihertz                  =                       iHz
iamp                    =                       iamplitude
                                                ; level  dur           type level         dur            type  level   dur       type level   dur           type level         dur           type  level 
kenvelope               transeg                 0.0,   iattack / 2.0, 2.5, iamp / 2.0,  iattack / 2.0, -2.5, iamp,   isustain, 0.0, iamp,   irelease / 2.0, 2.5, iamp / 2.0,   irelease / 2.0, -2.5, 0.0
iharmonics              ftgenonce               0, 0, 65536, 10, 3, 0, 1, 0, 0, 2
asignal                 poscil3                 kenvelope, ihertz, iharmonics
iwaveshape              ftgenonce               0, 0, 65536, 13, 1, 2, 0, 3, 0, 2    
asignal                 distort                 asignal, 0.09, iwaveshape
aleft, aright           pan2                    asignal * 12.0, ipan
                        outleta                 "left", aleft
                        outleta                 "right", aright
                        endin
                        
                        instr Bergeman_Phasing_Sines ; Bergeman phasing sine tones
                        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
iHz,kHz,iamplitude,idB  NoteOn                  p4, p5, -93
iattack 		=	                p3 * 0.25
isustain		=	                giextrap3 + p3 * 0.5
irelease 		= 			p3 * 0.25
p3                      =                       iattack + isustain + irelease
p3, adamping		Damping			0.01, p3, 0.01
ibergeman               ftgenonce               0, 0, 65537,    10,     .28, 1, .74, .66, .78, .48, .05, .33, 0.12, .08, .01, .54, 0.19, .08, .05, 0.16, .01, 0.11, .3, .02, 0.2 ; Bergeman f1
ip6                     =                       p6
ip7                     =                       p7
ip8                     =                       p8
ip9                     =                       p9
ip10                    =                       p10
ip11                    =                       p11
koctave			=			octcps(kHz)
idb			=   	                1.5
ip5                     =                       ibergeman
ip3                     =                       iattack
ip6                     =                       isustain
ip7                     =                       irelease
kp8                     =                       cpsoct(koctave - .01)
kp9                     =                       cpsoct(koctave + .01)
isc                     =                       idb * .333
k1                      linseg                  40, ip3, 800, p3, 800, 0.06, 0.0
k2                      linseg                  440, ip3, 220, p3, 220, 0.06, 0.0
k3                      linseg                  0.0, ip6, 800, ip7, 200.0, p3, 200, 0.06, 0.0
k4                      linseg                  800, ip3, 40, p3, 40, 0.06, 0.0
k5                      linseg                  220, ip3, 440, p3, 440, 0.06, 0.0
k6                      linseg                  isc, ip6, p3, ip7, p3, 0.06, 0.0
k7                      linseg                  0.0, ip6, 1, ip7, .3, p3, .1, 0.06, 0.0
a5                      poscil                  k3, kp8, ip5
a6                      poscil                  k3, kp8 * 0.999, ip5
a7                      poscil                  k3, kp8 * 1.001, ip5
a1                      =                       a5 + a6 + a7
a8                      poscil                  k6, kp9, ip5
a9                      poscil                  k6, kp9 * 0.999, ip5
a10                     poscil                  k6, kp9 * 1.001, ip5
a11                     =                       a8 + a9 + a10
a2                      butterbp                a1, k1, 40
a3                      butterbp                a2, k5, k2 * 0.9
a4                      balance                 a3, a1
a12                     butterbp                a11, k4, 40
a13                     butterbp                a12, k2, k5 * 0.8
a14                     balance                 a13, a11
a15                     reverb2                 a4, 5, 0.3
a16                     reverb2                 a4, 4, 0.2
a17                     =                       (a15 + a4) * k7
a18                     =                       (a16 + a4) * k7
aleft, aright		Pan			p7, (a17 + a18) * iamplitude * adamping
                        outleta                 "left", aleft
                        outleta                 "right", aright
                        endin

                        instr Gogins_Waveshaping_Drone_1 ; Gogins waveshaping drone
                        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
iHz,kHz,iamplitude,idB  NoteOn                  p4, p5, -40
iattack 		=	                p3 * 0.25
isustain		=	                giextrap3 + p3 * 0.5
irelease 		= 			p3 * 0.25
                        AdjustTimes             iattack, irelease
ip6                     =                       p6
ip7                     =                       p7
ip8                     =                       p8
ip9                     =                       p9
ip10                    =                       p10
ip11                    =                       p11
ipan                    =                       p7
ihertz                  =                       iHz
iamp                    =                       iamplitude
                                                ; level  dur           type level         dur            type  level   dur       type level   dur           type level         dur           type  level 
kenvelope               transeg                 0.0,   iattack / 2.0, 2.5, iamp / 2.0,  iattack / 2.0, -2.5, iamp,   isustain, 0.0, iamp,   irelease / 2.0, 2.5, iamp / 2.0,   irelease / 2.0, -2.5, 0.0
iharmonics              ftgenonce               0, 0, 65536, 10, 3, 0, 1, 0, 0, 2
asignal                 poscil3                 kenvelope, ihertz, iharmonics
iwaveshape              ftgenonce               0, 0, 65536, 13, 1, 2, 0, 3, 0, 2    
asignal                 distort                 asignal, 0.09, iwaveshape
aleft, aright           pan2                    asignal * 12.0, ipan
                        outleta                 "left", aleft
                        outleta                 "right", aright
                        endin
                        
                        instr Bergeman_Phasing_Sines_1 ; Bergeman phasing sine tones
                        ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
iHz,kHz,iamplitude,idB  NoteOn                  p4, p5, -93
iattack 		=	                p3 * 0.25
isustain		=	                giextrap3 + p3 * 0.5
irelease 		= 			p3 * 0.25
                        AdjustTimes             iattack, irelease
p3, adamping		Damping			0.01, p3, 0.01
ibergeman               ftgenonce               0, 0, 65537,    10,     .28, 1, .74, .66, .78, .48, .05, .33, 0.12, .08, .01, .54, 0.19, .08, .05, 0.16, .01, 0.11, .3, .02, 0.2 ; Bergeman f1
ip6                     =                       p6
ip7                     =                       p7
ip8                     =                       p8
ip9                     =                       p9
ip10                    =                       p10
ip11                    =                       p11
koctave			=			octcps(kHz)
idb			=   	                1.5
ip5                     =                       ibergeman
ip3                     =                       iattack
ip6                     =                       isustain
ip7                     =                       irelease
kp8                     =                       cpsoct(koctave - .01)
kp9                     =                       cpsoct(koctave + .01)
isc                     =                       idb * .333
k1                      linseg                  40, ip3, 800, p3, 800, 0.06, 0.0
k2                      linseg                  440, ip3, 220, p3, 220, 0.06, 0.0
k3                      linseg                  0.0, ip6, 800, ip7, 200.0, p3, 200, 0.06, 0.0
k4                      linseg                  800, ip3, 40, p3, 40, 0.06, 0.0
k5                      linseg                  220, ip3, 440, p3, 440, 0.06, 0.0
k6                      linseg                  isc, ip6, p3, ip7, p3, 0.06, 0.0
k7                      linseg                  0.0, ip6, 1, ip7, .3, p3, .1, 0.06, 0.0
a5                      poscil                  k3, kp8, ip5
a6                      poscil                  k3, kp8 * 0.999, ip5
a7                      poscil                  k3, kp8 * 1.001, ip5
a1                      =                       a5 + a6 + a7
a8                      poscil                  k6, kp9, ip5
a9                      poscil                  k6, kp9 * 0.999, ip5
a10                     poscil                  k6, kp9 * 1.001, ip5
a11                     =                       a8 + a9 + a10
a2                      butterbp                a1, k1, 40
a3                      butterbp                a2, k5, k2 * 0.8
a4                      balance                 a3, a1
a12                     butterbp                a11, k4, 40
a13                     butterbp                a12, k2, k5 * 0.8
a14                     balance                 a13, a11
a15                     reverb2                 a4, 5, 0.3
a16                     reverb2                 a4, 4, 0.2
a17                     =                       (a15 + a4) * k7
a18                     =                       (a16 + a4) * k7
aleft, aright		Pan			p7, (a17 + a18) * iamplitude * adamping
                        outleta                 "left", aleft
                        outleta                 "right", aright
                        endin

                        instr BigReverb ; Extra reverb for drone
aleftin                 inleta                  "left"
arightin                inleta                  "right"
ireverb                 =                       0.5
adummy                  =                       0
aleft, adummy           reverbsc                aleftin, aleftin, ireverb, 10000
adummy                  =                       0
aright, adummy          reverbsc                arightin, arightin, ireverb, 10000

aleft                   =                       aleftin + (aleft * 0.5)
aright                  =                       arightin + (aright * 0.5)
                        outleta                 "left", aleft
                        outleta                 "right", aright
                        endin

                        instr Master ; Master stereo output
aleftin                 inleta                  "left"
arightin                inleta                  "right"
ireverb                 =                       0.9
adummy                  =                       0
aleft, adummy           reverbsc                aleftin, aleftin, ireverb, 15000
adummy                  =                       0
aright, adummy          reverbsc                arightin, arightin, ireverb, 15000
aleft                   =                       aleftin + (aleft * 0.25)
aright                  =                       arightin + (aright * 0.25)
aleft                   dcblock                 aleft
aright                  dcblock                 aright
                        outs                    aleft, aright
                        endin
</CsInstruments>
<CsScore>
</CsScore>
</CsoundSynthesizer>
'''
        self.model.getCppSound().setCSD(self.csoundOrchestra)
        self.model.setCsoundCommand(self.csoundCommand)
        instruments = self.model.getCppSound().getCsoundFile().getInstrumentNames()
        for number, name in instruments.items():
            print ('Instr %4d: %s' % (number, name))
        print
    def createCsoundArrangement(self):
        print ('CREATING CSOUND ARRANGEMENT...')
        #~ #                 CsoundAC,   Csound,                                                       level (+-dB),  pan (-1.0 through +1.0)
        self.score.setDuration(9 * 60)        
        print
    def createMusicModel(self):
        print ('CREATING MUSIC MODEL...')
        print
        import GeneralizedContextualGroup
        self.gcg = GeneralizedContextualGroup.GeneralizedContextualGroup()
        # Ends on Cm9.
        self.gcg.setAxiom('pcs1 V+47 WC R45 a3 Q5 R50 a4 R55 a3 R60 a4 R65 a3 ')
        self.gcg.addRule('pcs1', 'P(0,4,7,11,14)')

        self.gcg.addRule('a3',   'a3k a3q a3 a3')
        self.gcg.addRule('a3k',  'K  WV')
        self.gcg.addRule('a3q',  'Q3 K D/1.25 WV Q3 V+1 D*1.25 WC')

        self.gcg.addRule('a4',   'L*2 a4k a4q D/1.25 a4 D/1.25  a4 D*1.25 D*1.25 L/2')
        self.gcg.addRule('a4k',  'K  WV')
        self.gcg.addRule('a4q',  'Q4 WV Q4 K V+4 WC')

        self.gcg.setIterationCount(2)
        self.gcg.debug = True
        self.gcg.generate()
        self.rescale = CsoundAC.Rescale()
        self.rescale.setRescale( CsoundAC.Event.TIME,       True, False, (1.0 / 40.0), 120    )
        self.rescale.setRescale( CsoundAC.Event.INSTRUMENT, True, False,  1,             3.99 )
        self.rescale.setRescale( CsoundAC.Event.KEY,        True, False, 37,            36    )
        self.rescale.setRescale( CsoundAC.Event.VELOCITY,   True, True,  43,            17    )
        self.rescale.setRescale( CsoundAC.Event.PAN,        True, True,   0.05,          0.9  )
        self.rescale.addChild(self.gcg)
        self.model.addChild(self.rescale)
        print

csoundComposition = CsoundComposition()

if len(sys.argv) > 1:
    csoundComposition.renderingMode = sys.argv[1]
else:
    csoundComposition.renderingMode = 'master'
csoundComposition.dacName = 'dac'
csoundComposition.playback = True
csoundComposition.render()
