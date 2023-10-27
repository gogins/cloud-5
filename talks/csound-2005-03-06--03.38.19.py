'''
Copyright (C) 2005 by Michael Gogins.
All rights reserved.
'''
import CsoundVST
import random
import math

minuetTable = {}
minuetTable[ 2] = { 1: 96,  2: 22,  3:141,  4: 41,  5:105,  6:122,  7: 11,  8: 30,  9: 70, 10:121, 11: 26, 12:  9, 13:112, 14: 49, 15:109, 16: 14}
minuetTable[ 3] = { 1: 32,  2:  6,  3:128,  4: 63,  5:146,  6: 46,  7:134,  8: 81,  9:117, 10: 39, 11:126, 12: 56, 13:174, 14: 18, 15:116, 16: 83}
minuetTable[ 4] = { 1: 69,  2: 95,  3:158,  4: 13,  5:153,  6: 55,  7:110,  8: 24,  9: 66, 10:139, 11: 15, 12:132, 13: 73, 14: 58, 15:145, 16: 79}
minuetTable[ 5] = { 1: 40,  2: 17,  3:113,  4: 85,  5:161,  6:  2,  7:159,  8:100,  9: 90, 10:176, 11:  7, 12: 34, 13: 67, 14:160, 15: 52, 16:170}
minuetTable[ 6] = { 1:148,  2: 74,  3:163,  4: 45,  5: 80,  6: 97,  7: 36,  8:107,  9: 25, 10:143, 11: 64, 12:125, 13: 76, 14:136, 15:  1, 16: 93}
minuetTable[ 7] = { 1:104,  2:157,  3: 27,  4:167,  5:154,  6: 68,  7:118,  8: 91,  9:138, 10: 71, 11:150, 12: 29, 13:101, 14:162, 15: 23, 16:151}
minuetTable[ 8] = { 1:152,  2: 60,  3:171,  4: 53,  5: 99,  6:133,  7: 21,  8:127,  9: 16, 10:155, 11: 57, 12:175, 13: 43, 14:168, 15: 89, 16:172}
minuetTable[ 9] = { 1:119,  2: 84,  3:114,  4: 50,  5:140,  6: 86,  7:169,  8: 94,  9:120, 10: 88, 11: 48, 12:166, 13: 51, 14:115, 15: 72, 16:111}
minuetTable[10] = { 1: 98,  2:142,  3: 42,  4:156,  5: 75,  6:129,  7: 62,  8:123,  9: 65, 10: 77, 11: 19, 12: 82, 13:137, 14: 38, 15:149, 16:  8}
minuetTable[11] = { 1:  3,  2: 87,  3:165,  4: 61,  5:135,  6: 47,  7:147,  8: 33,  9:102, 10:  4, 11: 31, 12:164, 13:144, 14: 59, 15:173, 16: 78}
minuetTable[12] = { 1: 54,  2:130,  3: 10,  4:103,  5: 28,  6: 37,  7:106,  8:  5,  9: 35, 10: 20, 11:108, 12: 92, 13: 12, 14:124, 15: 44, 16:131}

pitchesForRows = {}
pitchesForRows[2] = 'Bb major'
pitchesForRows[3] = 'C minor'
pitchesForRows[4] = 'A minor'
pitchesForRows[5] = 'Eb major'
pitchesForRows[6] = 'Bb major'

random.seed()

duration = 1.5
repetitions = []
for i in xrange(16 * 4):
	repetitions.append(1 + int(random.random() * 6.0))     

for i in xrange(6):
	random.shuffle(repetitions)
	print repetitions

def readMeasure(number):
	scoreNode = CsoundVST.ScoreNode()
	scoreNode.thisown = 0
	filename = 'c:/apcc/projects/Gogins/AlgorithmicComposition/wuerfelspiel/M' + str(number) + '.mid'
	print 'Reading "%s"' % (filename)
	scoreNode.getScore().load(filename)
	return scoreNode

