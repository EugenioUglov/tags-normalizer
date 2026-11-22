import StringManipulator from '@eugeniouglov/string-manipulator';

/**
 * Normalizes and expands user-provided tags.
 *
 * Single source file. Rollup builds it into two formats:
 *   - dist/tags-normalizer.cjs  — for require() / CommonJS
 *   - dist/tags-normalizer.mjs  — for import / ES Module
 */
class TagsNormalizer {
  #sm;

  constructor() {
    this.#sm = new StringManipulator();
  }

  getHandledTags(initialTags) {
    let handledTags = this.#getNormalizedTags(initialTags);

    const additionalTags = this.#getAdditionalTags(handledTags);

    // Merge original + additional tags, deduplicate.
    // Do NOT re-run #getNormalizedTags here, because it splits by whitespace
    // and would break multi-word additional tags like "hello world".
    const allTags = [...handledTags, ...additionalTags];

    return [...new Set(allTags)];
  }

  #getNormalizedTags(tags) {
    if (Array.isArray(tags)) {
      tags = tags.toString();
    }

    const sm = this.#sm;
    // Change all new lines to symbol ','.
    const tagsWithoutNewLine = String(tags).replaceAll('\n', ',');
    // Split by comma, then split each part by whitespace.
    const parts = sm.getArrayByText(tagsWithoutNewLine, ',');

    const tagsArray = [];
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed) {
        tagsArray.push(...sm.splitText(trimmed));
      }
    }

    // Delete same tags.
    const tagsSet = new Set(tagsArray);

    // Convertation from Set to Array.
    return Array.from(tagsSet);
  }

  #getAdditionalTags(tags) {
    if (Array.isArray(tags) === false) {
      tags = this.#sm.getArrayByText(String(tags), ',');
    }

    const sm = this.#sm;
    const additionalTags = [];

    for (const tag of tags) {
      let additionalTag = '';

      const tagWithoutSpecialCharacters = sm.getTextWithoutSpecialCharactes(tag, ' ').trim();

      if (tag !== tagWithoutSpecialCharacters) {
        additionalTag = tagWithoutSpecialCharacters;
      }

      if (
        tagWithoutSpecialCharacters !== tagWithoutSpecialCharacters.toUpperCase() &&
        tagWithoutSpecialCharacters !== tagWithoutSpecialCharacters.toLowerCase()
      ) {
        const tagWithSeparatedWords = sm.getSeparatedWordsByCamelCaseString(tagWithoutSpecialCharacters);
        additionalTag = tagWithSeparatedWords;
      }

      if (additionalTag) {
        additionalTags.push(additionalTag);
      }
    }

    return additionalTags;
  }
}

export default TagsNormalizer;