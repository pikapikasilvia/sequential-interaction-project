# Week 5 Process Template: Refining your final prototype

Text for each row of the template, ready to paste. Images are in `process/screenshots/`.

---

## Project Name

**Pompom Sequence**

## Final concept

You find a small, deflated pompom lying on the ground. Pressing and holding it puffs it up to full fluff. You then drag it onto a launch mark and throw it, slingshot-style, into a ring. The sequence is one continuous, linear experience with the same pompom from start to finish. I want it to feel tactile and a little playful: the pompom should seem soft and alive, with fibers that tremble, lag and burst in response to your hand, so each gesture feels like handling a real object rather than pressing a button.

## Final prototype link

https://pikapikasilvia.github.io/sequential-interaction-project/

(Repository: https://github.com/pikapikasilvia/sequential-interaction-project. Add `?tune` to the URL to show the tool panels.)

## Your custom tool panel(s)

*Image: `screenshots/0-panels.png`*

I built two panels, each floating and collapsible, with every value labeled with its unit and range, and *Restore defaults* and *Copy settings* buttons.

- **Motion panel** (left): refines how each step *feels*. Hold: hold duration, deflated size, fiber shake, and inflate curve. Drag: follow stiffness and damping, launch-mark snap distance, and snap motion. Throw: max pull distance, throw power, gravity, bounce, rolling friction, ring radius, hit tolerance, and the return motion after a miss. Motion curves can be set to Linear, Ease In, Ease Out, Ease In-Out or Spring/Bounce.
- **Visual panel** (right): refines how the grayscale study becomes a unified visual experience. It adjusts the background color and paper grain, the darkest and lightest fiber colors, fiber opacity and thickness, ring fill, outline and outline width, cue colors (hint rings, launch mark, aim path, progress arc), and shadow color, opacity and softness.

I wanted to refine the balance between "soft and floaty" and "weighty", and to test whether a color and texture direction could make the three studies read as one object in one world.

## Settings variation 1

*Image: `screenshots/1-default.png`*

**Default feel.** Hold 1.1 s, medium throw power (3.4), gravity 2000 px/s², bounce 0.38, grayscale visuals matching the original studies. This is the balanced baseline: the hold is long enough to feel deliberate, and the throw arcs and settles at a readable pace.

## Settings variation 2

*Image: `screenshots/2-lighter.png`*

**Lighter.** Hold 0.6 s, gravity lowered to 1100, bounce raised to 0.62, rolling friction 0.25, drag more responsive (stiffness 120, damping 9). Visuals: pale lavender and pink, thinner strands, light grain, and a faint, soft shadow. The pompom inflates quickly and floats and bounces more, so it feels airy and toy-like.

## Settings variation 3

*Image: `screenshots/3-heavier.png`*

**Heavier.** Hold 1.8 s, gravity raised to 3400, bounce cut to 0.12, more rolling friction (0.03), a smaller ring (0.65) and a slower, heavier drag (stiffness 60, damping 20). Visuals: dark background, thick caramel-colored strands, strong grain and a dark, hard shadow. Inflating takes effort, the throw drops quickly and barely bounces, and the smaller target makes landing a hit feel earned.

## Concept evolution

My Week 3 direction started as three separate grayscale studies of one pompom: **Hold** (press to inflate), **Drag** (move it on a spring) and **Flick** (throw it so it slides and bounces off the walls). When I combined them into one sequence, my professor pointed out that **Drag and Flick felt too similar**: both were "press, move, release", and the only difference was release speed, so they didn't read as two distinct interactions.

That feedback led me to replace Flick with **Throw**. Throw uses an opposite gesture, pulling *back* and releasing like a slingshot, and adds height, an arc, a shadow and landing bounces, so being thrown into the air feels clearly different from being dragged along the ground. I also added a goal: a dashed launch mark and a target ring. Now the end of Drag (dropping the pompom onto the launch mark) becomes the start of Throw, which makes the sequence more connected and gives it a clear ending.

## Final Prototype Reflection

Building the panels turned guesses into quick experiments. Instead of editing numbers in code and reloading, I could drag a slider and immediately feel the difference. That helped me discover how much of the "personality" comes from just a few values: gravity and bounce decide whether the pompom feels light or heavy, and hold duration decides whether inflating feels effortless or effortful. The Visual panel showed me that color and texture change the perceived weight too: the same physics reads heavier with dark, thick fibers and a hard shadow.

The most resolved part is the hand-off between steps. Hold unlocks Drag, Drag ends by snapping onto the launch mark, and Throw starts from there, all with the same pompom, so the sequence feels continuous rather than like three demos stitched together.

Next, I'd like to explore committing to one unified visual direction for Part 2, adding sound and visual feedback that change with the chosen "weight", and testing with other people to find which balance of light and heavy feels most satisfying.
