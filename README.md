# multiverse: Generative art with Adobe Photoshop

Multiverse is a collection of Adobe Photoshop scripts for making generative art,
created by Carl Tashian and Petra Cortright for the 2018 edition of Rhizome's
[Seven on Seven](https://rhizome.org/sevenonseven/) event at the New Museum
in NYC.

## Usage

If you just want to use this project in Photoshop, simply download the
contents of this repository. Then copy all the `*.jsx` files from the `build`
directory into Photoshop's `Scripts` folder (under `Presets`) and restart
Photoshop. The scripts will appear in Photoshop's File &rarr; Scripts menu

The scripts that run forever can be cancelled by hitting `Esc`.

Here's a brief description of the individual scripts:

### multiverse

This is a script that runs forever, and it combines a lot of the functionality
of the other scripts listed here, to create a generative art piece.

#### Requirements

You will need three layer groups (sets) in your document, with the
following names:

`remix` — the top layers in the document. These will be shown/hidden quite
frequently.

`midfield` — middle layers (possibly with alpha) that we don't want to have
floating to the top because they're too imposing

`background` — these layers should cover the entire canvas and, importantly,
these layers have no alpha. They could be mixed together, hidden or shown at
various opacities around 100%. Be sure they're _not_ marked as background
layers.

Locked and background layers will not be touched. The script will never move
layers between layer sets, only to the top of the set they're in.

#### How it works

It starts by fading 80% of the remix and midfield layers.

Then, it alternates between two modes: **regular mode** and **scene change** mode.

In **regular mode**, we shuffle around the remix and midfield layers and adjust
their opacity. Remix layers pop up on top or fade in. Midfield layers only
fade in and out.

Scene change mode is a special mode that happens every 5-10 minutes.

In **scene change mode**, we fade out and hide most of the remix and midfield
layers. Then we bring the lowest background layer to the top of the background
layer set and fade it in.

Once that's done, we go back to regular mode and start building up the top of
the canvas again.

#### Adjusting the settings

There's a lot you can change in the script that will affect its behavior. (see Development, below)

Some things that will affect the experience the most:

* how often remix layers pop to the surface vs. fade in
* the final opacity of each layer when it fades in
* how many layers we attempt to operate on at a time (more layers in play -> script is slower, fewer -> script is faster)
* how many steps of opacity to move through while fading in or out

It's important to note that the slowest operations are refreshing the
canvas (calling `refresh()`, which happens after every tick), and adjusting the
opacity of a layer. So, you can play with how many simultaneous changes you make
between refreshes to achieve your desired pace. You can also manually insert
calls to `$.sleep()` if you want to slow the pace.

### assign\_layer\_names

This script prompts you to choose any text file and will assign the names of
layers in the active document randomly, using lines from the file.

This is useful if you use a lot of layers and want names that are less generic
than "Layer 23."

As an example, we've included a list of rose variatals in
[roses.txt](https://github.com/tashian/multiverse/blob/master/roses.txt).

### random\_layer\_visibility

Go through the active document and randomly turn on and off layers.

### random\_opacity

Randomly set opacity for all layers in the active document.

### random\_opacity\_and\_visibility

A combination of the above two scripts!

### random\_motion\_blur

Randomly apply some motion blur to all layers.

### shuffle\_unlocked\_layers

Like iTunes for Adobe Photoshop, this shuffles all unlocked layers in the active
document. This will not move layers outside of layer sets, but will shuffle
layers within them.

## Development

You will need:

* [node.js](https://nodejs.org/en/)

Install the dependencies:

    npm install

Build the scripts:

    npm run build

Lint the scripts:

    npm run lint

## Thank you

Thank you to [Rhizome](http://rhizome.org/) for supporting the creation of this project,
and for being a champion of digital art and culture.