def buildTrack(sequence, channel, gain, timeoffset, pan):
	print 'Building track for channel %3d gain %3d...' % (channel, gain)
	cumulativeTime = timeoffset
	random.shuffle(repetitions)
	m = 0
	for i in xrange(0, 16):
		for j in xrange(2, 6):
		repeatCount = repetitions[m]
			m = m + 1
		for k in xrange(repeatCount):
				measure = readMeasure(minuetTable[j][i+1])
		rescale = CsoundVST.Rescale()
				rescale.setRescale(CsoundVST.Event.TIME, 1, 0, cumulativeTime, 0)
				rescale.setRescale(CsoundVST.Event.INSTRUMENT, 1, 1, channel, 0)
			rescale.setRescale(CsoundVST.Event.VELOCITY, 1, 1, 0, gain)
				rescale.setRescale(CsoundVST.Event.PAN, 1, 1, pan, 0)
				rescale.thisown = 0
				rescale.addChild(measure)
		print 'Repeat %4d of %4d at %8.3f with %3d notes of duration %7.3f...' %(k + 1, repeatCount, cumulativeTime, len(measure.getScore()), duration)
				sequence.addChild(rescale)
			cumulativeTime = cumulativeTime + duration

print 'Generating score...'
musicModel = CsoundVST.MusicModel()
musicModel.setConformPitches(True)
rescale = CsoundVST.Rescale()
musicModel.addChild(rescale)
rescale.setRescale(CsoundVST.Event.KEY,        1, 0, 34, 48)
rescale.setRescale(CsoundVST.Event.VELOCITY,   1, 1, 50,  9)
rescale.setRescale(CsoundVST.Event.PITCHES,    1, 1, CsoundVST.Conversions_nameToPitchClassSet("Bb major"), 0)
rescale.setRescale(CsoundVST.Event.TIME,       1, 1,  0, 550)
rescale.setRescale(CsoundVST.Event.DURATION,   1, 1,  0.25, 1.5)

timeoffset = (duration * 6.0) / 4.0
buildTrack(rescale, 0, 1.0, timeoffset * 0.0, 0)
buildTrack(rescale, 1, 1.0, timeoffset * 1.0,.75)
buildTrack(rescale, 2, 2.0, timeoffset * 2.0,-.75)
buildTrack(rescale, 3, 1.0, timeoffset * 3.0,.5)
buildTrack(rescale, 4, 2.0, timeoffset * 4.0,-.5)

musicModel.setCppSound(csound)
musicModel.generate()
filename = csound.getFilename();
print 'Filename:', filename
csound.setFilename(filename);
csound.setCommand("csound -RWdfo " + filename + ".wav " + filename + ".orc " + filename + ".sco")

