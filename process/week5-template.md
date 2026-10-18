# Week 5 Process Template: Refining your final prototype

Text for each row of the template, ready to paste. Images are in `process/screenshots/`.

## Project Name

Pompom Sequence

## Final concept

A tiny, deflated pompom is lying on the ground, trembling a little like it wants attention. You press and hold it until it puffs up into a full, fluffy ball. Then you drag it over to a launch spot, pull it back like a slingshot, and toss it into a ring. It's one short, continuous moment with the same pompom from start to finish. I wanted it to feel soft and a bit silly, like you're playing with something that's almost alive. The fibers shiver when you hold it, trail behind when you move it, and puff out when it lands.

## Final prototype link

https://pikapikasilvia.github.io/sequential-interaction-project/

## Your custom tool panel(s)

*Image: `screenshots/0-panels.png`*

I made two panels that sit on either side of the prototype and can be folded away.

The Motion panel is all about feel. For Hold, I can change how long you need to press, how flat the pompom starts and how much the fibers shake. For Drag, I can make it follow your finger tightly or lazily, and change how close you have to drop it to the launch spot. For Throw, I can play with pull distance, throw strength, gravity, bounce, rolling friction, ring size and how forgiving a "hit" is. I can also switch the motion curves between linear, eased and springy.

The Visual panel is where I tried to turn my three grey studies into one world. It controls the background color and paper texture, the colors and thickness of the fibers, the ring and guide colors, and how dark and soft the shadow is.

Mostly I wanted to figure out where the pompom sits between "light and floaty" and "heavy and solid", and whether color alone could make the three steps feel like one object.

## Settings variation 1

*Image: `screenshots/1-default.png`*

The original grey version. Hold for 1.1 seconds, medium gravity, a bit of bounce. It's basically my studies stitched together. It works, and the timing feels calm and even, but it's a little plain.

## Settings variation 2

*Image: `screenshots/2-lighter.png`*

The lighter version, and the one I ended up using. The hold only takes 0.6 seconds, gravity is much lower and the bounce is way higher, so the pompom floats up and hops a few times before settling. The drag snaps to your finger faster too. I paired it with soft lavender and pink, thinner fibers and a faint, blurry shadow. It feels airy, almost like a toy.

## Settings variation 3

*Image: `screenshots/3-heavier.png`*

The heavy version. You have to hold for 1.8 seconds, gravity is cranked up, there's barely any bounce and the ring is smaller. Dragging feels slow, like it has real weight. I gave it a dark background, thick caramel-colored fibers and a hard black shadow. It feels more like a wool ball than a pompom, and landing a throw feels like an actual achievement.

## Concept evolution

In Week 3 I had three separate grey studies of the same pompom: Hold to inflate it, Drag to move it around, and Flick to send it sliding and bouncing off the walls. When I put them together, my professor pointed out that Drag and Flick were basically the same gesture. Both were press, move, let go. The only difference was how fast you let go, so they didn't feel like two different interactions.

That pushed me to swap Flick for Throw. Instead of pushing the pompom forward, you pull it back and let go like a slingshot. I added height, an arc, a shadow and little bounces on landing, so throwing it into the air feels really different from sliding it along the ground. I also gave it somewhere to go: a dashed launch spot and a target ring. That turned out to connect everything better, because the end of Drag (dropping it on the launch spot) is now exactly where Throw begins.

## Final Prototype Reflection

The panels changed how I worked. Before, I'd change a number in the code, reload and try to remember what it felt like before. With sliders I could just drag and feel the difference right away. I was surprised how much of the pompom's personality came down to a few numbers. Gravity and bounce decide whether it feels light or heavy, and hold time decides whether puffing it up feels easy or like effort. Color mattered more than I expected too. With the exact same physics, dark thick fibers and a hard shadow made it feel heavier. After comparing all three, I went with the lighter purple version because it matched the soft, playful feeling I had in mind from the start.

I think the transitions between steps are the most finished part. Holding unlocks dragging, dropping it on the launch spot sets up the throw, and it's the same pompom the whole time, so it feels like one little story instead of three separate demos.

Next I'd like to keep polishing the visuals, add sounds that match the lighter feel, and let other people try it to see whether they prefer it light or heavy.
