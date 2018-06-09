import Document from '@atjson/document';
import WebComponentRenderer from './webcomponent-renderer';
import events from './mixins/events';
import './text-selection';
import './text-input';

const TEXT_NODE_TYPE = 3;
type Range = { start: number, end: number };

type Element = TextNode | HTMLElement;

export default class Editor extends events(HTMLElement) {

  selection: Range;

  static template = '<text-input><text-selection><div class="editor" style="white-space: pre-wrap; padding: 1em;" contenteditable></div></text-selection></text-input>';

  static events = {
    'change text-selection'(evt) {
      this.selection = evt.detail;
      this.scheduleRender();
    },

    'insertText text-input'(evt) {
      this.document.insertText(evt.detail.position, evt.detail.text);
      this.selection.start += evt.detail.text.length;
      this.selection.end += evt.detail.text.length;
    },

    'deleteText text-input'(evt) {
      let deletion = evt.detail;
      this.document.deleteText(deletion);
      // FIXME the selection should just be an annotation that we transform. We shouldn't handle logic here.
      if (this.selection.start < deletion.start) {
        // do nothing.
      } else if (this.selection.start < deletion.end) {
        this.selection.start = this.selection.end = deletion.start;
      } else {
        let l = deletion.end - deletion.start;
        this.selection.start -= l;
        this.selection.end -= l;
      }
    },

    'replaceText text-input'(evt) {
      let replacement = evt.detail;

      this.document.deleteText(replacement);
      this.document.insertText(replacement.start, replacement.text);
      this.selection.start = replacement.start + replacement.text.length;
    },

    'addAnnotation text-input'(evt) {









  scheduleRender() {
    console.log('schedule render called.');
    window.requestAnimationFrame(() => {
      this.render(this.querySelector('.editor'));
      let evt = new CustomEvent('change', { bubbles: true, detail: { document: this.document } });
      console.log('dispatching event', evt);
      this.dispatchEvent(evt);
    });
  }

  render(editor) {
    let rendered = new WebComponentRenderer(this.document).render();

    // This can be improved by doing the comparison on an element-by-element
    // basis (or by rendering incrementally via the HIR), but for now this will
    // prevent flickering of OS UI elements (e.g., spell check) while typing
    // characters that don't result in changes outside of text elements.
    if (rendered.innerHTML != editor.innerHTML) {
      console.table({
        current: rendered.innerHTML,
        updated: editor.innerHTML
      });
      console.info('Rendering', this.document);
      editor.innerHTML = rendered.innerHTML;

      // We need to do a force-reset here in order to avoid waiting for a full
      // cycle of the browser event loop. The DOM has changed, but if we wait
      // for the TextSelection MutationObserver to fire, the TextSelection
      // model will have an old set of nodes (since we've just replaced them
      // with new ones).
      //
      // PERF In the event of performance issues, this is a good candidate for
      // optimization.
      if (this.selection) {
        this.querySelector('text-selection').reset();
        this.querySelector('text-selection').setSelection(this.selection);
      }
    }
  }

  setDocument(value: Document) {
    this.document = value;
    this.document.addEventListener('change', (_ => this.scheduleRender() ));
  }

  getSelection() {
    return this.querySelector('text-selection');
  }

  connectedCallback() {
    this.innerHTML = this.constructor.template;
    super.connectedCallback();
    this.render(this.querySelector('.editor'));
    this.render(this.querySelector('.output'));
  }
}

if (!window.customElements.get('text-editor')) {
  window.customElements.define('text-editor', Editor);
}