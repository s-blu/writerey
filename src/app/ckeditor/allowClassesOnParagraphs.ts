function AllowLinkTarget(editor) {
    // Allow the "linkTarget" attribute in the editor model.
    editor.model.schema.extend('p', { allowAttributes: 'class' });

    // Tell the editor that the model "linkTarget" attribute converts into <a target="..."></a>
    editor.conversion.for('downcast').attributeToElement({
        model: 'class',
        view: (attributeValue, writer) => {
            const linkElement = writer.createAttributeElement('p', { target: attributeValue }, { priority: 5 });
            writer.setCustomProperty('class', true, linkElement);

            return linkElement;
        },
        converterPriority: 'low'
    });

    // Tell the editor that <a target="..."></a> converts into the "linkTarget" attribute in the model.
    editor.conversion.for('upcast').attributeToAttribute({
        view: {
            name: 'p',
            key: 'class'
        },
        model: 'class',
        converterPriority: 'low'
    });
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
                    // Convert <tagName> attributes only.
                    if (data.item.name !== tagName) {
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
        };
    }