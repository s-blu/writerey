import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import streamSaver from 'StreamSaver';

@Component({
  selector: 'wy-quill',
  templateUrl: './quill.component.html',
  styleUrls: ['./quill.component.scss']
})
export class QuillComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ align: [] }],
      ['clean'],
    ]
  };
  styles = {
    border: 'none',
    'font-family': "'Noto Serif', 'Libertinus Serif', 'Palatino Linotype', 'Book Antiqua', serif",
    'font-size': '16px'
  };
  demo = `
    

Rafael knelt at the door, stroking the wood carefully with his hand. Glimmering, interwoven strands spanned the entrance like a spider web, leading all to the door middle, where they tangled together to a perfectly white, round plane.
»What is this?«
Meadows displeaseness was hard to overhear.

Both mages who should have undertaken this mission got injured in a territory battle, alongside around half of the whole cycle. One should have imagine that Rafael and Meadow, both more battle mages than anything else, would be the worst pick for this mission but it turned out that Rafael was the last healthy mage that had even the slightest idea about concealment and lock spells. Meadow being his partner, she was pulled in without being asked. She wasn't amused.

»It's a magical lock. I can probably unravel it, but I need a moment.«
Meadow snorted disapprovingly. Rafael sighed and looked at her, as friendly as he could.
»We go in, search for hints and vanish. That's the order. It takes 15 minutes. Please try to handle 15 minutes, will you?«
She answered with a »Tz« and turned her back on him. That was almost as good as a „Yes, you're right“.

Rafael put his finger tips together, pointed them at the door and let the magic flow, down his arms, into his hands, until his tips started tingling. Hair fine strings out of bright blue sprang out of his fingers, immerging into the white hearth of the lock. Carefully, he pulled his hands apart. The white core jolted, unfolded itself, revealing dozens of thin strands knotted together like a ball of wool.

He bit on his lip to keep himself from cursing. This lock was more complex than he had expected. It will probably take ages to unlock it, but he needed to try. They are here to get into this shed, after all. Rafael pulled a bit stronger and the lock was shaken, folding itself back together. He loosened his grip again to keep it open, plucked out a string and began to follow him.

Meadows patience held for exactly one and a half minute.
»You're taking too long«, she rumbled.
»It's a wee bit more difficult than expected.«
A strong hand gripped his shoulder and pulled him backwards. He stumbled away from the door, losing connection to the lock. It immediately went back to its solid, compact state.
Rafael tumbled two steps until he managed to stop. He looked at her furiously.
»What the hell are you doing?!«
She ignored him and went closer to the door. Rafael did a step forward, prepared himself to tell her that she has no clue what she's doing, when his attention was drawn to her arm.

It glowed from the inside in a faint, red light. A red rune levitated millimeters above the back of her hand. She clenched her hand together and pulled it back. A pulse of light raced from her shoulder down into the fist. Rafael felt a rush of panic.
»Nononono you must not-«
She smashed her fist in the center of the lock. For a moment, it looked like it would resist, as the lock sucked up most of the impact. Then, as in slow motion, the door creaked and was pushed in. The magical lock burst like glass. The door followed with a loud crash, shattered apart in dozens splinters.
Rafael threw his hands over his head.
»That is a goddamn alarm system, you idiot!«, he yelled.
She looked at him unimpressed.
»Then hurry up.«
He glared at her. He needed a moment to restrain himself picking a fight with Meadow. Time was ticking.

It was dark inside the small shed, several crates stood around, stools and small desks formed a working space overrun by papers. It was a mess. Rafael picked some piles apart randomly, flipping through papers and checking the content of crates, until he found something interesting. A chest was tucked away in the corner of the shed, anchored and locked by the same spider web spell like the door. Rafael pointed his fingertips at the core.

»Time is up«, Meadow shouted from outside.
Argh! He was sure that this chest was important. There need to be something interesting in it. It will be gone when they leave now.
He cursed Meadows impulsive decisions.
»How many?« he asked aloud, while pulling the lock apart. Exactly as complex as on the door.
»Four.«
At least one too many. Rafael cut the connection to the lock and ran outside, to Meadows side. The enemy mages were only a few hundred meters away. Runes glowed along Meadows whole arm length. She was ready to smash heads.
»We leave«, he decided.
Meadow looked at him from the side, evaluating how serious he is.
»Now.«
The runes on her arms faded and she turned around.
They started running.

  `;

  constructor() { }

  ngOnInit(): void {
  }



  changedEditor(event) {

    console.log('changed editor');
    console.log(event);
    // saveAs(event.html, 'testdatei.txt')
    // const fileStream = streamSaver.createWriteStream('filename.txt', {
    //   size: 22, // (optional) Will show progress
    //   writableStrategy: undefined, // (optional)
    //   readableStrategy: undefined  // (optional)
    // })

    // new Response('StreamSaver is awesome').body
    //   .pipeTo(fileStream)
    //   .then((e) => console.log('sucess', e), (e) => console.log('error', e))
  }
}
