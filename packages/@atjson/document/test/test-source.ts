import Document, { AdjacentBoundaryBehaviour, Change, InlineAnnotation, Insertion, ObjectAnnotation } from '../src';

export class Anchor extends InlineAnnotation {
  static vendorPrefix = 'test';
  static type = 'a';
  attributes!: {
    href: string;
  };
}

export class Bold extends InlineAnnotation {
  static vendorPrefix = 'test';
  static type = 'bold';
}

export class Italic extends InlineAnnotation {
  static vendorPrefix = 'test';
  static type = 'italic';
}

export class CaptionSource extends Document {
  static contentType = 'application/vnd.atjson+caption';
  static schema = [Bold, Italic];
}

export class Instagram extends ObjectAnnotation {
  static vendorPrefix = 'test';
  static type = 'instagram';
}

export class Code extends ObjectAnnotation {
  static vendorPrefix = 'test';
  static type = 'code';
  attributes!: {
    class: string;
    language?: string;
    textStyle?: string;
  };
}

export class Locale extends ObjectAnnotation {
  static vendorPrefix = 'test';
  static type = 'locale';
  attributes!: {
    locale: string;
  };
}

export class Preformatted extends ObjectAnnotation {
  static vendorPrefix = 'test';
  static type = 'pre';
  attributes!: {
    style: string;
  };
}

export class Image extends ObjectAnnotation {
  static vendorPrefix = 'test';
  static type = 'image';
  static subdocuments = { caption: CaptionSource };
  attributes!: {
    caption: Document;
  };
}

export class Manual extends ObjectAnnotation {
  static vendorPrefix = 'test';
  static type = 'manual';
  handleChange(change: Change) {
    let insertion = change as Insertion;
    expect(change).toBeInstanceOf(Insertion);
    expect(this.start).toBe(0);
    expect(this.end).toBe(2);
    expect(insertion.start).toBe(2);
    expect(insertion.text).toBe('zzz');
    expect(insertion.behaviour).toBe(AdjacentBoundaryBehaviour.default);

    // artificial adjustment
    this.start = 1;
    this.end = 3;
  }
}

export default class TestSource extends Document {
  static contentType = 'application/vnd.atjson+test';
  static schema = [Anchor, Bold, Code, Image, Instagram, Italic, Locale, Manual, Preformatted];
}
