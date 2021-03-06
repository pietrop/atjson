import { BlockAnnotation } from '@atjson/document';

export default class Heading extends BlockAnnotation {
  static type = 'heading';
  static vendorPrefix = 'offset';
  attributes!: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}
