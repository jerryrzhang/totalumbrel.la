---
title: "Crest 61 - A custom-designed columnar staggered split keyboard"
date: "2024-11-25"
tags: ["project"]
---

<figure class="full-image">
  <Image src="images/crest61/board.png" alt="Alt text"/>
  <figcaption>looks good, doesnt it?</figcaption>
</figure>

<span class="first">T</span>his project was definitely a long time coming, and is my first major project (although still in its first revision). It is, interestingly, a perfect first project which introduced me into the hobby electronics world, deriving from my interest with keyboards.

This **surprisingly** is only my second keyboard build, much farther down the rabbit hole than you would expect by now, but that's only because my dwindling funds could not support a new keyboard purchase every single time a [nice case](https://www.alexotos.com/neo-ergo-review/) dropped, or a [new switch](https://www.theremingoat.com/blog/gateron-g-pro-3-yellow-switch-review) caught my interest. *(I sure was tempted though)*

So I decided to jump straight to endgame(ish) and build my own from scratch, using help from:
 - [This video](https://www.youtube.com/watch?v=7UXsD7nSfDY&list=WL&index=56) from Christian Selig
 - [This video](https://www.youtube.com/watch?v=M_VuXVErD6E&list=WL&index=55) amongst others from Ben Vallack
 - and [FlatFootFox's](https://flatfootfox.com/ergogen-introduction/) amazing Ergogen guide

## Specs
- Custom ortholinear layout, designed in [ergogen](https://ergogen.cache.works)
- Hand lubed gateron milky yellows *(classic)*
    - My original kb was done with Alpaca V2s, but for this one I wanted something with a little bit heavier actuation.
- TX "AP" Revision 4 stabs
- Some cheap knockoff xda botanical caps from [aliexpress](https://www.aliexpress.com/item/1005004559625865)
    - which have japanese legends on them, since they were the only ones available 😔 oh well...
- Gasket mounted (which, in hindsight, was a bit of a mistake but i'll get to that later)
- two rotary encoders 🤗
- supermini nrf52840 (nice!nano clones which run the same)
    -[Nice!Nanos](https://nicekeyboards.com/nice-nano/) are typically standard for split ble builds, but I'm poor, so I used clones from aliexpress which run the same chip
- ble with an 1800mAh [battery](https://www.aliexpress.com/item/1005005213892382.html?spm=a2g0o.order_list.order_list_main.207.50f418021CJyJC) for each side.
    - These are the same batteries which ps3 controllers use, which is handy because they are robust, cheap, and use a common connector. Very nice hardware.
- zmk firmware can be fond [here](https://github.com/jerryrzhang/zmk-config-crest)

That is basically all I can think of for specs.

## Design

<figure class="right-image">
  <Image src="images/crest61/ergogen-right.png" alt="Alt text"/>
  <figcaption>right half !!</figcaption>
</figure>

The design state was definitely the most fun, allowing me to do basically whatever I wanted without much consequence. 

#### Layout

The first step was to make an ortholinear keyboard layout with [ergogen](https://ergogen.cache.works/), which takes in a yaml/json file and outputs layouts drawings and a netted kicad file.

>You can see the layout I settled with for the right side 👉, with the left side being a quite similar mirror image.

While designing this layout, I had a few problems which I initially aimed to solve:
- my left hand 👍 could comfortably touch type, but my right hand 🖐 needs to hover over the keyboard to press enter and backspace.
  - I could easily solve this by harnessing the power of a split spacebar, which was replaced on the right side with backspace and return.
- keys need to stay in generally similar positions, especially on the left side, to avoid rebinding keys in cad software and games.
  - I retained the `;` , `[`, and `'` keys on the right side, with `]` and `\` being relegated to a different layer.
  - the space bar was also kept in half size on the left side, as I use its entire length when typing vs gaming.
- I hate [mod tap](https://zmk.dev/docs/keymaps/behaviors/hold-tap) behaviour, so I would like to retain the modifier keys.
  - I just kind of kept them where they were instead of getting rid of them like most ortho layouts. the alt key was placed on a slight tilt to accomodate the curve of the space bar. 😃
- and I heavily use the arrow keys while gaming and navigating code, so I would like to keep them on the base layer.
  - these remain in a small detached cluster, similar to that in the [keychron q1](https://keychron.com.au/products/keychron-q1-max-qmk-via-wireless-custom-mechanical-keyboard).

I finished with a design which feels faithful to the classic 75% layout, while also taking creative liberties to improve economics here and there.

#### PCB

In this stage, I was forced to learn the pcb editor [kicad](https://www.kicad.org/), which actually had a smoother learning curve than I first expected.

<figure class="left-image">
  <Image src="images/crest61/kicad-right.png" alt="Alt text"/>
  <figcaption>what beautiful professional traces</figcaption>
</figure>

Ergogen generates a netted pcb file for you, which means you can import it straight into kicad, and all the connections are marked for you to join with traces. The image to the left is of the left side pcb, with all the traces drawn into place. 

This is actually where we have to start being pedantic, because this design will get shipped off to China to be manufactured. 😨

The hardest part about this stage was accounting for the fact that my keyboard was designed to be a sort of hybrid between your [typical ortho split](https://github.com/foostan/crkbd) and a [classic 75%](https://keychron.com.au/collections/75-layout-keyboards/products/keychron-k2-wireless-mechanical-keyboard). Since my board has two keys larger than 1.75u, it needs fitting stab holes in the pcb. 

Designing the pcbs was fairly difficult, however unforunately for me, it was not the hardest part of the project...

#### Case 

I'd like to preface this section by saying that I am by no means a professional, only slightly casually experienced in the field of CAD design, and if you have proper experience, the poor design choices might be hard to read...

<figure class="center-image">
  <Image src="images/crest61/fusion-right.png" alt="Alt text"/>
  <figcaption></figcaption>
</figure>

> The only experience in 3d cad software I have is Fusion360, which is rather regrettable, due to its painfully priced subscription scheme... I'm currently getting free access from my uni course, but I should probably switch to solidworks before its too late.

First was to export a 3d model of the pcbs to fusion, so that I could design a case around it. This was fairly easy, since each switch footprint was a repeated unit, so I simply needed to assign 3d models for the socket, switch and diode for each switch.

Then, the prints for the microcontroller, switches, jst-ph battery connector socket, and stabs were placed in manually on both sides of the keyboard.

Before I started on the case, I needed to choose a system which the pcb/plate would be mounted to the case, the most common of which can be found [here](https://www.keyboard.university/200-courses/keyboard-mounting-styles-4lpp7). I **initially** sought to use the much simpler integrated plate method. Since the case would be 3d printed, this would be by far the least complex mounting system 🔥. 

Instead however, and perhaps regrettably, decided on using a [gasket mounted](https://www.reddit.com/r/MechanicalKeyboards/comments/127ff3n/lets_talk_about_gasket_mount/) system, like those found in non-split keyboards where the plate is **sandwiched** between silicone or foam spacers before being mounted onto the case. I dont really... know what the effective difference is to be completely honest here 😓. The hearsay says that it makes the typing bouncier and the sound poppier. I've never seen nor tried a non-gasket keyboard so I don't know if the difference in rigidity matters or not. Perhaps I will test this next revision.

The plate dwg was generated from ergogen, and after deciding on [some gaskets](https://www.aliexpress.com/item/1005005793344984) that would be used, I designed the case around it.

<figure class="right-image">
  <Image src="images/crest61/cross-section.png" alt="Alt text"/>
  <figcaption>the cross section™</figcaption>
</figure>

The image to the right shows the completed design, with a few iterations done on it. 
There is about 1.5mm of leeway between the plate and the case for a 3mm gasket 🤏. This distance affects the rigidity of the gasket system.

Since the pcb is only held onto the plate through the switches, standoffs must be added to the plate in order to keep a consistent spacing between the plate and the pcb 😀.

Unfortuantely for me however, this started causing issues with pcb horizontal clearance, while trying to keep the walls as thin as possible. Each wall must be a minimum of 5.5mm thin, accounting for the 3mm gasket and 2.5mm wall. The corners had to remain this width too, to leave room for nuts in order to fit mounting screws. 

>You may notice a slight tilt on the bottom of the case, and that is to make the typing experience on xda keycaps just a little bit better.

I compromised by removing the space for gaskets on some parts of the bottom, meaning that there was a little more flex when pressing the space bar key.

<figure class="full-image">
  <Image src="images/crest61/bottom-strip.png" alt="Alt text"/>
  <figcaption></figcaption>
</figure>

## Assembly

Assembly went surprisngly well for someone who doesn't really know what he's doing. After completing the pcb designs I ordered all the parts off aliexpress, and sent the gerber files for the pcbs to a chinese pcb manufacturer. There was a minimum buy of 5 copies, so at least I knew I had room to screw up 😅.

#### Soldering

<figure class="small-right-image">
  <Image src="images/crest61/solder.png" alt="Alt text"/>
  <figcaption>not the greatest work i've done...</figcaption>
</figure>

The soldering was a bit mind numbing. Perhaps it was the lead poisoning?🤔
I hadn't soldered much before this, so my skills gradually improved while I painstakingly soldered 61 smd diodes one by one (followed by 61 kailh sockets). I need to invest in a reflow machine...

Next was to solder the switches and microcontroller, and only during this did I realise that I had forgotten to trace one of the power lines, which was fixed by a quick red jumper wire **which can be seen in the cover image**.

Surprisingly however, there was no issue with any of my dubious soldering joints, and when the firmware was later uploaded, it worked like a charm 😁.

#### Plates

The plates ended up only going through 2 iterations, the first of which had an issue with clearance from the stablizers. When I had initially used a stab footprint cutout, the hole was a little too small, resulting in pressure on the sides of the stabs, which caused the space and enter keys to feel painfully sluggish.

<figure class="multiple-image">
  <Image src="images/crest61/v1-edited.png" alt="Alt text"/>
  <Image src="images/crest61/v2-edited.png" alt="Alt text"/>
</figure>

You can see my first attempt on the left, where I had tried to shave the edges to make it fit better. 

On the second attempt, I made the hole comedically large, so that I wouldn't have to think about this issue again. 😌

#### Case

The case was a simple print, and there were only two iterations, since there were **aforementionted** issues with pcb clearance. The choice to use nuts instead of heat inserts was a bit dubious, but they were what I had on hand.

<figure class="left-image">
  <Image src="images/crest61/case.png" alt="Alt text"/>
  <figcaption></figcaption>
</figure>

You can see here the right case, with some foam in the middle. 
There were **clearance** issues on the right side for pcb so the gasket area was removed. 

The nuts on the top left were initially there for an acrylic over the microcontroller, but I did not have a laser cutter available to me, so it was just left as is 😢.

The choice to place the battery slot near the middle of the base was not the greatest... ☹️ While trying to reduce the height of the keyboard I ran into some issues with clearance of the battery. If it was placed at the **top** of the case, the tilt would allow a lower height, which is important since the caps are xda profile. 

*Notes for next iteration I guess.*

<figure class="right-image">
  <Image src="images/crest61/switches.png" alt="Alt text"/>
  <figcaption></figcaption>
</figure>

#### Final Assembly
Now with everything completed, all that remained was for the final assembly of switches and keycaps. 🤗

This went overall smoothly. Later I switched the keycaps and keybindings to match the following:

`
M <---> N
`
`
I <---> K
`
`
O <---> L
`
`
P <---> ;
`

As seen in the cover image

The botanical set works great with this layout, especially with the novelty keys.

## Final notes


>The final assembled build is simply a *V1*, similar to a proof of concept. But even then, its good enough to daily drive.

Things I want to include in the future:
- [touchpad](https://www.cirque.com/glidepoint-circle-trackpads) on one side of the keyboard, probably right so I dont have to lift my hand to move my mouse 🥱
- thumb cluster a bit more splayed, or more keys below
- vertically shorter, and possibly more tilted 😵
- nice!view or similar *sharp* eink screen.
- another version with ultra low profile kailh switches.

I feel like I burnt out by the end of this project, and when I make a V2, I want to give it a proper finish.

For those that are interested, here is a sound test.

<figure>
  <figcaption></figcaption>
  <audio controls src="sounds/keyboard.mp3"></audio>
</figure>
