import { Dialog, ButtonView, Plugin, View } from "ckeditor5";
import { CustomEditorConfig } from "../../app.component";

export class AngularDialogModal extends Plugin {
    // Make sure the "Dialog" plugin is loaded.
    get requires() {
        return [Dialog];
    }

    init() {
        // Add a button to the component factory so it is available for the editor.
        this.editor.ui.componentFactory.add('showModal', locale => {
            const buttonView = new ButtonView(locale);

            buttonView.set({
                label: 'Generate report from Speech',
                tooltip: true,
                withText: true
            });

            // Define the button behavior on press.
            buttonView.on('execute', () => {
                const dialog = this.editor.plugins.get('Dialog');

                // If the button is turned on, hide the modal.
                if (buttonView.isOn) {
                    dialog.hide();
                    buttonView.isOn = false;

                    return;
                }

                buttonView.isOn = true;

                // Otherwise, show the modal.
                // First, create a view with some simple content. It will be displayed as the dialog's body.
                const textView = new View(locale);

                textView.setTemplate({
                    tag: 'div',
                    attributes: {
                        class: 'angular-rendered',
                        tabindex: -1
                    },
                });
                let component;
                // Tell the plugin to display a modal with the title, content, and one action button.
                dialog.show({
                    id: 'angular-dialog',
                    isModal: true,
                    title: 'Upload Speech Modal',
                    content: textView,
                    actionButtons: [
                        {
                            label: 'OK',
                            class: 'ck-button-action',
                            withText: true,
                            onExecute: () => dialog.hide()
                        }
                    ],
                    onHide() {
                        if (component) {
                            const html = component.instance.transcription;
                            this.editor.setData(html);
                        }
                        buttonView.isOn = false;
                    },
                    onShow: () => {
                        component = (this.editor.config as any).get('render')(textView.element);
                    }
                });
            });

            return buttonView;
        });
    }
}
