import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'wy-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss']
})
export class CkeditorComponent implements OnInit {
  // FIXME ckeditor itself needs a wrapped value, i.e. { content: string }
  @Input() content: any;

  // @Input() set content(value: string) {
  //   this.contentWrap.content = value;
  // }

  @Output() contentChange: EventEmitter<any> = new EventEmitter();
  @Output() hover: EventEmitter<any> = new EventEmitter();

  public Editor = ClassicEditor;
  public config = {
    toolbar: ['heading', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList',
      '|', 'blockQuote', 'indent', 'outdent', '|', 'undo', 'redo'],
    extraPlugins: [AllowLinkTarget]
  };


  constructor() { }

  ngOnInit() { }

  onChange(event) {
    console.log('on change', event.editor.getData())
    //this.contentChange.emit(event);
  }

  over(event) {
    // FIXME this feels like it crumbles apart by only reading it
    this.hover.emit(event?.srcElement?.parentNode?.classList[2]);
  }
}

function AllowLinkTarget( editor ) {
    // Allow the "linkTarget" attribute in the editor model.
    editor.model.schema.extend( '$text', { allowAttributes: 'parClass' } );

    // Tell the editor that the model "linkTarget" attribute converts into <a target="..."></a>
    editor.conversion.for( 'downcast' ).attributeToElement( {
        model: 'parClass',
        view: ( attributeValue, writer ) => {
            const linkElement = writer.createAttributeElement( 'p', { target: attributeValue }, { priority: 5 } );
            writer.setCustomProperty( 'link', true, linkElement );

            return linkElement;
        },
        converterPriority: 'low'
    } );

    // Tell the editor that <a target="..."></a> converts into the "linkTarget" attribute in the model.
    editor.conversion.for( 'upcast' ).attributeToAttribute( {
        view: {
            name: 'a',
            key: 'target'
        },
        model: 'parClass',
        converterPriority: 'low'
    } );
}


function newtry(editor) {
  editor.model.schema.extend('paragraph', { allowAttributes: 'pClass' });

  editor.conversion.for('upcast').attributeToAttribute({
    view: {
      name: 'p',
      key: 'class'
    },
    model: {
      key: 'pClass',
      value: viewElement => viewElement.getAttribute('class')
    },
    converterPriority: 'low'
  })
}

function allowElementPluginBuilder(tagName: string) {

  return function (editor) {
    // Allow element in the model.
    editor.model.schema.register(tagName, {
      allowWhere: '$block',
      allowContentOf: '$root',
      allowAttributes: 'pClass'
    })

    // Tell the editor that <a target="..."></a> converts into the "linkTarget" attribute in the model.
    editor.conversion.for('upcast').attributeToAttribute({
      view: {
        name: 'p',
        key: 'class'
      },
      model: 'pClass'
    });

    // Allow elements in the model to have all attributes.
    editor.model.schema.addAttributeCheck(context => {
      if (context.endsWith(tagName)) {
        return true;
      }
    });

    editor.conversion.for('downcast').attributeToElement({
      model: 'pClass',
      view: (attributeValue, writer) => {
        const linkElement = writer.createAttributeElement('p', { class: attributeValue }, { priority: 5 });
        console.log('assasdddddddddddddddddddd', linkElement)
        writer.setCustomProperty('class', true, linkElement);

        return linkElement;
      }
    });
    // View-to-model converter converting a view with all its attributes to the model.
    editor.conversion.for('upcast').elementToElement({
      view: tagName,
      model: (viewElement, modelWriter) => {
        // const val = viewElement.getAttributes('class')
        // console.log('adscvd', val)
        // return modelWriter.createAttributeElement('p', { class: val });
        //     console.log('assasdddddddddddddddddddd', linkElement)
        //     writer.setCustomProperty('class', true, linkElement);
        return modelWriter.createElement(tagName, viewElement.getAttributes(['style', 'class']));
      }
    });

    // Model-to-view converter
    // editor.conversion.for('downcast').elementToElement({
    //   model: tagName,
    //   view: tagName
    // });

    // Model-to-view converter for attributes.
    // Note that a lower-level, event-based API is used here.
    //   editor.conversion.for('downcast').add(dispatcher => {
    //     dispatcher.on('attribute', (evt, data, conversionApi) => {
    //       // Convert <internal-ids> attributes only.
    //       if (data.item.name != tagName) {
    //         return;
    //       }

    //       const viewWriter = conversionApi.writer;
    //       const viewDiv = conversionApi.mapper.toViewElement(data.item);

    //       // In the model-to-view conversion we convert changes.
    //       // An attribute can be added or removed or changed.
    //       // The below code handles all 3 cases.
    //       if (data.attributeNewValue) {
    //         viewWriter.setAttribute(data.attributeKey, data.attributeNewValue, viewDiv);
    //       } else {
    //         viewWriter.removeAttribute(data.attributeKey, viewDiv);
    //       }
    //     });
    //   });
  }
}

function schokopudding(editor) {
  // Allow the "linkTarget" attribute in the editor model.
  editor.model.schema.extend('$block', { allowAttributes: 'schokopudding' });
  editor.model.schema.extend('$text', { allowAttributes: 'schokopudding' });
  editor.model.schema.extend('$root', { allowAttributes: 'schokopudding' });

  console.log('hallo!')

  // Tell the editor that the model "linkTarget" attribute converts into <a target="..."></a>
  editor.conversion.for('downcast').attributeToElement({
    model: 'schokopudding',
    view: (attributeValue, writer) => {
      console.log('ATT VAL ATT VAL', attributeValue, writer)
      const linkElement = writer.createAttributeElement('p', { class: attributeValue }, { priority: 20 });
      console.log('assasdddddddddddddddddddd', linkElement)
      writer.setCustomProperty('paragraph', true, linkElement);

      return linkElement;
    }
  });

  // Tell the editor that <a target="..."></a> converts into the "linkTarget" attribute in the model.
  editor.conversion.for('upcast').attributeToAttribute({
    view: {
      name: 'p',
      key: 'class'
    },
    model: 'schokopudding'
  });
}