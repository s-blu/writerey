import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'wy-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.css']
})
export class CkeditorComponent implements OnInit {
  @Input() content: string;

  @Output() contentChange: EventEmitter<any> = new EventEmitter();

  public Editor = ClassicEditor;
  config = {
      extraPlugins: [ConvertDivAttributes, AllowLinkTarget]
  }

  // editor = ClassicEditor
  //   .create(document.getElementById('editor'), this.config)
  //   .then(() => console.log('ole'))
  //   .catch(error => {
  //     console.error(error);
  //   });

  constructor() { }

  ngOnInit() {
  }

  onChange(event) {
    console.log('ssss', event)
    console.log(event.editor.getData())
    this.contentChange.emit(event);
    }

}

function ConvertDivAttributes(editor) {
  // Allow <div> elements in the model.
  editor.model.schema.register('div', {
    allowWhere: '$block',
    allowContentOf: '$root'
  });

  // Allow <div> elements in the model to have all attributes.
  editor.model.schema.addAttributeCheck(context => {
    if (context.endsWith('div')) {
      return true;
    }
  });

  // View-to-model converter converting a view <div> with all its attributes to the model.
  editor.conversion.for('upcast').elementToElement({
    view: 'div',
    model: (viewElement, modelWriter) => {
      return modelWriter.createElement('div', viewElement.getAttributes());
    }
  });

  // Model-to-view converter for the <div> element (attributes are converted separately).
  editor.conversion.for('downcast').elementToElement({
    model: 'div',
    view: 'div'
  });

  // Model-to-view converter for <div> attributes.
  // Note that a lower-level, event-based API is used here.
  editor.conversion.for('downcast').add(dispatcher => {
    dispatcher.on('attribute', (evt, data, conversionApi) => {
      // Convert <div> attributes only.
      if (data.item.name != 'div') {
        return;
      }

      const viewWriter = conversionApi.writer;
      const viewDiv = conversionApi.mapper.toViewElement(data.item);

      // In the model-to-view conversion we convert changes.
      // An attribute can be added or removed or changed.
      // The below code handles all 3 cases.
      if (data.attributeNewValue) {
        viewWriter.setAttribute(data.attributeKey, data.attributeNewValue, viewDiv);
      } else {
        viewWriter.removeAttribute(data.attributeKey, viewDiv);
      }
    });
  });
}

function AllowLinkTarget( editor ) {
  // Allow the "linkTarget" attribute in the editor model.
  editor.model.schema.extend( '$text', { allowAttributes: 'linkTarget' } );

  // Tell the editor that the model "linkTarget" attribute converts into <a target="..."></a>
  editor.conversion.for( 'downcast' ).attributeToElement( {
      model: 'linkTarget',
      view: ( attributeValue, writer ) => {
          const linkElement = writer.createAttributeElement( 'a', { target: attributeValue }, { priority: 5 } );
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
      model: 'linkTarget',
      converterPriority: 'low'
  } );
}