print 'Creating Csound arrangement...'
# Create an arrangement.
csound.setOrchestra('''
; ================================================================
; Header
; ================================================================
sr			=			88200
ksmps			=			100
nchnls			=			2
0dbfs			=			120000

; ================================================================
; Set up SoundFonts.
; ================================================================

giFluidsynth		fluidEngine
giFluidSteinway		fluidLoad		"C:/apcc/soundfonts/Piano Steinway Grand Model C (21,738KB).sf2",  giFluidsynth, 1
			fluidProgramSelect	giFluidsynth, 0, giFluidSteinway, 0, 0
giFluidGM		fluidLoad		"C:/apcc/soundfonts/63.3mg The Sound Site Album Bank V1.0.SF2",   giFluidsynth, 1
			fluidProgramSelect	giFluidsynth, 1, giFluidGM,	 0, 12

; ================================================================
; Globals
; ================================================================
			zakinit 		10,10

; Global variable for the reverb unit
ga1 			init 			0
giwet 			init 			0.021

; ================================================================
; Tables
; ================================================================
; Waveform for the string-pad
giwave 			ftgen 			1, 0, 4096, 10, 1, .5, .33, .25,  .0, .1,  .1, .1
gisine 			ftgen 			2, 0, 65537, 10, 1 ; Sine wave.
giharpsichord 		ftgen 			3, 0, 2049, 	7, 	-1, 1024, 1, 1024, -1 ; Kelley harpsichord.
gicosine 		ftgen 			4, 0, 65537, 	11, 	1 ; Cosine wave. Get that noise down on the most widely used table!
giexponentialrise 	ftgen 			5, 0, 513, 	5, 	.001, 513, 1 ; Exponential rise.
githirteen 		ftgen 			6, 0, 513, 	9, 	1, .3, 0
giln 			ftgen 			7, 0, 8193, 	-12, 	20.0 ; Unscaled ln(I(x)) from 0 to 20.0.

; Sinus required by chorus
isine 			ftgen 			2, 0, 4096, 10, 1


; ================================================================
; Instruments
; ================================================================

instr 1 ; FluidSynth Steinway
; INITIALIZATION
			mididefault 		60, p3
			midinoteonkey		p4, p5
			print 			p2, p3, p4, p5, p6, p7, p8, p9, p10, p11
; Use channel assigned in fluidload.
; Normalize so iamplitude for p5 of 80 == ampdb(80).
iamplitude 		= 			ampdb(p5)
ichannel		=			0
ikey	 		= 			p4
ivelocity 		= 			p5 * .45
ijunk6 			= 			p6
ijunk7			=			p7
ijunk8			=			p8
ijunk9			=			p9
ijunk10			=			p10
ijunk11			=			p11
istatus			=			144
			print			istatus, ichannel, ikey, ivelocity
			fluidControl		giFluidsynth, istatus, ichannel, ikey, ivelocity
endin

instr 2 ; FluidSynth General MIDI
; INITIALIZATION
			mididefault 		60, p3
			midinoteonkey		p4, p5
			print 			p2, p3, p4, p5, p6, p7, p8, p9, p10, p11
; Use channel assigned in fluidload.
; Normalize so iamplitude for p5 of 80 == ampdb(80).
iamplitude 		= 			ampdb(p5 * 1.25)
ichannel		=			1
ikey	 		= 			p4
ivelocity 		= 			p5
ijunk6 			= 			p6
ijunk7			=			p7
ijunk8			=			p8
ijunk9			=			p9
ijunk10			=			p10
ijunk11			=			p11
istatus			=			144
			print			istatus, ichannel, ikey, ivelocity
			fluidControl		giFluidsynth, istatus, ichannel, ikey, ivelocity
endin


instr 3 ; Harpsichord, James Kelley
; INITIALIZATION
			mididefault 		60, p3
			midinoteonoct		p4, p5
			print 			p2, p3, p4, p5, p6, p7, p8, p9, p10, p11
; Envelope initialization.
iattack 		= 			0.005
isustain 		= 			p3
irelease 		= 			0.05
			; xtratim			iattack + irelease
p3			=			isustain + iattack + irelease		
kdamping		linsegr			0.0, iattack, 1.0, isustain, 1.0, irelease, 0.0
iduration 		= 			p3 + iattack + irelease
ifrequency 		= 			cpsoct(p4)
; Normalize so iamplitude for p5 of 80 == ampdb(80).
iamplitude 		= 			ampdb(p5) / 1.0
ijunk6 			= 			p6
; Constant-power pan.
ipi 			= 			4.0 * taninv(1.0)
iradians 		= 			p7 * ipi / 2.0
itheta 			= 			iradians / 2.0
; Translate angle in [-1, 1] to left and right gain factors.
irightgain 		= 			sqrt(2.0) / 2.0 * (cos(itheta) + sin(itheta))
ileftgain 		= 			sqrt(2.0) / 2.0 * (cos(itheta) - sin(itheta))
ijunk8 			= 			p8
ijunk9 			= 			p9
ijunk10 		= 			p10
ijunk11 		= 			p11
; KONTROL
kenvelope 		expseg	 		iamplitude, iduration, 1.0, irelease, 0.0001
kenvelope		=			kenvelope - 0.0001
; AUDIO
apluck 			pluck 			iamplitude, ifrequency, ifrequency, 0, 1
aharp 			oscili 			kenvelope, ifrequency, giharpsichord
aharp2 			balance 		apluck, aharp
aoutsignal 		= 			apluck + aharp2
asig1                   = 			aoutsignal * ileftgain * kdamping
asig2                   =                       aoutsignal * irightgain * kdamping
; To the chorus effect, through zak channels 1 and 2
			zawm 			asig1 * giwet, 1
			zawm 			asig2 * giwet, 2
			zawm 			asig1, 5
			zawm 			asig2, 6
endin

instr 4 ; Heavy metal model, Perry Cook
; INITIALIZATION
			mididefault 		60, p3
			midinoteonoct		p4, p5
			print 			p2, p3, p4, p5, p6, p7, p8, p9, p10, p11
iattack 		= 			0.01
idecay			=			2.0
isustain 		= 			p3
irelease 		= 			0.125
			; xtratim			iattack + idecay + irelease
p3			=			p3 + iattack + idecay + irelease
kdamping		linsegr			0.0, iattack, 1.0, idecay + isustain, 1.0, irelease, 0.0
iindex 			= 			1
icrossfade 		= 			3
ivibedepth 		= 			0.02
iviberate 		= 			4.8
ifn1 			= 			gisine
ifn2 			= 			giexponentialrise
ifn3 			= 			githirteen
ifn4 			= 			gisine
ivibefn 		= 			gicosine
ifrequency 		= 			cpsoct(p4 - 4.0)
; Normalize so iamplitude for p5 of 80 == ampdb(80).
iamplitude 		= 			ampdb(p5) * 25.0
ijunk6 			= 			p6
; Constant-power pan.	
ipi 			= 			4.0 * taninv(1.0)
iradians 		= 			p7 * ipi / 2.0
itheta 			= 			iradians / 2.0
; Translate angle in [-1, 1] to left and right gain factors.
irightgain 		= 			sqrt(2.0) / 2.0 * (cos(itheta) + sin(itheta)) * iamplitude
ileftgain 		= 			sqrt(2.0) / 2.0 * (cos(itheta) - sin(itheta)) * iamplitude
ijunk8 			= 			p8
ijunk9 			= 			p9
ijunk10 		= 			p10
ijunk11 		= 			p11
; AUDIO
adecay			transeg	 		0.0, iattack, 4, 1.0, idecay, -4, 0.1, irelease, -4, 0.0
asignal			fmmetal 		0.1, ifrequency, iindex, icrossfade, ivibedepth, iviberate, ifn1, ifn2, ifn3, ifn4, ivibefn
asig1                   = 			asignal * ileftgain * kdamping * adecay
asig2                   =                       asignal * irightgain * kdamping * adecay
; To the chorus effect, through zak channels 1 and 2
			zawm 			asig1 * giwet, 1
			zawm 			asig2 * giwet, 2
			zawm 			asig1, 5
			zawm 			asig2, 6
endin

instr 5,6 ; Xing by Andrew Horner
; p4 pitch in octave.pch
; original pitch	= A6
; range			= C6 - C7
; extended range	= F4 - C7
; INITIALIZATION
			mididefault 		60, p3
			midinoteonoct		p4, p5
			print 		p2, p3, p4, p5, p7, p8, p9, p10, p11
isine			=			1
iinstrument 		= 			p1
istarttime 		= 			p2
isustain 		= 			p3
iattack 		= 			.005
irelease 		= 			.06
			; xtratim			iattack + irelease
p3			=			isustain + iattack + irelease		
kdamping		linseg			0.0, iattack, 1.0, isustain, 1.0, irelease, 0.0
ioctave			=			p4 - 4.0
ifrequency 		= 			cpsoct(ioctave)
; Normalize so iamplitude for p5 of 80 == ampdb(80).
iamplitude 		= 			ampdb(p5) * 700.0
iphase 			=			p6
; Constant-power pan.
ipi 			=			4.0 * taninv(1.0)
ixpan 			=			p7
iradians 		=			ixpan * ipi / 2.0
itheta 			=			iradians / 2.0
; Translate angle in [-1, 1] to left and right gain factors.
irightgain 		=			sqrt(2.0) / 2.0 * (cos(itheta) + sin(itheta))
ileftgain 		=			sqrt(2.0) / 2.0 * (cos(itheta) - sin(itheta))
iypan 			=			p8
izpan 			=			p9
imason 			=			p10

idur			=			p3
ifreq			=			ifrequency
iamp			=			iamplitude
inorm			=			32310

aamp1 			linseg			0,.001,5200,.001,800,.001,3000,.0025,1100,.002,2800,.0015,1500,.001,2100,.011,1600,.03,1400,.95,700,1,320,1,180,1,90,1,40,1,20,1,12,1,6,1,3,1,0,1,0
kdevamp1		linseg			0, .05, .3, idur - .05, 0
kdev1 			oscili 			kdevamp1, 6.7, gisine, .8
amp1 			=			aamp1 * (1 + kdev1)

aamp2 			linseg			0,.0009,22000,.0005,7300,.0009,11000,.0004,5500,.0006,15000,.0004,5500,.0008,2200,.055,7300,.02,8500,.38,5000,.5,300,.5,73,.5,5.,5,0,1,1
kdevamp2		linseg			0,.12,.5,idur-.12,0
kdev2 			oscili 			kdevamp2, 10.5, gisine, 0
amp2			=			aamp2 * (1 + kdev2)

aamp3 			linseg			0,.001,3000,.001,1000,.0017,12000,.0013,3700,.001,12500,.0018,3000,.0012,1200,.001,1400,.0017,6000,.0023,200,.001,3000,.001,1200,.0015,8000,.001,1800,.0015,6000,.08,1200,.2,200,.2,40,.2,10,.4,0,1,0
kdevamp3		linseg			0, .02, .8, idur - .02, 0
kdev3 			oscili  		kdevamp3, 70, gisine ,0
amp3			=			aamp3 * (1 + kdev3),

awt1  			oscili			amp1, ifreq, gisine
awt2   			oscili			amp2, 2.7 * ifreq, gisine
awt3  			oscili			amp3, 4.95 * ifreq, gisine
asig			=			awt1 + awt2 + awt3
krel  			linenr 			1,0, idur, .06
asig			=			asig * krel * (iamp / inorm)
asig1			=                       asig * ileftgain * kdamping *.005
asig2               	=                       asig * irightgain * kdamping *.005
; To the chorus effect, through zak channels 1 and 2
			zawm 			asig1 * giwet, 1
			zawm 			asig2 * giwet, 2
			zawm 			asig1, 5
			zawm 			asig2, 6
endin

instr 9 ; Fluidsynth output
; INITIALIZATION
; Normalize so iamplitude for p5 of 80 == ampdb(80).
iamplitude 		= 			ampdb(p5) * 2.0
; AUDIO
aleft, aright 		fluidAllOut		giFluidsynth
asig1 			= 			aleft * iamplitude
asig2 			= 			aright * iamplitude
; To the chorus effect, through zak channels 1 and 2
			zawm 			asig1 * giwet, 1
			zawm 			asig2 * giwet, 2
			zawm 			asig1, 5
			zawm 			asig2, 6
endin

; ================================================================
; EFFECTS
; ================================================================


; ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
; Chorus effect, borrowed from http://www.jlpublishing.com/Csound.htm
; I made some of its parameters accesible trhough score
instr 10	;Chorus
  ; Read input from zak
  a1     zar     1
  a2     zar     2
  idlyml=p4      ;delay in milliseconds
  k1             oscili          idlyml/p5, 1, 2
  ar1l           vdelay3 a1, idlyml/5+k1, 900    ;delayed sound 1
  ar1r           vdelay3 a2, idlyml/5+k1, 900    ;delayed sound 1
  k2             oscili          idlyml/p5, .995, 2
  ar2l           vdelay3 a1, idlyml/5+k2, 700    ;delayed sound 2
  ar2r           vdelay3 a2, idlyml/5+k2, 700    ;delayed sound 2
  k3             oscili          idlyml/p5, 1.05, 2
  ar3l           vdelay3 a1, idlyml/5+k3, 700    ;delayed sound 3
  ar3r           vdelay3 a2, idlyml/5+k3, 700    ;delayed sound 3
  k4             oscili          idlyml/p5, 1, 2
  ar4l           vdelay3 a1, idlyml/5+k4, 900    ;delayed sound 4
  ar4r           vdelay3 a2, idlyml/5+k4, 900    ;delayed sound 4
  aoutl          =               (a1+ar1l+ar2l+ar3l+ar4l)*.5
  aoutr          =               (a2+ar1r+ar2r+ar3r+ar4r)*.5

  ; To the output mixer
  zawm            aoutl, 5
  zawm            aoutr, 6
  ; and also to the reverb unit
  ga1 = ga1 + (aoutl+aoutr)*.5
endin

; ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
; Reverb
; 8 delay line FDN reverb, with feedback matrix based upon 
; physical modeling scattering junction of 8 lossless waveguides
; of equal characteristic impedance. Based on Julius O. Smith III, 
; "A New Approach to Digital Reverberation using Closed Waveguide
; Networks," Proceedings of the International Computer Music 
; Conference 1985, p. 47-53 (also available as a seperate
; publication from CCRMA), as well as some more recent papers by
; Smith and others.
;
; Coded by Sean Costello, October 1999
instr 25	;Reverb
  ; Note: ga1 is the global input to the reverb.
  afilt1 init 0
  afilt2 init 0
  afilt3 init 0
  afilt4 init 0
  afilt5 init 0
  afilt6 init 0
  afilt7 init 0
  afilt8 init 0
  idel1 = (2473.000/sr)
  idel2 = (2767.000/sr)
  idel3 = (3217.000/sr)
  idel4 = (3557.000/sr)
  idel5 = (3907.000/sr)
  idel6 = (4127.000/sr)
  idel7 = (2143.000/sr)
  idel8 = (1933.000/sr)
  
  
  igain = p4      ; gain of reverb. Adjust empirically
				  ; for desired reverb time. .6 gives
				  ; a good small "live" room sound, .8
				  ; a small hall, .9 a large hall,
				  ; .99 an enormous stone cavern.
  
  ipitchmod = p5  ; amount of random pitch modulation
				  ; for the delay lines. 1 is the "normal"
				  ; amount, but this may be too high for
				  ; held pitches such as piano tones.
				  ; Adjust to taste.
  
  itone = p6      ; Cutoff frequency of lowpass filters
				  ; in feedback loops of delay lines,
				  ; in Hz. Lower cutoff frequencies results
				  ; in a sound with more high-frequency
				  ; damping.
  
  ; k1-k8 are used to add random pitch modulation to the
  ; delay lines. Helps eliminate metallic overtones
  ; in the reverb sound.
  k1      randi   .001, 3.1, .06
  k2      randi   .0011, 3.5, .9
  k3      randi   .0017, 1.11, .7
  k4      randi   .0006, 3.973, .3
  k5      randi   .001, 2.341, .63
  k6      randi   .0011, 1.897, .7
  k7      randi   .0017, 0.891, .9
  k8      randi   .0006, 3.221, .44
  ; apj is used to calculate "resultant junction pressure" for 
  ; the scattering junction of 8 lossless waveguides
  ; of equal characteristic impedance. If you wish to
  ; add more delay lines, simply add them to the following 
  ; equation, and replace the .25 by 2/N, where N is the 
  ; number of delay lines.
  apj = .25 * (afilt1 + afilt2 + afilt3 + afilt4 + afilt5 + afilt6 + afilt7 + afilt8)
  
  
  adum1   delayr  1
  adel1   deltapi idel1 + k1 * ipitchmod
		  delayw  ga1 + apj - afilt1
  
  adum2   delayr  1
  adel2   deltapi idel2 + k2 * ipitchmod
		  delayw  ga1 + apj - afilt2
  
  adum3   delayr  1
  adel3   deltapi idel3 + k3 * ipitchmod
		  delayw  ga1 + apj - afilt3
  
  adum4   delayr  1
  adel4   deltapi idel4 + k4 * ipitchmod
		  delayw  ga1 + apj - afilt4
  
  adum5   delayr  1
  adel5   deltapi idel5 + k5 * ipitchmod
		  delayw  ga1 + apj - afilt5
  
  adum6   delayr  1
  adel6   deltapi idel6 + k6 * ipitchmod
		  delayw  ga1 + apj - afilt6
  
  adum7   delayr  1
  adel7   deltapi idel7 + k7 * ipitchmod
		  delayw  ga1 + apj - afilt7
  
  adum8   delayr  1
  adel8   deltapi idel8 + k8 * ipitchmod
		  delayw  ga1 + apj - afilt8
  
  ; 1st order lowpass filters in feedback
  ; loops of delay lines.
  afilt1  tone    adel1 * igain, itone
  afilt2  tone    adel2 * igain, itone
  afilt3  tone    adel3 * igain, itone
  afilt4  tone    adel4 * igain, itone
  afilt5  tone    adel5 * igain, itone
  afilt6  tone    adel6 * igain, itone
  afilt7  tone    adel7 * igain, itone
  afilt8  tone    adel8 * igain, itone
  
  ; The outputs of the delay lines are summed
  ; and sent to the stereo outputs. This could
  ; easily be modified for a 4 or 8-channel 
  ; sound system.
  aout1 = (afilt1 + afilt3 + afilt5 + afilt7)
  aout2 = (afilt2 + afilt4 + afilt6 + afilt8)
  ;outs    aout1, aout2
  ; To the output mixer
  zawm aout1, 5
  zawm aout2, 6
  ga1 = 0
endin


; ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
; Output mixer
; It applies a bass enhancement, compression and fadeout
; to the whole piece,
instr 30
  ; Read input from zak
  a1  zar 5
  a2  zar 6
  ; Bass enhancement
  al1 butterlp a1, 100
  al2 butterlp a2, 100
  a1 = al1*1.5 +a1
  a2 = al2*1.5 +a2 

  ; Global amplitude shape
  kenv   linseg 0., p5 / 2.0, p4, p3 - p5, p4, p5 / 2.0, 0.
  a1=a1*kenv
  a2=a2*kenv 
  
  ; Compression
  a1 dam a1, 5000, 0.5, 1, 0.2, 0.1  
  a2 dam a2, 5000, 0.5, 1, 0.2, 0.1  

  a1blocked 	dcblock		a1
  a2blocked	dcblock		a2
  
  outs a1blocked, a2blocked
  zacl 0, 10
endin
''')
instrumentCount = csound.getArrangementCount()
musicModel.setConformPitches(True)
musicModel.createCsoundScore('''
i  9 0 [550.0+15]  95     95        0
i 10 0  550.0      10     30
i 25 0 [550.0+15]  0.98   0.8  20000
i 30 0  550.0      16     10   
''')
csound.perform()
























































