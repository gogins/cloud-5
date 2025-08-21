import jsdoc from '../../doc.json';
import { autocompletion } from '@codemirror/autocomplete';
import { h } from './html';

const escapeHtml = (str) => {
  const div = document.createElement('div');
  div.innerText = str;
  return div.innerHTML;
};

const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

const getDocLabel = (doc) => doc.name || doc.longname;

const buildParamsList = (params) =>
  params?.length
    ? `
    <div class="autocomplete-info-params-section">
      <h4 class="autocomplete-info-section-title">Parameters</h4>
      <ul class="autocomplete-info-params-list">
        ${params
          .map(
            ({ name, type, description }) => `
          <li class="autocomplete-info-param-item">
            <span class="autocomplete-info-param-name">${name}</span>
            <span class="autocomplete-info-param-type">${type.names?.join(' | ')}</span>
            ${description ? `<div class="autocomplete-info-param-desc">${stripHtml(description)}</div>` : ''}
          </li>
        `,
          )
          .join('')}
      </ul>
    </div>
  `
    : '';

const buildExamples = (examples) =>
  examples?.length
    ? `
    <div class="autocomplete-info-examples-section">
      <h4 class="autocomplete-info-section-title">Examples</h4>
      ${examples
        .map(
          (example) => `
        <pre class="autocomplete-info-example-code">${escapeHtml(example)}</pre>
      `,
        )
        .join('')}
    </div>
  `
    : '';

export const Autocomplete = ({ doc, label }) =>
  h`
  <div class="autocomplete-info-tooltip">
    <h3 class="autocomplete-info-function-name">${label || getDocLabel(doc)}</h3>
    ${doc.description ? `<p class="autocomplete-info-function-description">${doc.description}</p>` : ''}
    ${buildParamsList(doc.params)}
    ${buildExamples(doc.examples)}
  </div>
`[0];

const isValidDoc = (doc) => {
  const label = getDocLabel(doc);
  return label && !label.startsWith('_') && !['package'].includes(doc.kind);
};

const hasExcludedTags = (doc) =>
  ['superdirtOnly', 'noAutocomplete'].some((tag) => doc.tags?.find((t) => t.originalTitle === tag));

const jsdocCompletions = jsdoc.docs
  .filter((doc) => isValidDoc(doc) && !hasExcludedTags(doc))
  // https://codemirror.net/docs/ref/#autocomplete.Completion
  .map((doc) => ({
    label: getDocLabel(doc),
    // detail: 'xxx', // An optional short piece of information to show (with a different style) after the label.
    info: () => Autocomplete({ doc }),
    type: 'function', // https://codemirror.net/docs/ref/#autocomplete.Completion.type
  }));

export const strudelAutocomplete = (context) => {
  const word = context.matchBefore(/\w*/);
  if (word.from === word.to && !context.explicit) return null;

  return {
    from: word.from,
    options: jsdocCompletions,
    /*     options: [
      { label: 'match', type: 'keyword' },
      { label: 'hello', type: 'variable', info: '(World)' },
      { label: 'magic', type: 'text', apply: '⠁⭒*.✩.*⭒⠁', detail: 'macro' },
    ], */
  };
};

export const isAutoCompletionEnabled = (enabled) =>
  enabled ? [autocompletion({ override: [strudelAutocomplete] })] : [];
