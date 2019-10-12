/*
 * Iterates over folders in the current directory and renders stories for each example
 * exported by that folder.
 * Example exports should have the following shape:
 *  {
 *    usage: {String},
 *    examples: [
 *      {
 *        description: {String} name of the story
 *        components: {Array<{func}>} array of component funcs for which proptables will be shown
 *        example: {func} () => story,
 *        usage: {String}, overrides top-level usage if passed
 *        useHOC: {Boolean} if true and a component is an HOC,
 *                will not break through to underlying wrapped component for prop tables + source
 *      }
 *    ],
 *  }
 */
// import path from 'path';
import { storiesOf } from '@storybook/react';
// import GoogleAnalyticsDecorator from '../storybook-config/components/GoogleAnalytics';

const requireContext = require.context('./', /* subdirs= */ true, /index\.jsx?$/);

const packageExport = requireContext("./test/index.jsx");
//const packageExport = require.context('/06-event-flow/index.jsx');
console.log(packageExport);
const { examples, usage } = packageExport.default;
let name = 'event-flow';
const stories = storiesOf(name, module);

examples.forEach(example => {
    stories.addWithInfo({
        kind: name,
        story: example.description,
        storyFn: example.example,
        components: example.components,
        usage: example.usage || usage,
        useHOC: example.useHOC,
    });
});
