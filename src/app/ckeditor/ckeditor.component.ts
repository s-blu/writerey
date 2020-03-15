import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'wy-ckeditor',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss']
})
export class CkeditorComponent implements OnInit {
  @Input() content: string;

  @Output() contentChange: EventEmitter<any> = new EventEmitter();
  @Output() hover: EventEmitter<any> = new EventEmitter();

  public Editor = ClassicEditor;
  config = {
    toolbar: ['heading', '|', 'bold', 'italic', '|', 'numberedList', 'bulletedList',
      '|', 'blockQuote', 'indent', 'outdent', '|', 'undo', 'redo'],
    extraPlugins: [allowElementPluginBuilder('internal-ids'), allowElementPluginBuilder('div')]
  };

  constructor() { }

  ngOnInit() {

  }

  onChange(event) {
    console.log('ssss', event)
    console.log(event.editor.getData())
    this.contentChange.emit(event);
  }

  over(event) {
    console.log('OVER AND OUT', event, event.srcElement.parentNode.classList)
    this.hover.emit(`BOI YOURE HOVERING ${event.srcElement.parentNode.classList[1]}`);
  }

}


function allowElementPluginBuilder(tagName: string) {

  return function (editor) {
    // Allow element in the model.
    editor.model.schema.register(tagName, {
      allowWhere: '$block',
      allowContentOf: '$root'
    });

    // Allow elements in the model to have all attributes.
    editor.model.schema.addAttributeCheck(context => {
      if (context.endsWith(tagName)) {
        return true;
      }
    });

    // View-to-model converter converting a view with all its attributes to the model.
    editor.conversion.for('upcast').elementToElement({
      view: tagName,
      model: (viewElement, modelWriter) => {

        return modelWriter.createElement(tagName, viewElement.getAttributes(['style', 'class']));
      }
    });

    // Model-to-view converter
    editor.conversion.for('downcast').elementToElement({
      model: tagName,
      view: tagName
    });

    // Model-to-view converter for attributes.
    // Note that a lower-level, event-based API is used here.
    editor.conversion.for('downcast').add(dispatcher => {
      dispatcher.on('attribute', (evt, data, conversionApi) => {
        // Convert <internal-ids> attributes only.
        if (data.item.name != tagName) {
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
}
